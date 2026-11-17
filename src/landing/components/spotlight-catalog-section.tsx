"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { formatCurrencyBRL } from "@/shared/libs/formatters";
import {
  CATALOG_FILTER_CATEGORIES,
  LANDING_CATALOG_ITEMS,
  filterCatalogByCategory,
} from "@/landing/services/landing-catalog-service";
import type { CatalogFilterCategory } from "@/landing/types/landing";
import { SpotlightDrinkIllustration } from "@/landing/components/monochrome-cup-art";
import { cn } from "@/shared/libs/cn";

interface SensoryMeterRowProps {
  label: string;
  value: number;
}

function SensoryMeterRow({ label, value }: SensoryMeterRowProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">{label}</span>
        <span className="font-mono tabular-nums text-muted-foreground">
          {value}%
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          style={{ transform: `scaleX(${(value / 100).toFixed(2)})` }}
          className="h-full w-full origin-left rounded-full bg-foreground transition-transform duration-300 ease-out"
        />
      </div>
    </div>
  );
}

export function SpotlightCatalogSection() {
  const [selectedCategory, setSelectedCategory] =
    useState<CatalogFilterCategory>("Todos");
  const [selectedItemId, setSelectedItemId] = useState<string>(
    LANDING_CATALOG_ITEMS[0].id,
  );

  const visibleItems = useMemo(
    () => filterCatalogByCategory(selectedCategory),
    [selectedCategory],
  );

  const activeItem = useMemo(
    () =>
      visibleItems.find((item) => item.id === selectedItemId) ??
      visibleItems[0] ??
      LANDING_CATALOG_ITEMS[0],
    [visibleItems, selectedItemId],
  );

  function handleSelectCategory(category: CatalogFilterCategory) {
    setSelectedCategory(category);
    const filtered = filterCatalogByCategory(category);
    if (filtered.length > 0) {
      setSelectedItemId(filtered[0].id);
    }
  }

  return (
    <section
      id="catalogo"
      aria-labelledby="catalogo-heading"
      className="scroll-mt-[106px] border-b border-border bg-background py-20 sm:scroll-mt-16 sm:py-28"
    >
      <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <h2
              id="catalogo-heading"
              className="text-3xl font-bold tracking-[-0.03em] text-foreground sm:text-5xl"
            >
              Cardápio autoral
            </h2>
            <p className="max-w-xl text-base text-muted-foreground">
              Explore as seis criações da casa. Selecione ou passe o cursor
              sobre qualquer bebida para inspecionar sua composição e
              intensidade sensorial.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div
            role="group"
            aria-label="Filtrar cardápio por categoria"
            className="flex flex-wrap gap-2"
          >
            {CATALOG_FILTER_CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleSelectCategory(category)}
                  className={cn(
                    "min-h-[40px] rounded-full border px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:bg-muted",
                  )}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left Editorial List */}
          <ul
            aria-label="Lista de criações em destaque"
            className="divide-y divide-border border-y border-border lg:col-span-6"
          >
            {visibleItems.map((item) => {
              const isActive = activeItem.id === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setSelectedItemId(item.id)}
                    onMouseEnter={() => setSelectedItemId(item.id)}
                    onFocus={() => setSelectedItemId(item.id)}
                    className={cn(
                      "group flex w-full items-start justify-between gap-4 px-3 py-5 text-left transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-4",
                      isActive
                        ? "bg-muted/85 text-foreground"
                        : "bg-transparent text-foreground hover:bg-muted/40",
                    )}
                  >
                    <div className="flex min-w-0 items-start gap-4">
                      <span
                        className={cn(
                          "mt-1 font-mono text-xs tabular-nums transition-opacity",
                          isActive
                            ? "font-semibold text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {item.indexCode}
                      </span>
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-lg font-semibold tracking-tight sm:text-xl">
                            {item.name}
                          </span>
                          <Badge variant="outline" className="text-[11px]">
                            {item.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.tagline}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 font-mono text-sm font-semibold tabular-nums text-foreground">
                      {formatCurrencyBRL(item.price)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Right Interactive Spotlight Stage */}
          <div className="lg:sticky lg:top-24 lg:col-span-6">
            <Card
              data-spotlight-item={activeItem.id}
              className="overflow-hidden border-border bg-card py-0 shadow-none"
            >
              <CardContent className="space-y-6 p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 space-y-1.5">
                    <Badge variant="secondary">{activeItem.category}</Badge>
                    <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                      {activeItem.name}
                    </h3>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="block font-mono text-xl font-bold tabular-nums text-foreground sm:text-2xl">
                      {formatCurrencyBRL(activeItem.price)}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {activeItem.servingSize} / {activeItem.temperature}
                    </span>
                  </div>
                </div>

                {/* Illustrated Stage + Non-Overlapping Ingredient Callouts */}
                <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-border bg-muted/35 p-5 sm:p-6">
                  <div
                    key={activeItem.id}
                    className="flex items-center justify-center text-foreground transition-opacity duration-300"
                  >
                    <SpotlightDrinkIllustration
                      variant={activeItem.visual.variant}
                      visual={activeItem.visual}
                      className="h-[205px] w-[175px] sm:h-[235px] sm:w-[200px]"
                    />
                  </div>

                  <ul
                    aria-label="Ingredientes em destaque"
                    className="grid w-full gap-2.5 sm:grid-cols-3"
                  >
                    {activeItem.floatingIngredients.map((ing) => (
                      <li
                        key={ing.id}
                        className="rounded-xl border border-border bg-background/90 px-3 py-2.5 backdrop-blur-sm"
                      >
                        <span className="block text-xs font-semibold text-foreground">
                          {ing.label}
                        </span>
                        <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                          {ing.note}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {activeItem.description}
                </p>

                <Separator />

                {/* Sensory Profile Meters */}
                <div className="space-y-3" aria-label="Perfil sensorial">
                  <SensoryMeterRow
                    label="Cremosidade"
                    value={activeItem.sensoryProfile.cremosidade}
                  />
                  <SensoryMeterRow
                    label="Doçura"
                    value={activeItem.sensoryProfile.docura}
                  />
                  <SensoryMeterRow
                    label="Intensidade"
                    value={activeItem.sensoryProfile.intensidade}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
