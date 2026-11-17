import type {
  AlchemyBaseId,
  AlchemyOption,
  AlchemyRecommendation,
  AlchemyTextureId,
  AlchemyToppingId,
  CatalogFilterCategory,
  CatalogSpotlightItem,
  ExplodedCupLayer,
  ExplodedCupStage,
  SensoryProfile,
} from "@/landing/types/landing";

export const CATALOG_FILTER_CATEGORIES: readonly CatalogFilterCategory[] = [
  "Todos",
  "Clássicos",
  "Especiais",
  "Frutados",
  "Snacks",
] as const;

export const LANDING_CATALOG_ITEMS: readonly CatalogSpotlightItem[] = [
  {
    id: "prod-classic-milk",
    indexCode: "01",
    name: "Classic Brown Sugar Boba",
    category: "Clássicos",
    tagline: "Assam encorpado e veios lentos de mascavo tostado",
    description:
      "Chá preto Assam, leite cremoso, açúcar mascavo caramelizado nas paredes do copo e pérolas de tapioca cozidas em fogo baixo.",
    price: 22.9,
    servingSize: "500 ml",
    temperature: "Gelado",
    sensoryProfile: {
      cremosidade: 86,
      docura: 82,
      intensidade: 76,
    },
    floatingIngredients: [
      {
        id: "ing-assam",
        label: "Chá Preto Assam",
        note: "Infusão forte de folhas inteiras",
      },
      {
        id: "ing-mascavo",
        label: "Xarope de Mascavo",
        note: "Redução artesanal em espiral",
      },
      {
        id: "ing-boba",
        label: "Tapioca Preta",
        note: "Pérolas macias de centro elástico",
      },
    ],
    visual: {
      variant: "brown-sugar-swirl",
      liquidOpacity: 0.34,
      hasCheeseFoam: false,
      hasBrownSugarSwirl: true,
      pearlStyle: "tapioca",
      iceCubeCount: 2,
    },
  },
  {
    id: "prod-matcha-latte",
    indexCode: "02",
    name: "Matcha Cream Boba",
    category: "Clássicos",
    tagline: "Umami herbal japonês coroado com espuma salgada",
    description:
      "Matcha japonês batido a mão com leite gelado, pérolas de tapioca preta e camada espessa de cheese foam levemente salgado.",
    price: 25.9,
    servingSize: "500 ml",
    temperature: "Gelado",
    sensoryProfile: {
      cremosidade: 90,
      docura: 62,
      intensidade: 88,
    },
    floatingIngredients: [
      {
        id: "ing-matcha",
        label: "Matcha Japonês",
        note: "Moagem fina de primeira colheita",
      },
      {
        id: "ing-foam",
        label: "Cheese Foam",
        note: "Nuvem aerada com toque marinho",
      },
      {
        id: "ing-boba",
        label: "Tapioca Preta",
        note: "Contraste macio na base",
      },
    ],
    visual: {
      variant: "matcha-foam",
      liquidOpacity: 0.24,
      hasCheeseFoam: true,
      hasBrownSugarSwirl: false,
      pearlStyle: "tapioca",
      iceCubeCount: 2,
    },
  },
  {
    id: "prod-taro-velvet",
    indexCode: "03",
    name: "Taro Velvet Milk Tea",
    category: "Especiais",
    tagline: "Textura aveludada de raiz aromática com notas de baunilha",
    description:
      "Pasta cremosa de taro batida com leite integral até atingir consistência sedosa, finalizada com pérolas de tapioca preta.",
    price: 24.9,
    servingSize: "500 ml",
    temperature: "Cremoso gelado",
    sensoryProfile: {
      cremosidade: 96,
      docura: 78,
      intensidade: 68,
    },
    floatingIngredients: [
      {
        id: "ing-taro",
        label: "Pasta de Taro",
        note: "Corpo denso e aroma adocicado",
      },
      {
        id: "ing-leite",
        label: "Leite Cremoso",
        note: "Emulsão fria de textura sedosa",
      },
      {
        id: "ing-boba",
        label: "Tapioca Preta",
        note: "Pérolas envoltas em melado",
      },
    ],
    visual: {
      variant: "taro-velvet",
      liquidOpacity: 0.28,
      hasCheeseFoam: false,
      hasBrownSugarSwirl: false,
      pearlStyle: "tapioca",
      iceCubeCount: 2,
    },
  },
  {
    id: "prod-mango-pop",
    indexCode: "04",
    name: "Mango Popping Refresh",
    category: "Frutados",
    tagline: "Acidez tropical límpida com esferas que estalam no paladar",
    description:
      "Chá preto gelado de extração leve combinado com purê de manga madura e popping boba de morango de casca delicada.",
    price: 21.9,
    servingSize: "500 ml",
    temperature: "Extra gelado",
    sensoryProfile: {
      cremosidade: 34,
      docura: 74,
      intensidade: 72,
    },
    floatingIngredients: [
      {
        id: "ing-manga",
        label: "Purê de Manga",
        note: "Fruta fresca em redução leve",
      },
      {
        id: "ing-popping",
        label: "Popping Boba Morango",
        note: "Esferas líquidas de ruptura suave",
      },
      {
        id: "ing-tea",
        label: "Chá Preto Gelado",
        note: "Base límpida e refrescante",
      },
    ],
    visual: {
      variant: "mango-popping",
      liquidOpacity: 0.14,
      hasCheeseFoam: false,
      hasBrownSugarSwirl: false,
      pearlStyle: "popping",
      iceCubeCount: 3,
    },
  },
  {
    id: "prod-dirty-cheese",
    indexCode: "05",
    name: "Dirty Black Tea Cheese",
    category: "Especiais",
    tagline: "Contraste dramático entre torra intensa e espuma salgada",
    description:
      "Chá preto intenso caramelizado com mascavo escuro, leite frio e cobertura generosa de cheese foam cremoso no topo.",
    price: 26.5,
    servingSize: "500 ml",
    temperature: "Gelado em camadas",
    sensoryProfile: {
      cremosidade: 92,
      docura: 70,
      intensidade: 95,
    },
    floatingIngredients: [
      {
        id: "ing-assam-intenso",
        label: "Assam Dupla Infusão",
        note: "Perfil amadeirado e profundo",
      },
      {
        id: "ing-mascavo-dirty",
        label: "Mascavo Caramelizado",
        note: "Riscas densas na parede do copo",
      },
      {
        id: "ing-cheese",
        label: "Cheese Foam Salgado",
        note: "Camada aerada de alta cremosidade",
      },
    ],
    visual: {
      variant: "dirty-cheese",
      liquidOpacity: 0.34,
      hasCheeseFoam: true,
      hasBrownSugarSwirl: true,
      pearlStyle: "none",
      iceCubeCount: 2,
    },
  },
  {
    id: "prod-mochi-duo",
    indexCode: "06",
    name: "Mochi Artesanal (2 un)",
    category: "Snacks",
    tagline: "Massa de arroz batida a vapor com recheio sedoso de taro",
    description:
      "Dupla de mochi macio de textura elástica preparado diariamente, recheado com creme de taro pouco doce para acompanhar seu chá.",
    price: 16.9,
    servingSize: "2 unidades",
    temperature: "Fresco artesanal",
    sensoryProfile: {
      cremosidade: 84,
      docura: 64,
      intensidade: 58,
    },
    floatingIngredients: [
      {
        id: "ing-mochi",
        label: "Massa de Mochi",
        note: "Arroz glutinoso cozido no vapor",
      },
      {
        id: "ing-recheio-taro",
        label: "Creme de Taro",
        note: "Recheio macio de baixa doçura",
      },
      {
        id: "ing-polvilho",
        label: "Finalização Seca",
        note: "Toque aveludado na superfície",
      },
    ],
    visual: {
      variant: "mochi-duo",
      liquidOpacity: 0.2,
      hasCheeseFoam: false,
      hasBrownSugarSwirl: false,
      pearlStyle: "none",
      iceCubeCount: 0,
    },
  },
] as const;

