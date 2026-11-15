# Spec Delta

## Purpose

Allow staff to track active orders and update production status across the lifecycle defined in `UC02` (`Em preparo`, `Pronto`, `Entregue`).

## ADDED Requirements

### Requirement: Display orders grouped or filterable by status
The system SHALL display registered orders on `/pedidos` showing order identifier, items, timestamp, and current status (`Em preparo`, `Pronto`, `Entregue`).

#### Scenario: New sale appears as Em preparo
- **WHEN** a sale is completed on `/vendas`
- **THEN** the corresponding order appears on `/pedidos` with status `Em preparo`

### Requirement: Valid order status progression
The system SHALL allow updating an order's status along valid production states (`Em preparo` → `Pronto` → `Entregue`) and persist changes in browser storage.

#### Scenario: Advance order from Em preparo to Pronto to Entregue
- **WHEN** the user updates an order from `Em preparo` to `Pronto`, and later to `Entregue`
- **THEN** the system records each transition, updates the displayed status immediately, and persists it across reloads

#### Scenario: Invalid status transition (`5A`)
- **WHEN** an invalid status transition is attempted (e.g., setting a non-existent status or transitioning out of allowed states)
- **THEN** the system rejects the update and displays a validation error
