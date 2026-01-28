/**
 * AA.CORE.INGREDIENT.INDEX.v1.0 - African American Foodways Ingredient Library
 *
 * Midwest US + Gulf States (Alabama, Mississippi, Louisiana)
 * All entries: calibration_status=C (prior estimates pending sensory/database calibration)
 *
 * Vector format: [UMAMI, SALT, SWEET, SOUR, BITTER, HEAT_PEPPER, WARM_SPICE,
 *   SMOKE, ROASTED, FAT_RICH, CREAMY, HERBAL, CITRUS, ALLIUM, FERMENT,
 *   EARTHY, NUTTY, FLORAL, TEXTURE_CRISP, TEXTURE_TENDER]
 */

import { flavorVector } from "../types/flavor-space.js";
import {
  StructuralRole,
  SolubilityClass,
  IngredientClass,
} from "../types/ingredient.js";
import type { IngredientCard } from "../types/ingredient.js";
import {
  RegionTag,
  AATag,
  CalibrationStatus,
  type IngredientMetadata,
} from "../types/ingredient-metadata.js";

// ─── Helper Functions ───────────────────────────────────────────────────────

function aaCard(
  canonicalId: string,
  name: string,
  vector: number[],
  potency: number,
  volatility: number,
  solubility: SolubilityClass,
  roles: StructuralRole[],
  ingredientClass: IngredientClass,
  category: string,
  regionTags: RegionTag[],
  aaTags: AATag[],
  variants: string[]
): IngredientCard {
  const metadata: IngredientMetadata = {
    canonicalId,
    category,
    regionTags,
    aaTags,
    variants,
    calibrationStatus: CalibrationStatus.C,
  };
  return {
    id: canonicalId,
    name,
    vector: flavorVector(vector),
    potency,
    volatility,
    solubility,
    roles: new Set(roles),
    ingredientClass,
    metadata,
  };
}

// Shorthand for common region combinations
const GULF_ALL: RegionTag[] = [RegionTag.GULF_AL, RegionTag.GULF_MS, RegionTag.GULF_LA];
const GULF_MW: RegionTag[] = [...GULF_ALL, RegionTag.MIDWEST];
const ALL_REGIONS: RegionTag[] = [...GULF_MW, RegionTag.SHARED_US_PANTRY];

// ─── A) GREENS + VEGETABLE CORE ─────────────────────────────────────────────

const GREENS_VEGETABLES: IngredientCard[] = [
  aaCard("veg.collard_greens", "Collard greens",
    [0.5, 0.0, 0.0, 0.0, 1.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 1.5, 0.0, 0.0, 0.0, 3.0],
    0.5, 0.15, SolubilityClass.WATER, [StructuralRole.VEGETABLE], IngredientClass.BITTER_GREEN,
    "vegetable", GULF_MW, [AATag.AA_CORE, AATag.AA_POTLIKKER_GREENS, AATag.AA_MIDWEST_MIGRATION],
    ["fresh", "frozen", "chopped"]),

  aaCard("veg.mustard_greens", "Mustard greens",
    [0.3, 0.0, 0.0, 0.0, 2.0, 0.8, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 2.5],
    0.55, 0.2, SolubilityClass.WATER, [StructuralRole.VEGETABLE], IngredientClass.BITTER_GREEN,
    "vegetable", GULF_MW, [AATag.AA_CORE, AATag.AA_POTLIKKER_GREENS, AATag.AA_MIDWEST_MIGRATION],
    ["fresh", "frozen"]),

  aaCard("veg.turnip_greens", "Turnip greens",
    [0.3, 0.0, 0.0, 0.0, 2.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 1.5, 0.0, 0.0, 0.0, 2.5],
    0.5, 0.15, SolubilityClass.WATER, [StructuralRole.VEGETABLE], IngredientClass.BITTER_GREEN,
    "vegetable", GULF_ALL, [AATag.AA_CORE, AATag.AA_POTLIKKER_GREENS], ["fresh"]),

  aaCard("veg.kale", "Kale",
    [0.3, 0.0, 0.3, 0.0, 1.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 1.5, 0.0, 0.0, 0.5, 2.0],
    0.5, 0.15, SolubilityClass.WATER, [StructuralRole.VEGETABLE], IngredientClass.BITTER_GREEN,
    "vegetable", [RegionTag.MIDWEST, RegionTag.SHARED_US_PANTRY],
    [AATag.AA_POTLIKKER_GREENS, AATag.AA_MIDWEST_MIGRATION], ["fresh"]),

  aaCard("veg.cabbage_green", "Green cabbage",
    [0.0, 0.0, 1.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 2.0, 2.0],
    0.4, 0.1, SolubilityClass.WATER, [StructuralRole.VEGETABLE], IngredientClass.CRUCIFEROUS,
    "vegetable", [RegionTag.MIDWEST, RegionTag.GULF_AL, RegionTag.GULF_MS, RegionTag.SHARED_US_PANTRY],
    [AATag.AA_CORE], ["fresh"]),

  aaCard("veg.okra", "Okra",
    [0.3, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.3, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.5, 3.0],
    0.45, 0.1, SolubilityClass.WATER, [StructuralRole.VEGETABLE], IngredientClass.NEUTRAL,
    "vegetable", GULF_ALL, [AATag.AA_CORE, AATag.AA_GULF_CREOLE_COAST], ["fresh", "frozen", "sliced"]),

  aaCard("veg.sweet_potato", "Sweet potato (yams)",
    [0.3, 0.0, 3.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 1.5, 0.0, 0.0, 0.0, 0.0, 1.5, 0.0, 0.0, 0.0, 3.5],
    0.55, 0.1, SolubilityClass.WATER, [StructuralRole.VEGETABLE, StructuralRole.STARCH], IngredientClass.NEUTRAL,
    "vegetable", GULF_MW, [AATag.AA_CORE, AATag.AA_BAKING_DESSERT, AATag.AA_MIDWEST_MIGRATION],
    ["raw", "baked", "candied"]),

  aaCard("veg.corn_kernels", "Corn kernels",
    [0.0, 0.0, 2.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 1.0, 2.0],
    0.45, 0.1, SolubilityClass.WATER, [StructuralRole.VEGETABLE], IngredientClass.NEUTRAL,
    "vegetable", [RegionTag.MIDWEST, RegionTag.GULF_AL, RegionTag.GULF_MS, RegionTag.SHARED_US_PANTRY],
    [AATag.AA_CORE, AATag.AA_RICE_CORN_SYSTEM], ["fresh", "frozen", "canned"]),

  aaCard("veg.green_beans", "Green beans",
    [0.0, 0.0, 0.5, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 1.5, 2.0],
    0.4, 0.1, SolubilityClass.WATER, [StructuralRole.VEGETABLE], IngredientClass.NEUTRAL,
    "vegetable", [RegionTag.MIDWEST, RegionTag.GULF_AL, RegionTag.GULF_MS, RegionTag.SHARED_US_PANTRY],
    [AATag.AA_CORE], ["fresh", "frozen", "canned"]),
];