export const EXPLODED_CUP_LAYERS: readonly ExplodedCupLayer[] = [
  {
    id: "straw",
    order: "01",
    title: "Canudo Diagonal 12mm",
    subtitle: "Corte chanfrado para passagem livre",
    detail:
      "Calibre amplo desenhado para conduzir pérolas inteiras, espuma e chá em um só gole.",
    yOffsetStart: -26,
    scaleStart: 0.95,
    rotateStart: -6,
    activeFrom: 0,
    activeTo: 0.28,
  },
  {
    id: "lid",
    order: "02",
    title: "Tampa Dome Translúcida",
    subtitle: "Câmara de ar para a espuma superior",
    detail:
      "Preserva a textura aerada do cheese foam sem comprimir o topo da bebida.",
    yOffsetStart: -18,
    scaleStart: 0.96,
    rotateStart: -2.5,
    activeFrom: 0.05,
    activeTo: 0.35,
  },
  {
    id: "cheese-foam",
    order: "03",
    title: "Nuvem de Cheese Foam",
    subtitle: "Creme aerado com flor de sal",
    detail:
      "Batido em temperatura fria para contrastar salinidade delicada com o dulçor inferior.",
    yOffsetStart: -11,
    scaleStart: 0.98,
    rotateStart: 1.5,
    activeFrom: 0.18,
    activeTo: 0.56,
  },
  {
    id: "tea-ice",
    order: "04",
    title: "Chá Assam & Cubos de Gelo",
    subtitle: "Infusão concentrada de folhas inteiras",
    detail:
      "Extração térmica precisa resfriada sobre cubos cristalinos para manter o aroma limpo.",
    yOffsetStart: -4,
    scaleStart: 1,
    rotateStart: 0,
    activeFrom: 0.32,
    activeTo: 0.72,
  },
  {
    id: "brown-sugar",
    order: "05",
    title: "Redemoinho de Mascavo",
    subtitle: "Riscas caramelizadas em movimento lento",
    detail:
      "Calda espessa reduzida lentamente que cria desenhos orgânicos na parede interna.",
    yOffsetStart: 3,
    scaleStart: 0.98,
    rotateStart: 3,
    activeFrom: 0.48,
    activeTo: 0.85,
  },
  {
    id: "tapioca",
    order: "06",
    title: "Pérolas de Tapioca Preta",
    subtitle: "Cozimento lento e descanso no melado",
    detail:
      "Núcleo macio e elástico que assenta na base do copo mantendo o calor residual.",
    yOffsetStart: 10,
    scaleStart: 0.96,
    rotateStart: -1.5,
    activeFrom: 0.65,
    activeTo: 1,
  },
  {
    id: "cup",
    order: "07",
    title: "Copo Ki Bubble 500ml",
    subtitle: "Câmara de contenção de dupla espessura",
    detail:
      "Estrutura ergonômica transparente que acolhe todas as sete camadas em equilíbrio.",
    yOffsetStart: 17,
    scaleStart: 0.97,
    rotateStart: 0,
    activeFrom: 0.78,
    activeTo: 1,
  },
] as const;

