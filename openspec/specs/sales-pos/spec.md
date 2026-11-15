# sales-pos Specification

## Purpose
Enable employees and managers to register point-of-sale transactions (`UC01`) with automatic total calculation, recipe-based ingredient availability checks, simulated payment processing, automatic inventory deduction, and order creation.

## Requirements

### Requirement: Catalog display with real-time ingredient availability
The system SHALL display menu products on `/vendas` with prices and availability derived from current ingredient stock and each product's recipe.

#### Scenario: Product has insufficient ingredients
- **WHEN** one or more ingredients required by a product's recipe have insufficient quantity in stock (including quantities already reserved in the active cart)
- **THEN** the system marks the product as unavailable (`8A`) and prevents adding quantities beyond available ingredients

### Requirement: Cart management and automatic total calculation
The system SHALL allow selecting products, adjusting quantities, removing items, and automatically calculating the sale total.

#### Scenario: Add and adjust items in cart
- **WHEN** the user adds products or changes quantities in the cart
- **THEN** the system recalculates item subtotals and the total sale amount immediately

### Requirement: Payment method selection and authorization simulation
The system SHALL require selecting a payment method (`Dinheiro`, `PIX`, `Cartão de Crédito`, `Cartão de Débito`) and support both authorized and unauthorized (`5A`) simulated payment outcomes.

#### Scenario: Payment not authorized (`5A`)
- **WHEN** the simulated payment fails authorization
- **THEN** the system displays a payment failure message, keeps the cart intact, does not deduct inventory or record a sale, and prompts the user to choose another payment method or retry

### Requirement: Sale completion updates inventory, orders, and sales history
The system SHALL atomically record the sale, deduct recipe ingredients from stock, create an order in `Em preparo` status, and persist all updated state to browser storage upon authorized payment.

#### Scenario: Authorized sale completes end-to-end
- **WHEN** payment succeeds for a non-empty cart with valid ingredient stock
- **THEN** the system deducts consumed ingredient quantities from stock, creates a new order with status `Em preparo`, appends the sale to history, clears the cart, and displays confirmation
