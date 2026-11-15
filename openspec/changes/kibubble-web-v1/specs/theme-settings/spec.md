# Spec Delta

## Purpose

Provide a strictly monochromatic interface that adapts to Light and Dark themes, respects the user's preference, and exposes theme switching through a Gear Settings control.

## ADDED Requirements

### Requirement: Strictly monochromatic Light and Dark themes
The system SHALL render all UI surfaces, text, borders, charts, and status indicators using strictly monochromatic colors (black, white, and grayscale) in both Light and Dark themes.

#### Scenario: Initial theme resolution
- **WHEN** a user opens the application with no saved theme preference
- **THEN** the system applies the Light or Dark monochromatic theme matching the user's system preference

### Requirement: Theme toggle in Gear Settings
The system SHALL provide a Gear Settings control in the header (and a theme switch on `/login`) to toggle between Light and Dark themes and persist the choice in browser storage.

#### Scenario: Toggle theme via Gear Settings
- **WHEN** an authenticated user opens Gear Settings and switches between Light and Dark
- **THEN** the system immediately updates the visual theme across the interface and persists the preference across page reloads
