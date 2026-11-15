"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRedirectRoute } from "@/auth/services/auth-service";
import { useAppStore } from "@/shared/contexts/app-store-provider";

export default function HomePage() {
  const { store, hydrated } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    const target = getRedirectRoute(store.session, "/") ?? "/login";
    router.replace(target);
  }, [hydrated, store.session, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <span className="text-sm text-muted-foreground">
        Redirecionando...
      </span>
    </main>
  );
}
