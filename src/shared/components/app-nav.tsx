"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Boxes, ClipboardList, ShoppingBag } from "lucide-react";
import { cn } from "@/shared/libs/cn";
import type { UserRole } from "@/shared/types/domain";

interface NavItem {
  href: string;
  label: string;
  icon: typeof ShoppingBag;
  roles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/vendas",
    label: "Vendas",
    icon: ShoppingBag,
    roles: ["Colaborador", "Gestor"],
  },
  {
    href: "/pedidos",
    label: "Pedidos",
    icon: ClipboardList,
    roles: ["Colaborador", "Gestor"],
  },
  {
    href: "/estoque",
    label: "Estoque",
    icon: Boxes,
    roles: ["Gestor"],
  },
  {
    href: "/relatorios",
    label: "Relatórios",
    icon: BarChart3,
    roles: ["Gestor"],
  },
];

export function AppNav({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <nav aria-label="Navegação principal" className="flex items-center gap-1 overflow-x-auto">
      {visibleItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
