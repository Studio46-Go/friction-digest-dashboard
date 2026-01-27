/**
 * MFP v1.1 - Method & Heat Model (Section 1.4)
 *
 * V_i' = K_method(V_i, s_i, v_i, H)
 *
 * Cooking methods transform ingredient flavor vectors based on
 * solubility, volatility, and heat level.
 */

import { FlavorDimension, FLAVOR_DIMENSIONS } from "../types/flavor-space.js";
import type { FlavorVector } from "../types/flavor-space.js";
import { SolubilityClass } from "../types/ingredient.js";
import { CookingMethod } from "../types/method.js";

/**
 * Per-dimension modifier: multiplier applied to the base vector value.
 * Values > 1 amplify, < 1 attenuate.
 */
type DimensionModifiers = Partial<Record<FlavorDimension, number>>;

interface MethodKernelDef {
  /** Base modifiers always applied */
  modifiers: DimensionModifiers;
  /** Modifiers scaled by heat level H */
  heatScaled: DimensionModifiers;
  /** Volatility-dependent attenuation factor: higher heat + higher volatility = more loss */
  volatilityLossFactor: number;
}

const METHOD_KERNELS: Record<CookingMethod, MethodKernelDef> = {
  [CookingMethod.HIGH_HEAT_SEAR]: {
    modifiers: {},
    heatScaled: {
      [FlavorDimension.ROASTED]: 1.8,
      [FlavorDimension.SMOKE]: 1.4,
      [FlavorDimension.HERBAL]: 0.5,
      [FlavorDimension.CITRUS]: 0.4,
      [FlavorDimension.FLORAL]: 0.5,
      [FlavorDimension.TEXTURE_CRISP]: 1.6,
      [FlavorDimension.TEXTURE_TENDER]: 0.7,
    },
    volatilityLossFactor: 0.6,
  },
  [CookingMethod.BRAISE]: {
    modifiers: {
      [FlavorDimension.TEXTURE_TENDER]: 1.8,
      [FlavorDimension.TEXTURE_CRISP]: 0.2,
    },
    heatScaled: {
      [FlavorDimension.UMAMI]: 1.5,
      [FlavorDimension.FAT_RICH]: 1.2,
      [FlavorDimension.HERBAL]: 0.6,
      [FlavorDimension.CITRUS]: 0.5,
    },
    volatilityLossFactor: 0.4,
  },
  [CookingMethod.RAW_FINISH]: {
    modifiers: {
      [FlavorDimension.HERBAL]: 1.3,
      [FlavorDimension.CITRUS]: 1.3,
      [FlavorDimension.FLORAL]: 1.2,
    },
    heatScaled: {},
    volatilityLossFactor: 0.0,
  },
  [CookingMethod.ROAST]: {
    modifiers: {},
    heatScaled: {
      [FlavorDimension.ROASTED]: 1.6,
      [FlavorDimension.SWEET]: 1.2,
      [FlavorDimension.NUTTY]: 1.3,
      [FlavorDimension.HERBAL]: 0.6,
      [FlavorDimension.TEXTURE_CRISP]: 1.3,
    },
    volatilityLossFactor: 0.4,
  },
  [CookingMethod.STEAM]: {
    modifiers: {
      [FlavorDimension.TEXTURE_TENDER]: 1.3,
    },
    heatScaled: {
      [FlavorDimension.HERBAL]: 0.8,
      [FlavorDimension.FLORAL]: 0.9,
    },
    volatilityLossFactor: 0.2,
  },
  [CookingMethod.DEEP_FRY]: {
    modifiers: {
      [FlavorDimension.FAT_RICH]: 1.5,
      [FlavorDimension.TEXTURE_CRISP]: 2.0,
      [FlavorDimension.TEXTURE_TENDER]: 0.4,
    },
    heatScaled: {
      [FlavorDimension.ROASTED]: 1.3,
      [FlavorDimension.HERBAL]: 0.3,
      [FlavorDimension.CITRUS]: 0.3,
      [FlavorDimension.FLORAL]: 0.3,
    },
    volatilityLossFactor: 0.7,
  },
  [CookingMethod.SAUTE]: {
    modifiers: {},
    heatScaled: {
      [FlavorDimension.ROASTED]: 1.3,
      [FlavorDimension.ALLIUM]: 1.2,
      [FlavorDimension.HERBAL]: 0.7,
      [FlavorDimension.TEXTURE_CRISP]: 1.2,
    },
    volatilityLossFactor: 0.3,
  },
  [CookingMethod.SIMMER]: {
    modifiers: {
      [FlavorDimension.TEXTURE_TENDER]: 1.4,
    },
    heatScaled: {
      [FlavorDimension.UMAMI]: 1.3,
      [FlavorDimension.HERBAL]: 0.7,
      [FlavorDimension.CITRUS]: 0.6,
    },
    volatilityLossFactor: 0.3,
  },
  [CookingMethod.GRILL]: {
    modifiers: {},
    heatScaled: {
      [FlavorDimension.SMOKE]: 1.8,
      [FlavorDimension.ROASTED]: 1.5,
      [FlavorDimension.HERBAL]: 0.5,
      [FlavorDimension.CITRUS]: 0.4,
      [FlavorDimension.TEXTURE_CRISP]: 1.4,
    },
    volatilityLossFactor: 0.5,
  },
  [CookingMethod.SMOKE_METHOD]: {
    modifiers: {
      [FlavorDimension.SMOKE]: 2.0,
    },
    heatScaled: {
      [FlavorDimension.ROASTED]: 1.3,
      [FlavorDimension.HERBAL]: 0.4,
      [FlavorDimension.CITRUS]: 0.3,
      [FlavorDimension.TEXTURE_TENDER]: 1.3,
    },
    volatilityLossFactor: 0.5,
  },
  [CookingMethod.BLOOM_IN_FAT]: {
    modifiers: {
      [FlavorDimension.FAT_RICH]: 1.2,
    },
    heatScaled: {
      [FlavorDimension.WARM_SPICE]: 1.5,
      [FlavorDimension.HEAT_PEPPER]: 1.3,
      [FlavorDimension.EARTHY]: 1.2,
    },
    volatilityLossFactor: 0.1,
  },
  [CookingMethod.RAW]: {
    modifiers: {},
    heatScaled: {},
    volatilityLossFactor: 0.0,
  },
};

