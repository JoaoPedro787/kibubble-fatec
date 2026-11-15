"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BellRing,
  CheckCheck,
  Clock,
} from "lucide-react";
import {
  ALLOWED_NEXT_STATUS,
  VALID_ORDER_STATUSES,
  updateOrderStatus,
} from "@/pedidos/services/orders-service";
import { useAppStore } from "@/shared/contexts/app-store-provider";
import { formatCurrencyBRL, formatDateTimeBR } from "@/shared/libs/formatters";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { cn } from "@/shared/libs/cn";
import type { Order, OrderStatus } from "@/shared/types/domain";

type StatusFilter = "Todos" | OrderStatus;

const STATUS_META: Record<
  OrderStatus,
  {
    icon: typeof Clock;
    badgeVariant: "outline" | "default" | "secondary";
    cardClass: string;
    nextActionLabel: string | null;
  }
> = {
  "Em preparo": {
    icon: Clock,
    badgeVariant: "outline",
    cardClass: "border-dashed border-foreground/50 bg-card",
    nextActionLabel: "Marcar como Pronto",
  },
  Pronto: {
    icon: BellRing,
    badgeVariant: "default",
    cardClass: "border-2 border-foreground bg-card",
    nextActionLabel: "Marcar como Entregue",
  },
  Entregue: {
    icon: CheckCheck,
    badgeVariant: "secondary",
    cardClass: "border-border bg-muted/35",
    nextActionLabel: null,
  },
};

export function OrdersBoardView() {
  const { store } = useAppStore();
  const [filter, setFilter] = useState<StatusFilter>("Todos");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sortedOrders = useMemo(
    () =>
      [...store.orders].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [store.orders],
  );

  const counts = useMemo(() => {
    const map: Record<OrderStatus, number> = {
      "Em preparo": 0,
      Pronto: 0,
      Entregue: 0,
    };
    for (const order of sortedOrders) {
      map[order.status] += 1;
    }
    return map;
  }, [sortedOrders]);

  const visibleOrders = useMemo(() => {
    if (filter === "Todos") return sortedOrders;
    return sortedOrders.filter((order) => order.status === filter);
  }, [sortedOrders, filter]);

  function handleAdvance(order: Order) {
    setErrorMessage(null);
    const nextStatus = ALLOWED_NEXT_STATUS[order.status];
    if (!nextStatus) {
      setErrorMessage(
        `O pedido ${order.code} já foi entregue e não aceita novas alterações.`,
      );
      return;
    }

    const result = updateOrderStatus(order.id, nextStatus);
    if (!result.ok) {
      setErrorMessage(result.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Acompanhar Pedidos
          </h1>
          <p className="text-sm text-muted-foreground">
            Controle a fila de preparo da cozinha até a entrega ao cliente.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Filtrar pedidos por status"
          className="flex flex-wrap gap-1.5"
        >
          <Button
            type="button"
            role="tab"
            aria-selected={filter === "Todos"}
            variant={filter === "Todos" ? "default" : "outline"}
            size="sm"
            className="cursor-pointer font-mono tabular-nums"
            onClick={() => setFilter("Todos")}
          >
            Todos ({sortedOrders.length})
          </Button>
          {VALID_ORDER_STATUSES.map((status) => (
            <Button
              key={status}
              type="button"
              role="tab"
              aria-selected={filter === status}
              variant={filter === status ? "default" : "outline"}
              size="sm"
              className="cursor-pointer font-mono tabular-nums"
              onClick={() => setFilter(status)}
            >
              {status} ({counts[status]})
            </Button>
          ))}
        </div>
      </div>

      {errorMessage ? (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-md border-2 border-foreground bg-muted p-3 text-sm"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      ) : null}

      {visibleOrders.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center">
          <p className="text-sm font-medium">Nenhum pedido nesta categoria</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Novas vendas registradas no balcão aparecem automaticamente em Em preparo.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visibleOrders.map((order) => {
            const meta = STATUS_META[order.status];
            const Icon = meta.icon;
            const totalOrder = order.items.reduce(
              (acc, item) => acc + item.subtotal,
              0,
            );

            return (
              <Card
                key={order.id}
                className={cn("flex flex-col justify-between shadow-none", meta.cardClass)}
              >
                <CardHeader className="space-y-2 border-b border-border pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="font-mono text-base font-semibold tabular-nums">
                      {order.code}
                    </CardTitle>
                    <Badge variant={meta.badgeVariant} className="gap-1.5 text-xs">
                      <Icon className="size-3" aria-hidden="true" />
                      <span>{order.status}</span>
                    </Badge>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground tabular-nums">
                    Criado em {formatDateTimeBR(order.createdAt)}
                  </p>
                </CardHeader>

                <CardContent className="flex-1 pt-4">
                  <ul className="space-y-2">
                    {order.items.map((item) => (
                      <li
                        key={`${order.id}-${item.productId}`}
                        className="flex items-baseline justify-between gap-2 text-sm"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="font-mono font-semibold tabular-nums">
                            {item.quantity}x
                          </span>{" "}
                          <span>{item.productName}</span>
                        </span>
                        <span className="font-mono text-xs text-muted-foreground tabular-nums">
                          {formatCurrencyBRL(item.subtotal)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="flex items-center justify-between gap-3 border-t border-border pt-4">
                  <div className="text-xs text-muted-foreground">
                    Total{" "}
                    <span className="block font-mono text-sm font-semibold text-foreground tabular-nums">
                      {formatCurrencyBRL(totalOrder)}
                    </span>
                  </div>

                  {meta.nextActionLabel ? (
                    <Button
                      type="button"
                      size="sm"
                      className="min-h-10 cursor-pointer"
                      onClick={() => handleAdvance(order)}
                    >
                      <span>{meta.nextActionLabel}</span>
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </Button>
                  ) : (
                    <span className="text-xs font-medium text-muted-foreground">
                      Finalizado
                    </span>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
