import { beforeEach, describe, expect, it } from "vitest";
import { getOrders, updateOrderStatus } from "@/pedidos/services/orders-service";
import { readStore } from "@/shared/libs/storage";

describe("ordersService", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("advances order from Em preparo -> Pronto -> Entregue and persists changes", () => {
    const orders = getOrders(window.localStorage);
    const preparing = orders.find((o) => o.status === "Em preparo");
    expect(preparing).toBeDefined();

    const toReady = updateOrderStatus(preparing!.id, "Pronto", window.localStorage);
    expect(toReady.ok).toBe(true);
    if (toReady.ok) {
      expect(toReady.order.status).toBe("Pronto");
    }

    const toDelivered = updateOrderStatus(
      preparing!.id,
      "Entregue",
      window.localStorage,
    );
    expect(toDelivered.ok).toBe(true);
    if (toDelivered.ok) {
      expect(toDelivered.order.status).toBe("Entregue");
    }

    const persisted = readStore(window.localStorage).orders.find(
      (o) => o.id === preparing!.id,
    );
    expect(persisted?.status).toBe("Entregue");
  });

  it("rejects invalid status values and disallowed transitions (5A)", () => {
    const orders = getOrders(window.localStorage);
    const preparing = orders.find((o) => o.status === "Em preparo")!;
    const delivered = orders.find((o) => o.status === "Entregue")!;

    // Non-existent status
    const invalidName = updateOrderStatus(
      preparing.id,
      "Cancelado",
      window.localStorage,
    );
    expect(invalidName.ok).toBe(false);
    if (!invalidName.ok) {
      expect(invalidName.code).toBe("INVALID_STATUS");
    }

    // Skipping Pronto (Em preparo -> Entregue)
    const skipStep = updateOrderStatus(
      preparing.id,
      "Entregue",
      window.localStorage,
    );
    expect(skipStep.ok).toBe(false);
    if (!skipStep.ok) {
      expect(skipStep.code).toBe("INVALID_STATUS");
    }

    // Backward or out-of-terminal transition (Entregue -> Pronto)
    const backwards = updateOrderStatus(
      delivered.id,
      "Pronto",
      window.localStorage,
    );
    expect(backwards.ok).toBe(false);
    if (!backwards.ok) {
      expect(backwards.code).toBe("INVALID_STATUS");
    }
  });
});
