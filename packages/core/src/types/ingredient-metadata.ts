/**
 * MFP v1.1 - Ingredient Metadata Extensions
 *
 * Supports cultural foodways indexing, regional tagging,
 * calibration tracking, and variant management.
 *
 * ARTIFACT: AA.CORE.INGREDIENT.INDEX.v1.0
 */

/** Geographic region tags */
export enum RegionTag {
  MIDWEST = "MIDWEST",
  GULF_AL = "GULF_AL",
  GULF_MS = "GULF_MS",
  GULF_LA = "GULF_LA",
  SHARED_US_PANTRY = "SHARED_US_PANTRY",
}

/** African American foodways cultural tags */
export enum AATag {
  AA_CORE = "AA_CORE",
  AA_PRESERVING_PICKLING = "AA_PRESERVING_PICKLING",
  AA_BAKING_DESSERT = "AA_BAKING_DESSERT",
  AA_POTLIKKER_GREENS = "AA_POTLIKKER_GREENS",
  AA_LEGUMES_FIELDPEAS = "AA_LEGUMES_FIELDPEAS",
  AA_GULF_CREOLE_COAST = "AA_GULF_CREOLE_COAST",
  AA_MIDWEST_MIGRATION = "AA_MIDWEST_MIGRATION",
  AA_SEAFOOD_GULF = "AA_SEAFOOD_GULF",
  AA_RICE_CORN_SYSTEM = "AA_RICE_CORN_SYSTEM",
  AA_PEANUT_GROUNDNUT = "AA_PEANUT_GROUNDNUT",
  AA_WHOLE_HOG_CHEAPCUTS = "AA_WHOLE_HOG_CHEAPCUTS",
}

/**
 * Calibration status for ingredient data quality.
 *
 * A = Sensory panel validated (n≥10)
 * B = Database grounded (USDA/literature)
 * C = Prior estimate (culinary knowledge)
 */
export enum CalibrationStatus {
  A = "A",
  B = "B",
  C = "C",
}

/** Ingredient metadata for cultural foodways indexing */
export interface IngredientMetadata {
  /** Canonical ID from the ingredient index (e.g., "veg.collard_greens") */
  canonicalId: string;

  /** Ingredient category (e.g., "vegetable", "protein", "spice") */
  category: string;

  /** Geographic region tags */
  regionTags: RegionTag[];

  /** African American foodways tags */
  aaTags: AATag[];

  /** Required variants for full coverage */
  variants: string[];

  /** Data quality calibration status */
  calibrationStatus: CalibrationStatus;
}
