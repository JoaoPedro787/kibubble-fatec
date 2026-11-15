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

    // Switch to Histórico de Vendas tab and verify newly created sale appears
    const historyTab = screen.getByRole("tab", {
      name: /Histórico de Vendas/i,
    });
    fireEvent.mouseDown(historyTab);
    fireEvent.click(historyTab);
    expect(screen.getByText(createdCode)).toBeDefined();
  });
});
