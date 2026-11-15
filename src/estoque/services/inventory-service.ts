import { readStore, updateStore } from "@/shared/libs/storage";
import type { Ingredient } from "@/shared/types/domain";

export function isLowStock(ingredient: Ingredient): boolean {
  return ingredient.quantity <= ingredient.minThreshold;
}

export function getLowStockIngredients(ingredients: Ingredient[]): Ingredient[] {
  return ingredients.filter(isLowStock);
}

export function listIngredients(storage?: Storage | null): Ingredient[] {
  return readStore(storage).ingredients;
}

export type QuantityValidationResult =
  | { ok: true; value: number }
  | { ok: false; message: string };

export function validateQuantityInput(
  rawValue: string | number,
): QuantityValidationResult {
  if (typeof rawValue === "number") {
    if (!Number.isFinite(rawValue) || rawValue < 0) {
      return {
        ok: false,
        message: "Quantidade inválida (4A). Informe um número igual ou maior que zero.",
      };
    }
    return { ok: true, value: Math.round(rawValue * 100) / 100 };
  }

  const trimmed = rawValue.trim();
  if (trimmed.length === 0) {
    return {
      ok: false,
      message: "Quantidade inválida (4A). O campo não pode ficar vazio.",
    };
  }

  const normalized = trimmed.replace(",", ".");
  if (!/^-?\d+(\.\d+)?$/.test(normalized)) {
    return {
      ok: false,
      message: "Quantidade inválida (4A). Informe apenas valores numéricos.",
    };
  }

  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return {
      ok: false,
      message: "Quantidade inválida (4A). A quantidade não pode ser negativa.",
    };
  }

  return { ok: true, value: Math.round(parsed * 100) / 100 };
}

export type UpdateIngredientResult =
  | {
      ok: true;
      ingredient: Ingredient;
      lowStock: boolean;
    }
  | {
      ok: false;
      code: "INVALID_QUANTITY" | "NOT_FOUND";
      message: string;
    };

export function updateIngredientQuantity(
  ingredientId: string,
  rawQuantity: string | number,
  storage?: Storage | null,
): UpdateIngredientResult {
  const validation = validateQuantityInput(rawQuantity);
  if (!validation.ok) {
    return {
      ok: false,
      code: "INVALID_QUANTITY",
      message: validation.message,
    };
  }

  const store = readStore(storage);
  const exists = store.ingredients.some((item) => item.id === ingredientId);
  if (!exists) {
    return {
      ok: false,
      code: "NOT_FOUND",
      message: "Ingrediente não encontrado.",
    };
  }

  const nowIso = new Date().toISOString();
  let updatedIngredient!: Ingredient;

  updateStore((current) => {
    const ingredients = current.ingredients.map((item) => {
      if (item.id !== ingredientId) return item;
      updatedIngredient = {
        ...item,
        quantity: validation.value,
        updatedAt: nowIso,
      };
      return updatedIngredient;
    });

    return {
      ...current,
      ingredients,
    };
  }, storage);

  return {
    ok: true,
    ingredient: updatedIngredient,
    lowStock: isLowStock(updatedIngredient),
  };
}
