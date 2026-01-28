/**
 * MFP v1.1 - Quantity Normalization (Section 1.3)
 *
 * Converts raw quantities to unitless influence scalars α_i
 * using role-based normalization.
 */

import { ComponentCategory, getComponentCategory } from "../types/ingredient.js";
import type { StructuralRole } from "../types/ingredient.js";
import type { DishType } from "../types/method.js";

/**
 * Normalization constants per dish type.
 * Q_primary, Q_support, Q_finish define the reference quantities
 * at which each component category reaches full influence (α = 1.0).
 */
export interface NormalizationConstants {
  Q_primary: number;
  Q_support: number;
  Q_finish: number;
}

/** Default normalization constants by dish type (grams) */
const NORMALIZATION_REGISTRY: Record<string, NormalizationConstants> = {
  COMPLETE_PLATE: { Q_primary: 200, Q_support: 50, Q_finish: 10 },
  SNACK: { Q_primary: 100, Q_support: 30, Q_finish: 5 },
  SAUCE: { Q_primary: 100, Q_support: 40, Q_finish: 8 },
  SIDE: { Q_primary: 150, Q_support: 40, Q_finish: 8 },
  SOUP: { Q_primary: 250, Q_support: 50, Q_finish: 10 },
  SALAD: { Q_primary: 150, Q_support: 40, Q_finish: 8 },
  DESSERT: { Q_primary: 150, Q_support: 40, Q_finish: 5 },
};

/**
 * Get normalization constants for a dish type.
 * Falls back to COMPLETE_PLATE defaults if type not found.
 */
export function getNormalizationConstants(dishType: DishType): NormalizationConstants {
  return NORMALIZATION_REGISTRY[dishType] ?? NORMALIZATION_REGISTRY["COMPLETE_PLATE"];
}

/**
 * Compute the normalized influence scalar α_i for an ingredient.
 *
 * α_i = min(1.0, q_i / Q_category)
 *
 * @param quantity Raw quantity in grams/mL
 * @param roles The ingredient's structural roles
 * @param dishType The dish type for looking up normalization constants
 * @returns α_i ∈ [0, 1]
 */
export function computeAlpha(
  quantity: number,
  roles: Set<StructuralRole>,
  dishType: DishType
): number {
  const constants = getNormalizationConstants(dishType);
  const category = getComponentCategory(roles);

  let Q: number;
  switch (category) {
    case ComponentCategory.PRIMARY:
      Q = constants.Q_primary;
      break;
    case ComponentCategory.SUPPORT:
      Q = constants.Q_support;
      break;
    case ComponentCategory.FINISH:
      Q = constants.Q_finish;
      break;
  }

  return Math.min(1.0, quantity / Q);
}
