"use client";

import { CupSoda, Moon, Sun } from "lucide-react";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { useAppStore } from "@/shared/contexts/app-store-provider";
import { useScrollProgress } from "@/landing/hooks/use-scroll-progress";
import { HeroParallaxSection } from "@/landing/components/hero-parallax-section";
import { KineticMarquee } from "@/landing/components/kinetic-marquee";
import { ExplodedCupSection } from "@/landing/components/exploded-cup-section";
import { SpotlightCatalogSection } from "@/landing/components/spotlight-catalog-section";
import { DrinkAlchemySection } from "@/landing/components/drink-alchemy-section";

const SECTION_LINKS = [
  { href: "#anatomia", label: "Anatomia" },
  { href: "#catalogo", label: "Cardápio" },
  { href: "#alquimia", label: "Combinação" },
] as const;

function ScrollProgressBar() {
  const { progress } = useScrollProgress();
  const percent = Math.round(progress * 100);

  return (
    <div
      role="progressbar"
      aria-label="Progresso de leitura"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-border/50"
    >
      <div
        style={{ transform: `scaleX(${progress.toFixed(4)})` }}
        className="h-full w-full origin-left bg-foreground transition-transform duration-75 ease-out"
      />
    </div>
  );
}

export function LandingPageView() {
  const { resolvedTheme, toggleTheme } = useAppStore();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <a
            href="#inicio"
            className="flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex size-8 items-center justify-center rounded-md border border-border bg-primary text-primary-foreground">
              <CupSoda className="size-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold tracking-tight text-foreground">
              Ki Bubble
            </span>
          </a>

          <nav
            aria-label="Navegação principal"
            className="hidden items-center gap-7 sm:flex"
          >
            {SECTION_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2.5 rounded-full border border-border bg-card/85 px-3 py-1.5">
            {resolvedTheme === "dark" ? (
              <Moon className="size-3.5 text-foreground" aria-hidden="true" />
            ) : (
              <Sun className="size-3.5 text-foreground" aria-hidden="true" />
            )}
            <Label
              htmlFor="landing-theme-toggle"
              className="hidden text-xs font-medium cursor-pointer sm:inline"
            >
              {resolvedTheme === "dark" ? "Escuro" : "Claro"}
            </Label>
            <Switch
              id="landing-theme-toggle"
              aria-label="Alternar tema claro ou escuro"
              checked={resolvedTheme === "dark"}
              onCheckedChange={toggleTheme}
            />
          </div>
        </div>

        {/* Mobile anchor bar */}
        <nav
          aria-label="Navegação móvel"
          className="flex h-10 items-center justify-center gap-6 border-t border-border/70 px-4 sm:hidden"
        >
          {SECTION_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <ScrollProgressBar />
      </header>

      <main className="overflow-x-clip pt-10 sm:pt-0">
        <HeroParallaxSection />
        <KineticMarquee />
        <ExplodedCupSection />
        <SpotlightCatalogSection />
        <DrinkAlchemySection />
      </main>

      <footer className="border-t border-border bg-background py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded border border-border bg-primary text-primary-foreground">
                <CupSoda className="size-3.5" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold tracking-tight">
                Ki Bubble
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Bubble tea artesanal em contraste monocromático.
            </p>
          </div>

          <nav
            aria-label="Navegação do rodapé"
            className="flex flex-wrap items-center gap-5 text-xs text-muted-foreground"
          >
            <a href="#inicio" className="hover:text-foreground">
              Início
            </a>
            {SECTION_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
