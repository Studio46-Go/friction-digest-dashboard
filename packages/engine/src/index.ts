/**
 * @studio46/mfp-engine
 *
 * MFP Engine - Complete Mathematical Flavor Profile engine
 * Part of the Mathematical Flavor Profile Architecture
 */

// Re-export core types and functions for convenience
export {
  // Types
  FlavorDimension,
  FLAVOR_DIMENSIONS,
  type FlavorVector,
  flavorVector,
  StructuralRole,
  SolubilityClass,
  IngredientClass,
  type IngredientCard,
  type DishIngredient,
  CookingMethod,
  DishType,
  type ScoreComponents,
  type ScoredResult,
  type Recommendation,
  type MFPEngineOutput,
  RegionTag,
  AATag,
  CalibrationStatus,
  type IngredientMetadata,
  // Core functions
  computeDishVector,
  computeSimilarity,
  computeBalanceScore,
  evaluateStructuralCoverage,
  computeClashPenalty,
  computeFinalScore,
} from "@studio46/mfp-core";

// Re-export data for convenience
export {
  INGREDIENT_LIBRARY,
  getIngredient,
  getAllIngredients,
  STYLE_TARGETS,
  getStyleTarget,
  getStyleTargetIds,
  type StyleTarget,
  AA_INGREDIENT_LIBRARY,
  countByAATag,
  getByRegion,
} from "@studio46/mfp-data";

// Export engine
export { runMFPEngine, type MFPEngineInput } from "./engine/mfp-engine.js";
