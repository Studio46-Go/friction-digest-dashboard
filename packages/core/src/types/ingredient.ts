/**
 * MFP v1.1 - Ingredient Signature Card (Section 1.2)
 */

import type { FlavorVector } from "./flavor-space.js";
import type { IngredientMetadata } from "./ingredient-metadata.js";

/** Structural roles an ingredient can fulfill */
export enum StructuralRole {
  PROTEIN = "PROTEIN",
  FAT = "FAT",
  ACID = "ACID",
  AROMATIC = "AROMATIC",
  SWEETENER = "SWEETENER",
  STARCH = "STARCH",
  VEGETABLE = "VEGETABLE",
  UMAMI_BOOST = "UMAMI_BOOST",
  HERB_FINISH = "HERB_FINISH",
  HEAT_AGENT = "HEAT_AGENT",
  TEXTURE_AGENT = "TEXTURE_AGENT",
  GARNISH = "GARNISH",
  LIQUID_BASE = "LIQUID_BASE",
}

/** Solubility class for an ingredient */
export enum SolubilityClass {
  WATER = "WATER",
  FAT = "FAT",
  ALCOHOL = "ALCOHOL",
  DRY = "DRY",
}

/** Ingredient class for clash matrix lookups */
export enum IngredientClass {
  CITRUS = "CITRUS",
  MILK = "MILK",
  BITTER_GREEN = "BITTER_GREEN",
  SWEET_DESSERT = "SWEET_DESSERT",
  FISHY = "FISHY",
  STRONG_FLORAL = "STRONG_FLORAL",
  FERMENTED = "FERMENTED",
  RED_MEAT = "RED_MEAT",
  SHELLFISH = "SHELLFISH",
  CRUCIFEROUS = "CRUCIFEROUS",
  ALLIUM_CLASS = "ALLIUM_CLASS",
  SPICY = "SPICY",
  NEUTRAL = "NEUTRAL",
  PORK_CURED = "PORK_CURED",
  OFFAL = "OFFAL",
  LEGUME = "LEGUME",
  FRUIT_SWEET = "FRUIT_SWEET",
}

/**
 * Ingredient Signature Card (Section 1.2)
 *
 * Card(i) = {V_i, p_i, v_i, s_i, R_i}
 */
export interface IngredientCard {
  /** Unique identifier */
  id: string;

  /** Human-readable name */
  name: string;

  /** Base flavor vector V_i ∈ ℝ²⁰ */
  vector: FlavorVector;

  /** Potency scalar p_i ∈ [0, 1] */
  potency: number;

  /** Volatility scalar v_i ∈ [0, 1]; high = aroma-driven */
  volatility: number;

  /** Solubility class s_i */
  solubility: SolubilityClass;

  /** Structural roles R_i */
  roles: Set<StructuralRole>;

  /** Ingredient class for clash matrix lookups */
  ingredientClass: IngredientClass;

  /** Optional cultural/regional metadata */
  metadata?: IngredientMetadata;
}

/** Role-based component category for normalization */
export enum ComponentCategory {
  PRIMARY = "PRIMARY",
  SUPPORT = "SUPPORT",
  FINISH = "FINISH",
}

/** Determine the component category from structural roles */
export function getComponentCategory(roles: Set<StructuralRole>): ComponentCategory {
  const primaryRoles = new Set([
    StructuralRole.PROTEIN,
    StructuralRole.STARCH,
    StructuralRole.VEGETABLE,
  ]);
  const finishRoles = new Set([
    StructuralRole.HERB_FINISH,
  ]);

  for (const role of roles) {
    if (primaryRoles.has(role)) return ComponentCategory.PRIMARY;
  }
  for (const role of roles) {
    if (finishRoles.has(role)) return ComponentCategory.FINISH;
  }
  return ComponentCategory.SUPPORT;
}

/** An ingredient instance in a dish with a specific quantity */
export interface DishIngredient {
  card: IngredientCard;
  /** Raw quantity in grams (or mL for liquids) */
  quantity: number;
}
