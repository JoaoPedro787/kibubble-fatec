import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AppStoreProvider } from "@/shared/contexts/app-store-provider";
import { AppHeader } from "@/shared/components/app-header";
import { useAuth } from "@/auth/hooks/use-auth";
import { login } from "@/auth/services/auth-service";
import { readStore } from "@/shared/libs/storage";

const replaceMock = vi.fn();
let currentPathname = "/estoque";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
  usePathname: () => currentPathname,
}));

function RoleSwitchProbe() {
  const { switchRole } = useAuth();
  return (
    <button type="button" onClick={() => switchRole("Colaborador")}>
      Forçar Colaborador
    </button>
  );
}

describe("AppHeader", () => {
  beforeEach(() => {
    window.localStorage.clear();
    replaceMock.mockReset();
    currentPathname = "/estoque";
    document.documentElement.classList.remove("dark");
  });

  it("shows Gestor navigation items, toggles theme in Gear Settings, and logs out", async () => {
    login("Gestor", window.localStorage);

    render(
      <AppStoreProvider>
        <AppHeader />
      </AppStoreProvider>,
    );

    expect(screen.getAllByRole("link", { name: "Vendas" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Pedidos" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Estoque" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Relatórios" }).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Gear Settings" }));

    const themeSwitch = await screen.findByRole("switch", {
      name: "Alternar tema claro ou escuro",
    });
    fireEvent.click(themeSwitch);

    await waitFor(() => {
      expect(readStore(window.localStorage).theme).toBe("dark");
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    fireEvent.click(screen.getByRole("button", { name: "Deslogar" }));
    expect(readStore(window.localStorage).session).toBeNull();
    expect(replaceMock).toHaveBeenCalledWith("/login");
  });

  it("redirects to /vendas when switching from Gestor to Colaborador on a manager-only route", () => {
    currentPathname = "/relatorios";
    login("Gestor", window.localStorage);

    render(
      <AppStoreProvider>
        <AppHeader />
        <RoleSwitchProbe />
      </AppStoreProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Forçar Colaborador" }));
    expect(readStore(window.localStorage).session?.role).toBe("Colaborador");
    expect(replaceMock).toHaveBeenCalledWith("/vendas");
  });

  it("filters navigation for Colaborador", () => {
    currentPathname = "/vendas";
    login("Colaborador", window.localStorage);

    render(
      <AppStoreProvider>
        <AppHeader />
      </AppStoreProvider>,
    );

    expect(screen.getAllByRole("link", { name: "Vendas" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Pedidos" }).length).toBeGreaterThan(0);
    expect(screen.queryByRole("link", { name: "Estoque" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Relatórios" })).toBeNull();
  });
});
