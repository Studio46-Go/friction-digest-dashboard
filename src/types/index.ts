export {
  FlavorDimension,
  FLAVOR_DIMENSION_LABELS,
  FLAVOR_DIMENSIONS,
  type FlavorVector,
  createFlavorVector,
  flavorVector,
} from "./flavor-space.js";

export {
  StructuralRole,
  SolubilityClass,
  IngredientClass,
  ComponentCategory,
  getComponentCategory,
  type IngredientCard,
  type DishIngredient,
} from "./ingredient.js";

export { CookingMethod, DishType } from "./method.js";

export type {
  ScoreComponents,
  ScoredResult,
  IngredientContribution,
  StructuralGateResult,
  Recommendation,
  MFPEngineOutput,
} from "./scoring.js";

export {
  RegionTag,
  AATag,
  CalibrationStatus,
  type IngredientMetadata,
} from "./ingredient-metadata.js";
