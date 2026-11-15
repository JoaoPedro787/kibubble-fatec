import { beforeEach, describe, expect, it } from "vitest";
import {
  calculateCartTotals,
  getCatalogAvailability,
  processCheckout,
} from "@/vendas/services/sales-service";
import { readStore, updateStore } from "@/shared/libs/storage";

describe("salesService", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("calculates real-time recipe availability accounting for active cart reservations (8A)", () => {
    // Matcha Cream Boba uses 40g of ing-cream-cheese; seed has 180g => max 4 units
    // Dirty Black Tea Cheese uses 45g of ing-cream-cheese => max 4 units
    const store = readStore(window.localStorage);

    const initialAvail = getCatalogAvailability(
      store.products,
      store.ingredients,
      [],
    );
    expect(initialAvail.get("prod-matcha-latte")?.additionalAvailable).toBe(4);
    expect(initialAvail.get("prod-dirty-cheese")?.additionalAvailable).toBe(4);

    // Put 4 Matcha Lattes in cart (consumes 160g of 180g cream cheese -> 20g left)
    const afterCartAvail = getCatalogAvailability(
      store.products,
      store.ingredients,
      [{ productId: "prod-matcha-latte", quantity: 4 }],
    );
    expect(afterCartAvail.get("prod-matcha-latte")?.additionalAvailable).toBe(0);
    expect(afterCartAvail.get("prod-matcha-latte")?.available).toBe(false);
    expect(afterCartAvail.get("prod-dirty-cheese")?.additionalAvailable).toBe(0);
    expect(afterCartAvail.get("prod-dirty-cheese")?.available).toBe(false);
  });

  it("calculates cart totals accurately", () => {
    const store = readStore(window.localStorage);
    const totals = calculateCartTotals(store.products, [
      { productId: "prod-classic-milk", quantity: 2 }, // 2 * 22.90 = 45.80
      { productId: "prod-mochi-duo", quantity: 1 }, // 16.90
    ]);

    expect(totals.totalUnits).toBe(3);
    expect(totals.total).toBe(62.7);
    expect(totals.lines).toHaveLength(2);
  });

  it("rolls back without mutating stock, orders, or sales on payment failure (5A)", () => {
    const before = readStore(window.localStorage);

    const result = processCheckout(
      {
        items: [{ productId: "prod-classic-milk", quantity: 1 }],
        paymentMethod: "Cartão de Crédito",
        operatorRole: "Colaborador",
        simulateFailure: true,
      },
      window.localStorage,
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("PAYMENT_UNAUTHORIZED");
    }

    const after = readStore(window.localStorage);
    expect(after.sales.length).toBe(before.sales.length);
    expect(after.orders.length).toBe(before.orders.length);
    expect(after.ingredients).toEqual(before.ingredients);
  });

  it("rejects checkout when stock is insufficient (8A)", () => {
    updateStore((current) => ({
      ...current,
      ingredients: current.ingredients.map((ing) =>
        ing.id === "ing-mochi" ? { ...ing, quantity: 1 } : ing,
      ),
    }), window.localStorage);

    const result = processCheckout(
      {
        items: [{ productId: "prod-mochi-duo", quantity: 1 }], // needs 2 mochi
        paymentMethod: "PIX",
        operatorRole: "Colaborador",
      },
      window.localStorage,
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("INSUFFICIENT_STOCK");
      expect(result.missingIngredients).toContain("Massa de Mochi");
    }
  });

  it("atomically deducts ingredients, creates Em preparo order, and appends sale on authorized payment", () => {
    const before = readStore(window.localStorage);
    const bobaBefore = before.ingredients.find((i) => i.id === "ing-boba")!.quantity;
    const cupsBefore = before.ingredients.find((i) => i.id === "ing-cups")!.quantity;

    const result = processCheckout(
      {
        items: [{ productId: "prod-classic-milk", quantity: 2 }],
        paymentMethod: "PIX",
        operatorRole: "Colaborador",
      },
      window.localStorage,
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.order.status).toBe("Em preparo");
      expect(result.sale.total).toBe(45.8);
      expect(result.sale.orderCode).toBe(result.order.code);
    }

    const after = readStore(window.localStorage);
    expect(after.sales.length).toBe(before.sales.length + 1);
    expect(after.orders.length).toBe(before.orders.length + 1);
    expect(after.orders[0].status).toBe("Em preparo");

    const bobaAfter = after.ingredients.find((i) => i.id === "ing-boba")!.quantity;
    const cupsAfter = after.ingredients.find((i) => i.id === "ing-cups")!.quantity;
    expect(bobaAfter).toBe(bobaBefore - 120);
    expect(cupsAfter).toBe(cupsBefore - 2);
  });
});
