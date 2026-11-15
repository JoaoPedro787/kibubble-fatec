"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ROLE_DEFAULT_ROUTE,
  getRedirectRoute,
  login as loginService,
  logout as logoutService,
  switchRole as switchRoleService,
} from "@/auth/services/auth-service";
import { useAppStore } from "@/shared/contexts/app-store-provider";
import type { UserRole } from "@/shared/types/domain";

export function useAuth() {
  const { store, hydrated } = useAppStore();
  const router = useRouter();
  const pathname = usePathname();

  const login = useCallback(
    (role: UserRole) => {
      loginService(role);
      router.replace(ROLE_DEFAULT_ROUTE[role]);
    },
    [router],
  );

  const switchRole = useCallback(
    (role: UserRole) => {
      const updated = switchRoleService(role);
      const redirectTo = getRedirectRoute(updated, pathname);
      if (redirectTo) {
        router.replace(redirectTo);
      }
    },
    [pathname, router],
  );

  const logout = useCallback(() => {
    logoutService();
    router.replace("/login");
  }, [router]);

  return {
    session: store.session,
    hydrated,
    login,
    switchRole,
    logout,
  };
}