// ─── B) AROMATICS ───────────────────────────────────────────────────────────

const AROMATICS: IngredientCard[] = [
  aaCard("aro.onion_white", "White onion",
    [0.3, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 3.5, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0],
    0.6, 0.4, SolubilityClass.WATER, [StructuralRole.AROMATIC], IngredientClass.ALLIUM_CLASS,
    "aromatic", [RegionTag.SHARED_US_PANTRY, RegionTag.GULF_LA], [AATag.AA_CORE], ["fresh"]),

  aaCard("aro.celery", "Celery",
    [0.0, 0.3, 0.3, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.5, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 1.5, 0.5],
    0.4, 0.3, SolubilityClass.WATER, [StructuralRole.AROMATIC], IngredientClass.NEUTRAL,
    "aromatic", [RegionTag.MIDWEST, RegionTag.GULF_LA, RegionTag.SHARED_US_PANTRY],
    [AATag.AA_CORE, AATag.AA_GULF_CREOLE_COAST], ["fresh", "diced"]),

  aaCard("aro.bell_pepper_green", "Green bell pepper",
    [0.0, 0.0, 1.5, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0, 1.0],
    0.45, 0.25, SolubilityClass.WATER, [StructuralRole.AROMATIC, StructuralRole.VEGETABLE], IngredientClass.NEUTRAL,
    "aromatic", [RegionTag.GULF_LA, RegionTag.GULF_MS, RegionTag.SHARED_US_PANTRY],
    [AATag.AA_CORE, AATag.AA_GULF_CREOLE_COAST], ["fresh", "diced"]),

  aaCard("aro.scallion", "Scallion / green onion",
    [0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 3.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0],
    0.55, 0.5, SolubilityClass.WATER, [StructuralRole.AROMATIC, StructuralRole.GARNISH], IngredientClass.ALLIUM_CLASS,
    "aromatic", [RegionTag.GULF_LA, RegionTag.MIDWEST, RegionTag.SHARED_US_PANTRY],
    [AATag.AA_CORE, AATag.AA_GULF_CREOLE_COAST], ["fresh", "tops_only"]),

  aaCard("aro.jalapeno", "Jalapeño",
    [0.0, 0.0, 0.5, 0.0, 0.0, 3.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.5, 0.5],
    0.75, 0.4, SolubilityClass.WATER, [StructuralRole.AROMATIC, StructuralRole.HEAT_AGENT], IngredientClass.SPICY,
    "aromatic", [RegionTag.GULF_LA, RegionTag.MIDWEST, RegionTag.SHARED_US_PANTRY],
    [AATag.AA_CORE], ["fresh", "pickled"]),

  aaCard("aro.cayenne_fresh", "Cayenne pepper (fresh)",
    [0.0, 0.0, 0.0, 0.0, 0.0, 4.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0],
    0.85, 0.3, SolubilityClass.WATER, [StructuralRole.HEAT_AGENT], IngredientClass.SPICY,
    "aromatic", GULF_ALL, [AATag.AA_CORE], ["fresh"]),
];

// ─── C) PROTEINS ────────────────────────────────────────────────────────────

