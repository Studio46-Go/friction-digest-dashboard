/**
 * MFP v1.1 - Output Actions (Section 4)
 *
 * 4.1 Best Add-Ins
 * 4.2 Minimal Fix Moves
 * 4.3 Substitutions
 * 4.4 Method Adjustments
 */

import { FLAVOR_DIMENSIONS, FlavorDimension } from "../types/flavor-space.js";
import type { FlavorVector } from "../types/flavor-space.js";
import type { IngredientCard, DishIngredient } from "../types/ingredient.js";
import { StructuralRole, SolubilityClass } from "../types/ingredient.js";
import { CookingMethod, DishType } from "../types/method.js";
import type { Recommendation, StructuralGateResult, ScoreComponents } from "../types/scoring.js";
import { computeDishVector, type DishComputationConfig } from "./dish-computation.js";
import {
  computeSimilarity,
  computeBalanceScore,
  evaluateStructuralCoverage,
  computeClashPenalty,
  computeFinalScore,
} from "./scoring.js";
import { computeAlpha } from "./normalization.js";
import { cosineSimilarity } from "./vector-math.js";

/** Context needed for generating recommendations */
export interface RecommendationContext {
  ingredients: DishIngredient[];
  method: CookingMethod;
  heatLevel: number;
  dishType: DishType;
  targetProfile: FlavorVector;
  balanceWeights: FlavorVector;
  currentScore: number;
  currentComponents: ScoreComponents;
  normalizedVector: FlavorVector;
  structuralGate: StructuralGateResult;
  candidateIngredients: IngredientCard[];
  methodOverrides?: Map<string, { method: CookingMethod; heatLevel: number }>;
}

/**
 * 4.1 Best Add-Ins
 *
 * For each candidate ingredient k, compute ΔScore when added.
 * Return Top-N with recommended quantity ranges.
 */
export function findBestAddIns(
  ctx: RecommendationContext,
  topN: number = 5
): Recommendation[] {
  const results: Recommendation[] = [];

  for (const candidate of ctx.candidateIngredients) {
    // Skip if already in the dish
    if (ctx.ingredients.some((ing) => ing.card.id === candidate.id)) continue;

    // Try adding at a mid-range quantity
    const testQuantities = getTestQuantities(candidate, ctx.dishType);

    let bestDelta = -Infinity;
    let bestQty = testQuantities[0];

    for (const qty of testQuantities) {
      const newIngredients: DishIngredient[] = [
        ...ctx.ingredients,
        { card: candidate, quantity: qty },
      ];

      const config: DishComputationConfig = {
        ingredients: newIngredients,
        method: ctx.method,
        heatLevel: ctx.heatLevel,
        dishType: ctx.dishType,
        methodOverrides: ctx.methodOverrides,
      };

      const result = computeDishVector(config);
      const sim = computeSimilarity(result.normalizedVector, ctx.targetProfile);
      const bal = computeBalanceScore(result.normalizedVector, ctx.targetProfile, ctx.balanceWeights);
      const struct = evaluateStructuralCoverage(newIngredients, ctx.dishType);
      const alphas = newIngredients.map((ing) =>
        computeAlpha(ing.quantity, ing.card.roles, ctx.dishType)
      );
      const clash = computeClashPenalty(newIngredients, alphas, ctx.heatLevel);

      const components: ScoreComponents = {
        similarity: sim,
        balance: bal,
        structural: struct.coverage,
        clashPenalty: clash,
      };

      const scored = computeFinalScore(components);
      const delta = scored.score - ctx.currentScore;

      if (delta > bestDelta) {
        bestDelta = delta;
        bestQty = qty;
      }
    }

    if (bestDelta > 0) {
      results.push({
        type: "ADD_IN",
        description: `Add ${candidate.name} to improve flavor profile`,
        deltaScore: bestDelta,
        ingredientId: candidate.id,
        quantityRange: {
          min: Math.round(bestQty * 0.5),
          max: Math.round(bestQty * 1.5),
        },
      });
    }
  }

  // Sort by deltaScore descending, return top N
  results.sort((a, b) => b.deltaScore - a.deltaScore);
  return results.slice(0, topN);
}

/**
 * 4.2 Minimal Fix Moves
 *
 * Identify largest balance deviations and recommend fixes.
 */
