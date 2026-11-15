# Spec Delta

## Purpose

Enable managers (`Gestor`) to monitor ingredient quantities, update stock levels with validation, and receive automatic low-stock alerts (`UC03`).

## ADDED Requirements

### Requirement: Manager-only ingredient stock consultation
The system SHALL display all registered ingredients on `/estoque` with current quantity, unit of measure, configured minimum threshold, and low-stock alert indicator exclusively for the `Gestor` role.

#### Scenario: Consult ingredients and low-stock alerts
- **WHEN** a `Gestor` opens `/estoque`
- **THEN** the system displays every ingredient and visually highlights any ingredient whose current quantity is at or below its minimum threshold

### Requirement: Validated ingredient quantity updates
The system SHALL allow a `Gestor` to update ingredient quantities, reject invalid inputs (`4A`), and automatically recalculate low-stock alerts.

#### Scenario: Reject invalid quantity (`4A`)
- **WHEN** the `Gestor` submits a negative, non-numeric, or empty quantity value
- **THEN** the system displays a validation error and preserves the previous stock quantity

#### Scenario: Low-stock alert triggers on threshold breach
- **WHEN** an ingredient quantity drops to or below its minimum threshold (via manual update or sale deduction)
- **THEN** the system activates a low-stock alert indicator for that ingredient and surfaces an alert summary
