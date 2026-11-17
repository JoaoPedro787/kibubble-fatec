import { describe, expect, it } from "vitest";
import {
  ALCHEMY_BASES,
  ALCHEMY_TEXTURES,
  ALCHEMY_TOPPINGS,
  CATALOG_FILTER_CATEGORIES,
  EXPLODED_CUP_LAYERS,
  EXPLODED_CUP_STAGES,
  LANDING_CATALOG_ITEMS,
  filterCatalogByCategory,
  matchDrinkCombination,
} from "@/landing/services/landing-catalog-service";

describe("landingCatalogService", () => {
  it("exposes all 6 Ki Bubble signature creations with sensory profiles and ingredients", () => {
    expect(LANDING_CATALOG_ITEMS).toHaveLength(6);

    for (const item of LANDING_CATALOG_ITEMS) {
      expect(item.price).toBeGreaterThan(0);
      expect(item.floatingIngredients.length).toBeGreaterThanOrEqual(3);
      expect(item.sensoryProfile.cremosidade).toBeGreaterThan(0);
      expect(item.sensoryProfile.cremosidade).toBeLessThanOrEqual(100);
      expect(item.sensoryProfile.docura).toBeGreaterThan(0);
      expect(item.sensoryProfile.docura).toBeLessThanOrEqual(100);
      expect(item.sensoryProfile.intensidade).toBeGreaterThan(0);
      expect(item.sensoryProfile.intensidade).toBeLessThanOrEqual(100);
    }
  });

  it("filters catalog items across every category pill", () => {
    expect(CATALOG_FILTER_CATEGORIES).toEqual([
      "Todos",
      "Clássicos",
      "Especiais",
      "Frutados",
      "Snacks",
    ]);

    expect(filterCatalogByCategory("Todos")).toHaveLength(6);
    expect(filterCatalogByCategory("Clássicos").map((i) => i.name)).toEqual([
      "Classic Brown Sugar Boba",
      "Matcha Cream Boba",
    ]);
    expect(filterCatalogByCategory("Especiais").map((i) => i.name)).toEqual([
      "Taro Velvet Milk Tea",
      "Dirty Black Tea Cheese",
    ]);
    expect(filterCatalogByCategory("Frutados").map((i) => i.name)).toEqual([
      "Mango Popping Refresh",
    ]);
    expect(filterCatalogByCategory("Snacks").map((i) => i.name)).toEqual([
      "Mochi Artesanal (2 un)",
    ]);
  });

  it("defines exploded cup layers and 4 progressive assembly stages up to 100%", () => {
    expect(EXPLODED_CUP_LAYERS).toHaveLength(7);
    expect(EXPLODED_CUP_STAGES).toHaveLength(4);
    expect(EXPLODED_CUP_STAGES[0].progress).toBe(0);
    expect(EXPLODED_CUP_STAGES[3].progress).toBe(1);
    expect(EXPLODED_CUP_STAGES[3].highlightedLayers).toHaveLength(7);
  });

  it("deterministically matches all 16 alchemy combinations to signature creations", () => {
    expect(matchDrinkCombination("assam", "tapioca", "mascavo").recommendedDrink.id).toBe(
      "prod-classic-milk",
    );
    expect(matchDrinkCombination("assam", "tapioca", "cheese-foam").recommendedDrink.id).toBe(
      "prod-dirty-cheese",
    );
    expect(matchDrinkCombination("matcha", "tapioca", "cheese-foam").recommendedDrink.id).toBe(
      "prod-matcha-latte",
    );
    expect(matchDrinkCombination("taro", "tapioca", "mascavo").recommendedDrink.id).toBe(
      "prod-taro-velvet",
    );
    expect(matchDrinkCombination("frutado", "popping", "cheese-foam").recommendedDrink.id).toBe(
      "prod-mango-pop",
    );

    const results = new Set<string>();
    for (const base of ALCHEMY_BASES) {
      for (const texture of ALCHEMY_TEXTURES) {
        for (const topping of ALCHEMY_TOPPINGS) {
          const rec = matchDrinkCombination(base.id, texture.id, topping.id);
          expect(rec.recommendedDrink.name.length).toBeGreaterThan(0);
          expect(rec.matchReason.length).toBeGreaterThan(20);
          expect(rec.layerBreakdown).toHaveLength(3);
          expect(rec.sensoryEstimate.cremosidade).toBeLessThanOrEqual(100);
          expect(rec.sensoryEstimate.docura).toBeLessThanOrEqual(100);
          expect(rec.sensoryEstimate.intensidade).toBeLessThanOrEqual(100);
          results.add(`${base.id}:${texture.id}:${topping.id}->${rec.recommendedDrink.id}`);
        }
      }
    }

    expect(results.size).toBe(16);
  });
});