export function findMinimalFixes(ctx: RecommendationContext): Recommendation[] {
  const fixes: Recommendation[] = [];
  const { normalizedVector, targetProfile, balanceWeights } = ctx;

  // Find the largest deviations
  const deviations: { dim: number; delta: number; label: string }[] = [];
  for (let k = 0; k < FLAVOR_DIMENSIONS; k++) {
    const delta = normalizedVector[k] - targetProfile[k];
    const weightedDelta = Math.abs(delta) * balanceWeights[k];
    if (weightedDelta > 0.05) {
      deviations.push({
        dim: k,
        delta,
        label: FlavorDimension[k],
      });
    }
  }

  deviations.sort((a, b) => Math.abs(b.delta) * b.dim - Math.abs(a.delta) * a.dim);
  // Re-sort by weighted magnitude
  deviations.sort(
    (a, b) =>
      Math.abs(b.delta) * ctx.balanceWeights[b.dim] -
      Math.abs(a.delta) * ctx.balanceWeights[a.dim]
  );

  for (const dev of deviations.slice(0, 3)) {
    const fix = generateFixForDeviation(dev.dim, dev.delta, dev.label);
    if (fix) fixes.push(fix);
  }

  // Add structural fixes if gate failed
  if (!ctx.structuralGate.passed) {
    for (const role of ctx.structuralGate.missingRoles) {
      fixes.push({
        type: "FIX",
        description: `Add ingredient with ${role} role to meet structural requirements`,
        deltaScore: 0.05, // Estimated improvement per missing role
      });
    }
  }

  return fixes;
}

function generateFixForDeviation(
  dim: number,
  delta: number,
  label: string
): Recommendation | null {
  // delta > 0 means too much of this dimension, delta < 0 means too little
  if (delta > 0.1) {
    return {
      type: "FIX",
      description: `Reduce ${label} intensity — consider reducing dominant ${label.toLowerCase()} ingredients or balancing with complementary flavors`,
      deltaScore: Math.abs(delta) * 0.1,
    };
  }
  if (delta < -0.1) {
    const suggestion = getFillSuggestion(dim);
    return {
      type: "FIX",
      description: `Increase ${label} — ${suggestion}`,
      deltaScore: Math.abs(delta) * 0.1,
    };
  }
  return null;
}

function getFillSuggestion(dim: number): string {
  const suggestions: Partial<Record<FlavorDimension, string>> = {
    [FlavorDimension.UMAMI]: "add tomato paste, soy sauce, browning, or fermented element",
    [FlavorDimension.SALT]: "adjust seasoning with salt or soy sauce",
    [FlavorDimension.SWEET]: "add a touch of sweetener, caramelized onion, or sweet vegetable",
    [FlavorDimension.SOUR]: "add acid finish (lemon, vinegar, pickled element)",
    [FlavorDimension.BITTER]: "add bitter greens, dark chocolate, or coffee element",
    [FlavorDimension.HEAT_PEPPER]: "add chili, black pepper, or hot sauce",
    [FlavorDimension.WARM_SPICE]: "bloom warm spices in fat (cumin, cinnamon, coriander)",
    [FlavorDimension.SMOKE]: "add smoked ingredient or apply smoke method",
    [FlavorDimension.ROASTED]: "increase browning, roast vegetables, or toast nuts",
    [FlavorDimension.FAT_RICH]: "add butter, oil, or cream",
    [FlavorDimension.CREAMY]: "add cream, yogurt, or coconut milk",
    [FlavorDimension.HERBAL]: "add fresh herbs as raw finish",
    [FlavorDimension.CITRUS]: "add citrus zest or juice as raw finish",
    [FlavorDimension.ALLIUM]: "add sauteed or raw allium (onion, garlic, shallot)",
    [FlavorDimension.FERMENT]: "add fermented element (miso, kimchi, fish sauce)",
    [FlavorDimension.EARTHY]: "add mushrooms, root vegetables, or earthy spices",
    [FlavorDimension.NUTTY]: "toast and add nuts or seeds",
    [FlavorDimension.FLORAL]: "add edible flowers, rose water, or lavender",
    [FlavorDimension.TEXTURE_CRISP]: "add crispy element (toasted breadcrumbs, fried shallots)",
    [FlavorDimension.TEXTURE_TENDER]: "braise or slow-cook for tender texture",
  };
  return suggestions[dim as FlavorDimension] ?? "adjust ingredients to increase this dimension";
}

/**
 * 4.3 Substitutions
 *
 * Find ingredient substitutes j for i maximizing S_sim(V_i, V_j)
 * while reducing P_clash and preserving role R.
 */