const PROTEINS: IngredientCard[] = [
  aaCard("pro.chicken_thigh", "Chicken thigh",
    [2.5, 0.5, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 2.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 3.5],
    0.75, 0.1, SolubilityClass.WATER, [StructuralRole.PROTEIN], IngredientClass.NEUTRAL,
    "protein", ALL_REGIONS, [AATag.AA_CORE, AATag.AA_MIDWEST_MIGRATION], ["bone_in_skin_on", "boneless_skinless"]),

  aaCard("pro.chicken_wings", "Chicken wings",
    [2.0, 0.5, 0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 1.5, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.5],
    0.65, 0.1, SolubilityClass.WATER, [StructuralRole.PROTEIN], IngredientClass.NEUTRAL,
    "protein", [RegionTag.MIDWEST, RegionTag.SHARED_US_PANTRY],
    [AATag.AA_CORE, AATag.AA_MIDWEST_MIGRATION], ["whole", "flats_drums"]),

  aaCard("pro.turkey_smoked_parts", "Smoked turkey parts",
    [3.0, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 3.5, 1.0, 1.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 3.5],
    0.8, 0.15, SolubilityClass.WATER, [StructuralRole.PROTEIN, StructuralRole.UMAMI_BOOST], IngredientClass.NEUTRAL,
    "protein", [RegionTag.MIDWEST, RegionTag.GULF_AL, RegionTag.GULF_MS, RegionTag.SHARED_US_PANTRY],
    [AATag.AA_CORE, AATag.AA_POTLIKKER_GREENS, AATag.AA_MIDWEST_MIGRATION], ["leg", "wing", "neck"]),

  aaCard("pro.pork_bacon", "Bacon",
    [2.5, 3.0, 0.3, 0.0, 0.0, 0.0, 0.0, 3.5, 1.5, 4.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 3.5, 0.5],
    0.9, 0.3, SolubilityClass.FAT, [StructuralRole.PROTEIN, StructuralRole.FAT], IngredientClass.PORK_CURED,
    "protein", ALL_REGIONS, [AATag.AA_CORE, AATag.AA_WHOLE_HOG_CHEAPCUTS], ["smoked", "thick_cut"]),

  aaCard("pro.pork_ham", "Ham",
    [2.5, 3.0, 0.5, 0.0, 0.0, 0.0, 0.0, 2.0, 0.5, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 3.0],
    0.75, 0.15, SolubilityClass.WATER, [StructuralRole.PROTEIN], IngredientClass.PORK_CURED,
    "protein", ALL_REGIONS, [AATag.AA_CORE], ["cured", "smoked"]),

  aaCard("pro.pork_ham_hock", "Ham hock",
    [3.5, 3.0, 0.0, 0.0, 0.0, 0.0, 0.0, 3.5, 0.5, 3.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 4.0],
    0.85, 0.15, SolubilityClass.WATER, [StructuralRole.PROTEIN, StructuralRole.UMAMI_BOOST, StructuralRole.FAT], IngredientClass.PORK_CURED,
    "protein", GULF_MW, [AATag.AA_CORE, AATag.AA_POTLIKKER_GREENS, AATag.AA_WHOLE_HOG_CHEAPCUTS], ["smoked"]),

  aaCard("pro.pork_salt_pork", "Salt pork",
    [1.5, 4.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 4.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.5],
    0.8, 0.05, SolubilityClass.FAT, [StructuralRole.PROTEIN, StructuralRole.FAT], IngredientClass.PORK_CURED,
    "protein", [RegionTag.GULF_AL, RegionTag.GULF_MS, RegionTag.GULF_LA, RegionTag.SHARED_US_PANTRY],
    [AATag.AA_CORE, AATag.AA_WHOLE_HOG_CHEAPCUTS], ["cured"]),

  aaCard("pro.pork_fatback", "Fatback",
    [0.5, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 5.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0],
    0.6, 0.03, SolubilityClass.FAT, [StructuralRole.FAT], IngredientClass.PORK_CURED,
    "protein", [RegionTag.GULF_AL, RegionTag.GULF_MS, RegionTag.SHARED_US_PANTRY],
    [AATag.AA_CORE, AATag.AA_WHOLE_HOG_CHEAPCUTS], ["cured"]),

  aaCard("pro.pork_jowl", "Pork jowl",
    [2.0, 2.5, 0.3, 0.0, 0.0, 0.0, 0.0, 2.5, 1.0, 4.5, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 2.0],
    0.8, 0.15, SolubilityClass.FAT, [StructuralRole.PROTEIN, StructuralRole.FAT], IngredientClass.PORK_CURED,
    "protein", [RegionTag.GULF_AL, RegionTag.GULF_MS, RegionTag.SHARED_US_PANTRY],
    [AATag.AA_CORE, AATag.AA_WHOLE_HOG_CHEAPCUTS], ["cured", "smoked"]),

  aaCard("pro.pork_neckbones", "Pork neck bones",
    [3.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.5, 0.5, 0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 4.0],
    0.7, 0.05, SolubilityClass.WATER, [StructuralRole.PROTEIN, StructuralRole.UMAMI_BOOST], IngredientClass.OFFAL,
    "protein", [RegionTag.GULF_AL, RegionTag.GULF_MS, RegionTag.MIDWEST],
    [AATag.AA_CORE, AATag.AA_WHOLE_HOG_CHEAPCUTS], ["raw", "smoked"]),

  aaCard("pro.pork_pig_feet", "Pig's feet",
    [2.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.5, 0.5, 0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 4.5],
    0.55, 0.03, SolubilityClass.WATER, [StructuralRole.PROTEIN], IngredientClass.OFFAL,
    "protein", [RegionTag.GULF_AL, RegionTag.GULF_MS],
    [AATag.AA_CORE, AATag.AA_WHOLE_HOG_CHEAPCUTS], ["raw", "pickled"]),

  aaCard("pro.beef_oxtail", "Oxtail",
    [4.0, 0.5, 0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 3.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 4.5],
    0.9, 0.1, SolubilityClass.WATER, [StructuralRole.PROTEIN, StructuralRole.UMAMI_BOOST], IngredientClass.RED_MEAT,
    "protein", [RegionTag.MIDWEST, RegionTag.GULF_AL, RegionTag.GULF_MS],
    [AATag.AA_CORE, AATag.AA_WHOLE_HOG_CHEAPCUTS, AATag.AA_MIDWEST_MIGRATION], ["raw"]),

  aaCard("pro.sausage_andouille", "Andouille sausage",
    [3.0, 2.0, 0.0, 0.0, 0.0, 2.5, 1.0, 3.5, 1.5, 3.0, 0.0, 0.0, 0.0, 1.5, 0.0, 0.0, 0.0, 0.0, 1.0, 2.5],
    0.85, 0.25, SolubilityClass.FAT, [StructuralRole.PROTEIN, StructuralRole.AROMATIC], IngredientClass.PORK_CURED,
    "protein", [RegionTag.GULF_LA], [AATag.AA_CORE, AATag.AA_GULF_CREOLE_COAST], ["smoked"]),

  aaCard("pro.pork_tasso", "Tasso",
    [3.5, 2.5, 0.0, 0.0, 0.0, 3.0, 1.5, 4.0, 1.5, 2.5, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 2.0],
    0.9, 0.2, SolubilityClass.FAT, [StructuralRole.PROTEIN, StructuralRole.AROMATIC, StructuralRole.HEAT_AGENT], IngredientClass.PORK_CURED,
    "protein", [RegionTag.GULF_LA], [AATag.AA_GULF_CREOLE_COAST], ["smoked"]),

  aaCard("pro.fish_catfish", "Catfish",
    [1.5, 0.2, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.3, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 3.5],
    0.6, 0.15, SolubilityClass.WATER, [StructuralRole.PROTEIN], IngredientClass.FISHY,
    "protein", GULF_MW, [AATag.AA_CORE, AATag.AA_MIDWEST_MIGRATION, AATag.AA_SEAFOOD_GULF], ["fillet", "whole"]),

  aaCard("pro.sea_crab", "Crab",
    [3.0, 1.0, 1.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 3.0],
    0.75, 0.2, SolubilityClass.WATER, [StructuralRole.PROTEIN], IngredientClass.SHELLFISH,
    "protein", GULF_ALL, [AATag.AA_GULF_CREOLE_COAST, AATag.AA_SEAFOOD_GULF], ["lump", "claws", "shells_for_stock"]),

  aaCard("pro.sea_oyster", "Oyster",
    [4.0, 2.0, 0.3, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0, 1.5, 1.5, 0.0, 0.0, 0.0, 4.0],
    0.8, 0.25, SolubilityClass.WATER, [StructuralRole.PROTEIN], IngredientClass.SHELLFISH,
    "protein", GULF_ALL, [AATag.AA_GULF_CREOLE_COAST, AATag.AA_SEAFOOD_GULF], ["shucked"]),

  aaCard("pro.sea_crawfish", "Crawfish",
    [2.5, 0.8, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 3.0],
    0.7, 0.2, SolubilityClass.WATER, [StructuralRole.PROTEIN], IngredientClass.SHELLFISH,
    "protein", [RegionTag.GULF_LA], [AATag.AA_GULF_CREOLE_COAST, AATag.AA_SEAFOOD_GULF], ["tails", "shells_for_stock"]),
];

// ─── D) STOCKS ──────────────────────────────────────────────────────────────

