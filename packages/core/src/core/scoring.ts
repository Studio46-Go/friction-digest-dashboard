/**
 * MFP v1.1 - Matching & Scoring (Sections 3.1–3.6)
 *
 * Implements:
 *   3.1 Similarity (cosine)
 *   3.2 Balance vs Target Profile
 *   3.3 Structural Role Coverage
 *   3.4 Clash Penalty
 *   3.5 Final Compatibility Score
 *   3.6 Rounding & Precision Policy
 */

import { FLAVOR_DIMENSIONS } from "../types/flavor-space.js";
import type { FlavorVector } from "../types/flavor-space.js";
import { StructuralRole, IngredientClass } from "../types/ingredient.js";
import type { DishIngredient } from "../types/ingredient.js";
import type { DishType } from "../types/method.js";
import type { ScoreComponents, ScoredResult, StructuralGateResult } from "../types/scoring.js";
import { cosineSimilarity } from "./vector-math.js";

// ─── 3.1 Similarity ─────────────────────────────────────────────────────────

/**
 * Compute similarity between two normalized dish vectors.
 * S_sim = cosine(V_norm,A, V_norm,B)
 */
export function computeSimilarity(a: FlavorVector, b: FlavorVector): number {
  return cosineSimilarity(a, b);
}

// ─── 3.2 Balance vs Target Profile ──────────────────────────────────────────

/**
 * Compute balance score against a target profile.
 *
 * Δ = |V_norm - B_target|
 * S_bal = 1 - ( Σ_k W_bal[k] × Δ[k] ) / ( Σ_k W_bal[k] )
 *
 * @param normalizedVector V_norm of the dish
 * @param targetProfile B_target style/cuisine signature
 * @param weights W_bal per-dimension importance weights
 * @returns S_bal ∈ [0, 1]
 */
export function computeBalanceScore(
  normalizedVector: FlavorVector,
  targetProfile: FlavorVector,
  weights: FlavorVector
): number {
  let weightedDeviation = 0;
  let totalWeight = 0;

  for (let k = 0; k < FLAVOR_DIMENSIONS; k++) {
    const delta = Math.abs(normalizedVector[k] - targetProfile[k]);
    weightedDeviation += weights[k] * delta;
    totalWeight += weights[k];
  }

  if (totalWeight === 0) return 1;

  const score = 1 - weightedDeviation / totalWeight;
  return Math.max(0, Math.min(1, score));
}

// ─── 3.3 Structural Role Coverage ───────────────────────────────────────────

/** Required roles by dish type */
const REQUIRED_ROLES: Record<string, Set<StructuralRole>> = {
  COMPLETE_PLATE: new Set([
    StructuralRole.PROTEIN,
    StructuralRole.FAT,
    StructuralRole.ACID,
    StructuralRole.AROMATIC,
    StructuralRole.STARCH,
    StructuralRole.VEGETABLE,
    StructuralRole.HERB_FINISH,
  ]),
  SNACK: new Set([
    StructuralRole.FAT,
    StructuralRole.ACID,
    StructuralRole.AROMATIC,
  ]),
  SAUCE: new Set([
    StructuralRole.FAT,
    StructuralRole.ACID,
    StructuralRole.AROMATIC,
    StructuralRole.UMAMI_BOOST,
  ]),
  SIDE: new Set([
    StructuralRole.FAT,
    StructuralRole.ACID,
    StructuralRole.VEGETABLE,
  ]),
  SOUP: new Set([
    StructuralRole.FAT,
    StructuralRole.AROMATIC,
    StructuralRole.UMAMI_BOOST,
    StructuralRole.VEGETABLE,
    StructuralRole.HERB_FINISH,
  ]),
  SALAD: new Set([
    StructuralRole.FAT,
    StructuralRole.ACID,
    StructuralRole.VEGETABLE,
    StructuralRole.TEXTURE_AGENT,
  ]),
  DESSERT: new Set([
    StructuralRole.FAT,
    StructuralRole.SWEETENER,
    StructuralRole.TEXTURE_AGENT,
  ]),
};

/** Structural coverage thresholds θ(T) by dish type (Section 3.3) */
const STRUCTURAL_THRESHOLDS: Record<string, number> = {
  COMPLETE_PLATE: 0.85,
  SNACK: 0.60,
  SAUCE: 0.50,
  SIDE: 0.60,
  SOUP: 0.70,
  SALAD: 0.60,
  DESSERT: 0.60,
};

/**
 * Evaluate structural role coverage.
 *
 * C = |R_present ∩ R_req| / |R_req|
 * Gating: C < θ(T) → FAIL
 */
export function evaluateStructuralCoverage(
  ingredients: DishIngredient[],
  dishType: DishType
): StructuralGateResult {
  const requiredRoles = REQUIRED_ROLES[dishType] ?? REQUIRED_ROLES["COMPLETE_PLATE"];
  const threshold = STRUCTURAL_THRESHOLDS[dishType] ?? 0.85;

  // Collect all present roles
  const presentRoles = new Set<StructuralRole>();
  for (const { card } of ingredients) {
    for (const role of card.roles) {
      presentRoles.add(role);
    }
  }

  // Compute intersection
  const intersection = new Set<StructuralRole>();
  for (const role of requiredRoles) {
    if (presentRoles.has(role)) {
      intersection.add(role);
    }
  }

  const coverage = requiredRoles.size > 0 ? intersection.size / requiredRoles.size : 1;

  // Compute missing roles
  const missingRoles = new Set<StructuralRole>();
  for (const role of requiredRoles) {
    if (!presentRoles.has(role)) {
      missingRoles.add(role);
    }
  }

  return {
    passed: coverage >= threshold,
    coverage,
    threshold,
    presentRoles,
    requiredRoles,
    missingRoles,
  };
}

