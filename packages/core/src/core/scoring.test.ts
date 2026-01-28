import { describe, it, expect } from "vitest";
import {
  computeSimilarity,
  computeBalanceScore,
  evaluateStructuralCoverage,
  computeClashPenalty,
  computeFinalScore,
  interpretScore,
} from "./scoring.js";
import { flavorVector, createFlavorVector } from "../types/flavor-space.js";
import { StructuralRole, SolubilityClass, IngredientClass } from "../types/ingredient.js";
import type { DishIngredient, IngredientCard } from "../types/ingredient.js";
import { DishType } from "../types/method.js";
import type { ScoreComponents } from "../types/scoring.js";

function makeCard(
  id: string,
  roles: StructuralRole[],
  ingredientClass: IngredientClass = IngredientClass.NEUTRAL
): IngredientCard {
  return {
    id,
    name: id,
    vector: createFlavorVector(),
    potency: 0.5,
    volatility: 0.1,
    solubility: SolubilityClass.WATER,
    roles: new Set(roles),
    ingredientClass,
  };
}

function makeIngredient(
  id: string,
  roles: StructuralRole[],
  qty: number,
  ingredientClass: IngredientClass = IngredientClass.NEUTRAL
): DishIngredient {
  return { card: makeCard(id, roles, ingredientClass), quantity: qty };
}