export const EXPLODED_CUP_STAGES: readonly ExplodedCupStage[] = [
  {
    id: "stage-1",
    code: "01",
    label: "Dispersão",
    headline: "Sete elementos suspensos antes da união",
    summary:
      "Cada camada existe em estado independente: o canudo largo, a cúpula dome e a espuma salgada iniciam o percurso no alto.",
    progress: 0,
    highlightedLayers: ["straw", "lid", "cheese-foam"],
  },
  {
    id: "stage-2",
    code: "02",
    label: "Infusão",
    headline: "Chá Assam gelado encontra o xarope denso",
    summary:
      "Os cubos de gelo estabilizam a temperatura enquanto o redemoinho de açúcar mascavo começa a descer pela parede do copo.",
    progress: 0.36,
    highlightedLayers: ["tea-ice", "brown-sugar"],
  },
  {
    id: "stage-3",
    code: "03",
    label: "Assentamento",
    headline: "Pérolas de tapioca ocupam a base térmica",
    summary:
      "As pérolas cozidas repousam no fundo do copo, criando uma cama macia pronta para receber o contraste frio das camadas superiores.",
    progress: 0.72,
    highlightedLayers: ["tapioca", "cup"],
  },
  {
    id: "stage-4",
    code: "04",
    label: "Encaixe Completo",
    headline: "Alquimia selada em 100% de precisão",
    summary:
      "Tampa, espuma, chá, mascavo e tapioca convergem em uma única arquitetura pronta para o primeiro gole.",
    progress: 1,
    highlightedLayers: [
      "straw",
      "lid",
      "cheese-foam",
      "tea-ice",
      "brown-sugar",
      "tapioca",
      "cup",
    ],
  },
] as const;

export const ALCHEMY_BASES: readonly AlchemyOption<AlchemyBaseId>[] = [
  {
    id: "assam",
    label: "Chá Preto Assam",
    subtitle: "Notas amadeiradas e corpo intenso",
    sensoryDelta: { cremosidade: 58, docura: 50, intensidade: 90 },
  },
  {
    id: "matcha",
    label: "Matcha Japonês",
    subtitle: "Umami vegetal cremoso de colheita fina",
    sensoryDelta: { cremosidade: 76, docura: 48, intensidade: 86 },
  },
  {
    id: "taro",
    label: "Taro Cremoso",
    subtitle: "Aveludado com aroma suave de baunilha",
    sensoryDelta: { cremosidade: 94, docura: 72, intensidade: 62 },
  },
  {
    id: "frutado",
    label: "Frutado Tropical",
    subtitle: "Extração fria leve com purê de manga",
    sensoryDelta: { cremosidade: 28, docura: 70, intensidade: 68 },
  },
] as const;

