import { readStore, updateStore } from "@/shared/libs/storage";
import type {
  Ingredient,
  Order,
  OrderItem,
  PaymentMethod,
  Product,
  Sale,
  UserRole,
} from "@/shared/types/domain";

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface ProductAvailability {
  productId: string;
  totalMakeableFromStock: number;
  additionalAvailable: number;
  available: boolean;
  missingIngredients: string[];
}

export interface CartTotals {
  lines: OrderItem[];
  total: number;
  totalUnits: number;
}

export interface CheckoutInput {
  items: CartItem[];
  paymentMethod: PaymentMethod;
  operatorRole: UserRole;
  simulateFailure?: boolean;
}

export type CheckoutResult =
  | {
      ok: true;
      sale: Sale;
      order: Order;
    }
  | {
      ok: false;
      code: "EMPTY_CART" | "INSUFFICIENT_STOCK" | "PAYMENT_UNAUTHORIZED";
      message: string;
      missingIngredients?: string[];
    };

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

export function computeReservedIngredients(
  products: Product[],
  cart: CartItem[],
): Map<string, number> {
  const productMap = new Map(products.map((p) => [p.id, p]));
  const reserved = new Map<string, number>();

  for (const item of cart) {
    if (item.quantity <= 0) continue;
    const product = productMap.get(item.productId);
    if (!product) continue;

    for (const req of product.recipe) {
      const prev = reserved.get(req.ingredientId) ?? 0;
      reserved.set(req.ingredientId, prev + req.quantity * item.quantity);
    }
  }

  return reserved;
}

export function getProductAvailability(
  product: Product,
  ingredients: Ingredient[],
  cart: CartItem[],
): ProductAvailability {
  const ingredientMap = new Map(ingredients.map((i) => [i.id, i]));
  const reserved = computeReservedIngredients(
    [product],
    cart.filter((c) => c.productId === product.id),
  );

  // Note: When multiple products share ingredients in the cart, callers should pass
  // precomputed reserved map via getCatalogAvailability; this helper handles single-product checks cleanly too.
  let totalMakeableFromStock = Infinity;
  let additionalAvailable = Infinity;
  const missingIngredients: string[] = [];

  for (const req of product.recipe) {
    const ing = ingredientMap.get(req.ingredientId);
    if (!ing || req.quantity <= 0) {
      totalMakeableFromStock = 0;
      additionalAvailable = 0;
      if (ing) missingIngredients.push(ing.name);
      continue;
    }

    const totalPossible = Math.floor(ing.quantity / req.quantity);
    const remaining = Math.max(0, ing.quantity - (reserved.get(req.ingredientId) ?? 0));
    const additionalPossible = Math.floor(remaining / req.quantity);

    if (totalPossible < totalMakeableFromStock) {
      totalMakeableFromStock = totalPossible;
    }
    if (additionalPossible < additionalAvailable) {
      additionalAvailable = additionalPossible;
    }
    if (additionalPossible <= 0) {
      missingIngredients.push(ing.name);
    }
  }

  if (totalMakeableFromStock === Infinity) totalMakeableFromStock = 0;
  if (additionalAvailable === Infinity) additionalAvailable = 0;

  return {
    productId: product.id,
    totalMakeableFromStock,
    additionalAvailable,
    available: additionalAvailable > 0,
    missingIngredients,
  };
}

export function getCatalogAvailability(
  products: Product[],
  ingredients: Ingredient[],
  cart: CartItem[],
): Map<string, ProductAvailability> {
  const ingredientMap = new Map(ingredients.map((i) => [i.id, i]));
  const reserved = computeReservedIngredients(products, cart);
  const result = new Map<string, ProductAvailability>();

  for (const product of products) {
    let totalMakeableFromStock = Infinity;
    let additionalAvailable = Infinity;
    const missingIngredients: string[] = [];

    for (const req of product.recipe) {
      const ing = ingredientMap.get(req.ingredientId);
      if (!ing || req.quantity <= 0) {
        totalMakeableFromStock = 0;
        additionalAvailable = 0;
        if (ing) missingIngredients.push(ing.name);
        continue;
      }

      const totalPossible = Math.floor(ing.quantity / req.quantity);
      const remaining = Math.max(
        0,
        ing.quantity - (reserved.get(req.ingredientId) ?? 0),
      );
      const additionalPossible = Math.floor(remaining / req.quantity);

      if (totalPossible < totalMakeableFromStock) {
        totalMakeableFromStock = totalPossible;
      }
      if (additionalPossible < additionalAvailable) {
        additionalAvailable = additionalPossible;
      }
      if (additionalPossible <= 0) {
        missingIngredients.push(ing.name);
      }
    }

    if (totalMakeableFromStock === Infinity) totalMakeableFromStock = 0;
    if (additionalAvailable === Infinity) additionalAvailable = 0;

    result.set(product.id, {
      productId: product.id,
      totalMakeableFromStock,
      additionalAvailable,
      available: additionalAvailable > 0,
      missingIngredients,
    });
  }

  return result;
}

