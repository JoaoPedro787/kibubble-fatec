# Design

## Context

Ki Bubble is a greenfield Next.js (App Router, TypeScript) web application based on [sistema_v1.md](file:///home/joaolinux/Projects/kibubble/docs/sistema_v1.md) and governed by the architecture rules in [AGENTS.md](file:///home/joaolinux/Projects/kibubble/AGENTS.md). All persistence in v1 lives in the browser (`localStorage`), with no backend or database, while maintaining clean service boundaries for future database integration.

## Goals / Non-Goals

**Goals:**
- Deliver all 4 business use cases (`UC01`–`UC04`) plus mocked auth and theme controls across 5 routes (`/login`, `/vendas`, `/pedidos`, `/estoque`, `/relatorios`).
- Enforce the `feature-based` + `shared` directory layout (`src/<feature>/`, `src/shared/`, thin `src/app/`).
- Share UI primitives via `shadcn/ui` in `src/shared/components/ui/` styled strictly in monochrome Light and Dark modes.
- Keep state cohesive across features: selling a product updates ingredient stock, creates a kitchen order, and immediately updates manager reports.

**Non-Goals:**
- Real authentication, server-side sessions, payment gateway APIs, or database connections.
- Multi-store or multi-tenant inventory.
- A "restore demo data" reset button (excluded by user requirement).

## Decisions

### 1. Feature-Based + Shared Architecture
Organize `src/` strictly by business domain and shared infrastructure:
- `src/app/`: Thin App Router pages (`/`, `/login`, `/vendas`, `/pedidos`, `/estoque`, `/relatorios`) and root layout/providers.
- `src/auth/`: Login form, role-guard hook/wrapper, session service, auth types.
- `src/vendas/`: Product catalog grid, cart & payment panel, sales service (recipe validation + atomic checkout), unit tests.
- `src/pedidos/`: Order queue board/list, status transition controls (`Em preparo` → `Pronto` → `Entregue`), order service.
- `src/estoque/`: Ingredient table, inline/modal quantity editor, low-stock alert summary, inventory service.
- `src/relatorios/`: Revenue summary cards/charts (daily/weekly/monthly), average ticket KPI, top-selling ranking, sales history table, analytics calculation utils/service.
- `src/shared/`:
  - `components/ui/`: `shadcn/ui` components (Button, Card, Input, Select, Badge, Dialog, Popover, Table, Tabs, etc.).
  - `components/`: `AppHeader` (with profile switcher `Select` + `GearSettings`), `AppNav`.
  - `layouts/`: `AuthenticatedShell`.
  - `libs/`: `cn.ts`, `storage.ts` (typed `localStorage` store + initial seed), `formatters.ts` (BRL currency & dates).
  - `types/`: Domain entities shared across features (`UserRole`, `Ingredient`, `Product`, `Order`, `Sale`).
  - `contexts/`: `AppStoreProvider` / `ThemeProvider` hydrating safely on client mount.

*Alternative considered:* Putting everything in `src/components` and `src/lib` by technical layer. Rejected because `AGENTS.md` mandates `feature-based` + `shared` separation and domain boundaries ease future migration to server actions / DB repositories.

### 2. Unified `localStorage` Store Behind Decoupled Services
All domain services (`authService`, `salesService`, `ordersService`, `inventoryService`, `reportsService`) read and write through a single typed store wrapper (`src/shared/libs/storage.ts`) keyed under `kibubble:v1:store`.
- On first browser load (when `localStorage` has no key), the store initializes with realistic Ki Bubble seed data (bubble tea & snack products with recipes, ingredients with minimum thresholds, sample past sales for reports, and sample active orders).
- A React Context/store subscribes to mutations and re-renders active views immediately without page reloads, avoiding hydration mismatches by reading `localStorage` inside `useEffect` after mount.
- Swapping to PostgreSQL later requires only replacing service implementations with `fetch`/Server Actions while keeping UI components and domain types unchanged.

### 3. Atomic Checkout & Recipe Deduction (`UC01` → `UC03`, `UC02`, `UC04`)
Each `Product` defines a `recipe: Array<{ ingredientId: string; quantity: number }>`.
- **Availability check (`8A`):** Given current `ingredients` stock minus ingredients already committed by items in the active cart, the catalog computes remaining makeable units per product in real time.
- **Payment simulation (`5A`):** The checkout panel lets the operator select a payment method and includes an explicit "Simular falha de pagamento" toggle (or retry scenario) to exercise the `5A` alternative flow deterministically.
- **Commit:** Only on authorized payment does the service atomically deduct ingredients, append an `Order` (`status: 'Em preparo'`), and append a `Sale` record.

### 4. Strict Monochrome Light/Dark Design System & Header Controls
- Define CSS variables in `src/app/globals.css` using pure grayscale/black/white tokens for `:root` (Light) and `.dark` (Dark). Low-stock alerts and order statuses use monochrome visual cues (contrast inversion, crisp borders, typography weight, icons, and grayscale badges) rather than red/green/amber colors.
- **Header (`src/shared/components/app-header.tsx`):**
  - Left/Center: Brand mark + role-filtered navigation links.
  - Right: `Select` component to switch active profile (`Colaborador` ↔ `Gestor`) immediately next to the `Gear Settings` icon button.
  - `Gear Settings` opens a `Popover` containing the `Light / Dark` theme switch and the `Deslogar` action.
  - Switching from `Gestor` to `Colaborador` while viewing `/estoque` or `/relatorios` immediately redirects to `/vendas`.
- **Mandatory Skills Before Coding:** Before implementing any web UI/components/layouts, read and follow `/frontend-design`, `/ui-ux-pro-max`, and `/vercel-react-best-practices`.

## Risks / Trade-offs

- **Hydration flash with `localStorage` + theme:** Reading session and theme only in `useEffect` can cause a brief unstyled or redirect flash. → *Mitigation:* Render a minimal monochrome loading skeleton until store hydration completes, and apply the theme class via a tiny inline script or `next-themes` / early effect.
- **Monochrome status scannability:** Without color coding (red/yellow/green), urgent states like low stock or `Pronto` orders can blend in. → *Mitigation:* Differentiate states through high-contrast inverted badges (solid black/white fills), border styles (solid vs. dashed), uppercase tracking, and clear Lucide icons.
- **Corrupted `localStorage` data:** Manual edits or schema drift could break JSON parsing. → *Mitigation:* Wrap `localStorage` reads in schema/shape validation and fall back gracefully to the initial seed if parsing fails.
