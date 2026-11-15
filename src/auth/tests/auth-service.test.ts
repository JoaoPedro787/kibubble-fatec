import { beforeEach, describe, expect, it } from "vitest";
import {
  canAccessRoute,
  getRedirectRoute,
  getSession,
  login,
  logout,
  switchRole,
} from "@/auth/services/auth-service";

describe("authService", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("persists login session and clears it on logout", () => {
    expect(getSession(window.localStorage)).toBeNull();

    const session = login("Colaborador", window.localStorage);
    expect(session.role).toBe("Colaborador");
    expect(getSession(window.localStorage)?.role).toBe("Colaborador");

    const switched = switchRole("Gestor", window.localStorage);
    expect(switched.role).toBe("Gestor");
    expect(getSession(window.localStorage)?.role).toBe("Gestor");

    logout(window.localStorage);
    expect(getSession(window.localStorage)).toBeNull();
  });

  it("enforces route guards for unauthenticated, Colaborador, and Gestor users", () => {
    expect(getRedirectRoute(null, "/")).toBe("/login");
    expect(getRedirectRoute(null, "/vendas")).toBe("/login");
    expect(getRedirectRoute(null, "/estoque")).toBe("/login");
    expect(getRedirectRoute(null, "/login")).toBeNull();

    const colab = login("Colaborador", window.localStorage);
    expect(canAccessRoute(colab.role, "/vendas")).toBe(true);
    expect(canAccessRoute(colab.role, "/pedidos")).toBe(true);
    expect(canAccessRoute(colab.role, "/estoque")).toBe(false);
    expect(canAccessRoute(colab.role, "/relatorios")).toBe(false);

    expect(getRedirectRoute(colab, "/")).toBe("/vendas");
    expect(getRedirectRoute(colab, "/login")).toBe("/vendas");
    expect(getRedirectRoute(colab, "/estoque")).toBe("/vendas");
    expect(getRedirectRoute(colab, "/relatorios")).toBe("/vendas");
    expect(getRedirectRoute(colab, "/vendas")).toBeNull();

    const gestor = switchRole("Gestor", window.localStorage);
    expect(canAccessRoute(gestor.role, "/estoque")).toBe(true);
    expect(canAccessRoute(gestor.role, "/relatorios")).toBe(true);
    expect(getRedirectRoute(gestor, "/")).toBe("/relatorios");
    expect(getRedirectRoute(gestor, "/estoque")).toBeNull();
    expect(getRedirectRoute(gestor, "/relatorios")).toBeNull();
  });
});
