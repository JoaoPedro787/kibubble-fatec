"use client";

import { useId } from "react";
import type {
  AlchemyBaseId,
  AlchemyTextureId,
  AlchemyToppingId,
  CatalogVisualConfig,
  SpotlightIllustrationVariant,
} from "@/landing/types/landing";

interface SpotlightDrinkIllustrationProps {
  variant: SpotlightIllustrationVariant;
  visual?: CatalogVisualConfig;
  className?: string;
}

export function SpotlightDrinkIllustration({
  variant,
  visual,
  className = "w-full max-w-[250px]",
}: SpotlightDrinkIllustrationProps) {
  const uid = useId().replace(/:/g, "");

  if (variant === "mochi-duo") {
    return (
      <svg
        viewBox="0 0 280 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={`${uid}-plate`} cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
          </radialGradient>
          <radialGradient id={`${uid}-mochi`} cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.12" />
            <stop offset="65%" stopColor="currentColor" stopOpacity="0.28" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.55" />
          </radialGradient>
        </defs>

        {/* Ceramic minimalist plate */}
        <ellipse
          cx="140"
          cy="208"
          rx="108"
          ry="34"
          fill={`url(#${uid}-plate)`}
          stroke="currentColor"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
        <ellipse
          cx="140"
          cy="204"
          rx="84"
          ry="22"
          stroke="currentColor"
          strokeOpacity="0.18"
          strokeWidth="1"
        />

        {/* Back mochi */}
        <path
          d="M116 184C116 144 148 122 180 122C212 122 238 144 238 184C238 200 220 208 178 208C136 208 116 200 116 184Z"
          fill={`url(#${uid}-mochi)`}
          stroke="currentColor"
          strokeWidth="1.75"
        />
        {/* Dusting speckles */}
        <circle
          cx="164"
          cy="140"
          r="1.5"
          fill="currentColor"
          fillOpacity="0.45"
        />
        <circle
          cx="186"
          cy="136"
          r="2"
          fill="currentColor"
          fillOpacity="0.35"
        />
        <circle
          cx="198"
          cy="146"
          r="1.2"
          fill="currentColor"
          fillOpacity="0.4"
        />

        {/* Front cut mochi showing taro core */}
        <path
          d="M44 196C44 156 72 136 104 136C136 136 160 156 160 196C160 212 142 218 102 218C62 218 44 212 44 196Z"
          fill="var(--background)"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <path
          d="M44 196C44 156 72 136 104 136C136 136 160 156 160 196C160 212 142 218 102 218C62 218 44 212 44 196Z"
          fill={`url(#${uid}-mochi)`}
        />
        {/* Cross-section taro heart */}
        <ellipse
          cx="118"
          cy="184"
          rx="22"
          ry="18"
          fill="currentColor"
          fillOpacity="0.78"
        />
        <ellipse
          cx="114"
          cy="179"
          rx="9"
          ry="6"
          fill="var(--background)"
          fillOpacity="0.24"
        />
        {/* Soft flour dust highlight */}
        <path
          d="M72 152C82 145 96 143 110 145"
          stroke="currentColor"
          strokeOpacity="0.35"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  const hasFoam =
    visual?.hasCheeseFoam ??
    (variant === "matcha-foam" || variant === "dirty-cheese");
  const hasSwirl =
    visual?.hasBrownSugarSwirl ??
    (variant === "brown-sugar-swirl" || variant === "dirty-cheese");
  const pearlStyle =
    visual?.pearlStyle ??
    (variant === "dirty-cheese"
      ? "none"
      : variant === "mango-popping"
        ? "popping"
        : "tapioca");
  const isPopping = pearlStyle === "popping";
  const isDense = variant === "taro-velvet" || variant === "dirty-cheese";
  const iceCubeCount =
    visual?.iceCubeCount ?? (variant === "mango-popping" ? 3 : 2);
  const liquidOpacity =
    visual?.liquidOpacity ??
    (variant === "mango-popping"
      ? 0.14
      : variant === "taro-velvet"
        ? 0.28
        : variant === "matcha-foam"
          ? 0.24
          : 0.34);

  const pearls =
    pearlStyle === "none"
      ? []
      : [
          { cx: 102, cy: 294, r: 9 },
          { cx: 122, cy: 298, r: 9.5 },
          { cx: 142, cy: 293, r: 9 },
          { cx: 162, cy: 297, r: 9 },
          { cx: 180, cy: 292, r: 8.5 },
          { cx: 112, cy: 278, r: 8.5 },
          { cx: 134, cy: 279, r: 9 },
          { cx: 155, cy: 280, r: 8.5 },
          { cx: 172, cy: 276, r: 8 },
        ];

  return (
    <svg
      viewBox="0 0 280 350"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <clipPath id={`${uid}-cup-clip`}>
          <path d="M76 112L94 304C95 313 103 320 112 320H168C177 320 185 313 186 304L204 112H76Z" />
        </clipPath>
        <linearGradient id={`${uid}-liquid`} x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor="currentColor"
            stopOpacity={liquidOpacity * 0.55}
          />
          <stop
            offset="55%"
            stopColor="currentColor"
            stopOpacity={liquidOpacity}
          />
          <stop
            offset="100%"
            stopColor="currentColor"
            stopOpacity={liquidOpacity * 1.45}
          />
        </linearGradient>
      </defs>

      {/* Back rim arc of dome lid (behind straw) */}
      <path
        d="M72 110A68 9 0 0 1 208 110"
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeWidth="1.4"
      />

      {/* Diagonal wide straw */}
      <path
        d="M158 22L173 25L140 284L126 282L158 22Z"
        fill="currentColor"
        fillOpacity="0.88"
      />
      <path
        d="M161 23L165 24L134 282"
        stroke="var(--background)"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />

      {/* Liquid body inside cup clip */}
      <g clipPath={`url(#${uid}-cup-clip)`}>
        <rect
          x="74"
          y={hasFoam ? 158 : 134}
          width="132"
          height="194"
          fill={`url(#${uid}-liquid)`}
        />

        {/* Dense velvet gradient bands for taro/matcha */}
        {isDense ? (
          <path
            d="M76 226C106 212 138 240 168 224C184 216 196 220 204 226V324H76V226Z"
            fill="currentColor"
            fillOpacity="0.16"
          />
        ) : null}

        {/* Brown sugar swirl */}
        {hasSwirl ? (
          <g stroke="currentColor" strokeLinecap="round" fill="none">
            <path
              d="M84 182C106 196 98 226 124 238C146 248 134 276 158 286"
              strokeOpacity="0.65"
              strokeWidth="4.5"
            />
            <path
              d="M192 174C166 192 178 224 152 240C132 252 142 280 118 294"
              strokeOpacity="0.5"
              strokeWidth="3.5"
            />
            <path
              d="M96 254C116 266 108 290 134 306"
              strokeOpacity="0.55"
              strokeWidth="3"
            />
          </g>
        ) : null}

        {/* Ice cubes */}
        {iceCubeCount > 0 ? (
          <g stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.25">
            <rect
              x="96"
              y="168"
              width="28"
              height="28"
              rx="5"
              transform="rotate(-12 110 182)"
              fill="var(--background)"
              fillOpacity="0.42"
            />
            {iceCubeCount >= 2 ? (
              <rect
                x="146"
                y="162"
                width="26"
                height="26"
                rx="5"
                transform="rotate(14 159 175)"
                fill="var(--background)"
                fillOpacity="0.38"
              />
            ) : null}
            {iceCubeCount >= 3 ? (
              <rect
                x="120"
                y="196"
                width="24"
                height="24"
                rx="4"
                transform="rotate(-6 132 208)"
                fill="var(--background)"
                fillOpacity="0.45"
              />
            ) : null}
          </g>
        ) : null}

        {/* Cheese foam cloud layer */}
        {hasFoam ? (
          <path
            d="M76 126H204V162C190 172 174 156 158 166C142 176 126 158 108 166C92 174 82 162 76 164V126Z"
            fill="var(--background)"
            fillOpacity="0.88"
            stroke="currentColor"
            strokeOpacity="0.65"
            strokeWidth="1.4"
          />
        ) : null}

        {/* Pearls */}
        {pearls.map((p, idx) =>
          isPopping ? (
            <g key={idx}>
              <circle
                cx={p.cx}
                cy={p.cy}
                r={p.r}
                fill="currentColor"
                fillOpacity="0.18"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle
                cx={p.cx - 2.5}
                cy={p.cy - 2.5}
                r="2.2"
                fill="currentColor"
                fillOpacity="0.65"
              />
            </g>
          ) : (
            <g key={idx}>
              <circle
                cx={p.cx}
                cy={p.cy}
                r={p.r}
                fill="currentColor"
                fillOpacity="0.92"
              />
              <circle
                cx={p.cx - 2.8}
                cy={p.cy - 2.8}
                r="2"
                fill="var(--background)"
                fillOpacity="0.6"
              />
            </g>
          ),
        )}
      </g>

      {/* Translucent Dome Lid & Front Rim (no opaque band cutting straw) */}
      <path
        d="M74 110C74 72 104 46 140 46C176 46 206 72 206 110"
        fill="currentColor"
        fillOpacity="0.05"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M72 110A68 9 0 0 0 208 110"
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

      {/* Cup silhouette & glass highlights */}
      <path
        d="M76 112L94 304C95 313 103 320 112 320H168C177 320 185 313 186 304L204 112"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M90 132L104 298"
        stroke="currentColor"
        strokeOpacity="0.22"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface AlchemyLiveCupProps {
  base: AlchemyBaseId;
  texture: AlchemyTextureId;
  topping: AlchemyToppingId;
  className?: string;
}

export function AlchemyLiveCup({
  base,
  texture,
  topping,
  className = "w-full max-w-[240px]",
}: AlchemyLiveCupProps) {
  const uid = useId().replace(/:/g, "");

  const baseOpacity =
    base === "assam"
      ? 0.42
      : base === "matcha"
        ? 0.28
        : base === "taro"
          ? 0.22
          : 0.14;

  const pearlPositions = [
    { cx: 100, cy: 294, r: 9 },
    { cx: 120, cy: 298, r: 9.5 },
    { cx: 140, cy: 293, r: 9 },
    { cx: 160, cy: 297, r: 9.5 },
    { cx: 178, cy: 293, r: 8.5 },
    { cx: 110, cy: 277, r: 8.5 },
    { cx: 132, cy: 279, r: 9 },
    { cx: 152, cy: 278, r: 8.5 },
    { cx: 170, cy: 276, r: 8 },
  ];

  return (
    <svg
      viewBox="0 0 280 350"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <clipPath id={`${uid}-alchemy-cup`}>
          <path d="M76 112L94 304C95 313 103 320 112 320H168C177 320 185 313 186 304L204 112H76Z" />
        </clipPath>
        <linearGradient id={`${uid}-alchemy-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor="currentColor"
            stopOpacity={baseOpacity * 0.65}
          />
          <stop
            offset="100%"
            stopColor="currentColor"
            stopOpacity={baseOpacity * 1.4}
          />
        </linearGradient>
      </defs>

      {/* Back rim arc of dome lid (behind straw) */}
      <path
        d="M72 110A68 9 0 0 1 208 110"
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeWidth="1.4"
      />

      {/* Diagonal straw */}
      <path
        d="M158 22L173 25L140 284L126 282L158 22Z"
        fill="currentColor"
        fillOpacity="0.88"
      />
      <path
        d="M161 23L165 24L134 282"
        stroke="var(--background)"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />

      <g clipPath={`url(#${uid}-alchemy-cup)`}>
        {/* Liquid base */}
        <rect
          x="74"
          y={topping === "cheese-foam" ? 158 : 132}
          width="132"
          height="196"
          fill={`url(#${uid}-alchemy-fill)`}
          className="transition-all duration-300"
        />

        {/* Base-specific visual signature */}
        {base === "matcha" ? (
          <path
            d="M76 206Q140 190 204 206V324H76V206Z"
            fill="currentColor"
            fillOpacity="0.14"
          />
        ) : null}
        {base === "taro" ? (
          <path
            d="M76 218C112 204 168 232 204 214V324H76V218Z"
            fill="currentColor"
            fillOpacity="0.18"
          />
        ) : null}
        {base === "frutado" ? (
          <g stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.2">
            <rect
              x="100"
              y="160"
              width="25"
              height="25"
              rx="4"
              transform="rotate(-14 112 172)"
              fill="var(--background)"
              fillOpacity="0.45"
            />
            <rect
              x="146"
              y="156"
              width="25"
              height="25"
              rx="4"
              transform="rotate(14 158 168)"
              fill="var(--background)"
              fillOpacity="0.45"
            />
            <rect
              x="122"
              y="194"
              width="24"
              height="24"
              rx="4"
              transform="rotate(-6 134 206)"
              fill="var(--background)"
              fillOpacity="0.4"
            />
          </g>
        ) : (
          <g stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.2">
            <rect
              x="98"
              y="168"
              width="24"
              height="24"
              rx="4"
              transform="rotate(-10 110 180)"
              fill="var(--background)"
              fillOpacity="0.35"
            />
            <rect
              x="148"
              y="164"
              width="24"
              height="24"
              rx="4"
              transform="rotate(12 160 176)"
              fill="var(--background)"
              fillOpacity="0.35"
            />
          </g>
        )}

        {/* Topping layer */}
        {topping === "cheese-foam" ? (
          <g data-alchemy-topping="cheese-foam">
            <path
              d="M76 124H204V162C190 172 172 156 156 166C140 176 124 156 108 165C92 174 82 160 76 164V124Z"
              fill="var(--background)"
              fillOpacity="0.9"
              stroke="currentColor"
              strokeOpacity="0.7"
              strokeWidth="1.5"
            />
            <circle
              cx="114"
              cy="144"
              r="2"
              fill="currentColor"
              fillOpacity="0.35"
            />
            <circle
              cx="156"
              cy="148"
              r="1.5"
              fill="currentColor"
              fillOpacity="0.35"
            />
          </g>
        ) : (
          <g
            data-alchemy-topping="mascavo"
            stroke="currentColor"
            strokeLinecap="round"
            fill="none"
          >
            <path
              d="M84 160C110 178 96 214 126 228C152 240 134 274 160 288"
              strokeOpacity="0.72"
              strokeWidth="5"
            />
            <path
              d="M194 156C166 176 178 212 150 232C128 248 140 278 116 294"
              strokeOpacity="0.58"
              strokeWidth="4"
            />
          </g>
        )}

        {/* Texture pearls */}
        <g data-alchemy-texture={texture}>
          {pearlPositions.map((p, idx) =>
            texture === "popping" ? (
              <g key={idx}>
                <circle
                  cx={p.cx}
                  cy={p.cy}
                  r={p.r}
                  fill="var(--background)"
                  fillOpacity="0.45"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <circle
                  cx={p.cx - 2.5}
                  cy={p.cy - 2.5}
                  r="2.4"
                  fill="currentColor"
                  fillOpacity="0.7"
                />
              </g>
            ) : (
              <g key={idx}>
                <circle
                  cx={p.cx}
                  cy={p.cy}
                  r={p.r}
                  fill="currentColor"
                  fillOpacity="0.92"
                />
                <circle
                  cx={p.cx - 2.5}
                  cy={p.cy - 2.5}
                  r="2"
                  fill="var(--background)"
                  fillOpacity="0.62"
                />
              </g>
            ),
          )}
        </g>
      </g>

      {/* Translucent Dome Lid & Front Rim */}
      <path
        d="M74 110C74 72 104 46 140 46C176 46 206 72 206 110"
        fill="currentColor"
        fillOpacity="0.06"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M72 110A68 9 0 0 0 208 110"
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

      {/* Cup frame */}
      <path
        d="M76 112L94 304C95 313 103 320 112 320H168C177 320 185 313 186 304L204 112"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M90 132L104 298"
        stroke="currentColor"
        strokeOpacity="0.24"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
