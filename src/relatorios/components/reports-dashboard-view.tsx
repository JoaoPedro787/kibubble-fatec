"use client";

import { useMemo } from "react";
import {
  BarChart3,
  Calendar,
  Receipt,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { computeReportsSnapshot } from "@/relatorios/utils/analytics";
import { useAppStore } from "@/shared/contexts/app-store-provider";
import { formatCurrencyBRL, formatDateTimeBR } from "@/shared/libs/formatters";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

export function ReportsDashboardView() {
  const { store } = useAppStore();

  const snapshot = useMemo(
    () => computeReportsSnapshot(store.sales),
    [store.sales],
  );

  const maxPeriodRevenue = Math.max(
    snapshot.revenue.daily,
    snapshot.revenue.weekly,
    snapshot.revenue.monthly,
    1,
  );

  const maxProductUnits = Math.max(
    ...(snapshot.topProducts.map((p) => p.unitsSold) ?? [1]),
    1,
  );

  const periodBars = [
    {
      label: "Diário (hoje)",
      value: snapshot.revenue.daily,
      count: snapshot.revenue.dailyCount,
      barClass: "bg-foreground",
    },
    {
      label: "Semanal (últimos 7 dias)",
      value: snapshot.revenue.weekly,
      count: snapshot.revenue.weeklyCount,
      barClass: "bg-foreground/70",
    },
    {
      label: "Mensal (mês atual)",
      value: snapshot.revenue.monthly,
      count: snapshot.revenue.monthlyCount,
      barClass: "bg-foreground/45",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Relatórios Gerenciais
        </h1>
        <p className="text-sm text-muted-foreground">
          Indicadores de faturamento, ticket médio, ranking de produtos e histórico completo de vendas.
        </p>
      </div>

      <section
        aria-label="Indicadores principais"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <Card className="border-border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Faturamento Diário (3A)
            </CardTitle>
            <Calendar className="size-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <p className="font-mono text-2xl font-semibold tabular-nums">
              {formatCurrencyBRL(snapshot.revenue.daily)}
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground tabular-nums">
              {snapshot.revenue.dailyCount}{" "}
              {snapshot.revenue.dailyCount === 1 ? "venda hoje" : "vendas hoje"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Faturamento Semanal (3A)
            </CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <p className="font-mono text-2xl font-semibold tabular-nums">
              {formatCurrencyBRL(snapshot.revenue.weekly)}
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground tabular-nums">
              {snapshot.revenue.weeklyCount}{" "}
              {snapshot.revenue.weeklyCount === 1 ? "venda" : "vendas"} nos últimos 7 dias
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Faturamento Mensal (3A)
            </CardTitle>
            <BarChart3 className="size-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <p className="font-mono text-2xl font-semibold tabular-nums">
              {formatCurrencyBRL(snapshot.revenue.monthly)}
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground tabular-nums">
              {snapshot.revenue.monthlyCount}{" "}
              {snapshot.revenue.monthlyCount === 1 ? "venda no mês" : "vendas no mês"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-foreground shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Ticket Médio (3B)
            </CardTitle>
            <Receipt className="size-4 text-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <p className="font-mono text-2xl font-semibold tabular-nums">
              {formatCurrencyBRL(snapshot.averageTicket)}
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground tabular-nums">
              Base: {snapshot.revenue.totalSalesCount}{" "}
              {snapshot.revenue.totalSalesCount === 1
                ? "venda registrada"
                : "vendas registradas"}
            </p>
          </CardContent>
        </Card>
      </section>

      <Tabs defaultValue="visao-geral" className="space-y-4">
        <TabsList>
          <TabsTrigger value="visao-geral" className="cursor-pointer">
            Faturamento & Ranking
          </TabsTrigger>
          <TabsTrigger value="historico" className="cursor-pointer">
            Histórico de Vendas ({snapshot.history.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="grid gap-6 lg:grid-cols-12">
          <Card className="border-border shadow-none lg:col-span-5">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-base font-semibold">
                Comparativo de Faturamento (3A)
              </CardTitle>
              <CardDescription className="text-xs">
                Distribuição acumulada por janela operacional.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
              {periodBars.map((bar) => {
                const widthPct = Math.round((bar.value / maxPeriodRevenue) * 100);
                return (
                  <div key={bar.label} className="space-y-2">
                    <div className="flex items-baseline justify-between gap-2 text-sm">
                      <span className="font-medium">{bar.label}</span>
                      <span className="font-mono font-semibold tabular-nums">
                        {formatCurrencyBRL(bar.value)}
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${bar.barClass}`}
                        style={{ width: `${bar.value > 0 ? Math.max(widthPct, 4) : 0}%` }}
                      />
                    </div>
                    <p className="font-mono text-xs text-muted-foreground tabular-nums">
                      {bar.count} {bar.count === 1 ? "pedido" : "pedidos"}
                    </p>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-border shadow-none lg:col-span-7">
            <CardHeader className="border-b border-border pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <Trophy className="size-4" aria-hidden="true" />
                    <span>Produtos Mais Vendidos (3C)</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Ranking ordenado por unidades vendidas.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-5">
              {snapshot.topProducts.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Nenhuma venda registrada para compor o ranking.
                </p>
              ) : (
                <ul className="space-y-4">
                  {snapshot.topProducts.map((product, index) => {
                    const pct = Math.round(
                      (product.unitsSold / maxProductUnits) * 100,
                    );
                    return (
                      <li key={product.productId} className="space-y-1.5">
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Badge
                              variant={index === 0 ? "default" : "outline"}
                              className="font-mono text-xs tabular-nums"
                            >
                              #{index + 1}
                            </Badge>
                            <span className="truncate font-medium">
                              {product.productName}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 shrink-0 font-mono text-xs tabular-nums">
                            <span className="text-muted-foreground">
                              {product.unitsSold} un.
                            </span>
                            <span className="font-semibold text-foreground">
                              {formatCurrencyBRL(product.revenue)}
                            </span>
                          </div>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-foreground"
                            style={{ width: `${Math.max(pct, 4)}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historico">
          <Card className="border-border shadow-none">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-base font-semibold">
                Histórico Completo de Vendas (3D)
              </CardTitle>
              <CardDescription className="text-xs">
                Listagem cronológica da venda mais recente para a mais antiga.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {snapshot.history.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  Nenhuma venda registrada até o momento.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data / Hora</TableHead>
                      <TableHead>Pedido</TableHead>
                      <TableHead>Itens</TableHead>
                      <TableHead>Pagamento</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Operador
                      </TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {snapshot.history.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-mono text-xs tabular-nums whitespace-nowrap">
                          {formatDateTimeBR(sale.createdAt)}
                        </TableCell>
                        <TableCell className="font-mono text-xs font-semibold tabular-nums">
                          {sale.orderCode}
                        </TableCell>
                        <TableCell className="text-sm">
                          {sale.items
                            .map((item) => `${item.quantity}x ${item.productName}`)
                            .join(", ")}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {sale.paymentMethod}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                          {sale.operatorRole}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm font-semibold tabular-nums">
                          {formatCurrencyBRL(sale.total)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