export const ALCHEMY_TEXTURES: readonly AlchemyOption<AlchemyTextureId>[] = [
  {
    id: "tapioca",
    label: "Pérolas de Tapioca Preta",
    subtitle: "Mastigáveis, cozidas com melado escuro",
    sensoryDelta: { cremosidade: 12, docura: 16, intensidade: 8 },
  },
  {
    id: "popping",
    label: "Popping Boba de Morango",
    subtitle: "Esferas delicadas que explodem na boca",
    sensoryDelta: { cremosidade: 4, docura: 20, intensidade: 12 },
  },
] as const;

export const ALCHEMY_TOPPINGS: readonly AlchemyOption<AlchemyToppingId>[] = [
  {
    id: "cheese-foam",
    label: "Cheese Foam Salgado",
    subtitle: "Espuma densa que equilibra dulçor e sal",
    sensoryDelta: { cremosidade: 24, docura: 8, intensidade: 10 },
  },
  {
    id: "mascavo",
    label: "Calda de Mascavo",
    subtitle: "Redemoinho caramelizado de doçura profunda",
    sensoryDelta: { cremosidade: 10, docura: 26, intensidade: 14 },
  },
] as const;

const DRINK_BY_ID: Record<string, CatalogSpotlightItem> = Object.fromEntries(
  LANDING_CATALOG_ITEMS.map((item) => [item.id, item]),
);

function clampScore(value: number): number {
  return Math.max(15, Math.min(100, Math.round(value)));
}

function buildSensoryEstimate(
  base: AlchemyOption<AlchemyBaseId>,
  texture: AlchemyOption<AlchemyTextureId>,
  topping: AlchemyOption<AlchemyToppingId>,
): SensoryProfile {
  return {
    cremosidade: clampScore(
      base.sensoryDelta.cremosidade +
        texture.sensoryDelta.cremosidade * 0.45 +
        topping.sensoryDelta.cremosidade * 0.75,
    ),
    docura: clampScore(
      base.sensoryDelta.docura +
        texture.sensoryDelta.docura * 0.65 +
        topping.sensoryDelta.docura * 0.75,
    ),
    intensidade: clampScore(
      base.sensoryDelta.intensidade +
        texture.sensoryDelta.intensidade * 0.35 +
        topping.sensoryDelta.intensidade * 0.5,
    ),
  };
}

export function filterCatalogByCategory(
  category: CatalogFilterCategory,
): CatalogSpotlightItem[] {
  if (category === "Todos") {
    return [...LANDING_CATALOG_ITEMS];
  }
  return LANDING_CATALOG_ITEMS.filter((item) => item.category === category);
}

