export { computeAlpha, getNormalizationConstants } from "./normalization.js";
export { applyMethodKernel } from "./method-kernel.js";
export {
  dot,
  norm,
  normInf,
  cosineSimilarity,
  addVectors,
  subtractVectors,
  scaleVector,
  absVector,
  normalizeToProfile,
  bankersRound,
  withinTolerance,
  EPSILON_ABS,
  EPSILON_REL,
} from "./vector-math.js";
export {
  computeDishVector,
  type DishComputationConfig,
  type DishComputationResult,
} from "./dish-computation.js";
export {
  computeSimilarity,
  computeBalanceScore,
  evaluateStructuralCoverage,
  computeClashPenalty,
  computeFinalScore,
  interpretScore,
} from "./scoring.js";
export {
  findBestAddIns,
  findMinimalFixes,
  findSubstitutions,
  findMethodAdjustments,
  type RecommendationContext,
} from "./recommendations.js";
