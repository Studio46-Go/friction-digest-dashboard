/**
 * MFP v1.1 - Engine Orchestrator
 *
 * Main entry point that combines all subsystems to produce
 * the full MFPEngineOutput per the Output Contract (Section 7).
 */

import {
  type FlavorVector,
  type DishIngredient,
  type IngredientCard,
  CookingMethod,
  DishType,
  type MFPEngineOutput,
  type Recommendation,
  type ScoreComponents,
  computeDishVector,
  type DishComputationConfig,
  computeAlpha,
  computeSimilarity,
  computeBalanceScore,
  evaluateStructuralCoverage,
  computeClashPenalty,
  computeFinalScore,
  findBestAddIns,
  findMinimalFixes,
  findSubstitutions,
  findMethodAdjustments,
  type RecommendationContext,
} from "@studio46/mfp-core";
import { getStyleTarget, type StyleTarget, getAllIngredients } from "@studio46/mfp-data";

/** Input configuration for the MFP engine */
export interface MFPEngineInput {
  /** Ingredients with quantities */
  ingredients: DishIngredient[];

  /** Primary cooking method */
  method: CookingMethod;

  /** Heat level H ∈ [0, 1] */
  heatLevel: number;

  /** Dish type */
  dishType: DishType;

  /** Style target ID (e.g., "italian", "japanese") */
  styleTargetId: string;

  /** Optional per-ingredient method overrides */
  methodOverrides?: Map<string, { method: CookingMethod; heatLevel: number }>;

  /** Optional candidate ingredients for recommendations (defaults to full library) */
  candidateIngredients?: IngredientCard[];

  /** Number of top add-in recommendations to return (default: 5) */
  topAddIns?: number;

  /** Number of top substitution recommendations to return (default: 3) */
  topSubstitutions?: number;
}

/**
 * Run the full MFP engine pipeline.
 *
 * Pipeline:
 *   1. Compute dish vector (Section 2)
 *   2. Evaluate structural coverage (Section 3.3)
 *   3. Compute similarity to target (Section 3.1)
 *   4. Compute balance score (Section 3.2)
 *   5. Compute clash penalty (Section 3.4)
 *   6. Compute final score (Section 3.5)
 *   7. Generate recommendations (Section 4)
 *   8. Return full output (Section 7)
 */
export function runMFPEngine(input: MFPEngineInput): MFPEngineOutput {
  const {
    ingredients,
    method,
    heatLevel,
    dishType,
    styleTargetId,
    methodOverrides,
    topAddIns = 5,
    topSubstitutions = 3,
  } = input;

  // Resolve style target
  const styleTarget = getStyleTarget(styleTargetId);
  if (!styleTarget) {
    throw new Error(`Style target not found: ${styleTargetId}`);
  }

  // Step 1: Compute dish vector
  const dishConfig: DishComputationConfig = {
    ingredients,
    method,
    heatLevel,
    dishType,
    methodOverrides,
  };

  const { dishVector, normalizedVector, contributions } = computeDishVector(dishConfig);

  // Step 2: Structural coverage
  const structuralGate = evaluateStructuralCoverage(ingredients, dishType);

  // Step 3: Similarity to target
  const similarity = computeSimilarity(normalizedVector, styleTarget.profile);

  // Step 4: Balance score
  const balance = computeBalanceScore(
    normalizedVector,
    styleTarget.profile,
    styleTarget.weights
  );

  // Step 5: Clash penalty
  const alphas = ingredients.map((ing) =>
    computeAlpha(ing.quantity, ing.card.roles, dishType)
  );
  const clashPenalty = computeClashPenalty(ingredients, alphas, heatLevel);

  // Step 6: Final score
  const components: ScoreComponents = {
    similarity,
    balance,
    structural: structuralGate.coverage,
    clashPenalty,
  };
  const scored = computeFinalScore(components);

  // Step 7: Recommendations
  const candidateIngredients = input.candidateIngredients ?? getAllIngredients();

  const recContext: RecommendationContext = {
    ingredients,
    method,
    heatLevel,
    dishType,
    targetProfile: styleTarget.profile,
    balanceWeights: styleTarget.weights,
    currentScore: scored.score,
    currentComponents: components,
    normalizedVector,
    structuralGate,
    candidateIngredients,
    methodOverrides,
  };

  const recommendations: Recommendation[] = [
    ...findBestAddIns(recContext, topAddIns),
    ...findMinimalFixes(recContext),
    ...findSubstitutions(recContext, topSubstitutions),
    ...findMethodAdjustments(recContext),
  ];

  // Sort all recommendations by delta score
  recommendations.sort((a, b) => b.deltaScore - a.deltaScore);

  // Step 8: Return full output
  return {
    dishVector,
    normalizedVector,
    contributions,
    scored,
    structuralGate,
    recommendations,
  };
}
