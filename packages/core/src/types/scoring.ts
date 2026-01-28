/**
 * MFP v1.1 - Scoring & Output Types (Sections 3, 7)
 */

import type { FlavorVector } from "./flavor-space.js";
import type { StructuralRole } from "./ingredient.js";

/** Individual score components */
export interface ScoreComponents {
  /** Cosine similarity score S_sim ∈ [-1, 1] */
  similarity: number;

  /** Balance score S_bal ∈ [0, 1] */
  balance: number;

  /** Structural coverage S_struct ∈ [0, 1] */
  structural: number;

  /** Clash penalty P_clash ∈ [0, 1] */
  clashPenalty: number;
}

/** Score with uncertainty bounds */
export interface ScoredResult {
  /** Final compatibility score */
  score: number;

  /** Score uncertainty δScore */
  uncertainty: number;

  /** Component breakdown */
  components: ScoreComponents;
}

/** Ingredient contribution breakdown per dimension */
export interface IngredientContribution {
  ingredientId: string;
  ingredientName: string;
  /** Per-dimension contribution (α_i × p_i × V_i') */
  contribution: FlavorVector;
  /** Normalized influence scalar α_i */
  alpha: number;
}

/** Structural gating result */
export interface StructuralGateResult {
  passed: boolean;
  coverage: number;
  threshold: number;
  presentRoles: Set<StructuralRole>;
  requiredRoles: Set<StructuralRole>;
  missingRoles: Set<StructuralRole>;
}

/** Recommendation for an add-in, substitution, or fix */
export interface Recommendation {
  type: "ADD_IN" | "SUBSTITUTION" | "FIX" | "METHOD_ADJUSTMENT";
  description: string;
  /** Change in final score if applied */
  deltaScore: number;
  /** For add-ins: the ingredient to add */
  ingredientId?: string;
  /** For substitutions: replace this ingredient */
  replaceIngredientId?: string;
  /** For substitutions: with this ingredient */
  withIngredientId?: string;
  /** Recommended quantity range */
  quantityRange?: { min: number; max: number };
  /** For method adjustments */
  methodChange?: string;
}

/** Full engine output (Section 7 - Output Contract) */
export interface MFPEngineOutput {
  /** Raw dish vector V_dish (20-dim) */
  dishVector: FlavorVector;

  /** Normalized dish vector V_norm */
  normalizedVector: FlavorVector;

  /** Per-ingredient contribution breakdown */
  contributions: IngredientContribution[];

  /** Scored result with components and uncertainty */
  scored: ScoredResult;

  /** Structural gate result */
  structuralGate: StructuralGateResult;

  /** Top recommendations (add-ins, substitutions, fixes) */
  recommendations: Recommendation[];
}
