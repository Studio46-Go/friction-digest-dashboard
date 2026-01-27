/**
 * MFP v1.1 - Mathematical Flavor Profile Architecture
 *
 * ARTIFACT ID: MFP.MATHEMATICAL.FLAVOR.PROFILE.ARCHITECTURE.CANONICAL.v1.1
 * STATUS: CANONICAL / PRODUCTION-READY / ML400-CERTIFIED
 * PROTOCOL: Deterministic / Quantitative / Role-Aware
 */

// Types
export {
  FlavorDimension,
  FLAVOR_DIMENSION_LABELS,
  FLAVOR_DIMENSIONS,
  type FlavorVector,
  createFlavorVector,
  flavorVector,
  StructuralRole,
  SolubilityClass,
  IngredientClass,
  ComponentCategory,
  getComponentCategory,
  type IngredientCard,
  type DishIngredient,
  CookingMethod,
  DishType,
  type ScoreComponents,
  type ScoredResult,
  type IngredientContribution,
  type StructuralGateResult,
  type Recommendation,
  type MFPEngineOutput,
} from "./types/index.js";

// Core computation
export {
  computeAlpha,
  getNormalizationConstants,
  applyMethodKernel,
  dot,
  norm,
  normInf,
  cosineSimilarity,
  addVectors,
  subtractVectors,
  scaleVector,
  absVector,
  normalizeToProfile,
  bankersRound,
  withinTolerance,
  EPSILON_ABS,
  EPSILON_REL,
  computeDishVector,
  type DishComputationConfig,
  type DishComputationResult,
  computeSimilarity,
  computeBalanceScore,
  evaluateStructuralCoverage,
  computeClashPenalty,
  computeFinalScore,
  interpretScore,
  findBestAddIns,
  findMinimalFixes,
  findSubstitutions,
  findMethodAdjustments,
  type RecommendationContext,
} from "./core/index.js";

// Data
export {
  INGREDIENT_LIBRARY,
  getIngredient,
  getAllIngredients,
  STYLE_TARGETS,
  getStyleTarget,
  getStyleTargetIds,
  type StyleTarget,
} from "./data/index.js";

// Engine
export { runMFPEngine, type MFPEngineInput } from "./engine/index.js";
