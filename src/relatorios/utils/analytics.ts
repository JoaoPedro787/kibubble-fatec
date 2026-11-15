import type { Sale } from "@/shared/types/domain";

export interface RevenueBreakdown {
  daily: number;
  weekly: number;
  monthly: number;
  dailyCount: number;
  weeklyCount: number;
  monthlyCount: number;
  totalRevenue: number;
  totalSalesCount: number;
}

export interface TopProductRank {
  productId: string;
  productName: string;
  unitsSold: number;
  revenue: number;
}

export interface ReportsSnapshot {
  revenue: RevenueBreakdown;
  averageTicket: number;
  topProducts: TopProductRank[];
  history: Sale[];
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

export function calculateRevenueBreakdown(
  sales: Sale[],
  now: Date = new Date(),
): RevenueBreakdown {
  const todayStart = startOfLocalDay(now).getTime();
  const weekStart = todayStart - 6 * 24 * 60 * 60 * 1000;
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  let daily = 0;
  let weekly = 0;
  let monthly = 0;
  let dailyCount = 0;
  let weeklyCount = 0;
  let monthlyCount = 0;
  let totalRevenue = 0;

  for (const sale of sales) {
    const saleDate = new Date(sale.createdAt);
    const saleTime = saleDate.getTime();
    if (Number.isNaN(saleTime)) continue;

    totalRevenue = roundCurrency(totalRevenue + sale.total);

    if (saleTime >= todayStart) {
      daily = roundCurrency(daily + sale.total);
      dailyCount += 1;
    }

    if (saleTime >= weekStart) {
      weekly = roundCurrency(weekly + sale.total);
      weeklyCount += 1;
    }

    if (
      saleDate.getFullYear() === currentYear &&
      saleDate.getMonth() === currentMonth
    ) {
      monthly = roundCurrency(monthly + sale.total);
      monthlyCount += 1;
    }
  }

  return {
    daily,
    weekly,
    monthly,
    dailyCount,
    weeklyCount,
    monthlyCount,
    totalRevenue,
    totalSalesCount: sales.length,
  };
}

export function calculateAverageTicket(sales: Sale[]): number {
  if (sales.length === 0) return 0;
  const sum = sales.reduce((acc, sale) => acc + sale.total, 0);
  return roundCurrency(sum / sales.length);
}

export function calculateTopSellingProducts(sales: Sale[]): TopProductRank[] {
  const map = new Map<string, TopProductRank>();

  for (const sale of sales) {
    for (const item of sale.items) {
      const existing = map.get(item.productId);
      if (existing) {
        existing.unitsSold += item.quantity;
        existing.revenue = roundCurrency(existing.revenue + item.subtotal);
      } else {
        map.set(item.productId, {
          productId: item.productId,
          productName: item.productName,
          unitsSold: item.quantity,
          revenue: roundCurrency(item.subtotal),
        });
      }
    }
  }

  return Array.from(map.values()).sort((a, b) => {
    if (b.unitsSold !== a.unitsSold) return b.unitsSold - a.unitsSold;
    if (b.revenue !== a.revenue) return b.revenue - a.revenue;
    return a.productName.localeCompare(b.productName, "pt-BR");
  });
}

export function sortSalesChronologically(sales: Sale[]): Sale[] {
  return [...sales].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function computeReportsSnapshot(
  sales: Sale[],
  now: Date = new Date(),
): ReportsSnapshot {
  return {
    revenue: calculateRevenueBreakdown(sales, now),
    averageTicket: calculateAverageTicket(sales),
    topProducts: calculateTopSellingProducts(sales),
    history: sortSalesChronologically(sales),
  };
}
