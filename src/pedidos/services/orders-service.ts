import { readStore, updateStore } from "@/shared/libs/storage";
import type { Order, OrderStatus } from "@/shared/types/domain";

export const VALID_ORDER_STATUSES: readonly OrderStatus[] = [
  "Em preparo",
  "Pronto",
  "Entregue",
];

export const ALLOWED_NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  "Em preparo": "Pronto",
  Pronto: "Entregue",
  Entregue: null,
};

export function isValidOrderStatus(value: string): value is OrderStatus {
  return (VALID_ORDER_STATUSES as readonly string[]).includes(value);
}

export function canTransitionOrderStatus(
  current: OrderStatus,
  next: OrderStatus,
): boolean {
  return ALLOWED_NEXT_STATUS[current] === next;
}

export function getOrders(storage?: Storage | null): Order[] {
  const store = readStore(storage);
  return [...store.orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export type UpdateOrderStatusResult =
  | {
      ok: true;
      order: Order;
    }
  | {
      ok: false;
      code: "NOT_FOUND" | "INVALID_STATUS";
      message: string;
    };

export function updateOrderStatus(
  orderId: string,
  nextStatus: string,
  storage?: Storage | null,
): UpdateOrderStatusResult {
  if (!isValidOrderStatus(nextStatus)) {
    return {
      ok: false,
      code: "INVALID_STATUS",
      message:
        "Status inválido (5A). Utilize apenas Em preparo, Pronto ou Entregue.",
    };
  }

  const currentStore = readStore(storage);
  const target = currentStore.orders.find((o) => o.id === orderId);

  if (!target) {
    return {
      ok: false,
      code: "NOT_FOUND",
      message: "Pedido não encontrado.",
    };
  }

  if (!canTransitionOrderStatus(target.status, nextStatus)) {
    return {
      ok: false,
      code: "INVALID_STATUS",
      message: `Transição de status inválida (5A): não é possível alterar de "${target.status}" para "${nextStatus}".`,
    };
  }

  const nowIso = new Date().toISOString();
  let updatedOrder!: Order;

  updateStore((current) => {
    const orders = current.orders.map((order) => {
      if (order.id !== orderId) return order;
      updatedOrder = {
        ...order,
        status: nextStatus,
        updatedAt: nowIso,
      };
      return updatedOrder;
    });

    return {
      ...current,
      orders,
    };
  }, storage);

  return {
    ok: true,
    order: updatedOrder,
  };
}
