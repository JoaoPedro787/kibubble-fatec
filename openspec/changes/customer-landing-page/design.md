# Design

## Context

Currently, `src/app/page.tsx` invokes `getRedirectRoute(store.session, "/")` from `src/auth/services/auth-service.ts` to redirect every visitor on `/` to `/login` or an operational module. See `proposal.md` for why `/` is becoming a dedicated customer-facing landing page.

The project enforces a strict **feature-based architecture** (`src/<feature>/` + `src/shared/` + thin `src/app/` routes) and a **strictly monochromatic design system** (Light and Dark themes in black, white, and grayscale defined in `src/app/globals.css`). No external animation libraries are required or desired when smooth 60fps animations can be achieved with React state, CSS transforms, SVG layers, and `requestAnimationFrame`.

## Goals / Non-Goals

**Goals:**
- Architect a modular `src/landing/` feature with zero coupling to internal employee/POS state or staff login flows.
- Deliver smooth, 60fps scroll-driven and pointer-driven animations (Multi-layer Hero Parallax, Velocity Marquee, Apple-style Exploded Cup Scrollytelling, Interactive Spotlight Catalog, and 3-Step Drink Alchemy) using GPU-accelerated transforms (`translate3d`, `scale`, `opacity`).
- Guarantee full compliance with `prefers-reduced-motion: reduce` and seamless testing in Vitest + React Testing Library (`jsdom`).

**Non-Goals:**
- Online checkout, payment processing, or real-time order submission into the operational POS queue.
- Any employee/staff login links, role switchers, or live kitchen Kanban widgets on the landing page.
- Adding heavy third-party WebGL or external animation bundles to `package.json`.

## Decisions

### 1. Feature Structure (`src/landing/`)
- **Decision**: Organize all landing page code under `src/landing/`:
  - `src/landing/types/landing.ts`: Types for catalog showcase items (sensory scores, floating ingredients, visual layer presets), exploded cup layers, and 3-step alchemy options/recommendations.
  - `src/landing/services/landing-catalog-service.ts`: Curated customer-facing catalog metadata (sensory profiles, ingredient tags, visual theme tokens) and deterministic recommendation engine (`matchDrinkCombination(base, texture, topping)`) mapped to Ki Bubble's signature products.
  - `src/landing/hooks/use-scroll-progress.ts`: Lightweight `requestAnimationFrame` + passive scroll/mouse listener hook with automatic `prefers-reduced-motion` detection and safe `jsdom` fallbacks.
  - `src/landing/components/`:
    - `landing-page-view.tsx`: Top-level composition and sticky glass header with scroll progress bar and theme switch.
    - `hero-parallax-section.tsx`: Multi-plane boba parallax field + monumental outline typography + hero cup SVG.
    - `kinetic-marquee.tsx`: Dual-row velocity-reactive horizontal ticker.
    - `exploded-cup-section.tsx`: Scroll-pinned (`sticky`) Apple-style exploded view where 6 distinct SVG/visual layers (straw, dome lid, cheese foam, Assam tea & ice, brown sugar swirl, tapioca pearls, and cup vessel) converge from exploded vertical coordinates (`translate3d(0, offset * (1 - progress), 0)`) into the assembled cup at `progress = 1`, with stage callouts and manual stage buttons for keyboard/reduced-motion accessibility.
    - `spotlight-catalog-section.tsx`: Formato B (Interactive Spotlight) with category pills, large editorial item selector on the left, and an animated stage on the right displaying the drink's custom monochrome illustration, floating ingredient badges, and sensory bars (*Cremosidade*, *Doçura*, *Intensidade*).
    - `drink-alchemy-section.tsx`: Opção 1 ("Monte sua Combinação") 3-step interactive builder that updates a live layered SVG cup and computes the matching signature beverage.
- **Alternatives considered**: Reading directly from `localStorage` operational store (`KiBubbleStore`). Rejected because the landing page is a customer showcase and should not depend on mutable staff inventory thresholds or expose internal stock counts.

### 2. Apple-Style Exploded Cup Mechanics
- **Decision**: Use a scroll container (`min-h-[240vh]`) wrapping a `sticky top-16` viewport stage. Calculate normalized progress $p \in [0, 1]$ from `getBoundingClientRect()`. Each visual part of the cup has an initial exploded vertical offset (`yStart`, `scaleStart`, `rotateStart`) and interpolates linearly/cubic-eased toward `0` as $p \to 1$. In addition, render clickable step indicators (`01` to `04`) so users with `prefers-reduced-motion` (or in automated tests) can inspect any assembly stage directly.
- **Rationale**: Pure `transform: translate3d(...)` driven by normalized progress avoids layout thrashing, works identically across Light and Dark monochrome themes, and degrades gracefully in `jsdom`.

### 3. Public Root Route (`/`) in `auth-service.ts`
- **Decision**: Update `getRedirectRoute(session, pathname)` in `src/auth/services/auth-service.ts` so that `pathname === "/"` returns `null` for both unauthenticated and authenticated users (keeping `/login` redirecting authenticated users to `ROLE_DEFAULT_ROUTE[session.role]`, and keeping protected routes `/vendas`, `/pedidos`, `/estoque`, `/relatorios` redirecting unauthenticated users to `/login`).
- **Rationale**: Aligns `auth-service.ts` with the updated `auth` spec where `/` is the public customer landing page.

## Risks / Trade-offs

- **[Risk] Scroll and `requestAnimationFrame` APIs in `jsdom` unit tests** → **Mitigation**: Guard `window.matchMedia` and `getBoundingClientRect` in `use-scroll-progress.ts`, and expose interactive stage/item controls so every section (Exploded Cup, Spotlight Catalog, Drink Alchemy) can be deterministically tested via both scroll simulation and user clicks.
- **[Risk] Visual contrast in strict monochrome across overlapping parallax layers** → **Mitigation**: Use semantic CSS variables (`bg-background/80`, `border-border`, radial gradients with specular highlights, and `backdrop-blur`) tested across both `.dark` and `:root` light palettes.
