# Tasks

## 1. Project Setup & Architecture Scaffolding

- [ ] 1.1 Initialize Next.js (App Router, TypeScript, Tailwind CSS) in the repository root with `src/` directory support and verify `npm run build` succeeds.
- [ ] 1.2 Create the `feature-based` + `shared` directory structure (`src/auth/`, `src/vendas/`, `src/pedidos/`, `src/estoque/`, `src/relatorios/`, `src/shared/`, `src/app/`) and configure `shadcn/ui` with components placed under `src/shared/components/ui/` (verify `components.json` aliases point to `@/shared/components/ui` and base primitives render cleanly).
- [ ] 1.3 Read and apply `/frontend-design`, `/ui-ux-pro-max`, and `/vercel-react-best-practices` skills, then configure strict monochromatic Light/Dark CSS tokens (`:root` and `.dark`) in `src/app/globals.css` and verify theme variables switch cleanly between pure black/white/grayscale values.

## 2. Shared Domain Types, `localStorage` Store & Seed Data

- [ ] 2.1 Define shared domain types in `src/shared/types/` (`UserRole`, `UserSession`, `Ingredient`, `Product`, `RecipeItem`, `Order`, `OrderStatus`, `PaymentMethod`, `Sale`) and verify TypeScript typecheck passes (`npx tsc --noEmit`).
- [ ] 2.2 Implement the typed `localStorage` store wrapper (`kibubble:v1:store`), initial seed data (products with ingredient recipes, ingredients with minimum thresholds, initial orders, and sample sales), and `AppStoreProvider` in `src/shared/` (without a restore-demo button), plus unit tests verifying seed initialization and persistence across reads.

## 3. Authentication, Monochrome Theme & Global Shell (`auth` + `theme-settings`)

- [ ] 3.1 Implement `auth` feature (`src/auth/services/`, `src/auth/components/`, `src/auth/hooks/`) with `/login` profile selection (`Colaborador` / `Gestor`), session persistence, and route guards restricting `/estoque` and `/relatorios` to `Gestor`; verify unit tests cover role redirects and login/logout state.
- [ ] 3.2 Implement `AppHeader` (`src/shared/components/app-header.tsx`) and `AuthenticatedShell` (`src/shared/layouts/`) featuring role-filtered navigation, the quick profile switcher `Select` (`Colaborador` ↔ `Gestor`) next to `Gear Settings`, and the `Gear Settings` popover with Light/Dark theme toggle and `Deslogar` button; verify switching from `Gestor` to `Colaborador` on `/estoque` or `/relatorios` redirects to `/vendas` and theme preference persists on reload.

## 4. Point of Sale (`UC01` — `src/vendas/`)

- [ ] 4.1 Implement `salesService` (`src/vendas/services/`) supporting recipe-based ingredient availability calculation (`8A`), automatic cart totals, simulated payment authorization (`5A` failure mode + success), and atomic commit (deduct stock, create `Em preparo` order, append sale); verify unit tests pass for availability limits, `5A` failed payment rollback, and atomic stock deduction.
- [ ] 4.2 Build `/vendas` UI (`src/vendas/components/`, `src/app/vendas/page.tsx`) using `shadcn/ui` components to display product availability badges, cart controls, payment method selector with failure simulation toggle, and confirmation/error feedback; verify completing a sale updates `localStorage`, creates an order, and decrements ingredient availability in real time.

## 5. Order Tracking (`UC02` — `src/pedidos/`)

- [ ] 5.1 Implement `ordersService` (`src/pedidos/services/`) with status transition validation (`Em preparo` → `Pronto` → `Entregue`, rejecting invalid transitions `5A`) and unit tests verifying valid transitions and `5A` rejection.
- [ ] 5.2 Build `/pedidos` UI (`src/pedidos/components/`, `src/app/pedidos/page.tsx`) displaying orders filterable/grouped by status with monochrome visual differentiation and status-advance actions; verify newly created sales appear as `Em preparo` and transition to `Pronto` and `Entregue` persistently across reloads.

## 6. Ingredient Inventory (`UC03` — `src/estoque/`)

- [ ] 6.1 Implement `inventoryService` (`src/estoque/services/`) supporting ingredient listing, quantity updates with `4A` validation (rejecting empty, non-numeric, or negative numbers), and minimum-threshold low-stock alert calculation; verify unit tests cover `4A` validation errors and threshold alert triggers.
- [ ] 6.2 Build `/estoque` UI (`src/estoque/components/`, `src/app/estoque/page.tsx`) restricted to `Gestor` with ingredient table, inline/dialog quantity editing, validation feedback, and monochrome low-stock alert indicators; verify alerts update automatically both after manual edits and after sales deductions.

## 7. Management Reports (`UC04` — `src/relatorios/`)

- [ ] 7.1 Implement `reportsService` / analytics calculators (`src/relatorios/services/`, `src/relatorios/utils/`) computing daily, weekly, and monthly revenue (`3A`), automatic average ticket (`3B`), top-selling products ranking (`3C`), and chronological sales history (`3D`); verify unit tests cover zero-sales edge cases and multi-sale aggregation accuracy.
- [ ] 7.2 Build `/relatorios` UI (`src/relatorios/components/`, `src/app/relatorios/page.tsx`) restricted to `Gestor` presenting KPI cards, monochrome revenue/ranking views, and full sales history table; verify new sales recorded in `/vendas` immediately reflect across all report sections.

## 8. End-to-End Verification

- [ ] 8.1 Run `npx tsc --noEmit`, unit test suite, and `npm run build`, then verify the complete user flow in the browser across Light/Dark themes and `Colaborador` / `Gestor` role switching (`Login` → `Venda` → `Pedido` → `Estoque` → `Relatórios` → `Logout`).
