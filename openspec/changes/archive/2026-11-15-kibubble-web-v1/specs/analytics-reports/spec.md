# Spec Delta

## Purpose

Provide manager-only (`Gestor`) operational and financial analytics (`UC04`) computed dynamically from persisted sales records.

## ADDED Requirements

### Requirement: Manager-only access to reports
The system SHALL restrict `/relatorios` exclusively to the `Gestor` role and compute all metrics dynamically from persisted sales records.

#### Scenario: Metrics reflect newly registered sales
- **WHEN** a new sale is completed in `/vendas` and a `Gestor` views `/relatorios`
- **THEN** all report figures reflect the newly recorded sale immediately

### Requirement: Revenue breakdown (`3A`)
The system SHALL display total revenue grouped by daily, weekly, and monthly periods (`3A`).

#### Scenario: View daily, weekly, and monthly revenue
- **WHEN** the `Gestor` views the revenue section or period filter on `/relatorios`
- **THEN** the system displays calculated revenue for today, the current 7-day/week window, and the current month

### Requirement: Automatic average ticket calculation (`3B`)
The system SHALL automatically calculate and display the average ticket (`total revenue / number of sales`, or zero when there are no sales) (`3B`).

#### Scenario: Calculate average ticket
- **WHEN** one or more sales exist in browser storage
- **THEN** the system displays the average ticket rounded as currency alongside total sales count

### Requirement: Top-selling products ranking (`3C`)
The system SHALL generate and display a ranking of products ordered by total units sold and revenue contribution (`3C`).

#### Scenario: View top-selling products
- **WHEN** the `Gestor` inspects the product ranking on `/relatorios`
- **THEN** products are sorted in descending order of quantity sold

### Requirement: Complete sales history (`3D`)
The system SHALL display the complete chronological history of registered sales including date/time, sold items, payment method, operator profile, and total amount (`3D`).

#### Scenario: Inspect sales history
- **WHEN** the `Gestor` opens the sales history view on `/relatorios`
- **THEN** all persisted sales are listed from newest to oldest with full item and payment details
