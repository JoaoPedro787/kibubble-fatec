import { beforeEach, describe, expect, it } from "vitest";
import {
  calculateAverageTicket,
  calculateRevenueBreakdown,
  calculateTopSellingProducts,
  computeReportsSnapshot,
} from "@/relatorios/utils/analytics";
import { getReportsSnapshot } from "@/relatorios/services/reports-service";
import { writeStore } from "@/shared/libs/storage";
import { createInitialSeed } from "@/shared/libs/seed";
import type { Sale } from "@/shared/types/domain";

describe("reportsService & analytics calculators", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("handles zero-sales edge case cleanly", () => {
    const empty = computeReportsSnapshot([], new Date("2026-11-15T12:00:00"));
    expect(empty.revenue.daily).toBe(0);
    expect(empty.revenue.weekly).toBe(0);
    expect(empty.revenue.monthly).toBe(0);
    expect(empty.revenue.totalRevenue).toBe(0);
    expect(empty.revenue.totalSalesCount).toBe(0);
    expect(empty.averageTicket).toBe(0);
    expect(empty.topProducts).toEqual([]);
    expect(empty.history).toEqual([]);
  });

  it("computes daily, weekly, and monthly revenue (3A), average ticket (3B), ranking (3C), and chronological history (3D)", () => {
    const now = new Date("2026-11-15T18:00:00");
    const sales: Sale[] = [
      {
        id: "s-old-month",
        orderId: "o1",
        orderCode: "KB-001",
        items: [
          {
            productId: "p-a",
            productName: "Classic Boba",
            quantity: 1,
            unitPrice: 20,
            subtotal: 20,
          },
        ],
        total: 20,
        paymentMethod: "PIX",
        operatorRole: "Colaborador",
        createdAt: "2026-10-25T15:00:00",
      },
      {
        id: "s-month-only",
        orderId: "o2",
        orderCode: "KB-002",
        items: [
          {
            productId: "p-b",
            productName: "Matcha Boba",
            quantity: 3,
            unitPrice: 25,
            subtotal: 75,
          },
        ],
        total: 75,
        paymentMethod: "Dinheiro",
        operatorRole: "Colaborador",
        createdAt: "2026-11-03T12:00:00",
      },
      {
        id: "s-week",
        orderId: "o3",
        orderCode: "KB-003",
        items: [
          {
            productId: "p-a",
            productName: "Classic Boba",
            quantity: 2,
            unitPrice: 20,
            subtotal: 40,
          },
        ],
        total: 40,
        paymentMethod: "Cartão de Crédito",
        operatorRole: "Gestor",
        createdAt: "2026-11-13T14:00:00",
      },
      {
        id: "s-today",
        orderId: "o4",
        orderCode: "KB-004",
        items: [
          {
            productId: "p-a",
            productName: "Classic Boba",
            quantity: 2,
            unitPrice: 20,
            subtotal: 40,
          },
          {
            productId: "p-c",
            productName: "Mochi",
            quantity: 1,
            unitPrice: 15,
            subtotal: 15,
          },
        ],
        total: 55,
        paymentMethod: "PIX",
        operatorRole: "Colaborador",
        createdAt: "2026-11-15T16:00:00",
      },
    ];

    const revenue = calculateRevenueBreakdown(sales, now);
    expect(revenue.daily).toBe(55);
    expect(revenue.dailyCount).toBe(1);
    expect(revenue.weekly).toBe(95); // 40 + 55
    expect(revenue.weeklyCount).toBe(2);
    expect(revenue.monthly).toBe(170); // 75 + 40 + 55
    expect(revenue.monthlyCount).toBe(3);
    expect(revenue.totalRevenue).toBe(190);

    // Average ticket: 190 / 4 = 47.5
    expect(calculateAverageTicket(sales)).toBe(47.5);

    // Ranking: Classic Boba (5 units), Matcha Boba (3 units), Mochi (1 unit)
    const ranking = calculateTopSellingProducts(sales);
    expect(ranking[0].productId).toBe("p-a");
    expect(ranking[0].unitsSold).toBe(5);
    expect(ranking[0].revenue).toBe(100);
    expect(ranking[1].productId).toBe("p-b");
    expect(ranking[1].unitsSold).toBe(3);
    expect(ranking[2].productId).toBe("p-c");
    expect(ranking[2].unitsSold).toBe(1);

    // Chronological history (newest first)
    const seed = createInitialSeed(now);
    writeStore({ ...seed, sales }, window.localStorage);
    const snapshot = getReportsSnapshot(window.localStorage, now);
    expect(snapshot.history.map((s) => s.id)).toEqual([
      "s-today",
      "s-week",
      "s-month-only",
      "s-old-month",
    ]);
  });
});
