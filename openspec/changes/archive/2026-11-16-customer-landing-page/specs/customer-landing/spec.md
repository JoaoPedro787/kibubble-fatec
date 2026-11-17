# customer-landing Specification

## Purpose

Provide an immersive, strictly monochromatic customer-facing landing page on `/` that showcases Ki Bubble's artisanal beverages through multi-layer parallax, velocity-reactive kinetic typography, an Apple-style scroll-pinned exploded cup assembly, an interactive spotlight catalog, and a 3-step custom drink combination recommender without exposing internal staff or administrative interfaces.

## ADDED Requirements

### Requirement: Customer-only monochromatic brand experience on root route
The system SHALL render the public customer landing page at `/` using strictly monochromatic tokens (black, white, and grayscale) in both Light and Dark themes, with a fixed glass header containing brand identity, section navigation anchors (`#anatomia`, `#catalogo`, `#alquimia`), a scroll progress indicator, and a theme toggle, and SHALL NOT display staff login buttons, role selectors, or internal operational controls.

#### Scenario: Customer visits root route
- **WHEN** any visitor navigates to `/`
- **THEN** the system renders the Ki Bubble customer landing page without redirecting to `/login` or operational routes and without displaying staff/employee entry links

#### Scenario: Visitor switches theme on landing page
- **WHEN** the visitor activates the theme toggle in the landing header
- **THEN** the system switches between Light and Dark monochromatic themes immediately and persists the preference in browser storage

### Requirement: Multi-layer parallax hero and velocity-reactive marquee
The system SHALL display a hero section with multi-plane depth layers (background outline typography and blurred pearls, central illustrated cup, and foreground specular pearls) that respond to scroll and pointer movement, followed by a dual-track kinetic marquee that scrolls continuously and reacts to scroll velocity while respecting `prefers-reduced-motion`.

#### Scenario: Hero and marquee render with motion enabled
- **WHEN** the visitor views and scrolls the hero and marquee sections with standard motion preferences
- **THEN** depth layers translate at distinct parallax multipliers and the kinetic marquee tracks update their horizontal offset smoothly

#### Scenario: Reduced motion preference is active
- **WHEN** the visitor has `prefers-reduced-motion: reduce` enabled
- **THEN** the landing page disables continuous floating and parallax displacements while keeping all content, illustrations, and interactive controls fully accessible

### Requirement: Apple-style scroll-pinned exploded cup assembly
The system SHALL provide a scroll-pinned (`sticky`) scrollytelling section (`#anatomia`) where the visual components of the signature Bubble Tea (diagonal straw, dome lid, cheese foam cloud, Assam tea with ice cubes, brown sugar swirl, black tapioca pearls, and cup vessel) start separated in vertical space at the beginning of the section and progressively converge into a fully assembled cup as scroll progress reaches 100%, accompanied by stage callouts for each ingredient layer.

#### Scenario: Visitor scrolls through the exploded view section
- **WHEN** the visitor scrolls through `#anatomia` from 0% to 100% progress
- **THEN** the floating visual layers interpolate their vertical offsets and opacity until they lock together into the completed cup illustration and highlight the active ingredient stage

### Requirement: Interactive spotlight catalog showcase
The system SHALL present the Ki Bubble signature catalog (`#catalogo`) in an Interactive Spotlight layout featuring category filters (`Todos`, `Clássicos`, `Especiais`, `Frutados`, `Snacks`), an editorial list of items on one side, and a live spotlight stage on the other side that updates the featured drink illustration, floating ingredient callouts, price, description, and sensory profile bars (*Cremosidade*, *Doçura*, *Intensidade*) when a customer hovers or selects an item.

#### Scenario: Customer selects or hovers a catalog item
- **WHEN** the customer activates or hovers a product in the editorial catalog list
- **THEN** the spotlight stage transitions to display that product's custom monochrome illustration, ingredient composition, sensory profile meters, and price

#### Scenario: Customer filters catalog by category
- **WHEN** the customer clicks a category filter in `#catalogo`
- **THEN** the editorial list updates to show matching signature items and automatically selects the first item in the filtered list for the spotlight stage

### Requirement: Three-step interactive drink alchemy recommender
The system SHALL provide an interactive "Monte sua Combinação" section (`#alquimia`) where the customer selects three sensory steps — **1. Base** (*Chá Preto Assam*, *Matcha Japonês*, *Taro Cremoso*, or *Frutado Tropical*), **2. Textura** (*Pérolas de Tapioca Preta* or *Popping Boba de Morango*), and **3. Finalização** (*Cheese Foam Salgado* or *Calda de Mascavo*) — dynamically updating a live layered cup preview and recommending the closest matching signature beverage from the Ki Bubble menu.

#### Scenario: Customer changes combination steps
- **WHEN** the customer selects a different Base, Textura, or Finalização option in `#alquimia`
- **THEN** the visual cup preview updates its visual layers immediately and displays the recommended signature product name, matching notes, and price
