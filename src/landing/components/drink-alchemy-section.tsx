"use client";

import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Check } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { formatCurrencyBRL } from "@/shared/libs/formatters";
import {
  ALCHEMY_BASES,
  ALCHEMY_TEXTURES,
  ALCHEMY_TOPPINGS,
  matchDrinkCombination,
} from "@/landing/services/landing-catalog-service";
import type {
  AlchemyBaseId,
  AlchemyOption,
  AlchemyTextureId,
  AlchemyToppingId,
} from "@/landing/types/landing";
import { AlchemyLiveCup } from "@/landing/components/monochrome-cup-art";
import { cn } from "@/shared/libs/cn";

interface AlchemyStepGroupProps<T extends string> {
  stepNumber: string;
  title: string;
  options: readonly AlchemyOption<T>[];
  value: T;
  onChange: (value: T) => void;
  columnsClassName?: string;
}

function AlchemyStepGroup<T extends string>({
  stepNumber,
  title,
  options,
  value,
  onChange,
  columnsClassName = "grid-cols-1 sm:grid-cols-2",
}: AlchemyStepGroupProps<T>) {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, idx: number) {
    let nextIdx: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIdx = (idx + 1) % options.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIdx = (idx - 1 + options.length) % options.length;
    }
    if (nextIdx !== null) {
      event.preventDefault();
      onChange(options[nextIdx].id);
      buttonRefs.current[nextIdx]?.focus();
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-baseline gap-2.5">
        <span className="font-mono text-xs font-semibold tabular-nums text-muted-foreground">
          {stepNumber}
        </span>
        <h3 className="text-base font-semibold tracking-tight text-foreground">
          {title}
        </h3>
      </div>

      <div
        role="radiogroup"
        aria-label={`${stepNumber} ${title}`}
        className={cn("grid gap-2.5", columnsClassName)}
      >
        {options.map((option, idx) => {
          const isSelected = option.id === value;
          return (
            <button
              key={option.id}
              ref={(el) => {
                buttonRefs.current[idx] = el;
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(option.id)}
              onKeyDown={(event) => handleKeyDown(event, idx)}
              className={cn(
                "flex min-h-[68px] items-start justify-between gap-3 rounded-xl border p-3.5 text-left transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:bg-muted/70",
              )}
            >
              <div className="space-y-0.5">
                <span className="block text-sm font-semibold">
                  {option.label}
                </span>
                <span
                  className={cn(
                    "block text-xs leading-snug",
                    isSelected
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground",
                  )}
                >
                  {option.subtitle}
                </span>
              </div>
              <span
                aria-hidden="true"
                className={cn(
                  "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
                  isSelected
                    ? "border-primary-foreground bg-primary-foreground text-primary"
                    : "border-border",
                )}
              >
                {isSelected ? <Check className="size-3" /> : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DrinkAlchemySection() {
  const [base, setBase] = useState<AlchemyBaseId>("assam");
  const [texture, setTexture] = useState<AlchemyTextureId>("tapioca");
  const [topping, setTopping] = useState<AlchemyToppingId>("mascavo");

  const recommendation = useMemo(
    () => matchDrinkCombination(base, texture, topping),
    [base, texture, topping],
  );

  return (
    <section
      id="alquimia"
      aria-labelledby="alquimia-heading"
      className="scroll-mt-[106px] bg-background py-20 sm:scroll-mt-16 sm:py-28"
    >
      <div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-3">
          <h2
            id="alquimia-heading"
            className="text-3xl font-bold tracking-[-0.03em] text-foreground sm:text-5xl"
          >
            Monte sua combinação
          </h2>
          <p className="text-base text-muted-foreground">
            Escolha a base líquida, a textura das pérolas e a finalização do topo
            em três cliques para descobrir qual criação Ki Bubble traduz o seu
            paladar.
          </p>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-12">
          {/* 3-Step Interactive Controls */}
          <div className="space-y-8 lg:col-span-7">
            <AlchemyStepGroup
              stepNumber="1."
              title="Base"
              options={ALCHEMY_BASES}
              value={base}
              onChange={setBase}
            />

            <AlchemyStepGroup
              stepNumber="2."
              title="Textura"
              options={ALCHEMY_TEXTURES}
              value={texture}
              onChange={setTexture}
            />

            <AlchemyStepGroup
              stepNumber="3."
              title="Finalização"
              options={ALCHEMY_TOPPINGS}
              value={topping}
              onChange={setTopping}
            />
          </div>

          {/* Live Layered Cup Preview & Signature Recommendation */}
          <div className="lg:sticky lg:top-24 lg:col-span-5">
            <Card
              data-alchemy-match={recommendation.recommendedDrink.id}
              className="overflow-hidden border-border bg-card py-0 shadow-none"
            >
              <CardContent className="space-y-6 p-6 sm:p-8">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline">{recommendation.matchBadge}</Badge>
                  <span className="font-mono text-xs tabular-nums text-muted-foreground">
                    3 / 3 etapas
                  </span>
                </div>

                {/* Live SVG Cup Chamber */}
                <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-muted/35 p-6">
                  <AlchemyLiveCup
                    base={base}
                    texture={texture}
                    topping={topping}
                    className="h-[225px] w-[185px] text-foreground"
                  />

                  <ul
                    aria-label="Camadas da sua combinação"
                    className="flex flex-wrap justify-center gap-1.5"
                  >
                    {recommendation.layerBreakdown.map((layerLabel) => (
                      <li
                        key={layerLabel}
                        className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-foreground"
                      >
                        {layerLabel}
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                {/* Recommended Menu Drink */}
                <div className="space-y-2.5" aria-live="polite">
                  <div className="flex items-baseline justify-between gap-3">
                    <div>
                      <span className="block text-xs text-muted-foreground">
                        Bebida ideal do cardápio
                      </span>
                      <h3 className="mt-0.5 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                        {recommendation.recommendedDrink.name}
                      </h3>
                    </div>
                    <span className="shrink-0 font-mono text-xl font-bold tabular-nums text-foreground">
                      {formatCurrencyBRL(recommendation.recommendedDrink.price)}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {recommendation.matchReason}
                  </p>
                </div>

                {/* Quick Sensory Estimate */}
                <dl className="grid grid-cols-3 border-t border-border pt-4 text-center">
                  <div className="pr-2">
                    <dt className="text-[11px] text-muted-foreground">
                      Cremosidade
                    </dt>
                    <dd className="mt-0.5 font-mono text-sm font-semibold tabular-nums text-foreground">
                      {recommendation.sensoryEstimate.cremosidade}%
                    </dd>
                  </div>
                  <div className="border-x border-border px-2">
                    <dt className="text-[11px] text-muted-foreground">Doçura</dt>
                    <dd className="mt-0.5 font-mono text-sm font-semibold tabular-nums text-foreground">
                      {recommendation.sensoryEstimate.docura}%
                    </dd>
                  </div>
                  <div className="pl-2">
                    <dt className="text-[11px] text-muted-foreground">
                      Intensidade
                    </dt>
                    <dd className="mt-0.5 font-mono text-sm font-semibold tabular-nums text-foreground">
                      {recommendation.sensoryEstimate.intensidade}%
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
