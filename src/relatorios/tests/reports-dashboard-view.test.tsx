import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AppStoreProvider } from "@/shared/contexts/app-store-provider";
import { ReportsDashboardView } from "@/relatorios/components/reports-dashboard-view";
import { login } from "@/auth/services/auth-service";
import { processCheckout } from "@/vendas/services/sales-service";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => "/relatorios",
}));

describe("ReportsDashboardView (/relatorios)", () => {
  beforeEach(() => {
    window.localStorage.clear();
    login("Gestor", window.localStorage);
  });

  it("renders KPIs, product ranking, and sales history reflecting new sales", () => {
    const checkout = processCheckout(
      {
        items: [{ productId: "prod-mochi-duo", quantity: 3 }],
        paymentMethod: "PIX",
        operatorRole: "Gestor",
      },
      window.localStorage,
    );
    expect(checkout.ok).toBe(true);
    const createdCode = checkout.ok ? checkout.order.code : "";

    render(
      <AppStoreProvider>
        <ReportsDashboardView />
      </AppStoreProvider>,
    );

    expect(screen.getByText("Faturamento Diário (3A)")).toBeDefined();
    expect(screen.getByText("Ticket Médio (3B)")).toBeDefined();
    expect(screen.getByText("Produtos Mais Vendidos (3C)")).toBeDefined();

    // Top-selling product (Mochi Artesanal (2 un)) is selected by default
    const initialRegion = screen.getByRole("region", {
      name: "Métricas de Mochi Artesanal (2 un)",
    });
    expect(initialRegion).toBeDefined();
    expect(initialRegion.textContent).toContain(
      "Faturamento do Produto: Mochi Artesanal (2 un)",
    );
    expect(initialRegion.textContent).toContain("Total acumulado");

    // Clear selection hides the individual product metrics region
    fireEvent.click(screen.getByRole("button", { name: /Limpar seleção/i }));
    expect(
      screen.queryByRole("region", {
        name: "Métricas de Mochi Artesanal (2 un)",
      }),
    ).toBeNull();

    // Clicking the product in ranking opens its individual metrics again
    const mochiButton = screen.getByRole("button", {
      name: /Mochi Artesanal \(2 un\)/i,
    });
    fireEvent.click(mochiButton);
    expect(
      screen.getByRole("region", {
        name: "Métricas de Mochi Artesanal (2 un)",
      }),
    ).toBeDefined();

    // Switch to Histórico de Vendas tab and verify newly created sale appears
    const historyTab = screen.getByRole("tab", {
      name: /Histórico de Vendas/i,
    });
    fireEvent.mouseDown(historyTab);
    fireEvent.click(historyTab);
    expect(screen.getByText(createdCode)).toBeDefined();
  });
});
