# Proposal

## Why

Ki Bubble needs an integrated web platform to centralize its storefront sales, kitchen order queue, ingredient inventory, and management analytics in a single operational flow. Building a 100% client-side Next.js application with mocked data persisted in `localStorage` validates the end-to-end business workflows immediately while keeping the service layer decoupled for future database integration.

## What Changes

- Initialize a greenfield Next.js (App Router, TypeScript) web application structured around a `feature-based` + `shared` architecture (`src/<feature>/`, `src/shared/`, and thin routes in `src/app/`).
- Implement `shadcn/ui` shared components under `src/shared/components/ui/` styled with a strict monochromatic palette (black, white, grayscale) supporting Light and Dark themes.
- Add mocked authentication (`/login`), role-based navigation (`Colaborador` and `Gestor`), a global header `Select` for quick profile switching, and a `Gear Settings` popover for Light/Dark theme toggling and logout.
- Implement the 4 core business modules from `docs/sistema_v1.md` backed by `localStorage` state (with product-to-ingredient recipes so sales automatically deduct stock and generate orders/reports, and without a "restore demo data" button):
  - **Vendas (`/vendas` — UC01):** Catalog selection, automatic total calculation, payment method & simulated authorization (including failure handling and ingredient unavailability checks), stock deduction, and order creation.
  - **Pedidos (`/pedidos` — UC02):** Order queue with status progression (`Em preparo` → `Pronto` → `Entregue`).
  - **Estoque (`/estoque` — UC03):** Ingredient stock consultation, validated quantity updates, and low-stock threshold alerts (Gestor only).
  - **Relatórios (`/relatorios` — UC04):** Revenue breakdown (daily, weekly, monthly), automatic average ticket, top-selling products ranking, and full sales history (Gestor only).

## Capabilities

### New Capabilities

- `auth`: Mock authentication (`/login`), `Colaborador` and `Gestor` role-based route/navigation enforcement, header profile-switcher `Select`, and logout action.
- `theme-settings`: Strict monochromatic Light/Dark theme system with `Gear Settings` control in the header and `localStorage` persistence.
- `sales-pos`: Point-of-sale flow (`UC01`) with recipe-based ingredient availability checks, cart totals, payment simulation (success and `5A` unauthorized failure), automatic stock deduction, and order/sale creation.
- `orders-tracking`: Order queue management (`UC02`) supporting `Em preparo`, `Pronto`, and `Entregue` status transitions and validation.
- `inventory-management`: Manager-only ingredient stock management (`UC03`) with quantity updates, validation, and automatic minimum-threshold alerts.
- `analytics-reports`: Manager-only analytics dashboard (`UC04`) providing daily/weekly/monthly revenue, automatic average ticket, product ranking, and sales history.

### Modified Capabilities

<!-- None: greenfield project with no existing specs. -->

## Impact

- **Application Code (`src/`):** New Next.js App Router codebase organized into `src/auth/`, `src/vendas/`, `src/pedidos/`, `src/estoque/`, `src/relatorios/`, `src/shared/`, and `src/app/`.
- **Dependencies:** Next.js, React, TypeScript, Tailwind CSS, `shadcn/ui` primitives, and `lucide-react` icons.
- **Persistence:** Client-side `localStorage` behind decoupled service interfaces (no backend API or database in v1).
