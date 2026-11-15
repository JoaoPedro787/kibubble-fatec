import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AppStoreProvider } from "@/shared/contexts/app-store-provider";
import { InventoryView } from "@/estoque/components/inventory-view";
import { login } from "@/auth/services/auth-service";
import { readStore } from "@/shared/libs/storage";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => "/estoque",
}));

describe("InventoryView (/estoque)", () => {
  beforeEach(() => {
    window.localStorage.clear();
    login("Gestor", window.localStorage);
  });

  it("validates 4A quantity edits and updates low-stock alerts dynamically", () => {
    render(
      <AppStoreProvider>
        <InventoryView />
      </AppStoreProvider>,
    );

    // Seed starts with Creme Cheese Foam at 180g <= 200g minThreshold
    expect(screen.getByRole("region", { name: "Alertas de estoque baixo" })).toBeDefined();

    // Open edit dialog for first ingredient (Pérolas de Tapioca Preta)
    const updateButtons = screen.getAllByRole("button", { name: /Atualizar/i });
    fireEvent.click(updateButtons[0]);

    const input = screen.getByLabelText(/Nova quantidade/i);
    fireEvent.change(input, { target: { value: "-10" } });
    fireEvent.click(screen.getByRole("button", { name: "Salvar quantidade" }));

    expect(screen.getByRole("alert").textContent).toContain("4A");

    // Set below threshold (100 <= 300)
    fireEvent.change(input, { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "Salvar quantidade" }));

    const updated = readStore(window.localStorage).ingredients[0];
    expect(updated.quantity).toBe(100);
    expect(
      screen.getByRole("region", { name: "Alertas de estoque baixo" }).textContent,
    ).toContain("Pérolas de Tapioca Preta");
  });
});
