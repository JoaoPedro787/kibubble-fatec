# auth Specification

## Purpose
Provide mocked authentication, role-based access control between `Colaborador` and `Gestor` profiles, quick role switching in the application header, and session logout persisted in browser storage.

## Requirements

### Requirement: Unauthenticated users are directed to login
The system SHALL require an active mocked user session to access operational and management routes (`/vendas`, `/pedidos`, `/estoque`, `/relatorios`), while allowing public unauthenticated access to the root customer landing page (`/`).

#### Scenario: Redirect unauthenticated access
- **WHEN** an unauthenticated user navigates to any protected route (`/vendas`, `/pedidos`, `/estoque`, `/relatorios`)
- **THEN** the system redirects the user to `/login`

#### Scenario: Public access to root landing page
- **WHEN** an unauthenticated or authenticated user navigates to `/`
- **THEN** the system renders the public customer landing page without redirecting to `/login` or operational routes

#### Scenario: Sign in as Colaborador or Gestor
- **WHEN** the user selects a profile (`Colaborador` or `Gestor`) on `/login` and submits login
- **THEN** the system persists the active session in browser storage and navigates to `/vendas` (for `Colaborador`) or `/relatorios` (for `Gestor`)

### Requirement: Role-based navigation and route access
The system SHALL restrict management modules (`/estoque` and `/relatorios`) to the `Gestor` role while allowing `Colaborador` and `Gestor` to access `/vendas` and `/pedidos`.

#### Scenario: Colaborador accesses permitted routes
- **WHEN** the active role is `Colaborador`
- **THEN** navigation displays only Vendas and Pedidos, and direct navigation to `/estoque` or `/relatorios` redirects to `/vendas`

#### Scenario: Gestor accesses all modules
- **WHEN** the active role is `Gestor`
- **THEN** navigation displays Vendas, Pedidos, Estoque, and Relatórios, and all four routes are accessible

### Requirement: Quick user-role switcher in header
The system SHALL display a user profile selector next to the Gear Settings control in the authenticated header allowing instant switching between `Colaborador` and `Gestor`.

#### Scenario: Switch from Gestor to Colaborador while on a manager-only route
- **WHEN** the user is on `/estoque` or `/relatorios` and selects `Colaborador` in the header user selector
- **THEN** the system updates the persisted session role to `Colaborador` and redirects the user to `/vendas`

#### Scenario: Switch between roles on a shared route
- **WHEN** the user is on `/vendas` or `/pedidos` and changes the header user selector
- **THEN** the system updates the persisted session role and immediately updates visible navigation items without requiring re-login

### Requirement: Logout via Gear Settings
The system SHALL allow authenticated users to log out from the Gear Settings menu in the header.

#### Scenario: User logs out
- **WHEN** the user opens Gear Settings and clicks Logout
- **THEN** the system clears the active session from browser storage and redirects to `/login`
