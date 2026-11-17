# auth Specification

## MODIFIED Requirements

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
