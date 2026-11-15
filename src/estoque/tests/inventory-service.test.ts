import { beforeEach, describe, expect, it } from "vitest";
import {
  getLowStockIngredients,
  isLowStock,
  listIngredients,
  updateIngredientQuantity,
} from "@/estoque/services/inventory-service";

describe("inventoryService", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("rejects empty, non-numeric, and negative quantities (4A) while preserving previous stock", () => {
    const initial = listIngredients(window.localStorage);
    const target = initial.find((i) => i.id === "ing-boba")!;
    const previousQty = target.quantity;

    for (const badInput of ["", "   ", "abc", "-5", -10, "12g"]) {
      const res = updateIngredientQuantity(target.id, badInput, window.localStorage);
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.code).toBe("INVALID_QUANTITY");
      }
    }

    const after = listIngredients(window.localStorage).find((i) => i.id === target.id)!;
    expect(after.quantity).toBe(previousQty);
  });

  it("updates stock quantity and triggers low-stock alert at or below minimum threshold", () => {
    const target = listIngredients(window.localStorage).find((i) => i.id === "ing-boba")!;
    expect(isLowStock(target)).toBe(false);

    // Update exactly to minThreshold
    const atThreshold = updateIngredientQuantity(
      target.id,
      String(target.minThreshold),
      window.localStorage,
    );
    expect(atThreshold.ok).toBe(true);
    if (atThreshold.ok) {
      expect(atThreshold.lowStock).toBe(true);
    }

    const lowAlerts = getLowStockIngredients(listIngredients(window.localStorage));
    expect(lowAlerts.some((i) => i.id === target.id)).toBe(true);

    // Restock above threshold clears alert
    const restocked = updateIngredientQuantity(
      target.id,
      target.minThreshold + 500,
      window.localStorage,
    );
    expect(restocked.ok).toBe(true);
    if (restocked.ok) {
      expect(restocked.lowStock).toBe(false);
    }
  });
});
