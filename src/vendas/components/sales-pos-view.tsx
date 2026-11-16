"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Banknote,
  CheckCircle2,
  CreditCard,
  Minus,
  Plus,
  QrCode,
  ShoppingBag,
  Trash2,
  Wallet,
} from "lucide-react";
import {
  calculateCartTotals,
  getCatalogAvailability,
  processCheckout,
  type CartItem,
} from "@/vendas/services/sales-service";
import { useAppStore } from "@/shared/contexts/app-store-provider";
import { formatCurrencyBRL } from "@/shared/libs/formatters";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { Switch } from "@/shared/components/ui/switch";
import { cn } from "@/shared/libs/cn";
import type { Order, PaymentMethod } from "@/shared/types/domain";

const PAYMENT_OPTIONS: Array<{
  value: PaymentMethod;
  label: string;
  icon: typeof QrCode;
}> = [
  { value: "PIX", label: "PIX", icon: QrCode },
  { value: "Cartão de Crédito", label: "Crédito", icon: CreditCard },
  { value: "Cartão de Débito", label: "Débito", icon: Wallet },
  { value: "Dinheiro", label: "Dinheiro", icon: Banknote },
];

export function SalesPosView() {
  const { store } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("PIX");
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const categories = useMemo(() => {
    const unique = new Set(store.products.map((p) => p.category));
    return ["Todos", ...Array.from(unique)];
  }, [store.products]);

  const filteredProducts = useMemo(() => {
    const active = store.products.filter((p) => p.active);
    if (selectedCategory === "Todos") return active;
    return active.filter((p) => p.category === selectedCategory);
  }, [store.products, selectedCategory]);

  const availabilityMap = useMemo(
    () => getCatalogAvailability(store.products, store.ingredients, cart),
    [store.products, store.ingredients, cart],
  );

  const cartTotals = useMemo(
    () => calculateCartTotals(store.products, cart),
    [store.products, cart],
  );

  const cartQuantityMap = useMemo(
    () => new Map(cart.map((item) => [item.productId, item.quantity])),
    [cart],
  );

  function addToCart(productId: string) {
    const avail = availabilityMap.get(productId);
    if (!avail || !avail.available) return;

    setErrorBanner(null);
    setConfirmedOrder(null);
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
  }

  function decrementFromCart(productId: string) {
    setErrorBanner(null);
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function removeFromCart(productId: string) {
    setErrorBanner(null);
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  }

  function handleCheckout() {
    setErrorBanner(null);
    setConfirmedOrder(null);

    const role = store.session?.role ?? "Colaborador";
    const result = processCheckout({
      items: cart,
      paymentMethod,
      operatorRole: role,
    });

    if (!result.ok) {
      setErrorBanner(result.message);
      return;
    }

    setCart([]);
    setConfirmedOrder(result.order);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Registrar Venda
          </h1>
          <p className="text-sm text-muted-foreground">
            Selecione os produtos do cardápio, confirme a forma de pagamento e envie para preparo.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Filtrar por categoria"
          className="flex flex-wrap gap-1.5"
        >
          {categories.map((category) => {
            const active = selectedCategory === category;
            return (
              <Button
                key={category}
                type="button"
                role="tab"
                aria-selected={active}
                variant={active ? "default" : "outline"}
                size="sm"
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            );
          })}
        </div>
      </div>

      {confirmedOrder ? (
        <div
          role="status"
          className="flex flex-col gap-3 rounded-lg border border-primary bg-primary text-primary-foreground p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold">
                Venda registrada com sucesso — Pedido {confirmedOrder.code}
              </p>
              <p className="text-xs text-primary-foreground/85">
                Estoque de ingredientes atualizado e pedido enviado para a fila em preparo.
              </p>
            </div>
          </div>
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="shrink-0 cursor-pointer"
          >
            <Link href="/pedidos" transitionTypes={["nav-forward"]}>
              Acompanhar em Pedidos
            </Link>
          </Button>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        <section
          aria-label="Catálogo de produtos"
          className="grid gap-4 sm:grid-cols-2 lg:col-span-8"
        >
          {filteredProducts.map((product) => {
            const avail = availabilityMap.get(product.id);
            const inCartQty = cartQuantityMap.get(product.id) ?? 0;
            const additional = avail?.additionalAvailable ?? 0;
            const isAvailable = additional > 0;
            const totalStockPossible = avail?.totalMakeableFromStock ?? 0;

            return (
              <Card
                key={product.id}
                className={cn(
                  "flex flex-col justify-between shadow-none transition-colors",
                  !isAvailable && totalStockPossible === 0
                    ? "border-dashed opacity-75"
                    : "border-border",
                )}
              >
                <CardHeader className="space-y-2 pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      {product.category}
                    </span>
                    {isAvailable ? (
                      <Badge variant="secondary" className="font-mono text-xs">
                        Disponível ({additional})
                      </Badge>
                    ) : (
                      <Badge
                        variant="default"
                        className="font-mono text-xs"
                      >
                        Indisponível (8A)
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-base font-semibold leading-snug">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="text-xs leading-relaxed">
                    {product.description}
                  </CardDescription>
                </CardHeader>

                <CardFooter className="flex items-center justify-between gap-3 border-t border-border pt-4">
                  <span className="font-mono text-lg font-semibold tabular-nums">
                    {formatCurrencyBRL(product.price)}
                  </span>

                  {inCartQty > 0 ? (
                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label={`Remover uma unidade de ${product.name}`}
                        className="size-10 cursor-pointer"
                        onClick={() => decrementFromCart(product.id)}
                      >
                        <Minus className="size-4" aria-hidden="true" />
                      </Button>
                      <span
                        aria-label={`Quantidade de ${product.name} no carrinho`}
                        className="min-w-8 text-center font-mono text-sm font-semibold tabular-nums"
                      >
                        {inCartQty}
                      </span>
                      <Button
                        type="button"
                        variant="default"
                        size="icon"
                        disabled={!isAvailable}
                        aria-label={`Adicionar mais uma unidade de ${product.name}`}
                        className="size-10 cursor-pointer"
                        onClick={() => addToCart(product.id)}
                      >
                        <Plus className="size-4" aria-hidden="true" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant={isAvailable ? "default" : "outline"}
                      disabled={!isAvailable}
                      className="min-h-10 cursor-pointer"
                      onClick={() => addToCart(product.id)}
                    >
                      <Plus className="size-4" aria-hidden="true" />
                      <span>Adicionar</span>
                    </Button>
                  )}
                </CardFooter>

                {!isAvailable && avail && avail.missingIngredients.length > 0 ? (
                  <div className="border-t border-dashed border-border bg-muted/40 px-6 py-2 text-xs text-muted-foreground">
                    Limite de insumo: {avail.missingIngredients.join(", ")}
                  </div>
                ) : null}
              </Card>
            );
          })}
        </section>

        <aside className="lg:col-span-4 lg:sticky lg:top-20">
          <Card className="border-border shadow-none">
            <CardHeader className="border-b border-border pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <ShoppingBag className="size-4" aria-hidden="true" />
                  <span>Resumo da Venda</span>
                </CardTitle>
                <Badge variant="outline" className="font-mono text-xs tabular-nums">
                  {cartTotals.totalUnits}{" "}
                  {cartTotals.totalUnits === 1 ? "item" : "itens"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-5 pt-5">
              {cartTotals.lines.length === 0 ? (
                <div className="rounded-md border border-dashed border-border p-6 text-center">
                  <p className="text-sm font-medium">Carrinho vazio</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Adicione bebidas ou snacks do cardápio ao lado para iniciar.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {cartTotals.lines.map((line) => {
                    const avail = availabilityMap.get(line.productId);
                    const canAddMore = (avail?.additionalAvailable ?? 0) > 0;
                    return (
                      <li
                        key={line.productId}
                        className="flex items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {line.productName}
                          </p>
                          <p className="font-mono text-xs text-muted-foreground tabular-nums">
                            {line.quantity}x {formatCurrencyBRL(line.unitPrice)}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-sm font-semibold tabular-nums mr-1">
                            {formatCurrencyBRL(line.subtotal)}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon-xs"
                            aria-label={`Diminuir ${line.productName}`}
                            className="cursor-pointer"
                            onClick={() => decrementFromCart(line.productId)}
                          >
                            <Minus className="size-3" aria-hidden="true" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon-xs"
                            disabled={!canAddMore}
                            aria-label={`Aumentar ${line.productName}`}
                            className="cursor-pointer"
                            onClick={() => addToCart(line.productId)}
                          >
                            <Plus className="size-3" aria-hidden="true" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            aria-label={`Excluir ${line.productName}`}
                            className="cursor-pointer"
                            onClick={() => removeFromCart(line.productId)}
                          >
                            <Trash2 className="size-3" aria-hidden="true" />
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              <Separator />

              <div className="space-y-3">
                <Label className="text-sm font-medium text-foreground">
                  Forma de pagamento
                </Label>
                <div
                  role="radiogroup"
                  aria-label="Forma de pagamento"
                  className="grid grid-cols-2 gap-2"
                >
                  {PAYMENT_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const active = paymentMethod === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => {
                          setPaymentMethod(opt.value);
                          setErrorBanner(null);
                        }}
                        className={cn(
                          "flex min-h-11 items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-foreground hover:bg-muted",
                        )}
                      >
                        <Icon className="size-3.5 shrink-0" aria-hidden="true" />
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {errorBanner ? (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-md border-2 border-foreground bg-muted p-3 text-xs text-foreground"
                >
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <div className="space-y-1">
                    <p className="font-semibold">Falha no pagamento</p>
                    <p>{errorBanner}</p>
                  </div>
                </div>
              ) : null}

              <Separator />

              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Total da venda
                </span>
                <span className="font-mono text-2xl font-semibold tabular-nums">
                  {formatCurrencyBRL(cartTotals.total)}
                </span>
              </div>
            </CardContent>

            <CardFooter className="border-t border-border pt-4">
              <Button
                type="button"
                size="lg"
                disabled={cartTotals.lines.length === 0}
                className="w-full cursor-pointer"
                onClick={handleCheckout}
              >
                Finalizar Venda
              </Button>
            </CardFooter>
          </Card>
        </aside>
      </div>
    </div>
  );
}