export function findSubstitutions(
  ctx: RecommendationContext,
  topN: number = 3
): Recommendation[] {
  const results: Recommendation[] = [];

  for (const existing of ctx.ingredients) {
    for (const candidate of ctx.candidateIngredients) {
      // Skip same ingredient
      if (candidate.id === existing.card.id) continue;

      // Must share at least one structural role
      let sharesRole = false;
      for (const role of existing.card.roles) {
        if (candidate.roles.has(role)) {
          sharesRole = true;
          break;
        }
      }
      if (!sharesRole) continue;

      // Compute similarity between original and substitute vectors
      const vectorSim = cosineSimilarity(existing.card.vector, candidate.vector);
      if (vectorSim < 0.3) continue; // Too different to be a substitute

      // Compute score with substitution
      const newIngredients = ctx.ingredients.map((ing) =>
        ing.card.id === existing.card.id
          ? { card: candidate, quantity: ing.quantity }
          : ing
      );

      const config: DishComputationConfig = {
        ingredients: newIngredients,
        method: ctx.method,
        heatLevel: ctx.heatLevel,
        dishType: ctx.dishType,
        methodOverrides: ctx.methodOverrides,
      };

      const result = computeDishVector(config);
      const sim = computeSimilarity(result.normalizedVector, ctx.targetProfile);
      const bal = computeBalanceScore(
        result.normalizedVector,
        ctx.targetProfile,
        ctx.balanceWeights
      );
      const struct = evaluateStructuralCoverage(newIngredients, ctx.dishType);
      const alphas = newIngredients.map((ing) =>
        computeAlpha(ing.quantity, ing.card.roles, ctx.dishType)
      );
      const clash = computeClashPenalty(newIngredients, alphas, ctx.heatLevel);

      const components: ScoreComponents = {
        similarity: sim,
        balance: bal,
        structural: struct.coverage,
        clashPenalty: clash,
      };

      const scored = computeFinalScore(components);
      const delta = scored.score - ctx.currentScore;

      if (delta > 0) {
        results.push({
          type: "SUBSTITUTION",
          description: `Replace ${existing.card.name} with ${candidate.name}`,
          deltaScore: delta,
          replaceIngredientId: existing.card.id,
          withIngredientId: candidate.id,
        });
      }
    }
  }

  results.sort((a, b) => b.deltaScore - a.deltaScore);
  return results.slice(0, topN);
}

/**
 * 4.4 Method Adjustments
 *
 * Recommend cooking method changes based on profile gaps.
 */
export function findMethodAdjustments(ctx: RecommendationContext): Recommendation[] {
  const adjustments: Recommendation[] = [];
  const { normalizedVector, targetProfile } = ctx;

  // Check if CITRUS/HERBAL are low and heat is high → suggest RAW_FINISH
  const herbalGap = targetProfile[FlavorDimension.HERBAL] - normalizedVector[FlavorDimension.HERBAL];
  const citrusGap = targetProfile[FlavorDimension.CITRUS] - normalizedVector[FlavorDimension.CITRUS];

  if ((herbalGap > 0.1 || citrusGap > 0.1) && ctx.heatLevel > 0.5) {
    adjustments.push({
      type: "METHOD_ADJUSTMENT",
      description:
        "Add RAW_FINISH step for herbs/citrus to preserve volatile aromatics lost during high-heat cooking",
      deltaScore: (herbalGap + citrusGap) * 0.05,
      methodChange: "RAW_FINISH",
    });
  }

  // Check if WARM_SPICE target is high and spices are fat-soluble → suggest BLOOM_IN_FAT
  const spiceGap =
    targetProfile[FlavorDimension.WARM_SPICE] - normalizedVector[FlavorDimension.WARM_SPICE];
  if (spiceGap > 0.1) {
    const hasFatSolubleSpice = ctx.ingredients.some(
      (ing) =>
        ing.card.solubility === SolubilityClass.FAT &&
        ing.card.roles.has(StructuralRole.AROMATIC)
    );
    if (hasFatSolubleSpice) {
      adjustments.push({
        type: "METHOD_ADJUSTMENT",
        description:
          "Bloom fat-soluble spices early in oil to maximize warm spice extraction",
        deltaScore: spiceGap * 0.05,
        methodChange: "BLOOM_IN_FAT",
      });
    }
  }

  // Check if SMOKE is desired but low
  const smokeGap = targetProfile[FlavorDimension.SMOKE] - normalizedVector[FlavorDimension.SMOKE];
  if (smokeGap > 0.15) {
    adjustments.push({
      type: "METHOD_ADJUSTMENT",
      description: "Apply smoke method or grill to develop smoky character",
      deltaScore: smokeGap * 0.05,
      methodChange: "SMOKE_METHOD",
    });
  }

  // Check if TEXTURE_CRISP is desired but low
  const crispGap =
    targetProfile[FlavorDimension.TEXTURE_CRISP] -
    normalizedVector[FlavorDimension.TEXTURE_CRISP];
  if (crispGap > 0.15) {
    adjustments.push({
      type: "METHOD_ADJUSTMENT",
      description: "Finish with high-heat sear or deep-fry for crispy texture",
      deltaScore: crispGap * 0.05,
      methodChange: "HIGH_HEAT_SEAR",
    });
  }

  return adjustments;
}

/** Get test quantities for a candidate ingredient based on its roles */
function getTestQuantities(card: IngredientCard, dishType: DishType): number[] {
  const isPrimary = card.roles.has(StructuralRole.PROTEIN) ||
    card.roles.has(StructuralRole.STARCH) ||
    card.roles.has(StructuralRole.VEGETABLE);
  const isFinish = card.roles.has(StructuralRole.HERB_FINISH);

  if (isPrimary) {
    return dishType === "SNACK" as DishType ? [30, 60, 100] : [50, 100, 200];
  }
  if (isFinish) {
    return [3, 5, 10];
  }
  return [10, 25, 50];
}
