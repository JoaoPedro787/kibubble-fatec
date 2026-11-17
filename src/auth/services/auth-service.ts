import { readStore, updateStore } from "@/shared/libs/storage";
import type { UserRole, UserSession } from "@/shared/types/domain";

export const ROLE_DEFAULT_ROUTE: Record<UserRole, string> = {
  Colaborador: "/vendas",
  Gestor: "/relatorios",
};

export const MANAGER_ONLY_ROUTES = ["/estoque", "/relatorios"] as const;
export const PROTECTED_ROUTES = [
  "/vendas",
  "/pedidos",
  "/estoque",
  "/relatorios",
] as const;

const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  Colaborador: "Operador de Balcão",
  Gestor: "Gestor da Loja",
};

export function isManagerOnlyRoute(pathname: string): boolean {
  return MANAGER_ONLY_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function canAccessRoute(
  role: UserRole | null,
  pathname: string,
): boolean {
  if (!role) return false;
  if (isManagerOnlyRoute(pathname)) {
    return role === "Gestor";
  }
  return true;
}

export function getRedirectRoute(
  session: UserSession | null,
  pathname: string,
): string | null {
  if (pathname === "/") {
    return null;
  }

  if (!session) {
    if (pathname === "/login") return null;
    return "/login";
  }

  if (pathname === "/login") {
    return ROLE_DEFAULT_ROUTE[session.role];
  }

  if (!canAccessRoute(session.role, pathname)) {
    return "/vendas";
  }

  return null;
}

export function getSession(storage?: Storage | null): UserSession | null {
  return readStore(storage).session;
}

export function login(
  role: UserRole,
  storage?: Storage | null,
): UserSession {
  const session: UserSession = {
    role,
    name: ROLE_DISPLAY_NAMES[role],
    loggedInAt: new Date().toISOString(),
  };

  updateStore(
    (current) => ({
      ...current,
      session,
    }),
    storage,
  );

  return session;
}

export function switchRole(
  role: UserRole,
  storage?: Storage | null,
): UserSession {
  const session: UserSession = {
    role,
    name: ROLE_DISPLAY_NAMES[role],
    loggedInAt: new Date().toISOString(),
  };

  updateStore(
    (current) => ({
      ...current,
      session,
    }),
    storage,
  );

  return session;
}

export function logout(storage?: Storage | null): void {
  updateStore(
    (current) => ({
      ...current,
      session: null,
    }),
    storage,
  );
}
