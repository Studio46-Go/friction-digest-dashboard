/**
 * MFP v1.1 - Flavor Space Definition (Section 1.1)
 *
 * 20-dimensional vector space representing flavor profiles.
 * Each dimension scored on a 0–5 continuous intensity scale.
 */

/** Flavor dimension indices for the 20-dimensional flavor space */
export enum FlavorDimension {
  UMAMI = 0,
  SALT = 1,
  SWEET = 2,
  SOUR = 3,
  BITTER = 4,
  HEAT_PEPPER = 5,
  WARM_SPICE = 6,
  SMOKE = 7,
  ROASTED = 8,
  FAT_RICH = 9,
  CREAMY = 10,
  HERBAL = 11,
  CITRUS = 12,
  ALLIUM = 13,
  FERMENT = 14,
  EARTHY = 15,
  NUTTY = 16,
  FLORAL = 17,
  TEXTURE_CRISP = 18,
  TEXTURE_TENDER = 19,
}

/** Dimension labels matching the spec ordering */
export const FLAVOR_DIMENSION_LABELS: readonly string[] = [
  "UMAMI",
  "SALT",
  "SWEET",
  "SOUR",
  "BITTER",
  "HEAT_PEPPER",
  "WARM_SPICE",
  "SMOKE",
  "ROASTED",
  "FAT_RICH",
  "CREAMY",
  "HERBAL",
  "CITRUS",
  "ALLIUM",
  "FERMENT",
  "EARTHY",
  "NUTTY",
  "FLORAL",
  "TEXTURE_CRISP",
  "TEXTURE_TENDER",
] as const;

export const FLAVOR_DIMENSIONS = 20;

/** A 20-dimensional flavor vector. Each element in [0, 5]. */
export type FlavorVector = Float64Array;

/** Create a zero-initialized flavor vector */
export function createFlavorVector(): FlavorVector {
  return new Float64Array(FLAVOR_DIMENSIONS);
}

/** Create a flavor vector from an array of values */
export function flavorVector(values: number[]): FlavorVector {
  if (values.length !== FLAVOR_DIMENSIONS) {
    throw new Error(
      `FlavorVector requires exactly ${FLAVOR_DIMENSIONS} dimensions, got ${values.length}`
    );
  }
  return new Float64Array(values);
}