/**
 * Apply method kernel to transform an ingredient's flavor vector.
 *
 * V_i' = K_method(V_i, s_i, v_i, H)
 *
 * @param vector Base flavor vector V_i
 * @param solubility Solubility class s_i
 * @param volatility Volatility scalar v_i
 * @param heatLevel Heat level H ∈ [0, 1]
 * @param method Cooking method
 * @returns Transformed flavor vector V_i'
 */
export function applyMethodKernel(
  vector: FlavorVector,
  solubility: SolubilityClass,
  volatility: number,
  heatLevel: number,
  method: CookingMethod
): FlavorVector {
  const kernel = METHOD_KERNELS[method];
  const result = new Float64Array(FLAVOR_DIMENSIONS);

  for (let k = 0; k < FLAVOR_DIMENSIONS; k++) {
    let value = vector[k];

    // Apply base modifiers
    const baseMod = kernel.modifiers[k as FlavorDimension];
    if (baseMod !== undefined) {
      value *= baseMod;
    }

    // Apply heat-scaled modifiers: interpolate between 1.0 and modifier based on H
    const heatMod = kernel.heatScaled[k as FlavorDimension];
    if (heatMod !== undefined) {
      const scaledMod = 1.0 + (heatMod - 1.0) * heatLevel;
      value *= scaledMod;
    }

    // Volatility loss: volatile compounds degrade with heat
    // Fat-soluble ingredients are partially protected
    if (volatility > 0 && heatLevel > 0) {
      const protectionFactor = solubility === SolubilityClass.FAT ? 0.5 : 1.0;
      const loss = volatility * heatLevel * kernel.volatilityLossFactor * protectionFactor;
      value *= (1.0 - loss);
    }

    // Clamp to [0, 5]
    result[k] = Math.max(0, Math.min(5, value));
  }

  return result;
}
