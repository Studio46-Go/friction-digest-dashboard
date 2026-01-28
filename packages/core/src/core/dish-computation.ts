/**
 * MFP v1.1 - Core Dish Vector Computation (Section 2)
 *
 * Steps:
 *   1. Compute α_i for each ingredient (normalization)
 *   2. Transform V_i → V_i' using K_method and H
 *   3. Aggregate: V_dish = Σ_i α_i p_i V_i'
 *   4. Normalize: V_norm = V_dish / max(5, ||V_dish||∞)
 */

import { FLAVOR_DIMENSIONS, createFlavorVector } from "../types/flavor-space.js";
import type { FlavorVector } from "../types/flavor-space.js";
import type { DishIngredient } from "../types/ingredient.js";
import type { CookingMethod, DishType } from "../types/method.js";
import type { IngredientContribution } from "../types/scoring.js";
import { computeAlpha } from "./normalization.js";
import { applyMethodKernel } from "./method-kernel.js";
import { normalizeToProfile } from "./vector-math.js";

/** Configuration for dish vector computation */
export interface DishComputationConfig {
  /** Ingredients with quantities */
  ingredients: DishIngredient[];

  /** Cooking method applied to all ingredients (or per-ingredient overrides) */
  method: CookingMethod;

  /** Heat level H ∈ [0, 1] */
  heatLevel: number;

  /** Dish type for normalization constants */
  dishType: DishType;

  /** Optional per-ingredient method overrides (e.g., RAW_FINISH for garnish) */
  methodOverrides?: Map<string, { method: CookingMethod; heatLevel: number }>;
}

/** Result of dish vector computation */
export interface DishComputationResult {
  /** Raw aggregated dish vector V_dish */
  dishVector: FlavorVector;

  /** Normalized profile V_norm */
  normalizedVector: FlavorVector;

  /** Per-ingredient contribution breakdown */
  contributions: IngredientContribution[];
}

/**
 * Compute the dish flavor vector from ingredients, method, and heat level.
 *
 * Follows Section 2 steps exactly:
 *   Step 1: α_i = f_role(q_i, R_i)
 *   Step 2: V_i' = K_method(V_i, s_i, v_i, H)
 *   Step 3: V_dish = Σ_i α_i p_i V_i'
 *   Step 4: V_norm = V_dish / max(5, ||V_dish||∞)
 */
export function computeDishVector(config: DishComputationConfig): DishComputationResult {
  const { ingredients, method, heatLevel, dishType, methodOverrides } = config;

  const dishVector = createFlavorVector();
  const contributions: IngredientContribution[] = [];

  for (const { card, quantity } of ingredients) {
    // Step 1: Compute normalized influence scalar
    const alpha = computeAlpha(quantity, card.roles, dishType);

    // Step 2: Apply method kernel
    const override = methodOverrides?.get(card.id);
    const ingredientMethod = override?.method ?? method;
    const ingredientHeat = override?.heatLevel ?? heatLevel;

    const transformedVector = applyMethodKernel(
      card.vector,
      card.solubility,
      card.volatility,
      ingredientHeat,
      ingredientMethod
    );

    // Step 3: Accumulate weighted contribution
    const contribution = createFlavorVector();
    for (let k = 0; k < FLAVOR_DIMENSIONS; k++) {
      const value = alpha * card.potency * transformedVector[k];
      contribution[k] = value;
      dishVector[k] += value;
    }

    contributions.push({
      ingredientId: card.id,
      ingredientName: card.name,
      contribution,
      alpha,
    });
  }

  // Step 4: Normalize to profile
  const normalizedVector = normalizeToProfile(dishVector);

  return { dishVector, normalizedVector, contributions };
}
