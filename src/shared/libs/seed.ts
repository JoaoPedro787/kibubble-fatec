import type {
  Ingredient,
  KiBubbleStore,
  Order,
  Product,
  Sale,
} from "@/shared/types/domain";

function isoHoursAgo(now: Date, hours: number): string {
  return new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();
}

function isoDaysAgo(now: Date, days: number): string {
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
}

export function createInitialSeed(now: Date = new Date()): KiBubbleStore {
  const timestamp = now.toISOString();

  const ingredients: Ingredient[] = [
    {
      id: "ing-boba",
      name: "Pérolas de Tapioca Preta",
      unit: "g",
      quantity: 1200,
      minThreshold: 300,
      updatedAt: timestamp,
    },
    {
      id: "ing-tea-black",
      name: "Chá Preto Assam",
      unit: "ml",
      quantity: 4500,
      minThreshold: 1000,
      updatedAt: timestamp,
    },
    {
      id: "ing-tea-matcha",
      name: "Chá Verde Matcha",
      unit: "g",
      quantity: 360,
      minThreshold: 100,
      updatedAt: timestamp,
    },
    {
      id: "ing-milk",
      name: "Leite Integral",
      unit: "ml",
      quantity: 5000,
      minThreshold: 1200,
      updatedAt: timestamp,
    },
    {
      id: "ing-brown-sugar",
      name: "Xarope de Açúcar Mascavo",
      unit: "ml",
      quantity: 1400,
      minThreshold: 300,
      updatedAt: timestamp,
    },
    {
      id: "ing-taro",
      name: "Pasta de Taro",
      unit: "g",
      quantity: 900,
      minThreshold: 250,
      updatedAt: timestamp,
    },
    {
      id: "ing-mango",
      name: "Purê de Manga",
      unit: "ml",
      quantity: 800,
      minThreshold: 250,
      updatedAt: timestamp,
    },
    {
      id: "ing-popping-strawberry",
      name: "Popping Boba Morango",
      unit: "g",
      quantity: 650,
      minThreshold: 200,
      updatedAt: timestamp,
    },
    {
      id: "ing-cream-cheese",
      name: "Creme Cheese Foam",
      unit: "g",
      quantity: 180,
      minThreshold: 200,
      updatedAt: timestamp,
    },
    {
      id: "ing-mochi",
      name: "Massa de Mochi",
      unit: "un",
      quantity: 24,
      minThreshold: 8,
      updatedAt: timestamp,
    },
    {
      id: "ing-cups",
      name: "Copo 500ml + Canudo",
      unit: "un",
      quantity: 45,
      minThreshold: 15,
      updatedAt: timestamp,
    },
  ];

  const products: Product[] = [
    {
      id: "prod-classic-milk",
      name: "Classic Brown Sugar Boba",
      category: "Clássicos",
      description: "Chá preto Assam, leite cremoso, açúcar mascavo e pérolas de tapioca.",
      price: 22.9,
      active: true,
      recipe: [
        { ingredientId: "ing-boba", quantity: 60 },
        { ingredientId: "ing-tea-black", quantity: 200 },
        { ingredientId: "ing-milk", quantity: 150 },
        { ingredientId: "ing-brown-sugar", quantity: 40 },
        { ingredientId: "ing-cups", quantity: 1 },
      ],
    },
    {
      id: "prod-matcha-latte",
      name: "Matcha Cream Boba",
      category: "Clássicos",
      description: "Matcha japonês batido com leite gelado, boba e cheese foam.",
      price: 25.9,
      active: true,
      recipe: [
        { ingredientId: "ing-boba", quantity: 60 },
        { ingredientId: "ing-tea-matcha", quantity: 12 },
        { ingredientId: "ing-milk", quantity: 200 },
        { ingredientId: "ing-cream-cheese", quantity: 40 },
        { ingredientId: "ing-cups", quantity: 1 },
      ],
    },
    {
      id: "prod-taro-velvet",
      name: "Taro Velvet Milk Tea",
      category: "Especiais",
      description: "Pasta cremosa de taro com leite e pérolas de tapioca.",
      price: 24.9,
      active: true,
      recipe: [
        { ingredientId: "ing-boba", quantity: 60 },
        { ingredientId: "ing-taro", quantity: 50 },
        { ingredientId: "ing-milk", quantity: 200 },
        { ingredientId: "ing-cups", quantity: 1 },
      ],
    },
    {
      id: "prod-mango-pop",
      name: "Mango Popping Refresh",
      category: "Frutados",
      description: "Chá preto gelado com purê de manga e popping boba de morango.",
      price: 21.9,
      active: true,
      recipe: [
        { ingredientId: "ing-mango", quantity: 80 },
        { ingredientId: "ing-popping-strawberry", quantity: 50 },
        { ingredientId: "ing-tea-black", quantity: 180 },
        { ingredientId: "ing-cups", quantity: 1 },
      ],
    },
    {
      id: "prod-dirty-cheese",
      name: "Dirty Black Tea Cheese",
      category: "Especiais",
      description: "Chá preto intenso caramelizado com mascavo e camada de cheese foam.",
      price: 26.5,
      active: true,
      recipe: [
        { ingredientId: "ing-tea-black", quantity: 200 },
        { ingredientId: "ing-brown-sugar", quantity: 50 },
        { ingredientId: "ing-cream-cheese", quantity: 45 },
        { ingredientId: "ing-milk", quantity: 150 },
        { ingredientId: "ing-cups", quantity: 1 },
      ],
    },
    {
      id: "prod-mochi-duo",
      name: "Mochi Artesanal (2 un)",
      category: "Snacks",
      description: "Dupla de mochi macio recheado com creme de taro.",
      price: 16.9,
      active: true,
      recipe: [
        { ingredientId: "ing-mochi", quantity: 2 },
        { ingredientId: "ing-taro", quantity: 20 },
      ],
    },
  ];

  const t1 = isoDaysAgo(now, 8);
  const t2 = isoDaysAgo(now, 3);
  const t3 = isoHoursAgo(now, 2);
  const t4 = isoHoursAgo(now, 0.75);
  const t5 = isoHoursAgo(now, 0.25);

  const sales: Sale[] = [
    {
      id: "sale-1001",
      orderId: "ord-1001",
      orderCode: "KB-001",
      items: [
        {
          productId: "prod-classic-milk",
          productName: "Classic Brown Sugar Boba",
          quantity: 2,
          unitPrice: 22.9,
          subtotal: 45.8,
        },
        {
          productId: "prod-mochi-duo",
          productName: "Mochi Artesanal (2 un)",
          quantity: 1,
          unitPrice: 16.9,
          subtotal: 16.9,
        },
      ],
      total: 62.7,
      paymentMethod: "PIX",
      operatorRole: "Colaborador",
      createdAt: t1,
    },
    {
      id: "sale-1002",
      orderId: "ord-1002",
      orderCode: "KB-002",
      items: [
        {
          productId: "prod-taro-velvet",
          productName: "Taro Velvet Milk Tea",
          quantity: 2,
          unitPrice: 24.9,
          subtotal: 49.8,
        },
      ],
      total: 49.8,
      paymentMethod: "Cartão de Crédito",
      operatorRole: "Colaborador",
      createdAt: t2,
    },
    {
      id: "sale-1003",
      orderId: "ord-1003",
      orderCode: "KB-003",
      items: [
        {
          productId: "prod-mango-pop",
          productName: "Mango Popping Refresh",
          quantity: 1,
          unitPrice: 21.9,
          subtotal: 21.9,
        },
        {
          productId: "prod-classic-milk",
          productName: "Classic Brown Sugar Boba",
          quantity: 1,
          unitPrice: 22.9,
          subtotal: 22.9,
        },
      ],
      total: 44.8,
      paymentMethod: "Dinheiro",
      operatorRole: "Gestor",
      createdAt: t3,
    },
    {
      id: "sale-1004",
      orderId: "ord-1004",
      orderCode: "KB-004",
      items: [
        {
          productId: "prod-matcha-latte",
          productName: "Matcha Cream Boba",
          quantity: 1,
          unitPrice: 25.9,
          subtotal: 25.9,
        },
      ],
      total: 25.9,
      paymentMethod: "Cartão de Débito",
      operatorRole: "Colaborador",
      createdAt: t4,
    },
    {
      id: "sale-1005",
      orderId: "ord-1005",
      orderCode: "KB-005",
      items: [
        {
          productId: "prod-dirty-cheese",
          productName: "Dirty Black Tea Cheese",
          quantity: 1,
          unitPrice: 26.5,
          subtotal: 26.5,
        },
        {
          productId: "prod-mochi-duo",
          productName: "Mochi Artesanal (2 un)",
          quantity: 1,
          unitPrice: 16.9,
          subtotal: 16.9,
        },
      ],
      total: 43.4,
      paymentMethod: "PIX",
      operatorRole: "Colaborador",
      createdAt: t5,
    },
  ];

  const orders: Order[] = [
    {
      id: "ord-1001",
      code: "KB-001",
      saleId: "sale-1001",
      items: sales[0].items,
      status: "Entregue",
      createdAt: t1,
      updatedAt: t1,
    },
    {
      id: "ord-1002",
      code: "KB-002",
      saleId: "sale-1002",
      items: sales[1].items,
      status: "Entregue",
      createdAt: t2,
      updatedAt: t2,
    },
    {
      id: "ord-1003",
      code: "KB-003",
      saleId: "sale-1003",
      items: sales[2].items,
      status: "Entregue",
      createdAt: t3,
      updatedAt: t3,
    },
    {
      id: "ord-1004",
      code: "KB-004",
      saleId: "sale-1004",
      items: sales[3].items,
      status: "Pronto",
      createdAt: t4,
      updatedAt: t4,
    },
    {
      id: "ord-1005",
      code: "KB-005",
      saleId: "sale-1005",
      items: sales[4].items,
      status: "Em preparo",
      createdAt: t5,
      updatedAt: t5,
    },
  ];

  return {
    version: 1,
    theme: null,
    session: null,
    ingredients,
    products,
    orders,
    sales,
    nextOrderNumber: 6,
  };
}