const STOCKS: IngredientCard[] = [
  aaCard("base.chicken_stock", "Chicken stock/broth",
    [2.5, 1.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.5, 0.0, 0.3, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5],
    0.5, 0.1, SolubilityClass.WATER, [StructuralRole.LIQUID_BASE, StructuralRole.UMAMI_BOOST], IngredientClass.NEUTRAL,
    "base", ALL_REGIONS, [AATag.AA_CORE], ["homemade", "store_bought_low_sodium"]),

  aaCard("base.shrimp_stock", "Shrimp stock",
    [3.5, 1.5, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    0.6, 0.15, SolubilityClass.WATER, [StructuralRole.LIQUID_BASE, StructuralRole.UMAMI_BOOST], IngredientClass.SHELLFISH,
    "base", GULF_ALL, [AATag.AA_GULF_CREOLE_COAST, AATag.AA_SEAFOOD_GULF], ["shells_based"]),

  aaCard("base.seafood_stock", "Seafood stock",
    [3.0, 1.5, 0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0],
    0.55, 0.15, SolubilityClass.WATER, [StructuralRole.LIQUID_BASE, StructuralRole.UMAMI_BOOST], IngredientClass.FISHY,
    "base", GULF_ALL, [AATag.AA_GULF_CREOLE_COAST, AATag.AA_SEAFOOD_GULF], ["fishbones_based", "shellfish_based"]),
];

// ─── E) GRAINS ──────────────────────────────────────────────────────────────

const GRAINS: IngredientCard[] = [
  aaCard("grain.rice_long_grain", "Long-grain rice",
    [0.2, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 3.5],
    0.35, 0.05, SolubilityClass.DRY, [StructuralRole.STARCH], IngredientClass.NEUTRAL,
    "grain", GULF_MW, [AATag.AA_CORE, AATag.AA_RICE_CORN_SYSTEM, AATag.AA_GULF_CREOLE_COAST], ["raw", "cooked"]),

  aaCard("grain.rice_parboiled", "Parboiled/converted rice",
    [0.2, 0.0, 0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.2, 0.0, 3.5],
    0.35, 0.05, SolubilityClass.DRY, [StructuralRole.STARCH], IngredientClass.NEUTRAL,
    "grain", [RegionTag.GULF_LA, RegionTag.GULF_MS, RegionTag.SHARED_US_PANTRY],
    [AATag.AA_RICE_CORN_SYSTEM, AATag.AA_GULF_CREOLE_COAST], ["raw"]),

  aaCard("grain.grits", "Grits",
    [0.3, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.5, 0.0, 0.0, 0.0, 0.0, 1.0, 0.3, 0.0, 0.0, 3.5],
    0.4, 0.05, SolubilityClass.DRY, [StructuralRole.STARCH], IngredientClass.NEUTRAL,
    "grain", GULF_MW, [AATag.AA_CORE, AATag.AA_RICE_CORN_SYSTEM], ["quick", "stone_ground"]),

  aaCard("grain.cornmeal_yellow", "Yellow cornmeal",
    [0.3, 0.0, 1.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 1.0, 0.5, 0.0, 1.0, 1.5],
    0.4, 0.05, SolubilityClass.DRY, [StructuralRole.STARCH], IngredientClass.NEUTRAL,
    "grain", GULF_MW, [AATag.AA_CORE, AATag.AA_RICE_CORN_SYSTEM, AATag.AA_BAKING_DESSERT], ["fine", "medium", "coarse"]),

  aaCard("grain.hominy", "Hominy",
    [0.3, 0.0, 0.8, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 1.0, 0.3, 0.0, 0.0, 3.0],
    0.35, 0.05, SolubilityClass.WATER, [StructuralRole.STARCH], IngredientClass.NEUTRAL,
    "grain", [RegionTag.GULF_AL, RegionTag.GULF_MS, RegionTag.MIDWEST],
    [AATag.AA_RICE_CORN_SYSTEM], ["canned"]),

  aaCard("grain.oats_rolled", "Rolled oats",
    [0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 1.0, 0.0, 0.0, 3.0],
    0.35, 0.05, SolubilityClass.DRY, [StructuralRole.STARCH], IngredientClass.NEUTRAL,
    "grain", [RegionTag.MIDWEST, RegionTag.SHARED_US_PANTRY],
    [AATag.AA_CORE, AATag.AA_BAKING_DESSERT], ["rolled", "quick"]),
];

// ─── F) LEGUMES ─────────────────────────────────────────────────────────────

const LEGUMES: IngredientCard[] = [
  aaCard("leg.black_eyed_peas", "Black-eyed peas",
    [0.5, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 1.0, 0.0, 0.0, 0.0, 0.0, 2.0, 0.3, 0.0, 0.0, 3.0],
    0.45, 0.05, SolubilityClass.WATER, [StructuralRole.VEGETABLE, StructuralRole.PROTEIN], IngredientClass.LEGUME,
    "legume", GULF_MW, [AATag.AA_CORE, AATag.AA_LEGUMES_FIELDPEAS, AATag.AA_MIDWEST_MIGRATION], ["dried", "canned"]),

  aaCard("leg.field_peas", "Field peas",
    [0.5, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.8, 0.0, 0.0, 0.0, 0.0, 2.5, 0.3, 0.0, 0.0, 3.0],
    0.45, 0.05, SolubilityClass.WATER, [StructuralRole.VEGETABLE, StructuralRole.PROTEIN], IngredientClass.LEGUME,
    "legume", [RegionTag.GULF_AL, RegionTag.GULF_MS],
    [AATag.AA_CORE, AATag.AA_LEGUMES_FIELDPEAS], ["dried"]),

  aaCard("leg.butter_beans", "Butter beans (lima beans)",
    [0.3, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 2.0, 0.0, 0.0, 0.0, 0.0, 1.5, 0.3, 0.0, 0.0, 3.5],
    0.45, 0.05, SolubilityClass.WATER, [StructuralRole.VEGETABLE, StructuralRole.PROTEIN], IngredientClass.LEGUME,
    "legume", [RegionTag.GULF_AL, RegionTag.GULF_MS, RegionTag.MIDWEST],
    [AATag.AA_CORE, AATag.AA_LEGUMES_FIELDPEAS], ["dried", "canned"]),

  aaCard("leg.kidney_beans_red", "Red kidney beans",
    [0.5, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 2.0, 0.5, 0.0, 0.0, 3.0],
    0.45, 0.05, SolubilityClass.WATER, [StructuralRole.VEGETABLE, StructuralRole.PROTEIN], IngredientClass.LEGUME,
    "legume", [RegionTag.GULF_LA, RegionTag.SHARED_US_PANTRY],
    [AATag.AA_CORE, AATag.AA_GULF_CREOLE_COAST], ["dried", "canned"]),

  aaCard("leg.peanuts_raw", "Peanuts",
    [0.5, 0.0, 0.8, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 2.0, 0.3, 0.0, 0.0, 0.0, 0.0, 1.5, 4.5, 0.0, 2.5, 0.5],
    0.6, 0.1, SolubilityClass.DRY, [StructuralRole.PROTEIN, StructuralRole.TEXTURE_AGENT], IngredientClass.NEUTRAL,
    "legume", [RegionTag.GULF_AL, RegionTag.GULF_MS, RegionTag.SHARED_US_PANTRY],
    [AATag.AA_CORE, AATag.AA_PEANUT_GROUNDNUT], ["raw", "roasted_salted", "roasted_unsalted"]),

  aaCard("leg.peanut_butter", "Peanut butter",
    [0.5, 0.5, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.5, 3.0, 2.5, 0.0, 0.0, 0.0, 0.0, 1.0, 5.0, 0.0, 0.0, 2.0],
    0.8, 0.1, SolubilityClass.FAT, [StructuralRole.FAT, StructuralRole.PROTEIN], IngredientClass.NEUTRAL,
    "condiment", [RegionTag.MIDWEST, RegionTag.SHARED_US_PANTRY],
    [AATag.AA_PEANUT_GROUNDNUT], ["smooth", "crunchy"]),
];

// ─── G) FATS + DAIRY ────────────────────────────────────────────────────────

const FATS_DAIRY: IngredientCard[] = [
  aaCard("fat.lard", "Lard",
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 4.5, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0],
    0.6, 0.02, SolubilityClass.FAT, [StructuralRole.FAT], IngredientClass.NEUTRAL,
    "fat", [RegionTag.GULF_AL, RegionTag.GULF_MS, RegionTag.MIDWEST],
    [AATag.AA_CORE, AATag.AA_BAKING_DESSERT], ["rendered"]),

  aaCard("fat.vegetable_oil", "Vegetable oil",
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 3.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    0.5, 0.01, SolubilityClass.FAT, [StructuralRole.FAT], IngredientClass.NEUTRAL,
    "fat", [RegionTag.SHARED_US_PANTRY], [AATag.AA_CORE, AATag.AA_MIDWEST_MIGRATION], ["neutral"]),

  aaCard("fat.bacon_drippings", "Bacon drippings",
    [2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.5, 1.0, 4.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    0.8, 0.2, SolubilityClass.FAT, [StructuralRole.FAT, StructuralRole.UMAMI_BOOST], IngredientClass.PORK_CURED,
    "fat", [RegionTag.GULF_AL, RegionTag.GULF_MS, RegionTag.MIDWEST],
    [AATag.AA_CORE, AATag.AA_WHOLE_HOG_CHEAPCUTS], ["rendered"]),

  aaCard("dairy.milk_whole", "Whole milk",
    [0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.5, 2.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5],
    0.4, 0.05, SolubilityClass.WATER, [StructuralRole.FAT], IngredientClass.MILK,
    "dairy", [RegionTag.SHARED_US_PANTRY], [AATag.AA_CORE, AATag.AA_BAKING_DESSERT], ["whole"]),

  aaCard("dairy.buttermilk", "Buttermilk",
    [0.0, 0.2, 0.3, 2.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 2.0, 0.0, 0.0, 0.0, 1.5, 0.0, 0.0, 0.0, 0.0, 0.5],
    0.55, 0.1, SolubilityClass.WATER, [StructuralRole.ACID, StructuralRole.FAT], IngredientClass.MILK,
    "dairy", [RegionTag.GULF_AL, RegionTag.GULF_MS, RegionTag.MIDWEST, RegionTag.SHARED_US_PANTRY],
    [AATag.AA_CORE, AATag.AA_BAKING_DESSERT], ["cultured"]),

  aaCard("dairy.cheddar_sharp", "Sharp cheddar",
    [3.5, 2.5, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 3.0, 2.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.5, 0.0, 0.0, 1.0],
    0.8, 0.1, SolubilityClass.FAT, [StructuralRole.FAT, StructuralRole.UMAMI_BOOST], IngredientClass.MILK,
    "dairy", [RegionTag.MIDWEST, RegionTag.SHARED_US_PANTRY],
    [AATag.AA_CORE, AATag.AA_MIDWEST_MIGRATION], ["mild", "sharp", "extra_sharp"]),

  aaCard("dairy.evaporated_milk", "Evaporated milk",
    [0.0, 0.0, 1.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 2.0, 3.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5],
    0.5, 0.05, SolubilityClass.WATER, [StructuralRole.FAT], IngredientClass.MILK,
    "dairy", [RegionTag.GULF_AL, RegionTag.GULF_MS, RegionTag.MIDWEST],
    [AATag.AA_BAKING_DESSERT, AATag.AA_MIDWEST_MIGRATION], ["canned"]),

  aaCard("dairy.condensed_milk", "Sweetened condensed milk",
    [0.0, 0.0, 4.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 1.5, 3.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5],
    0.7, 0.05, SolubilityClass.WATER, [StructuralRole.SWEETENER, StructuralRole.FAT], IngredientClass.MILK,
    "dairy", [RegionTag.GULF_AL, RegionTag.GULF_MS, RegionTag.MIDWEST],
    [AATag.AA_BAKING_DESSERT], ["canned"]),

  aaCard("egg.whole", "Eggs",
    [1.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 2.5],
    0.6, 0.1, SolubilityClass.WATER, [StructuralRole.PROTEIN, StructuralRole.FAT], IngredientClass.NEUTRAL,
    "protein", [RegionTag.SHARED_US_PANTRY], [AATag.AA_BAKING_DESSERT], ["whole"]),
];

// ─── H) SPICES + HERBS ──────────────────────────────────────────────────────

const SPICES_HERBS: IngredientCard[] = [
  aaCard("spice.paprika_sweet", "Paprika (sweet)",
    [0.3, 0.0, 1.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0],
    0.6, 0.3, SolubilityClass.FAT, [StructuralRole.AROMATIC], IngredientClass.SPICY,
    "spice", [RegionTag.GULF_LA, RegionTag.SHARED_US_PANTRY],
    [AATag.AA_CORE, AATag.AA_GULF_CREOLE_COAST], ["sweet"]),

  aaCard("spice.cayenne_ground", "Cayenne (ground)",
    [0.0, 0.0, 0.0, 0.0, 0.0, 5.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    0.95, 0.3, SolubilityClass.FAT, [StructuralRole.HEAT_AGENT], IngredientClass.SPICY,
    "spice", ALL_REGIONS, [AATag.AA_CORE], ["ground"]),

  aaCard("spice.mustard_seed", "Mustard seed",
    [0.0, 0.0, 0.0, 0.3, 0.5, 1.5, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0],
    0.7, 0.4, SolubilityClass.WATER, [StructuralRole.AROMATIC], IngredientClass.SPICY,
    "spice", [RegionTag.GULF_AL, RegionTag.GULF_MS, RegionTag.MIDWEST, RegionTag.SHARED_US_PANTRY],
    [AATag.AA_PRESERVING_PICKLING, AATag.AA_CORE], ["yellow", "brown"]),

  aaCard("spice.celery_seed", "Celery seed",
    [0.0, 0.3, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0],
    0.7, 0.4, SolubilityClass.DRY, [StructuralRole.AROMATIC], IngredientClass.NEUTRAL,
    "spice", [RegionTag.MIDWEST, RegionTag.SHARED_US_PANTRY],
    [AATag.AA_PRESERVING_PICKLING, AATag.AA_GULF_CREOLE_COAST], ["seed"]),

  aaCard("spice.bay_leaf", "Bay leaf",
    [0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 3.0, 0.0, 0.0, 0.0, 1.5, 0.0, 0.3, 0.0, 0.0],
    0.6, 0.3, SolubilityClass.FAT, [StructuralRole.AROMATIC], IngredientClass.NEUTRAL,
    "herb", [RegionTag.GULF_LA, RegionTag.SHARED_US_PANTRY],
    [AATag.AA_CORE, AATag.AA_PRESERVING_PICKLING, AATag.AA_GULF_CREOLE_COAST], ["dried"]),

  aaCard("spice.thyme", "Thyme",
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 3.5, 0.0, 0.0, 0.0, 1.5, 0.0, 0.5, 0.0, 0.0],
    0.65, 0.5, SolubilityClass.FAT, [StructuralRole.HERB_FINISH, StructuralRole.AROMATIC], IngredientClass.NEUTRAL,
    "herb", [RegionTag.GULF_LA, RegionTag.SHARED_US_PANTRY],
    [AATag.AA_CORE, AATag.AA_GULF_CREOLE_COAST], ["fresh", "dried"]),

  aaCard("spice.clove", "Cloves",
    [0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 5.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0],
    0.95, 0.6, SolubilityClass.FAT, [StructuralRole.AROMATIC], IngredientClass.SPICY,
    "spice", [RegionTag.GULF_AL, RegionTag.GULF_MS, RegionTag.MIDWEST, RegionTag.SHARED_US_PANTRY],
    [AATag.AA_PRESERVING_PICKLING, AATag.AA_BAKING_DESSERT], ["whole", "ground"]),

  aaCard("spice.allspice", "Allspice",
    [0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 4.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0],
    0.85, 0.5, SolubilityClass.FAT, [StructuralRole.AROMATIC], IngredientClass.SPICY,
    "spice", [RegionTag.GULF_AL, RegionTag.GULF_MS, RegionTag.MIDWEST, RegionTag.SHARED_US_PANTRY],
    [AATag.AA_PRESERVING_PICKLING, AATag.AA_BAKING_DESSERT], ["ground"]),

  aaCard("spice.nutmeg", "Nutmeg",
    [0.0, 0.0, 0.5, 0.0, 0.3, 0.0, 4.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0],
    0.85, 0.5, SolubilityClass.FAT, [StructuralRole.AROMATIC], IngredientClass.SPICY,
    "spice", [RegionTag.SHARED_US_PANTRY], [AATag.AA_BAKING_DESSERT], ["ground"]),

  aaCard("spice.mace", "Mace",
    [0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 3.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.3, 1.0, 0.0, 0.0],
    0.8, 0.5, SolubilityClass.FAT, [StructuralRole.AROMATIC], IngredientClass.SPICY,
    "spice", [RegionTag.SHARED_US_PANTRY], [AATag.AA_BAKING_DESSERT, AATag.AA_PRESERVING_PICKLING], ["ground"]),

  aaCard("spice.dill_seed", "Dill seed",
    [0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 3.0, 0.0, 0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0],
    0.65, 0.5, SolubilityClass.FAT, [StructuralRole.AROMATIC], IngredientClass.NEUTRAL,
    "spice", [RegionTag.MIDWEST, RegionTag.SHARED_US_PANTRY],
    [AATag.AA_PRESERVING_PICKLING], ["seed"]),
];

// ─── I) ACIDS + CONDIMENTS ──────────────────────────────────────────────────

const ACIDS_CONDIMENTS: IngredientCard[] = [
  aaCard("acid.vinegar_distilled", "Distilled white vinegar",
    [0.0, 0.0, 0.0, 5.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    0.9, 0.6, SolubilityClass.WATER, [StructuralRole.ACID], IngredientClass.NEUTRAL,
    "acid", [RegionTag.SHARED_US_PANTRY], [AATag.AA_PRESERVING_PICKLING, AATag.AA_CORE], ["5_percent"]),

  aaCard("acid.vinegar_apple_cider", "Apple cider vinegar",
    [0.0, 0.0, 0.5, 4.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.3, 0.0, 0.0],
    0.8, 0.5, SolubilityClass.WATER, [StructuralRole.ACID], IngredientClass.FERMENTED,
    "acid", [RegionTag.SHARED_US_PANTRY, RegionTag.GULF_AL, RegionTag.GULF_MS],
    [AATag.AA_PRESERVING_PICKLING, AATag.AA_CORE], ["raw_unfiltered_optional"]),

  aaCard("condiment.hot_sauce_louisiana", "Louisiana-style hot sauce",
    [0.0, 1.5, 0.0, 3.0, 0.0, 3.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0],
    0.85, 0.4, SolubilityClass.WATER, [StructuralRole.ACID, StructuralRole.HEAT_AGENT, StructuralRole.HERB_FINISH], IngredientClass.SPICY,
    "condiment", GULF_ALL, [AATag.AA_CORE, AATag.AA_GULF_CREOLE_COAST], ["crystal_style", "louisiana_style_generic"]),

  aaCard("condiment.mustard_yellow", "Yellow mustard",
    [0.0, 0.5, 0.5, 1.5, 0.0, 0.5, 0.3, 0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0],
    0.5, 0.3, SolubilityClass.WATER, [StructuralRole.ACID, StructuralRole.HERB_FINISH], IngredientClass.NEUTRAL,
    "condiment", [RegionTag.MIDWEST, RegionTag.SHARED_US_PANTRY], [AATag.AA_CORE], ["prepared"]),

  aaCard("condiment.mustard_creole", "Creole mustard",
    [0.0, 0.5, 0.3, 2.0, 0.0, 1.0, 0.5, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.3, 0.3, 0.0, 0.0, 0.5, 0.0],
    0.6, 0.3, SolubilityClass.WATER, [StructuralRole.ACID, StructuralRole.HERB_FINISH], IngredientClass.NEUTRAL,
    "condiment", [RegionTag.GULF_LA], [AATag.AA_GULF_CREOLE_COAST], ["prepared"]),

  aaCard("condiment.worcestershire", "Worcestershire sauce",
    [3.5, 1.5, 1.0, 2.0, 0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.5, 0.0, 0.0, 0.0, 0.0, 0.0],
    0.8, 0.3, SolubilityClass.WATER, [StructuralRole.UMAMI_BOOST, StructuralRole.ACID], IngredientClass.FERMENTED,
    "condiment", [RegionTag.MIDWEST, RegionTag.SHARED_US_PANTRY], [AATag.AA_CORE], ["prepared"]),

  aaCard("condiment.ketchup", "Ketchup",
    [2.0, 0.5, 3.0, 1.5, 0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    0.6, 0.1, SolubilityClass.WATER, [StructuralRole.ACID, StructuralRole.SWEETENER], IngredientClass.NEUTRAL,
    "condiment", [RegionTag.MIDWEST, RegionTag.SHARED_US_PANTRY], [AATag.AA_CORE], ["prepared"]),

  aaCard("condiment.pickles_dill", "Dill pickles",
    [0.0, 2.0, 0.0, 3.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0, 0.0, 0.3, 1.0, 0.0, 0.0, 0.0, 3.0, 0.0],
    0.55, 0.2, SolubilityClass.WATER, [StructuralRole.ACID, StructuralRole.TEXTURE_AGENT], IngredientClass.FERMENTED,
    "preserved", [RegionTag.MIDWEST, RegionTag.SHARED_US_PANTRY],
    [AATag.AA_PRESERVING_PICKLING], ["chips", "spears", "relish"]),
];

// ─── J) BAKING ──────────────────────────────────────────────────────────────

const BAKING: IngredientCard[] = [
  aaCard("bake.flour_all_purpose", "All-purpose flour",
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 1.5],
    0.2, 0.02, SolubilityClass.DRY, [StructuralRole.STARCH], IngredientClass.NEUTRAL,
    "baking", [RegionTag.SHARED_US_PANTRY], [AATag.AA_BAKING_DESSERT, AATag.AA_CORE], ["bleached_optional", "unbleached"]),

  aaCard("bake.flour_self_rising", "Self-rising flour",
    [0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 1.5],
    0.2, 0.02, SolubilityClass.DRY, [StructuralRole.STARCH], IngredientClass.NEUTRAL,
    "baking", [RegionTag.GULF_AL, RegionTag.GULF_MS, RegionTag.MIDWEST],
    [AATag.AA_BAKING_DESSERT], ["standard"]),

  aaCard("bake.baking_powder", "Baking powder",
    [0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    0.1, 0.01, SolubilityClass.DRY, [StructuralRole.TEXTURE_AGENT], IngredientClass.NEUTRAL,
    "baking", [RegionTag.SHARED_US_PANTRY], [AATag.AA_BAKING_DESSERT], ["standard"]),

  aaCard("bake.baking_soda", "Baking soda",
    [0.0, 0.5, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    0.1, 0.01, SolubilityClass.DRY, [StructuralRole.TEXTURE_AGENT], IngredientClass.NEUTRAL,
    "baking", [RegionTag.SHARED_US_PANTRY], [AATag.AA_BAKING_DESSERT], ["standard"]),

  aaCard("bake.yeast_active_dry", "Active dry yeast",
    [0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.3, 0.0, 0.0, 0.0, 0.5],
    0.15, 0.05, SolubilityClass.WATER, [StructuralRole.TEXTURE_AGENT], IngredientClass.FERMENTED,
    "baking", [RegionTag.SHARED_US_PANTRY], [AATag.AA_BAKING_DESSERT], ["packet", "jar"]),
];

// ─── K) SWEETENERS ──────────────────────────────────────────────────────────

const SWEETENERS: IngredientCard[] = [
  aaCard("sweet.sugar_white", "White sugar",
    [0.0, 0.0, 5.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    0.9, 0.01, SolubilityClass.WATER, [StructuralRole.SWEETENER], IngredientClass.SWEET_DESSERT,
    "sweetener", [RegionTag.SHARED_US_PANTRY], [AATag.AA_BAKING_DESSERT, AATag.AA_CORE], ["granulated"]),

  aaCard("sweet.molasses", "Molasses",
    [0.0, 0.0, 3.5, 0.0, 1.5, 0.0, 1.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.5, 0.0, 0.0, 0.0, 0.5],
    0.85, 0.1, SolubilityClass.WATER, [StructuralRole.SWEETENER], IngredientClass.SWEET_DESSERT,
    "sweetener", [RegionTag.GULF_AL, RegionTag.GULF_MS, RegionTag.MIDWEST],
    [AATag.AA_BAKING_DESSERT, AATag.AA_CORE], ["unsulphured", "blackstrap_optional"]),

  aaCard("sweet.cane_syrup", "Cane syrup",
    [0.0, 0.0, 4.0, 0.0, 0.0, 0.0, 0.3, 0.0, 0.3, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.5],
    0.8, 0.1, SolubilityClass.WATER, [StructuralRole.SWEETENER], IngredientClass.SWEET_DESSERT,
    "sweetener", GULF_ALL, [AATag.AA_BAKING_DESSERT], ["heritage"]),

  aaCard("sweet.vanilla_extract", "Vanilla extract",
    [0.0, 0.0, 1.5, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 3.5, 0.0, 0.0],
    0.9, 0.8, SolubilityClass.ALCOHOL, [StructuralRole.AROMATIC, StructuralRole.HERB_FINISH], IngredientClass.NEUTRAL,
    "flavoring", [RegionTag.SHARED_US_PANTRY], [AATag.AA_BAKING_DESSERT], ["pure"]),
];

// ─── L) FRUITS ──────────────────────────────────────────────────────────────

const FRUITS: IngredientCard[] = [
  aaCard("fruit.peach", "Peaches",
    [0.0, 0.0, 3.5, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 2.0, 0.0, 3.0],
    0.55, 0.5, SolubilityClass.WATER, [StructuralRole.VEGETABLE, StructuralRole.SWEETENER], IngredientClass.FRUIT_SWEET,
    "fruit", [RegionTag.GULF_AL, RegionTag.GULF_MS, RegionTag.MIDWEST, RegionTag.SHARED_US_PANTRY],
    [AATag.AA_BAKING_DESSERT, AATag.AA_PRESERVING_PICKLING, AATag.AA_CORE], ["fresh", "frozen", "canned_in_juice"]),

  aaCard("fruit.blackberry", "Blackberries",
    [0.0, 0.0, 2.5, 2.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.5, 2.5],
    0.5, 0.4, SolubilityClass.WATER, [StructuralRole.VEGETABLE, StructuralRole.SWEETENER], IngredientClass.FRUIT_SWEET,
    "fruit", [RegionTag.GULF_AL, RegionTag.GULF_MS, RegionTag.MIDWEST],
    [AATag.AA_BAKING_DESSERT, AATag.AA_PRESERVING_PICKLING], ["fresh", "frozen"]),

  aaCard("fruit.strawberry", "Strawberries",
    [0.0, 0.0, 3.0, 1.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.5, 0.0, 2.5],
    0.5, 0.5, SolubilityClass.WATER, [StructuralRole.VEGETABLE, StructuralRole.SWEETENER], IngredientClass.FRUIT_SWEET,
    "fruit", [RegionTag.MIDWEST, RegionTag.SHARED_US_PANTRY],
    [AATag.AA_BAKING_DESSERT, AATag.AA_PRESERVING_PICKLING], ["fresh", "frozen"]),

  aaCard("fruit.apple", "Apples",
    [0.0, 0.0, 3.0, 1.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 2.0, 2.0],
    0.45, 0.3, SolubilityClass.WATER, [StructuralRole.VEGETABLE], IngredientClass.FRUIT_SWEET,
    "fruit", [RegionTag.MIDWEST, RegionTag.SHARED_US_PANTRY],
    [AATag.AA_BAKING_DESSERT, AATag.AA_PRESERVING_PICKLING, AATag.AA_CORE], ["fresh", "sauce"]),

  aaCard("fruit.fig", "Figs",
    [0.0, 0.0, 4.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 1.5, 0.0, 1.5, 0.0, 3.5],
    0.5, 0.3, SolubilityClass.WATER, [StructuralRole.SWEETENER, StructuralRole.VEGETABLE], IngredientClass.FRUIT_SWEET,
    "fruit", GULF_ALL, [AATag.AA_PRESERVING_PICKLING, AATag.AA_BAKING_DESSERT], ["fresh", "dried"]),

  aaCard("fruit.pear", "Pears",
    [0.0, 0.0, 3.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 3.0],
    0.4, 0.3, SolubilityClass.WATER, [StructuralRole.VEGETABLE], IngredientClass.FRUIT_SWEET,
    "fruit", [RegionTag.MIDWEST, RegionTag.SHARED_US_PANTRY],
    [AATag.AA_PRESERVING_PICKLING], ["fresh", "canned"]),
];

// ─── M) NUTS + COCOA ────────────────────────────────────────────────────────

const NUTS_COCOA: IngredientCard[] = [
  aaCard("nut.pecan", "Pecans",
    [0.0, 0.0, 1.0, 0.0, 0.3, 0.0, 0.0, 0.0, 1.5, 2.5, 0.5, 0.0, 0.0, 0.0, 0.0, 0.3, 4.5, 0.0, 2.5, 0.5],
    0.65, 0.1, SolubilityClass.FAT, [StructuralRole.TEXTURE_AGENT, StructuralRole.FAT], IngredientClass.NEUTRAL,
    "nut", GULF_MW, [AATag.AA_BAKING_DESSERT, AATag.AA_CORE], ["halves", "chopped", "toasted"]),

  aaCard("flavor.cocoa_powder", "Cocoa powder",
    [0.0, 0.0, 0.5, 0.0, 3.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0, 0.5, 0.3, 0.0, 0.0],
    0.75, 0.3, SolubilityClass.DRY, [StructuralRole.AROMATIC], IngredientClass.NEUTRAL,
    "flavoring", [RegionTag.SHARED_US_PANTRY], [AATag.AA_BAKING_DESSERT], ["natural", "dutch_process_optional"]),
];

// ─── N) GUMBO THICKENERS + ROUX ─────────────────────────────────────────────

const GUMBO_SYSTEM: IngredientCard[] = [
  aaCard("thickener.file_powder", "Filé powder (sassafras)",
    [0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 2.5, 0.0, 0.3, 0.0, 0.0],
    0.6, 0.4, SolubilityClass.DRY, [StructuralRole.AROMATIC, StructuralRole.HERB_FINISH], IngredientClass.NEUTRAL,
    "spice", [RegionTag.GULF_LA], [AATag.AA_GULF_CREOLE_COAST], ["powder"]),

  aaCard("thickener.cornstarch", "Cornstarch",
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5],
    0.1, 0.01, SolubilityClass.DRY, [StructuralRole.TEXTURE_AGENT], IngredientClass.NEUTRAL,
    "thickener", [RegionTag.SHARED_US_PANTRY], [AATag.AA_PRESERVING_PICKLING, AATag.AA_CORE], ["powder"]),

  aaCard("roux.dark", "Dark roux",
    [0.5, 0.0, 0.0, 0.0, 0.3, 0.0, 0.0, 0.0, 3.5, 2.0, 0.5, 0.0, 0.0, 0.0, 0.0, 1.5, 2.5, 0.0, 0.0, 1.0],
    0.7, 0.1, SolubilityClass.FAT, [StructuralRole.FAT, StructuralRole.STARCH], IngredientClass.NEUTRAL,
    "technique_ingredient", [RegionTag.GULF_LA],
    [AATag.AA_GULF_CREOLE_COAST], ["blond_roux", "brown_roux", "dark_roux"]),
];

// ─── O) PRESERVING SUPPORT ──────────────────────────────────────────────────

const PRESERVING: IngredientCard[] = [
  aaCard("preserve.salt_canning", "Canning/pickling salt",
    [0.0, 5.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    0.95, 0.0, SolubilityClass.WATER, [StructuralRole.HERB_FINISH], IngredientClass.NEUTRAL,
    "preservative", [RegionTag.SHARED_US_PANTRY], [AATag.AA_PRESERVING_PICKLING], ["fine"]),

  aaCard("preserve.pectin", "Fruit pectin",
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5],
    0.05, 0.0, SolubilityClass.WATER, [StructuralRole.TEXTURE_AGENT], IngredientClass.NEUTRAL,
    "preservative", [RegionTag.SHARED_US_PANTRY], [AATag.AA_PRESERVING_PICKLING], ["powder", "liquid_optional"]),
];

// ─── P) FRY FISH KIT ────────────────────────────────────────────────────────

const FRY_KIT: IngredientCard[] = [
  aaCard("fry.cornmeal_dredge", "Cornmeal dredge",
    [0.3, 0.5, 0.5, 0.0, 0.0, 0.5, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.3, 0.0, 4.0, 0.0],
    0.4, 0.1, SolubilityClass.DRY, [StructuralRole.TEXTURE_AGENT], IngredientClass.NEUTRAL,
    "technique_ingredient", GULF_MW, [AATag.AA_MIDWEST_MIGRATION, AATag.AA_CORE], ["mild", "spicy"]),

  aaCard("fry.frying_oil_depth", "Frying oil (deep fry)",
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 4.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    0.5, 0.01, SolubilityClass.FAT, [StructuralRole.FAT], IngredientClass.NEUTRAL,
    "technique_ingredient", [RegionTag.MIDWEST, RegionTag.SHARED_US_PANTRY],
    [AATag.AA_MIDWEST_MIGRATION], ["neutral"]),
];

// ─── Q) BENNE SEED ──────────────────────────────────────────────────────────

const BENNE: IngredientCard[] = [
  aaCard("seed.sesame_benne", "Sesame (benne seed)",
    [0.3, 0.0, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 1.5, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 3.5, 0.0, 1.5, 0.0],
    0.6, 0.2, SolubilityClass.FAT, [StructuralRole.GARNISH, StructuralRole.TEXTURE_AGENT], IngredientClass.NEUTRAL,
    "seed", [RegionTag.GULF_AL, RegionTag.GULF_MS, RegionTag.SHARED_US_PANTRY],
    [AATag.AA_CORE], ["whole", "toasted"]),
];

// ─── COMBINED EXPORT ────────────────────────────────────────────────────────

export const AA_INGREDIENT_LIBRARY: IngredientCard[] = [
  ...GREENS_VEGETABLES,
  ...AROMATICS,
  ...PROTEINS,
  ...STOCKS,
  ...GRAINS,
  ...LEGUMES,
  ...FATS_DAIRY,
  ...SPICES_HERBS,
  ...ACIDS_CONDIMENTS,
  ...BAKING,
  ...SWEETENERS,
  ...FRUITS,
  ...NUTS_COCOA,
  ...GUMBO_SYSTEM,
  ...PRESERVING,
  ...FRY_KIT,
  ...BENNE,
];

/** Register AA ingredients into a target ingredient map */
export function registerAAIngredients(target: Map<string, IngredientCard>): void {
  for (const card of AA_INGREDIENT_LIBRARY) {
    target.set(card.id, card);
  }
}

/** Get count of AA ingredients by tag */
export function countByAATag(tag: AATag): number {
  return AA_INGREDIENT_LIBRARY.filter(
    (card) => card.metadata?.aaTags.includes(tag)
  ).length;
}

/** Get ingredients by region */
export function getByRegion(region: RegionTag): IngredientCard[] {
  return AA_INGREDIENT_LIBRARY.filter(
    (card) => card.metadata?.regionTags.includes(region)
  );
}
