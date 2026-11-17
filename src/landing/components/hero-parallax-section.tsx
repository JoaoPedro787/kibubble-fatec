"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/shared/components/ui/button";
import { usePrefersReducedMotion } from "@/landing/hooks/use-scroll-progress";
import { SpotlightDrinkIllustration } from "@/landing/components/monochrome-cup-art";

interface SpecularPearl {
  id: string;
  sizeClass: string;
  positionClass: string;
  depthX: number;
  depthY: number;
  scrollMultiplier: number;
  blurred?: boolean;
}

const SPECULAR_PEARLS: readonly SpecularPearl[] = [
  {
    id: "pearl-bg-top-left",
    sizeClass: "size-20 sm:size-28",
    positionClass: "top-16 left-[4%] opacity-20 blur-[12px]",
    depthX: 12,
    depthY: 10,
    scrollMultiplier: 0.08,
    blurred: true,
  },
  {
    id: "pearl-bg-bottom-right",
    sizeClass: "size-28 sm:size-36",
    positionClass: "bottom-10 right-[3%] opacity-20 blur-[14px]",
    depthX: 16,
    depthY: 14,
    scrollMultiplier: 0.1,
    blurred: true,
  },
  {
    id: "pearl-fg-right",
    sizeClass: "size-11 sm:size-14",
    positionClass: "hidden lg:block top-24 right-[8%] lg:right-[10%]",
    depthX: -32,
    depthY: -26,
    scrollMultiplier: -0.2,
  },
  {
    id: "pearl-fg-mid-left",
    sizeClass: "size-9 sm:size-10",
    positionClass: "hidden sm:block bottom-20 left-[44%] lg:left-[48%]",
    depthX: 28,
    depthY: -22,
    scrollMultiplier: -0.16,
  },
  {
    id: "pearl-fg-lower-right",
    sizeClass: "size-10 sm:size-14",
    positionClass: "bottom-6 right-5 sm:bottom-12 sm:right-[12%]",
    depthX: -38,
    depthY: 28,
    scrollMultiplier: -0.24,
  },
] as const;

