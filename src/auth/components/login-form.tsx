"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CupSoda, Moon, ShieldCheck, Sun, UserCheck } from "lucide-react";
import { useAuth } from "@/auth/hooks/use-auth";
import { ROLE_DEFAULT_ROUTE } from "@/auth/services/auth-service";
import { useAppStore } from "@/shared/contexts/app-store-provider";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Switch } from "@/shared/components/ui/switch";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/libs/cn";
import type { UserRole } from "@/shared/types/domain";

const PROFILE_OPTIONS: Array<{
  role: UserRole;
  title: string;
  subtitle: string;
  permissions: string[];
  icon: typeof UserCheck;
}> = [
  {
    role: "Colaborador",
    title: "Colaborador",
    subtitle: "Operação de balcão e cozinha",
    permissions: [
      "Registrar vendas no PDV",
      "Acompanhar e atualizar pedidos",
    ],
    icon: UserCheck,
  },
  {
    role: "Gestor",
    title: "Gestor",
    subtitle: "Operação completa e gestão",
    permissions: [
      "Acesso total a Vendas e Pedidos",
      "Controle de estoque e alertas",
      "Relatórios de faturamento e ranking",
    ],
    icon: ShieldCheck,
  },
];

export function LoginForm() {
  const { session, hydrated, login } = useAuth();
  const { resolvedTheme, toggleTheme } = useAppStore();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>("Colaborador");

  useEffect(() => {
    if (hydrated && session) {
      router.replace(ROLE_DEFAULT_ROUTE[session.role]);
    }
  }, [hydrated, session, router]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    login(selectedRole);
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground px-4 py-6 sm:px-8">
      <header className="mx-auto flex w-full max-w-4xl items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-md border border-border bg-primary text-primary-foreground">
            <CupSoda className="size-4" aria-hidden="true" />
          </div>
          <div className="leading-tight">
            <span className="block text-sm font-semibold tracking-tight">
              Ki Bubble
            </span>
            <span className="block text-xs text-muted-foreground">
              Sistema Operacional
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-md border border-border bg-card px-3 py-1.5">
          {resolvedTheme === "dark" ? (
            <Moon className="size-3.5 text-foreground" aria-hidden="true" />
          ) : (
            <Sun className="size-3.5 text-foreground" aria-hidden="true" />
          )}
          <Label
            htmlFor="login-theme-toggle"
            className="text-xs font-medium cursor-pointer"
          >
            {resolvedTheme === "dark" ? "Tema Escuro" : "Tema Claro"}
          </Label>
          <Switch
            id="login-theme-toggle"
            aria-label="Alternar tema claro ou escuro"
            checked={resolvedTheme === "dark"}
            onCheckedChange={toggleTheme}
          />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center py-10">
        <Card className="w-full border-border shadow-none">
          <CardHeader className="space-y-2 border-b border-border pb-6">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Acessar plataforma
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground max-w-md">
              Selecione o perfil operacional para iniciar o turno na loja Ki Bubble.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div
                role="radiogroup"
                aria-label="Perfil de acesso"
                className="grid gap-4 sm:grid-cols-2"
              >
                {PROFILE_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedRole === option.role;
                  return (
                    <button
                      key={option.role}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setSelectedRole(option.role)}
                      className={cn(
                        "group relative flex flex-col items-start rounded-lg border p-4 text-left transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-card-foreground hover:bg-muted/60",
                      )}
                    >
                      <div className="flex w-full items-center justify-between">
                        <div
                          className={cn(
                            "flex size-8 items-center justify-center rounded-md border",
                            isSelected
                              ? "border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground"
                              : "border-border bg-muted text-foreground",
                          )}
                        >
                          <Icon className="size-4" aria-hidden="true" />
                        </div>
                        <span
                          className={cn(
                            "flex size-5 items-center justify-center rounded-full border",
                            isSelected
                              ? "border-primary-foreground bg-primary-foreground text-primary"
                              : "border-border",
                          )}
                        >
                          {isSelected ? (
                            <Check className="size-3" aria-hidden="true" />
                          ) : null}
                        </span>
                      </div>

                      <div className="mt-4">
                        <div className="text-base font-semibold">
                          {option.title}
                        </div>
                        <p
                          className={cn(
                            "mt-0.5 text-xs",
                            isSelected
                              ? "text-primary-foreground/80"
                              : "text-muted-foreground",
                          )}
                        >
                          {option.subtitle}
                        </p>
                      </div>

                      <ul className="mt-4 space-y-1.5 text-xs">
                        {option.permissions.map((perm) => (
                          <li key={perm} className="flex items-start gap-2">
                            <span
                              aria-hidden="true"
                              className={cn(
                                "mt-1.5 size-1 shrink-0 rounded-full",
                                isSelected
                                  ? "bg-primary-foreground"
                                  : "bg-foreground",
                              )}
                            />
                            <span
                              className={cn(
                                isSelected
                                  ? "text-primary-foreground/90"
                                  : "text-muted-foreground",
                              )}
                            >
                              {perm}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-border pt-5">
                <p className="text-xs text-muted-foreground">
                  Você poderá alternar o perfil rapidamente pelo cabeçalho após entrar.
                </p>
                <Button type="submit" size="lg" className="cursor-pointer sm:w-auto w-full">
                  Entrar como {selectedRole}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <footer className="mx-auto w-full max-w-4xl text-center text-xs text-muted-foreground">
        Ki Bubble (armazenamento local no navegador)
      </footer>
    </div>
  );
}