describe("scoring", () => {
  describe("computeSimilarity (3.1)", () => {
    it("returns high similarity for similar profiles", () => {
      const a = flavorVector([0.5, 0.3, 0.2, 0.4, 0, 0, 0, 0, 0, 0.5, 0, 0.3, 0, 0, 0, 0, 0, 0, 0, 0]);
      const b = flavorVector([0.6, 0.3, 0.2, 0.3, 0, 0, 0, 0, 0, 0.4, 0, 0.4, 0, 0, 0, 0, 0, 0, 0, 0]);
      const sim = computeSimilarity(a, b);
      expect(sim).toBeGreaterThan(0.9);
    });

    it("returns low similarity for very different profiles", () => {
      const a = flavorVector([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      const b = flavorVector([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
      const sim = computeSimilarity(a, b);
      expect(sim).toBe(0);
    });
  });

  describe("computeBalanceScore (3.2)", () => {
    it("returns 1.0 for perfect match", () => {
      const profile = flavorVector([0.5, 0.3, 0.2, 0.4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      const weights = flavorVector([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
      expect(computeBalanceScore(profile, profile, weights)).toBe(1.0);
    });

    it("returns lower score for larger deviations", () => {
      const norm = flavorVector([0.8, 0.1, 0.1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      const target = flavorVector([0.2, 0.5, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      const weights = flavorVector([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
      const score = computeBalanceScore(norm, target, weights);
      expect(score).toBeLessThan(1.0);
      expect(score).toBeGreaterThanOrEqual(0);
    });

    it("respects dimension weights", () => {
      const norm = flavorVector([0.8, 0.0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      const target = flavorVector([0.3, 0.0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      const highWeight = flavorVector([5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
      const lowWeight = flavorVector([0.1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);

      const scoreHigh = computeBalanceScore(norm, target, highWeight);
      const scoreLow = computeBalanceScore(norm, target, lowWeight);
      // High weight on the deviating dimension → lower balance score
      expect(scoreHigh).toBeLessThan(scoreLow);
    });
  });

  describe("evaluateStructuralCoverage (3.3)", () => {
    it("returns full coverage when all required roles are present", () => {
      const ingredients: DishIngredient[] = [
        makeIngredient("protein", [StructuralRole.PROTEIN], 200),
        makeIngredient("fat", [StructuralRole.FAT], 30),
        makeIngredient("acid", [StructuralRole.ACID], 10),
        makeIngredient("aromatic", [StructuralRole.AROMATIC], 20),
        makeIngredient("starch", [StructuralRole.STARCH], 150),
        makeIngredient("veg", [StructuralRole.VEGETABLE], 100),
        makeIngredient("herb", [StructuralRole.HERB_FINISH], 5),
      ];
      const result = evaluateStructuralCoverage(ingredients, DishType.COMPLETE_PLATE);
      expect(result.coverage).toBe(1.0);
      expect(result.passed).toBe(true);
      expect(result.missingRoles.size).toBe(0);
    });

    it("identifies missing roles", () => {
      const ingredients: DishIngredient[] = [
        makeIngredient("protein", [StructuralRole.PROTEIN], 200),
        makeIngredient("fat", [StructuralRole.FAT], 30),
      ];
      const result = evaluateStructuralCoverage(ingredients, DishType.COMPLETE_PLATE);
      expect(result.coverage).toBeLessThan(1.0);
      expect(result.missingRoles.size).toBeGreaterThan(0);
      expect(result.missingRoles.has(StructuralRole.ACID)).toBe(true);
    });

    it("uses correct threshold for dish type", () => {
      const ingredients: DishIngredient[] = [
        makeIngredient("fat", [StructuralRole.FAT], 30),
        makeIngredient("acid", [StructuralRole.ACID], 10),
        makeIngredient("aromatic", [StructuralRole.AROMATIC], 20),
      ];
      // SNACK requires FAT, ACID, AROMATIC (3 roles) → full coverage
      const result = evaluateStructuralCoverage(ingredients, DishType.SNACK);
      expect(result.passed).toBe(true);
    });

    it("fails gate when coverage below threshold", () => {
      const ingredients: DishIngredient[] = [
        makeIngredient("protein", [StructuralRole.PROTEIN], 200),
      ];
      const result = evaluateStructuralCoverage(ingredients, DishType.COMPLETE_PLATE);
      expect(result.passed).toBe(false);
    });
  });

  describe("computeClashPenalty (3.4)", () => {
    it("returns 0 for no clashing ingredients", () => {
      const ingredients: DishIngredient[] = [
        makeIngredient("a", [StructuralRole.PROTEIN], 200, IngredientClass.NEUTRAL),
        makeIngredient("b", [StructuralRole.STARCH], 150, IngredientClass.NEUTRAL),
      ];
      const penalty = computeClashPenalty(ingredients, [1.0, 0.75], 0.5);
      expect(penalty).toBe(0);
    });

    it("returns positive penalty for clashing ingredients", () => {
      const ingredients: DishIngredient[] = [
        makeIngredient("citrus", [StructuralRole.ACID], 20, IngredientClass.CITRUS),
        makeIngredient("milk", [StructuralRole.FAT], 100, IngredientClass.MILK),
      ];
      const penalty = computeClashPenalty(ingredients, [0.8, 0.8], 0.7);
      expect(penalty).toBeGreaterThan(0);
    });

    it("penalty increases with heat level", () => {
      const ingredients: DishIngredient[] = [
        makeIngredient("citrus", [StructuralRole.ACID], 20, IngredientClass.CITRUS),
        makeIngredient("milk", [StructuralRole.FAT], 100, IngredientClass.MILK),
      ];
      const lowHeat = computeClashPenalty(ingredients, [0.8, 0.8], 0.1);
      const highHeat = computeClashPenalty(ingredients, [0.8, 0.8], 0.9);
      expect(highHeat).toBeGreaterThan(lowHeat);
    });

    it("returns 0 for single ingredient", () => {
      const ingredients: DishIngredient[] = [
        makeIngredient("one", [StructuralRole.PROTEIN], 200, IngredientClass.FISHY),
      ];
      expect(computeClashPenalty(ingredients, [1.0], 0.5)).toBe(0);
    });
  });

  describe("computeFinalScore (3.5)", () => {
    it("computes weighted sum with correct formula", () => {
      const components: ScoreComponents = {
        similarity: 0.8,
        balance: 0.7,
        structural: 1.0,
        clashPenalty: 0.1,
      };
      const result = computeFinalScore(components);
      // Score = 0.45×0.8 + 0.35×0.7 + 0.20×1.0 - 0.40×0.1
      // = 0.36 + 0.245 + 0.20 - 0.04 = 0.765
      expect(result.score).toBeCloseTo(0.765);
    });

    it("includes uncertainty bounds", () => {
      const components: ScoreComponents = {
        similarity: 0.8,
        balance: 0.7,
        structural: 1.0,
        clashPenalty: 0.1,
      };
      const result = computeFinalScore(components);
      expect(result.uncertainty).toBeGreaterThan(0);
      expect(result.uncertainty).toBeLessThan(0.15);
    });

    it("can go negative with high clash", () => {
      const components: ScoreComponents = {
        similarity: 0.2,
        balance: 0.2,
        structural: 0.3,
        clashPenalty: 1.0,
      };
      const result = computeFinalScore(components);
      expect(result.score).toBeLessThan(0);
    });
  });

  describe("interpretScore (3.5)", () => {
    it("interprets score ranges correctly", () => {
      expect(interpretScore(0.85)).toContain("Strong");
      expect(interpretScore(0.65)).toContain("Workable");
      expect(interpretScore(0.40)).toContain("Moderate");
      expect(interpretScore(0.15)).toContain("High clash");
      expect(interpretScore(-0.3)).toContain("Severe");
    });
  });
});
