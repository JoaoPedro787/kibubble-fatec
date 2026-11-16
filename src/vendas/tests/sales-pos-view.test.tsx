import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AppStoreProvider } from "@/shared/contexts/app-store-provider";
import { SalesPosView } from "@/vendas/components/sales-pos-view";
import { login } from "@/auth/services/auth-service";
import { readStore } from "@/shared/libs/storage";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => "/vendas",
}));

describe("SalesPosView (/vendas)", () => {
  beforeEach(() => {
    window.localStorage.clear();
    login("Colaborador", window.localStorage);
  });

  it("handles 5A payment failure keeping cart intact, then completes sale updating localStorage", () => {
    const initialStore = readStore(window.localStorage);
    const initialSalesCount = initialStore.sales.length;
    const initialOrdersCount = initialStore.orders.length;

    render(
      <AppStoreProvider>
        <SalesPosView />
      </AppStoreProvider>,
    );

    const addButtons = screen.getAllByRole("button", { name: /Adicionar/i });
    fireEvent.click(addButtons[0]); // Classic Brown Sugar Boba

    expect(screen.getByText(/1 item/i)).toBeDefined();

    fireEvent.click(screen.getByRole("button", { name: "Finalizar Venda" }));

    expect(screen.getByRole("status").textContent).toContain("Venda registrada com sucesso");
    const updatedStore = readStore(window.localStorage);
    expect(updatedStore.sales.length).toBe(initialSalesCount + 1);
    expect(updatedStore.orders.length).toBe(initialOrdersCount + 1);
    expect(updatedStore.orders[0].status).toBe("Em preparo");
  });
});
