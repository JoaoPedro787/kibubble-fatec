import { beforeEach, describe, expect, it } from "vitest";
import { STORAGE_KEY, readStore, updateStore, writeStore } from "@/shared/libs/storage";
import { createInitialSeed } from "@/shared/libs/seed";

describe("localStorage store wrapper", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("initializes with seed data when storage is empty and persists it", () => {
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();

    const store = readStore(window.localStorage);
    expect(store.version).toBe(1);
    expect(store.products.length).toBeGreaterThanOrEqual(5);
    expect(store.ingredients.length).toBeGreaterThanOrEqual(8);
    expect(store.orders.length).toBeGreaterThanOrEqual(3);
    expect(store.sales.length).toBeGreaterThanOrEqual(3);
    expect(window.localStorage.getItem(STORAGE_KEY)).not.toBeNull();

    // Every product recipe must reference valid ingredient IDs
    const ingredientIds = new Set(store.ingredients.map((item) => item.id));
    for (const product of store.products) {
      expect(product.recipe.length).toBeGreaterThan(0);
      for (const recipeItem of product.recipe) {
        expect(ingredientIds.has(recipeItem.ingredientId)).toBe(true);
        expect(recipeItem.quantity).toBeGreaterThan(0);
      }
    }
  });

  it("persists updates across reads and recovers from corrupted JSON", () => {
    const initial = createInitialSeed(new Date("2026-11-15T12:00:00Z"));
    writeStore(initial, window.localStorage);

    updateStore(
      (current) => ({
        ...current,
        theme: "dark",
      }),
      window.localStorage,
    );

    const reloaded = readStore(window.localStorage);
    expect(reloaded.theme).toBe("dark");

    // Corrupted JSON falls back cleanly to initial seed
    window.localStorage.setItem(STORAGE_KEY, "{broken-json");
    const recovered = readStore(window.localStorage);
    expect(recovered.version).toBe(1);
    expect(recovered.products.length).toBeGreaterThan(0);
  });
});
