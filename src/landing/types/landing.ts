export type CatalogItemCategory =
  | "Clássicos"
  | "Especiais"
  | "Frutados"
  | "Snacks";

export type CatalogFilterCategory = "Todos" | CatalogItemCategory;

export interface SensoryProfile {
  cremosidade: number;
  docura: number;
  intensidade: number;
}

export interface FloatingIngredient {
  id: string;
  label: string;
  note: string;
}

export type SpotlightIllustrationVariant =
  | "brown-sugar-swirl"
  | "matcha-foam"
  | "taro-velvet"
  | "mango-popping"
  | "dirty-cheese"
  | "mochi-duo";

export interface CatalogVisualConfig {
  variant: SpotlightIllustrationVariant;
  liquidOpacity: number;
  hasCheeseFoam: boolean;
  hasBrownSugarSwirl: boolean;
  pearlStyle: "tapioca" | "popping" | "none";
  iceCubeCount: number;
}

export interface CatalogSpotlightItem {
  id: string;
  indexCode: string;
  name: string;
  category: CatalogItemCategory;
  tagline: string;
  description: string;
  price: number;
  servingSize: string;
  temperature: string;
  sensoryProfile: SensoryProfile;
  floatingIngredients: FloatingIngredient[];
  visual: CatalogVisualConfig;
}

export type ExplodedCupLayerId =
  | "straw"
  | "lid"
  | "cheese-foam"
  | "tea-ice"
  | "brown-sugar"
  | "tapioca"
  | "cup";

export interface ExplodedCupLayer {
  id: ExplodedCupLayerId;
  order: string;
  title: string;
  subtitle: string;
  detail: string;
  yOffsetStart: number;
  scaleStart: number;
  rotateStart: number;
  activeFrom: number;
  activeTo: number;
}

export interface ExplodedCupStage {
  id: string;
  code: string;
  label: string;
  headline: string;
  summary: string;
  progress: number;
  highlightedLayers: ExplodedCupLayerId[];
}

export type AlchemyBaseId = "assam" | "matcha" | "taro" | "frutado";
export type AlchemyTextureId = "tapioca" | "popping";
export type AlchemyToppingId = "cheese-foam" | "mascavo";

export interface AlchemyOption<T extends string> {
  id: T;
  label: string;
  subtitle: string;
  sensoryDelta: SensoryProfile;
}

export interface AlchemySelection {
  base: AlchemyBaseId;
  texture: AlchemyTextureId;
  topping: AlchemyToppingId;
}

export interface AlchemyRecommendation {
  selection: AlchemySelection;
  baseOption: AlchemyOption<AlchemyBaseId>;
  textureOption: AlchemyOption<AlchemyTextureId>;
  toppingOption: AlchemyOption<AlchemyToppingId>;
  recommendedDrink: CatalogSpotlightItem;
  matchBadge: string;
  matchReason: string;
  layerBreakdown: string[];
  sensoryEstimate: SensoryProfile;
}