export function matchDrinkCombination(
  base: AlchemyBaseId,
  texture: AlchemyTextureId,
  topping: AlchemyToppingId,
): AlchemyRecommendation {
  const baseOption =
    ALCHEMY_BASES.find((item) => item.id === base) ?? ALCHEMY_BASES[0];
  const textureOption =
    ALCHEMY_TEXTURES.find((item) => item.id === texture) ?? ALCHEMY_TEXTURES[0];
  const toppingOption =
    ALCHEMY_TOPPINGS.find((item) => item.id === topping) ?? ALCHEMY_TOPPINGS[0];

  let drinkId = "prod-classic-milk";
  let matchBadge = "Afinidade Direta";
  let matchReason = "";

  if (base === "assam") {
    if (topping === "cheese-foam") {
      drinkId = "prod-dirty-cheese";
      if (texture === "tapioca") {
        matchBadge = "Afinidade Direta";
        matchReason =
          "O perfil encorpado do Assam com Cheese Foam Salgado define o Dirty Black Tea Cheese; inclua pérolas de tapioca preta para completar a textura.";
      } else {
        matchBadge = "Variação Autoral";
        matchReason =
          "A base intensa de Assam com Cheese Foam remete ao Dirty Black Tea Cheese, contrastada pelo estalo frutado do Popping Boba de Morango.";
      }
    } else {
      drinkId = "prod-classic-milk";
      if (texture === "tapioca") {
        matchBadge = "Combinação Assinatura";
        matchReason =
          "Equivalência exata: Chá Preto Assam, pérolas de tapioca preta e calda de mascavo formam a receita original do Classic Brown Sugar Boba.";
      } else {
        matchBadge = "Variação Autoral";
        matchReason =
          "Construído sobre a base clássica do Classic Brown Sugar Boba com mascavo, trocando a tapioca pela leveza cítrica do Popping Boba de Morango.";
      }
    }
  } else if (base === "matcha") {
    drinkId = "prod-matcha-latte";
    if (texture === "tapioca" && topping === "cheese-foam") {
      matchBadge = "Combinação Assinatura";
      matchReason =
        "Equivalência exata: Matcha Japonês, pérolas de tapioca preta e Cheese Foam Salgado reproduzem integralmente o Matcha Cream Boba.";
    } else if (texture === "tapioca" && topping === "mascavo") {
      matchBadge = "Variação Autoral";
      matchReason =
        "Parte do nosso Matcha Cream Boba com tapioca preta, substituindo o topo salgado pelo calor tostado da Calda de Mascavo.";
    } else if (texture === "popping" && topping === "cheese-foam") {
      matchBadge = "Variação Autoral";
      matchReason =
        "Une o Matcha Japonês e o Cheese Foam do Matcha Cream Boba com o contraste refrescante do Popping Boba de Morango.";
    } else {
      matchBadge = "Descoberta do Laboratório";
      matchReason =
        "Tem o Matcha Cream Boba como núcleo herbal, reinterpretado com Popping Boba de Morango e doçura profunda de Calda de Mascavo.";
    }
  } else if (base === "taro") {
    drinkId = "prod-taro-velvet";
    if (texture === "tapioca" && topping === "mascavo") {
      matchBadge = "Afinidade Direta";
      matchReason =
        "Base fiel ao Taro Velvet Milk Tea com pérolas de tapioca preta, enriquecida por veios caramelizados de Calda de Mascavo.";
    } else if (texture === "tapioca" && topping === "cheese-foam") {
      matchBadge = "Afinidade Direta";
      matchReason =
        "Amplia a cremosidade natural do Taro Velvet Milk Tea e suas pérolas de tapioca com o acabamento aerado do Cheese Foam Salgado.";
    } else if (texture === "popping" && topping === "cheese-foam") {
      matchBadge = "Variação Autoral";
      matchReason =
        "A base sedosa do Taro Velvet Milk Tea recebe esferas de morango e topo salgado de Cheese Foam para um contraste contemporâneo.";
    } else {
      matchBadge = "Variação Autoral";
      matchReason =
        "Mantém a alma cremosa do Taro Velvet Milk Tea combinando Popping Boba de Morango e Calda de Mascavo.";
    }
  } else {
    drinkId = "prod-mango-pop";
    if (texture === "popping" && topping === "cheese-foam") {
      matchBadge = "Afinidade Direta";
      matchReason =
        "Traduz o frescor do Mango Popping Refresh com Popping Boba de Morango, ganhando contraste cremoso com Cheese Foam Salgado.";
    } else if (texture === "popping" && topping === "mascavo") {
      matchBadge = "Afinidade Direta";
      matchReason =
        "Preserva a dupla tropical do Mango Popping Refresh e Popping Boba de Morango com um toque final de Calda de Mascavo.";
    } else if (texture === "tapioca" && topping === "cheese-foam") {
      matchBadge = "Variação Autoral";
      matchReason =
        "Reimagina o Mango Popping Refresh em versão mais encorpada com pérolas de tapioca preta e cobertura de Cheese Foam.";
    } else {
      matchBadge = "Descoberta do Laboratório";
      matchReason =
        "Usa o Mango Popping Refresh como base frutada e adiciona corpo artesanal com pérolas de tapioca e Calda de Mascavo.";
    }
  }

  const recommendedDrink = DRINK_BY_ID[drinkId] ?? LANDING_CATALOG_ITEMS[0];

  return {
    selection: { base, texture, topping },
    baseOption,
    textureOption,
    toppingOption,
    recommendedDrink,
    matchBadge,
    matchReason,
    layerBreakdown: [
      `Topo: ${toppingOption.label}`,
      `Corpo: ${baseOption.label}`,
      `Base: ${textureOption.label}`,
    ],
    sensoryEstimate: buildSensoryEstimate(
      baseOption,
      textureOption,
      toppingOption,
    ),
  };
}