export function HeroParallaxSection() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const outlineRef = useRef<HTMLDivElement | null>(null);
  const cupRef = useRef<HTMLDivElement | null>(null);
  const pearlRefs = useRef<Record<string, HTMLSpanElement | null>>({});

  useEffect(() => {
    const applyTransforms = (
      scrollY: number,
      px: number,
      py: number,
      disabled: boolean,
    ) => {
      const clampedScroll = Math.min(scrollY, 900);

      if (outlineRef.current) {
        outlineRef.current.style.transform = disabled
          ? "translate3d(0px, 0px, 0px)"
          : `translate3d(${(px * -14).toFixed(1)}px, ${(clampedScroll * 0.16 + py * -10).toFixed(1)}px, 0px)`;
      }

      if (cupRef.current) {
        cupRef.current.style.transform = disabled
          ? "translate3d(0px, 0px, 0px)"
          : `translate3d(${(px * 16).toFixed(1)}px, ${(clampedScroll * -0.07 + py * 14).toFixed(1)}px, 0px)`;
      }

      for (const pearl of SPECULAR_PEARLS) {
        const el = pearlRefs.current[pearl.id];
        if (!el) continue;
        el.style.transform = disabled
          ? "translate3d(0px, 0px, 0px)"
          : `translate3d(${(px * pearl.depthX).toFixed(1)}px, ${(
              clampedScroll * pearl.scrollMultiplier +
              py * pearl.depthY
            ).toFixed(1)}px, 0px)`;
      }
    };

    if (prefersReducedMotion || typeof window === "undefined") {
      applyTransforms(0, 0, 0, true);
      return;
    }

    const targetPointer = { x: 0, y: 0 };
    const currentPointer = { x: 0, y: 0 };
    let rafId: number | null = null;

    const tick = () => {
      rafId = null;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const dx = targetPointer.x - currentPointer.x;
      const dy = targetPointer.y - currentPointer.y;

      const needsLerp = Math.abs(dx) >= 0.002 || Math.abs(dy) >= 0.002;
      if (needsLerp) {
        currentPointer.x += dx * 0.14;
        currentPointer.y += dy * 0.14;
      } else {
        currentPointer.x = targetPointer.x;
        currentPointer.y = targetPointer.y;
      }

      applyTransforms(scrollY, currentPointer.x, currentPointer.y, false);

      if (needsLerp) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const scheduleTick = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      scheduleTick();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      targetPointer.x = Math.max(
        -1,
        Math.min(1, (event.clientX / w - 0.5) * 2),
      );
      targetPointer.y = Math.max(
        -1,
        Math.min(1, (event.clientY / h - 0.5) * 2),
      );
      scheduleTick();
    };

    const onPointerLeave = () => {
      targetPointer.x = 0;
      targetPointer.y = 0;
      scheduleTick();
    };

    applyTransforms(window.scrollY || window.pageYOffset || 0, 0, 0, false);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", onPointerLeave);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [prefersReducedMotion]);

  return (
    <section
      id="inicio"
      aria-label="Apresentação Ki Bubble"
      data-reduced-motion={prefersReducedMotion ? "true" : "false"}
      className="relative isolate flex min-h-[calc(100svh-4rem)] scroll-mt-[106px] items-center overflow-x-clip border-b border-border pt-20 pb-14 sm:scroll-mt-16 sm:pt-24 sm:pb-20"
    >
      {/* Layer 0: Monumental Hollow Typography */}
      <div
        ref={outlineRef}
        aria-hidden="true"
        data-parallax-layer="outline-type"
        style={{ transform: "translate3d(0px, 0px, 0px)" }}
        className="pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 select-none overflow-hidden text-center will-change-transform"
      >
        <p
          className="whitespace-nowrap text-[clamp(3.25rem,17.5vw,16rem)] font-black leading-[0.85] tracking-[-0.05em] text-foreground opacity-[0.08] dark:opacity-[0.12]"
          style={{
            WebkitTextFillColor: "transparent",
            WebkitTextStroke: "1.5px currentColor",
          }}
        >
          KI BUBBLE
        </p>
      </div>

      {/* Depth-of-field & Specular Boba Pearls (behind text layer on mobile, framed cleanly around cup on desktop) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[5] overflow-hidden"
      >
        {SPECULAR_PEARLS.map((pearl) => (
          <span
            key={pearl.id}
            ref={(el) => {
              pearlRefs.current[pearl.id] = el;
            }}
            data-parallax-layer={pearl.id}
            style={{
              transform: "translate3d(0px, 0px, 0px)",
              background:
                "radial-gradient(circle at 30% 28%, rgb(255 255 255 / 0.72) 0%, rgb(135 135 135 / 0.48) 24%, rgb(22 22 22 / 0.94) 68%, rgb(0 0 0 / 1) 100%)",
              boxShadow: pearl.blurred
                ? undefined
                : "0 18px 34px -14px rgb(0 0 0 / 0.45), inset -2px -3px 10px rgb(255 255 255 / 0.22)",
            }}
            className={`absolute rounded-full border border-foreground/25 will-change-transform ${pearl.sizeClass} ${pearl.positionClass}`}
          />
        ))}
      </div>

      {/* Layer 1: Asymmetric Editorial Split */}
      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
        <div className="space-y-8 lg:col-span-7">
          <div className="space-y-5">
            <h1 className="max-w-2xl text-[clamp(2.4rem,6vw,4.75rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-foreground">
              O ritual do bubble tea em camadas precisas.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Chá preto Assam de folhas inteiras, pérolas de tapioca cozidas em
              fogo baixo e cheese foam batido a frio. Uma degustação autoral
              revelada no contraste puro do monocromático.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="h-11 px-6 cursor-pointer">
              <a href="#anatomia">Explorar anatomia</a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-11 px-6 cursor-pointer bg-background/70 backdrop-blur-sm"
            >
              <a href="#catalogo">Ver cardápio</a>
            </Button>
          </div>

          <dl className="grid max-w-lg grid-cols-3 border-t border-border pt-6">
            <div className="pr-3 sm:pr-4">
              <dt className="text-xs text-muted-foreground">Volume padrão</dt>
              <dd className="mt-1 whitespace-nowrap font-mono text-base font-semibold tabular-nums text-foreground sm:text-lg">
                500 ml
              </dd>
            </div>
            <div className="border-l border-border px-3 sm:px-4">
              <dt className="text-xs text-muted-foreground">Canudo largo</dt>
              <dd className="mt-1 whitespace-nowrap font-mono text-base font-semibold tabular-nums text-foreground sm:text-lg">
                12 mm
              </dd>
            </div>
            <div className="border-l border-border pl-3 sm:pl-4">
              <dt className="text-xs text-muted-foreground">Menu curado</dt>
              <dd className="mt-1 whitespace-nowrap font-mono text-base font-semibold tabular-nums text-foreground sm:text-lg">
                6 criações
              </dd>
            </div>
          </dl>
        </div>

        {/* Hero Illustrated Cup Stage */}
        <div className="relative flex items-center justify-center lg:col-span-5">
          <div
            ref={cupRef}
            data-parallax-layer="hero-cup"
            style={{ transform: "translate3d(0px, 0px, 0px)" }}
            className="relative flex w-full max-w-[340px] flex-col items-center justify-center rounded-[2rem] border border-border bg-card/75 p-7 backdrop-blur-md will-change-transform sm:p-8"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-6 rounded-full border border-dashed border-border/80"
            />
            <SpotlightDrinkIllustration
              variant="brown-sugar-swirl"
              className="relative z-10 w-full max-w-[235px] text-foreground drop-shadow-sm"
            />
            <div className="mt-2 flex w-full items-center justify-between border-t border-border pt-4 text-xs">
              <span className="font-medium text-foreground">
                Assam + Mascavo + Boba
              </span>
              <span className="font-mono tabular-nums text-muted-foreground">
                4 °C
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