// ─── 3.4 Clash Penalty ──────────────────────────────────────────────────────

/** Clash matrix: ingredient class pair → base clash coefficient c_ab */
type ClashKey = `${IngredientClass}|${IngredientClass}`;
type ClashMatrix = Map<ClashKey, number>;

function clashKey(a: IngredientClass, b: IngredientClass): ClashKey {
  // Ensure consistent ordering for bidirectional lookup
  return a <= b ? `${a}|${b}` : `${b}|${a}`;
}

/** Default clash matrix (Section 3.4.1) */
const DEFAULT_CLASH_MATRIX: ClashMatrix = new Map<ClashKey, number>([
  [clashKey(IngredientClass.CITRUS, IngredientClass.MILK), 0.7],
  [clashKey(IngredientClass.BITTER_GREEN, IngredientClass.SWEET_DESSERT), 0.5],
  [clashKey(IngredientClass.FISHY, IngredientClass.STRONG_FLORAL), 0.6],
  [clashKey(IngredientClass.FISHY, IngredientClass.MILK), 0.5],
  [clashKey(IngredientClass.CRUCIFEROUS, IngredientClass.SWEET_DESSERT), 0.4],
  [clashKey(IngredientClass.FERMENTED, IngredientClass.SWEET_DESSERT), 0.35],
  [clashKey(IngredientClass.FISHY, IngredientClass.SWEET_DESSERT), 0.55],
  [clashKey(IngredientClass.SPICY, IngredientClass.SWEET_DESSERT), 0.3],
]);

/**
 * Compute clash penalty P_clash (Section 3.4.2).
 *
 * For each pair (i,j):
 *   r_ij = c_class(i,j) × g_intensity(i,j) × g_method(H)
 *
 * P_clash = Σ_{i<j} r_ij / N_pairs
 *
 * @param ingredients Dish ingredients with computed alphas
 * @param alphas Normalized influence scalars per ingredient
 * @param heatLevel Global heat level H
 * @param clashMatrix Optional custom clash matrix
 */
export function computeClashPenalty(
  ingredients: DishIngredient[],
  alphas: number[],
  heatLevel: number,
  clashMatrix?: ClashMatrix
): number {
  const cm = clashMatrix ?? DEFAULT_CLASH_MATRIX;
  const n = ingredients.length;

  if (n < 2) return 0;

  let totalRisk = 0;
  let nPairs = 0;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      nPairs++;

      const classA = ingredients[i].card.ingredientClass;
      const classB = ingredients[j].card.ingredientClass;
      const key = clashKey(classA, classB);
      const c = cm.get(key);

      if (c === undefined || c === 0) continue;

      // g_intensity = min(1, (α_i + α_j) / 2)
      const gIntensity = Math.min(1, (alphas[i] + alphas[j]) / 2);

      // g_method: higher heat amplifies curdle/bitterness risks
      const gMethod = 1.0 + 0.5 * heatLevel;

      const r = c * gIntensity * gMethod;
      totalRisk += r;
    }
  }

  if (nPairs === 0) return 0;

  return Math.min(1, totalRisk / nPairs);
}

// ─── 3.5 Final Compatibility Score ──────────────────────────────────────────

/** Score weights from the spec */
const WEIGHT_SIMILARITY = 0.45;
const WEIGHT_BALANCE = 0.35;
const WEIGHT_STRUCTURAL = 0.20;
const WEIGHT_CLASH_PENALTY = 0.40;

/** Base uncertainty per score type */
const UNCERTAINTY_BASE = 0.06;
const UNCERTAINTY_CLASH_CONTRIB = 0.04;

/**
 * Compute the final compatibility score (Section 3.5).
 *
 * Score = 0.45×S_sim + 0.35×S_bal + 0.20×S_struct - 0.40×P_clash
 *
 * Typical uncertainty: δScore ≈ ±0.06–0.10
 */
export function computeFinalScore(components: ScoreComponents): ScoredResult {
  const score =
    WEIGHT_SIMILARITY * components.similarity +
    WEIGHT_BALANCE * components.balance +
    WEIGHT_STRUCTURAL * components.structural -
    WEIGHT_CLASH_PENALTY * components.clashPenalty;

  // Uncertainty estimate: base + clash contribution
  const uncertainty = UNCERTAINTY_BASE + UNCERTAINTY_CLASH_CONTRIB * components.clashPenalty;

  return { score, uncertainty, components };
}

/**
 * Interpret a compatibility score (Section 3.5).
 */
export function interpretScore(score: number): string {
  if (score > 0.75) return "Strong coherence, minimal clash";
  if (score >= 0.55) return "Workable, minor issues";
  if (score >= 0.30) return "Moderate clash/imbalance; requires fixing";
  if (score >= 0.00) return "High clash risk; major intervention needed";
  return "Severe clash; incompatible combination";
}

export { DEFAULT_CLASH_MATRIX, clashKey, type ClashMatrix, type ClashKey };
