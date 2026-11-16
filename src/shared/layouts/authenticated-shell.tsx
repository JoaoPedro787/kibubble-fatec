"use client";

import { RouteGuard } from "@/auth/components/route-guard";
import { AppHeader } from "@/shared/components/app-header";

export function AuthenticatedShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard>
      <div className="min-h-screen flex flex-col overflow-x-clip bg-background text-foreground">
        <AppHeader />
        <main className="mx-auto w-full max-w-7xl min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </RouteGuard>
  );
}