export function calculateCartTotals(
  products: Product[],
  cart: CartItem[],
): CartTotals {
  const productMap = new Map(products.map((p) => [p.id, p]));
  const lines: OrderItem[] = [];
  let total = 0;
  let totalUnits = 0;

  for (const item of cart) {
    if (item.quantity <= 0) continue;
    const product = productMap.get(item.productId);
    if (!product) continue;

    const subtotal = roundCurrency(product.price * item.quantity);
    lines.push({
      productId: product.id,
      productName: product.name,
      quantity: item.quantity,
      unitPrice: product.price,
      subtotal,
    });
    total = roundCurrency(total + subtotal);
    totalUnits += item.quantity;
  }

  return { lines, total, totalUnits };
}

export function processCheckout(
  input: CheckoutInput,
  storage?: Storage | null,
): CheckoutResult {
  const validCart = input.items.filter((item) => item.quantity > 0);
  if (validCart.length === 0) {
    return {
      ok: false,
      code: "EMPTY_CART",
      message: "Adicione ao menos um produto ao carrinho antes de finalizar.",
    };
  }

  const store = readStore(storage);
  const { lines, total } = calculateCartTotals(store.products, validCart);
  if (lines.length === 0) {
    return {
      ok: false,
      code: "EMPTY_CART",
      message: "Nenhum produto válido encontrado no carrinho.",
    };
  }

  const requiredByIngredient = computeReservedIngredients(
    store.products,
    validCart,
  );
  const ingredientMap = new Map(store.ingredients.map((i) => [i.id, i]));
  const missingIngredients: string[] = [];

  for (const [ingredientId, requiredQty] of requiredByIngredient.entries()) {
    const ing = ingredientMap.get(ingredientId);
    if (!ing || ing.quantity < requiredQty) {
      missingIngredients.push(ing ? ing.name : ingredientId);
    }
  }

  if (missingIngredients.length > 0) {
    return {
      ok: false,
      code: "INSUFFICIENT_STOCK",
      message: `Ingredientes insuficientes para concluir a venda: ${missingIngredients.join(", ")}.`,
      missingIngredients,
    };
  }

  if (input.simulateFailure) {
    return {
      ok: false,
      code: "PAYMENT_UNAUTHORIZED",
      message:
        "Pagamento não autorizado (5A). Selecione outra forma de pagamento ou tente novamente.",
    };
  }

  const nowIso = new Date().toISOString();
  let createdSale!: Sale;
  let createdOrder!: Order;

  updateStore((current) => {
    const orderNum = current.nextOrderNumber;
    const orderCode = `KB-${String(orderNum).padStart(3, "0")}`;
    const orderId = `ord-${Date.now()}-${orderNum}`;
    const saleId = `sale-${Date.now()}-${orderNum}`;

    const nextIngredients = current.ingredients.map((ing) => {
      const consumed = requiredByIngredient.get(ing.id) ?? 0;
      if (consumed === 0) return ing;
      return {
        ...ing,
        quantity: Math.max(0, roundCurrency(ing.quantity - consumed)),
        updatedAt: nowIso,
      };
    });

    createdOrder = {
      id: orderId,
      code: orderCode,
      saleId,
      items: lines,
      status: "Em preparo",
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    createdSale = {
      id: saleId,
      orderId,
      orderCode,
      items: lines,
      total,
      paymentMethod: input.paymentMethod,
      operatorRole: input.operatorRole,
      createdAt: nowIso,
    };

    return {
      ...current,
      ingredients: nextIngredients,
      orders: [createdOrder, ...current.orders],
      sales: [createdSale, ...current.sales],
      nextOrderNumber: orderNum + 1,
    };
  }, storage);

  return {
    ok: true,
    sale: createdSale,
    order: createdOrder,
  };
}
