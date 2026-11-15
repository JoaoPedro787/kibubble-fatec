import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AppStoreProvider } from "@/shared/contexts/app-store-provider";
import { OrdersBoardView } from "@/pedidos/components/orders-board-view";
import { login } from "@/auth/services/auth-service";
import { processCheckout } from "@/vendas/services/sales-service";
import { readStore } from "@/shared/libs/storage";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => "/pedidos",
}));

describe("OrdersBoardView (/pedidos)", () => {
  beforeEach(() => {
    window.localStorage.clear();
    login("Colaborador", window.localStorage);
  });

  it("displays newly created sale as Em preparo and advances to Pronto then Entregue", () => {
    const checkout = processCheckout(
      {
        items: [{ productId: "prod-classic-milk", quantity: 1 }],
        paymentMethod: "PIX",
        operatorRole: "Colaborador",
      },
      window.localStorage,
    );
    expect(checkout.ok).toBe(true);
    const createdCode = checkout.ok ? checkout.order.code : "";

    render(
      <AppStoreProvider>
        <OrdersBoardView />
      </AppStoreProvider>,
    );

    expect(screen.getByText(createdCode)).toBeDefined();

    // Advance the first Em preparo order (which is the newest sale)
    const prontoButtons = screen.getAllByRole("button", {
      name: /Marcar como Pronto/i,
    });
    fireEvent.click(prontoButtons[0]);

    const afterPronto = readStore(window.localStorage).orders.find(
      (o) => o.code === createdCode,
    );
    expect(afterPronto?.status).toBe("Pronto");

    const entregueButtons = screen.getAllByRole("button", {
      name: /Marcar como Entregue/i,
    });
    fireEvent.click(entregueButtons[0]);

    const afterEntregue = readStore(window.localStorage).orders.find(
      (o) => o.code === createdCode,
    );
    expect(afterEntregue?.status).toBe("Entregue");
  });
});
