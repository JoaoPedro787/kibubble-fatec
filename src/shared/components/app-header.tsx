"use client";

import Link from "next/link";
import { CupSoda, LogOut, Moon, Settings, Sun } from "lucide-react";
import { useAuth } from "@/auth/hooks/use-auth";
import { ROLE_DEFAULT_ROUTE } from "@/auth/services/auth-service";
import { AppNav } from "@/shared/components/app-nav";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Separator } from "@/shared/components/ui/separator";
import { Switch } from "@/shared/components/ui/switch";
import { useAppStore } from "@/shared/contexts/app-store-provider";
import type { UserRole } from "@/shared/types/domain";

export function AppHeader() {
  const { session, switchRole, logout } = useAuth();
  const { resolvedTheme, toggleTheme } = useAppStore();

  if (!session) return null;

  const homeHref = ROLE_DEFAULT_ROUTE[session.role];

  return (
    <header
      style={{ viewTransitionName: "app-header" }}
      className="sticky top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85"
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4 sm:gap-6">
          <Link
            href={homeHref}
            transitionTypes={["nav-lateral"]}
            className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex size-8 items-center justify-center rounded-md border border-border bg-primary text-primary-foreground">
              <CupSoda className="size-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold tracking-tight">
              Ki Bubble
            </span>
          </Link>

          <div className="hidden md:block">
            <AppNav role={session.role} indicatorName="nav-pill-desktop" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={session.role}
            onValueChange={(value) => switchRole(value as UserRole)}
          >
            <SelectTrigger
              aria-label="Perfil de acesso"
              className="h-9 w-[124px] sm:w-[142px] text-xs font-medium cursor-pointer"
            >
              <SelectValue placeholder="Perfil" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="Colaborador" className="cursor-pointer">
                Colaborador
              </SelectItem>
              <SelectItem value="Gestor" className="cursor-pointer">
                Gestor
              </SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Gear Settings"
                title="Configurações"
                className="cursor-pointer"
              >
                <Settings className="size-4" aria-hidden="true" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64 p-4">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Sessão ativa</p>
                  <p className="text-sm font-semibold">{session.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Perfil: {session.role}
                  </p>
                </div>

                <Separator />

                <div className="flex items-center justify-between gap-2">
                  <Label
                    htmlFor="header-theme-toggle"
                    className="flex items-center gap-2 text-sm font-medium cursor-pointer"
                  >
                    {resolvedTheme === "dark" ? (
                      <Moon className="size-4" aria-hidden="true" />
                    ) : (
                      <Sun className="size-4" aria-hidden="true" />
                    )}
                    <span>
                      {resolvedTheme === "dark" ? "Tema Escuro" : "Tema Claro"}
                    </span>
                  </Label>
                  <Switch
                    id="header-theme-toggle"
                    aria-label="Alternar tema claro ou escuro"
                    checked={resolvedTheme === "dark"}
                    onCheckedChange={toggleTheme}
                  />
                </div>

                <Separator />

                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start gap-2 cursor-pointer"
                  onClick={logout}
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  <span>Deslogar</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex h-11 items-center overflow-x-auto border-t border-border px-4 md:hidden">
        <AppNav role={session.role} indicatorName="nav-pill-mobile" />
      </div>
    </header>
  );
}
