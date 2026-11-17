"use client";

import { useEffect, useRef } from "react";
import {
  usePrefersReducedMotion,
  useScrollVelocityRef,
} from "@/landing/hooks/use-scroll-progress";

const PRIMARY_TOKENS = [
  "Chá Preto Assam",
  "Pérolas de Tapioca Preta",
  "Cheese Foam Salgado",
  "Calda de Mascavo",
  "Matcha Japonês",
  "Taro Cremoso",
  "Popping Boba de Morango",
  "Mochi Artesanal",
] as const;

const SECONDARY_TOKENS = [
  "Infusão Concentrada",
  "Textura Elástica",
  "Salinidade Sutil",
  "Contraste Térmico",
  "Camadas Visíveis",
  "Corte Chanfrado 12mm",
  "Fogo Baixo",
  "Alquimia Monocromática",
] as const;

function MarqueePhraseGroup({
  tokens,
  outlined = false,
  wrap = false,
}: {
  tokens: readonly string[];
  outlined?: boolean;
  wrap?: boolean;
}) {
  return (
    <div
      className={
        wrap
          ? "flex w-full flex-wrap items-center justify-center gap-x-5 gap-y-2.5 px-4"
          : "flex shrink-0 items-center gap-6 pr-6"
      }
    >
      {tokens.map((token) => (
        <span
          key={token}
          className={
            wrap
              ? "inline-flex items-center gap-4"
              : "inline-flex items-center gap-6"
          }
        >
          <span
            className={
              outlined
                ? "whitespace-nowrap text-lg font-bold tracking-tight text-foreground sm:text-2xl"
                : "whitespace-nowrap text-lg font-semibold tracking-tight text-foreground sm:text-2xl"
            }
            style={
              outlined
                ? {
                    WebkitTextFillColor: "transparent",
                    WebkitTextStroke: "1px currentColor",
                  }
                : undefined
            }
          >
            {token}
          </span>
          <span
            aria-hidden="true"
            className="size-2 shrink-0 rounded-full bg-foreground/70"
          />
        </span>
      ))}
    </div>
  );
}

export function KineticMarquee() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const velocityRef = useScrollVelocityRef(prefersReducedMotion);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const topTrackRef = useRef<HTMLDivElement | null>(null);
  const bottomTrackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const topEl = topTrackRef.current;
    const bottomEl = bottomTrackRef.current;
    if (!topEl || !bottomEl) return;

    if (prefersReducedMotion) {
      topEl.style.transform = "translate3d(0px, 0px, 0px)";
      bottomEl.style.transform = "translate3d(0px, 0px, 0px)";
      return;
    }

    let offsetTop = 0;
    let offsetBottom = 0;
    let lastTs = performance.now();
    let rafId: number | null = null;
    let isVisible = true;

    const wrapOffset = (value: number, width: number) => {
      const span = width > 0 ? width : 1200;
      return ((value % span) + span) % span;
    };

    const step = (now: number) => {
      rafId = null;
      if (!isVisible || document.hidden) return;

      const dt = Math.min(48, Math.max(4, now - lastTs));
      lastTs = now;

      const scrollBoost = velocityRef.current ?? 0;
      const frameScale = dt / 16.67;

      offsetTop += (0.55 + scrollBoost * 0.42) * frameScale;
      offsetBottom += (-0.42 - scrollBoost * 0.36) * frameScale;

      const topHalf = topEl.scrollWidth / 2;
      const bottomHalf = bottomEl.scrollWidth / 2;

      const topX = -wrapOffset(offsetTop, topHalf);
      const bottomX = -wrapOffset(offsetBottom, bottomHalf);

      topEl.style.transform = `translate3d(${topX.toFixed(1)}px, 0px, 0px)`;
      bottomEl.style.transform = `translate3d(${bottomX.toFixed(1)}px, 0px, 0px)`;

      rafId = requestAnimationFrame(step);
    };

    const startLoop = () => {
      if (rafId !== null || !isVisible || document.hidden) return;
      lastTs = performance.now();
      rafId = requestAnimationFrame(step);
    };

    const stopLoop = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined" && containerRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          isVisible = entries[0]?.isIntersecting ?? true;
          if (isVisible) {
            startLoop();
          } else {
            stopLoop();
          }
        },
        { threshold: 0.01 },
      );
      observer.observe(containerRef.current);
    }

    const onVisibilityChange = () => {
      if (document.hidden) {
        stopLoop();
      } else {
        startLoop();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    startLoop();

    return () => {
      stopLoop();
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [prefersReducedMotion, velocityRef]);

  return (
    <section
      ref={containerRef}
      aria-label="Ingredientes e sensações Ki Bubble"
      data-reduced-motion={prefersReducedMotion ? "true" : "false"}
      className="overflow-hidden border-b border-border bg-muted/40 py-6 sm:py-8"
    >
      <div className="space-y-4">
        <div className="overflow-hidden">
          <div
            ref={topTrackRef}
            data-marquee-track="primary"
            className={
              prefersReducedMotion
                ? "flex w-full items-center justify-center"
                : "flex w-max items-center will-change-transform"
            }
          >
            <MarqueePhraseGroup
              tokens={PRIMARY_TOKENS}
              wrap={prefersReducedMotion}
            />
            {!prefersReducedMotion ? (
              <div aria-hidden="true" className="flex shrink-0">
                <MarqueePhraseGroup tokens={PRIMARY_TOKENS} />
              </div>
            ) : null}
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            ref={bottomTrackRef}
            data-marquee-track="secondary"
            className={
              prefersReducedMotion
                ? "flex w-full items-center justify-center text-foreground/80"
                : "flex w-max items-center text-foreground/85 will-change-transform"
            }
          >
            <MarqueePhraseGroup
              tokens={SECONDARY_TOKENS}
              outlined
              wrap={prefersReducedMotion}
            />
            {!prefersReducedMotion ? (
              <div aria-hidden="true" className="flex shrink-0">
                <MarqueePhraseGroup tokens={SECONDARY_TOKENS} outlined />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
