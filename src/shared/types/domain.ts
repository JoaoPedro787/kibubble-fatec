export type UserRole = "Colaborador" | "Gestor";

export interface UserSession {
  role: UserRole;
  name: string;
  loggedInAt: string;
}

export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  minThreshold: number;
  updatedAt: string;
}

export interface RecipeItem {
  ingredientId: string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  recipe: RecipeItem[];
  active: boolean;
}

export type OrderStatus = "Em preparo" | "Pronto" | "Entregue";

export type PaymentMethod =
  | "Dinheiro"
  | "PIX"
  | "Cartão de Crédito"
  | "Cartão de Débito";

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  code: string;
  saleId: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  id: string;
  orderId: string;
  orderCode: string;
  items: OrderItem[];
  total: number;
  paymentMethod: PaymentMethod;
  operatorRole: UserRole;
  createdAt: string;
}

export type ThemeMode = "light" | "dark";

export interface KiBubbleStore {
  version: 1;
  theme: ThemeMode | null;
  session: UserSession | null;
  ingredients: Ingredient[];
  products: Product[];
  orders: Order[];
  sales: Sale[];
  nextOrderNumber: number;
}
