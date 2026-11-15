import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AppStoreProvider } from "@/shared/contexts/app-store-provider";
import { AuthenticatedShell } from "@/shared/layouts/authenticated-shell";
import { PageTransition } from "@/shared/components/page-transition";
import { useAuth } from "@/auth/hooks/use-auth";
import { login } from "@/auth/services/auth-service";
import { readStore } from "@/shared/libs/storage";

const replaceMock = vi.fn();
let currentPathname = "/vendas";

const addTransitionTypeSpy = vi.fn();

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return {
    ...actual,
    addTransitionType: (type: string) => {
      addTransitionTypeSpy(type);
      if (typeof actual.addTransitionType === "function") {
        actual.addTransitionType(type);
      }
    },
  };
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
  usePathname: () => currentPathname,
}));

function AuthTransitionControls() {
  const { switchRole, login: loginAction, logout } = useAuth();
  return (
    <div>
      <button type="button" onClick={() => switchRole("Gestor")}>
        Mudar para Gestor
      </button>
      <button type="button" onClick={() => switchRole("Colaborador")}>
        Mudar para Colaborador
      </button>
      <button type="button" onClick={() => loginAction("Colaborador")}>
        Entrar Colaborador
      </button>
      <button type="button" onClick={() => logout()}>
        Sair
      </button>
    </div>
  );
}

describe("Page View Transitions (F1)", () => {
  beforeEach(() => {
    window.localStorage.clear();
    replaceMock.mockReset();
    addTransitionTypeSpy.mockReset();
    currentPathname = "/vendas";
  });

  it("renders PageTransition around page content", () => {
    render(
      <PageTransition>
        <div>Conteúdo de vendas</div>
      </PageTransition>,
    );

    expect(screen.getByText("Conteúdo de vendas")).not.toBeNull();
  });

  it("switches roles directly without triggering role-switch transition types", () => {
    login("Colaborador", window.localStorage);

    render(
      <AppStoreProvider>
        <AuthenticatedShell>
          <AuthTransitionControls />
        </AuthenticatedShell>
      </AppStoreProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Mudar para Gestor" }));

    expect(readStore(window.localStorage).session?.role).toBe("Gestor");
    expect(addTransitionTypeSpy).not.toHaveBeenCalled();
    expect(replaceMock).not.toHaveBeenCalled();

    currentPathname = "/estoque";
    fireEvent.click(screen.getByRole("button", { name: "Mudar para Colaborador" }));

    expect(readStore(window.localStorage).session?.role).toBe("Colaborador");
    expect(addTransitionTypeSpy).not.toHaveBeenCalled();
    expect(replaceMock).toHaveBeenCalledWith("/vendas");
  });

  it("applies nav-forward on login and nav-back on logout", async () => {
    render(
      <AppStoreProvider>
        <AuthTransitionControls />
      </AppStoreProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Entrar Colaborador" }));

    await waitFor(() => {
      expect(addTransitionTypeSpy).toHaveBeenCalledWith("nav-forward");
      expect(replaceMock).toHaveBeenCalledWith("/vendas");
    });

    addTransitionTypeSpy.mockClear();
    replaceMock.mockReset();

    fireEvent.click(screen.getByRole("button", { name: "Sair" }));

    await waitFor(() => {
      expect(addTransitionTypeSpy).toHaveBeenCalledWith("nav-back");
      expect(replaceMock).toHaveBeenCalledWith("/login");
    });
  });
});
