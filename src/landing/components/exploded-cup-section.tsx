"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  EXPLODED_CUP_LAYERS,
  EXPLODED_CUP_STAGES,
} from "@/landing/services/landing-catalog-service";
import {
  usePrefersReducedMotion,
  useSectionScrollProgress,
} from "@/landing/hooks/use-scroll-progress";
import type { ExplodedCupLayerId } from "@/landing/types/landing";
import { cn } from "@/shared/libs/cn";

const LAYER_Z_INDEX: Record<ExplodedCupLayerId, number> = {
  "tea-ice": 10,
  straw: 20,
  "brown-sugar": 25,
  tapioca: 30,
  "cheese-foam": 35,
  lid: 40,
  cup: 50,
};

function resolveStageForProgress(progress: number) {
  if (progress >= 0.88) return EXPLODED_CUP_STAGES[3];
  if (progress >= 0.54) return EXPLODED_CUP_STAGES[2];
  if (progress >= 0.2) return EXPLODED_CUP_STAGES[1];
  return EXPLODED_CUP_STAGES[0];
}

function ExplodedLayerSvg({
  layerId,
  uid,
}: {
  layerId: ExplodedCupLayerId;
  uid: string;
}) {
  switch (layerId) {
    case "straw":
      return (
        <svg
          viewBox="0 0 280 350"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          aria-hidden="true"
        >
          <path
            d="M158 18L174 21L139 286L124 284L158 18Z"
            fill="currentColor"
            fillOpacity="0.92"
          />
          <path
            d="M161 19L165 20L133 284"
            stroke="var(--background)"
            strokeOpacity="0.4"
            strokeWidth="1.5"
          />
        </svg>
      );

    case "lid":
      return (
        <svg
          viewBox="0 0 280 350"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          aria-hidden="true"
        >
          <path
            d="M74 110C74 72 104 46 140 46C176 46 206 72 206 110"
            fill="currentColor"
            fillOpacity="0.06"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <ellipse
            cx="140"
            cy="110"
            rx="68"
            ry="9"
            fill="var(--background)"
            fillOpacity="0.18"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <ellipse
            cx="161"
            cy="49"
            rx="9"
            ry="3"
            stroke="currentColor"
            strokeOpacity="0.55"
            strokeWidth="1.2"
          />
        </svg>
      );

    case "cheese-foam":
      return (
        <svg
          viewBox="0 0 280 350"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          aria-hidden="true"
        >
          <path
            d="M78 122H202L198 164C185 174 170 158 154 168C138 178 122 158 106 167C92 174 84 162 80 164L78 122Z"
            fill="var(--background)"
            fillOpacity="0.92"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <circle
            cx="114"
            cy="144"
            r="2"
            fill="currentColor"
            fillOpacity="0.4"
          />
          <circle
            cx="152"
            cy="148"
            r="1.5"
            fill="currentColor"
            fillOpacity="0.4"
          />
          <circle
            cx="174"
            cy="140"
            r="1.8"
            fill="currentColor"
            fillOpacity="0.3"
          />
        </svg>
      );

    case "tea-ice":
      return (
        <svg
          viewBox="0 0 280 350"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={`${uid}-tea-fill`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.44" />
            </linearGradient>
          </defs>
          <path
            d="M80 156H200L187 300C186 309 178 316 168 316H112C102 316 94 309 93 300L80 156Z"
            fill={`url(#${uid}-tea-fill)`}
          />
          {/* Isometric ice cubes */}
          <g stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.3">
            <rect
              x="98"
              y="174"
              width="27"
              height="27"
              rx="5"
              transform="rotate(-12 112 188)"
              fill="var(--background)"
              fillOpacity="0.46"
            />
            <rect
              x="148"
              y="168"
              width="26"
              height="26"
              rx="5"
              transform="rotate(14 161 181)"
              fill="var(--background)"
              fillOpacity="0.42"
            />
            <rect
              x="122"
              y="208"
              width="25"
              height="25"
              rx="4"
              transform="rotate(-4 134 220)"
              fill="var(--background)"
              fillOpacity="0.38"
            />
          </g>
        </svg>
      );

    case "brown-sugar":
      return (
        <svg
          viewBox="0 0 280 350"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          aria-hidden="true"
        >
          <g stroke="currentColor" strokeLinecap="round" fill="none">
            <path
              d="M86 180C110 196 100 226 126 238C150 250 138 278 162 288"
              strokeOpacity="0.78"
              strokeWidth="4.5"
            />
            <path
              d="M192 174C166 192 178 224 152 240C132 252 142 282 118 294"
              strokeOpacity="0.62"
              strokeWidth="3.5"
            />
            <path
              d="M96 254C118 266 110 290 136 306"
              strokeOpacity="0.55"
              strokeWidth="3"
            />
          </g>
        </svg>
      );

    case "tapioca":
      return (
        <svg
          viewBox="0 0 280 350"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          aria-hidden="true"
        >
          {[
            { cx: 102, cy: 294, r: 9 },
            { cx: 122, cy: 298, r: 9.5 },
            { cx: 142, cy: 293, r: 9 },
            { cx: 162, cy: 297, r: 9 },
            { cx: 178, cy: 292, r: 8.5 },
            { cx: 112, cy: 277, r: 8.5 },
            { cx: 134, cy: 279, r: 9 },
            { cx: 155, cy: 280, r: 8.5 },
            { cx: 171, cy: 275, r: 8 },
          ].map((p, idx) => (
            <g key={idx}>
              <circle
                cx={p.cx}
                cy={p.cy}
                r={p.r}
                fill="currentColor"
                fillOpacity="0.94"
              />
              <circle
                cx={p.cx - 2.6}
                cy={p.cy - 2.6}
                r="2"
                fill="var(--background)"
                fillOpacity="0.62"
              />
            </g>
          ))}
        </svg>
      );

    case "cup":
      return (
        <svg
          viewBox="0 0 280 350"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          aria-hidden="true"
        >
          <path
            d="M76 112L94 304C95 313 103 320 112 320H168C177 320 185 313 186 304L204 112"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <ellipse
            cx="140"
            cy="112"
            rx="64"
            ry="7"
            stroke="currentColor"
            strokeOpacity="0.4"
            strokeWidth="1.25"
          />
          <path
            d="M90 134L104 298"
            stroke="currentColor"
            strokeOpacity="0.28"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

export function ExplodedCupSection() {
  const uid = useId().replace(/:/g, "");
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const scrollProgress = useSectionScrollProgress(
    sectionRef,
    prefersReducedMotion,
  );

  const [manualOverride, setManualOverride] = useState<number | null>(null);
  const overrideScrollYRef = useRef<number>(0);

  useEffect(() => {
    if (prefersReducedMotion || typeof window === "undefined") return;

    const onScroll = () => {
      setManualOverride((prev) => {
        if (prev === null) return null;
        const currentY = window.scrollY || window.pageYOffset || 0;
        if (Math.abs(currentY - overrideScrollYRef.current) > 24) {
          return null;
        }
        return prev;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [prefersReducedMotion]);

  const effectiveProgress =
    manualOverride !== null ? manualOverride : scrollProgress;
  const activeStage = useMemo(
    () => resolveStageForProgress(effectiveProgress),
    [effectiveProgress],
  );
  const percent = Math.round(effectiveProgress * 100);
  const dispersalFactor = 1 - effectiveProgress;

  const handleSelectStage = useCallback((progress: number) => {
    if (typeof window !== "undefined") {
      overrideScrollYRef.current = window.scrollY || window.pageYOffset || 0;
    }
    setManualOverride(progress);
  }, []);

  return (
    <section
      id="anatomia"
      ref={sectionRef}
      aria-labelledby="anatomia-heading"
      data-progress={effectiveProgress.toFixed(2)}
      data-stage={activeStage.code}
      className={cn(
        "relative scroll-mt-[106px] border-b border-border bg-background sm:scroll-mt-16",
        prefersReducedMotion
          ? "py-14 sm:py-20"
          : "min-h-[190vh] lg:min-h-[225vh]",
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-6xl items-center px-4 sm:px-6 lg:px-8",
          prefersReducedMotion
            ? "py-4"
            : "py-6 lg:sticky lg:top-16 lg:min-h-[calc(100svh-4rem)] lg:py-4",
        )}
      >
        <div className="grid w-full items-start gap-6 lg:grid-cols-12 lg:items-center lg:gap-10">
          {/* Left Narrative & Accessible Stage Switcher */}
          <div className="order-2 space-y-4 lg:order-1 lg:col-span-6">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2
                id="anatomia-heading"
                className="text-2xl font-bold tracking-[-0.03em] text-foreground sm:text-4xl"
              >
                Anatomia do copo
              </h2>
              <span
                aria-label={`Progresso de montagem: ${percent} por cento`}
                className="font-mono text-sm font-medium tabular-nums text-foreground"
              >
                {percent}%
              </span>
            </div>

            {/* Clickable 01..04 Stage Indicators */}
            <div
              role="group"
              aria-label="Estágios da vista explodida"
              className="grid grid-cols-2 gap-2 sm:grid-cols-4"
            >
              {EXPLODED_CUP_STAGES.map((stage) => {
                const isActive = activeStage.id === stage.id;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => handleSelectStage(stage.progress)}
                    className={cn(
                      "flex flex-col items-start rounded-lg border px-3 py-2 text-left transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:bg-muted",
                    )}
                  >
                    <span className="font-mono text-xs tabular-nums opacity-75">
                      {stage.code}
                    </span>
                    <span className="mt-0.5 text-xs font-semibold leading-tight">
                      {stage.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-1 rounded-xl border border-border bg-card/80 px-4 py-3">
              <h3 className="text-base font-semibold tracking-tight text-foreground">
                {activeStage.headline}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {activeStage.summary}
              </p>
            </div>

            {/* 7-part Layer Index */}
            <ol
              aria-label="Camadas da bebida"
              className="grid gap-1.5 sm:grid-cols-2"
            >
              {EXPLODED_CUP_LAYERS.map((layer) => {
                const isHighlighted = activeStage.highlightedLayers.includes(
                  layer.id,
                );
                return (
                  <li
                    key={layer.id}
                    data-layer-callout={layer.id}
                    data-active={isHighlighted ? "true" : "false"}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 transition-colors",
                      isHighlighted
                        ? "border-foreground/50 bg-muted text-foreground"
                        : "border-border/70 bg-background text-muted-foreground",
                    )}
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-xs tabular-nums">
                        {layer.order}
                      </span>
                      <span className="text-xs font-semibold text-foreground sm:text-sm">
                        {layer.title}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground sm:text-xs">
                      {layer.subtitle}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Right Sticky Apple-Style Exploded Cup Stage (Opaque full-bleed dock on < lg so text never ghost-collides underneath) */}
          <div
            className={cn(
              "order-1 flex items-center justify-center lg:order-2 lg:col-span-6",
              !prefersReducedMotion &&
                "sticky top-[105px] z-20 -mx-4 border-b border-border bg-background px-4 py-3 sm:top-[65px] sm:-mx-6 sm:px-6 lg:static lg:z-auto lg:mx-0 lg:border-b-0 lg:bg-transparent lg:p-0",
            )}
          >
            <div className="relative flex h-[285px] w-full max-w-[400px] items-center justify-center overflow-hidden rounded-[2rem] border border-border bg-card p-4 sm:h-[380px] lg:h-[460px] lg:p-5">
              {/* Subtle vertical calibration ruler */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-7 bottom-9 left-5 hidden flex-col justify-between border-l border-dashed border-border/80 pl-2 font-mono text-[10px] tabular-nums text-muted-foreground sm:flex"
              >
                <span>0 mm</span>
                <span>250 ml</span>
                <span>500 ml</span>
              </div>

              <div className="relative -mt-2 h-[175px] w-[140px] sm:h-[220px] sm:w-[176px] lg:h-[285px] lg:w-[228px]">
                {EXPLODED_CUP_LAYERS.map((layer) => {
                  const y = (layer.yOffsetStart * dispersalFactor).toFixed(1);
                  const scale = (
                    1 -
                    (1 - layer.scaleStart) * dispersalFactor
                  ).toFixed(3);
                  const rotate = (layer.rotateStart * dispersalFactor).toFixed(
                    1,
                  );
                  const isActiveLayer = activeStage.highlightedLayers.includes(
                    layer.id,
                  );
                  const opacity = isActiveLayer
                    ? 1
                    : Number((0.78 + 0.22 * effectiveProgress).toFixed(2));

                  return (
                    <div
                      key={layer.id}
                      data-exploded-layer={layer.id}
                      style={{
                        transform: `translate3d(0px, ${y}%, 0px) scale(${scale}) rotate(${rotate}deg)`,
                        opacity,
                        zIndex: LAYER_Z_INDEX[layer.id],
                      }}
                      className="absolute inset-0 text-foreground transition-[opacity] duration-200 will-change-transform"
                    >
                      <ExplodedLayerSvg layerId={layer.id} uid={uid} />
                    </div>
                  );
                })}
              </div>

              <div className="absolute right-5 bottom-3 left-5 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {effectiveProgress >= 0.99
                    ? "Copo montado"
                    : "Role para encaixar as camadas"}
                </span>
                <span className="font-mono tabular-nums">
                  {activeStage.code} / 04
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
