/**
 * @studio46/mfp-core
 *
 * MFP Core - Types, math primitives, and scoring algorithms
 * Part of the Mathematical Flavor Profile Architecture
 */

// ─── Types ─────────────────────────────────────────────────────────────────
export {
  FlavorDimension,
  FLAVOR_DIMENSION_LABELS,
  FLAVOR_DIMENSIONS,
  type FlavorVector,
  createFlavorVector,
  flavorVector,
} from "./types/flavor-space.js";

export {
  StructuralRole,
  SolubilityClass,
  IngredientClass,
  ComponentCategory,
  getComponentCategory,
  type IngredientCard,
  type DishIngredient,
} from "./types/ingredient.js";

export { CookingMethod, DishType } from "./types/method.js";

export type {
  ScoreComponents,
  ScoredResult,
  IngredientContribution,
  StructuralGateResult,
  Recommendation,
  MFPEngineOutput,
} from "./types/scoring.js";

export {
  RegionTag,
  AATag,
  CalibrationStatus,
  type IngredientMetadata,
} from "./types/ingredient-metadata.js";

// ─── Core Math ─────────────────────────────────────────────────────────────
export {
  dot,
  norm,
  cosineSimilarity,
  bankersRound,
  withinTolerance,
} from "./core/vector-math.js";

export {
  computeAlpha,
  getNormalizationConstants,
  type NormalizationConstants,
} from "./core/normalization.js";

export {
  applyMethodKernel,
  getMethodMultipliers,
  type MethodMultipliers,
} from "./core/method-kernel.js";

export {
  computeDishVector,
  type DishComputationConfig,
  type DishComputationResult,
} from "./core/dish-computation.js";

export {
  computeSimilarity,
  computeBalanceScore,
  evaluateStructuralCoverage,
  computeClashPenalty,
  computeFinalScore,
  REQUIRED_ROLES_BY_DISH_TYPE,
  CLASH_MATRIX,
} from "./core/scoring.js";

export {
  findBestAddIns,
  findMinimalFixes,
  findSubstitutions,
  findMethodAdjustments,
  type RecommendationContext,
} from "./core/recommendations.js";
