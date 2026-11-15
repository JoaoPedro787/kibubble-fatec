"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getRedirectRoute } from "@/auth/services/auth-service";
import { useAppStore } from "@/shared/contexts/app-store-provider";

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { store, hydrated } = useAppStore();
  const pathname = usePathname();
  const router = useRouter();

  const redirectTo = hydrated ? getRedirectRoute(store.session, pathname) : null;

  useEffect(() => {
    if (hydrated && redirectTo) {
      router.replace(redirectTo);
    }
  }, [hydrated, redirectTo, router]);

  if (!hydrated || redirectTo) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-background text-foreground"
        aria-busy="true"
        aria-label="Carregando sessão"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="h-5 w-32 animate-pulse rounded bg-muted" />
          <div className="h-3 w-48 animate-pulse rounded bg-muted/70" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
