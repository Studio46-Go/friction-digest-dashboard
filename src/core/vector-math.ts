/**
 * MFP v1.1 - Vector Mathematics
 *
 * Core vector operations for flavor space computations.
 * All operations maintain full double precision (Section 1.5, 3.6).
 */

import { FLAVOR_DIMENSIONS, createFlavorVector } from "../types/flavor-space.js";
import type { FlavorVector } from "../types/flavor-space.js";

/** Computational tolerance constants (Section 1.5) */
export const EPSILON_ABS = 1e-6;
export const EPSILON_REL = 1e-4;

/**
 * Compute the dot product of two flavor vectors.
 */
export function dot(a: FlavorVector, b: FlavorVector): number {
  let sum = 0;
  for (let i = 0; i < FLAVOR_DIMENSIONS; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}

/**
 * Compute the L2 norm (Euclidean length) of a flavor vector.
 */
export function norm(v: FlavorVector): number {
  return Math.sqrt(dot(v, v));
}

/**
 * Compute the L∞ norm (max absolute value) of a flavor vector.
 */
export function normInf(v: FlavorVector): number {
  let max = 0;
  for (let i = 0; i < FLAVOR_DIMENSIONS; i++) {
    const abs = Math.abs(v[i]);
    if (abs > max) max = abs;
  }
  return max;
}

/**
 * Compute cosine similarity between two flavor vectors.
 * Returns value in [-1, 1]. Returns 0 for zero vectors.
 *
 * Section 3.1: S_sim = cosine(V_norm,A, V_norm,B)
 */
export function cosineSimilarity(a: FlavorVector, b: FlavorVector): number {
  const dotProduct = dot(a, b);
  const normA = norm(a);
  const normB = norm(b);

  if (normA < EPSILON_ABS || normB < EPSILON_ABS) {
    return 0;
  }

  return dotProduct / (normA * normB);
}

/**
 * Add two vectors: result = a + b
 */
export function addVectors(a: FlavorVector, b: FlavorVector): FlavorVector {
  const result = createFlavorVector();
  for (let i = 0; i < FLAVOR_DIMENSIONS; i++) {
    result[i] = a[i] + b[i];
  }
  return result;
}

/**
 * Subtract vectors: result = a - b
 */
export function subtractVectors(a: FlavorVector, b: FlavorVector): FlavorVector {
  const result = createFlavorVector();
  for (let i = 0; i < FLAVOR_DIMENSIONS; i++) {
    result[i] = a[i] - b[i];
  }
  return result;
}

/**
 * Scale a vector by a scalar: result = scalar * v
 */
export function scaleVector(v: FlavorVector, scalar: number): FlavorVector {
  const result = createFlavorVector();
  for (let i = 0; i < FLAVOR_DIMENSIONS; i++) {
    result[i] = v[i] * scalar;
  }
  return result;
}

/**
 * Element-wise absolute value of a vector.
 */
export function absVector(v: FlavorVector): FlavorVector {
  const result = createFlavorVector();
  for (let i = 0; i < FLAVOR_DIMENSIONS; i++) {
    result[i] = Math.abs(v[i]);
  }
  return result;
}

/**
 * Normalize a dish vector to shape profile.
 *
 * Section 2: V_norm = V_dish / max(5, ||V_dish||∞)
 */
export function normalizeToProfile(v: FlavorVector): FlavorVector {
  const maxVal = Math.max(5, normInf(v));
  return scaleVector(v, 1.0 / maxVal);
}

/**
 * Banker's rounding (round-half-to-even) per Section 3.6.
 * Used only for final display output, never for intermediate calculations.
 */
export function bankersRound(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  const shifted = value * factor;
  const floored = Math.floor(shifted);
  const diff = shifted - floored;

  if (Math.abs(diff - 0.5) < EPSILON_ABS) {
    // Exactly 0.5: round to even
    return (floored % 2 === 0 ? floored : floored + 1) / factor;
  }

  return Math.round(shifted) / factor;
}

/**
 * Check if two values are within computational tolerance (Section 1.5).
 */
export function withinTolerance(actual: number, expected: number): boolean {
  const absDiff = Math.abs(actual - expected);
  return absDiff <= Math.max(EPSILON_ABS, EPSILON_REL * Math.abs(expected));
}
