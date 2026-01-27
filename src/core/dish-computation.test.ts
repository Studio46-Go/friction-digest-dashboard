import { describe, it, expect } from "vitest";
import { computeDishVector } from "./dish-computation.js";
import { flavorVector, FlavorDimension, FLAVOR_DIMENSIONS } from "../types/flavor-space.js";
import { StructuralRole, SolubilityClass, IngredientClass } from "../types/ingredient.js";
import type { IngredientCard, DishIngredient } from "../types/ingredient.js";
import { CookingMethod, DishType } from "../types/method.js";
import { withinTolerance } from "./vector-math.js";

function makeCard(overrides: Partial<IngredientCard> & { id: string }): IngredientCard {
  return {
    name: overrides.id,
    vector: flavorVector(new Array(FLAVOR_DIMENSIONS).fill(0)),
    potency: 0.8,
    volatility: 0.1,
    solubility: SolubilityClass.WATER,
    roles: new Set([StructuralRole.PROTEIN]),
    ingredientClass: IngredientClass.NEUTRAL,
    ...overrides,
  };
}

describe("dish-computation", () => {
  it("produces a 20-dimensional dish vector", () => {
    const ingredients: DishIngredient[] = [
      {
        card: makeCard({
          id: "test",
          vector: flavorVector([2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
        }),
        quantity: 200,
      },
    ];

    const result = computeDishVector({
      ingredients,
      method: CookingMethod.RAW,
      heatLevel: 0,
      dishType: DishType.COMPLETE_PLATE,
    });

    expect(result.dishVector.length).toBe(FLAVOR_DIMENSIONS);
    expect(result.normalizedVector.length).toBe(FLAVOR_DIMENSIONS);
  });

  it("aggregates multiple ingredients", () => {
    const ingredients: DishIngredient[] = [
      {
        card: makeCard({
          id: "a",
          vector: flavorVector([2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
          potency: 1.0,
        }),
        quantity: 200, // α = 1.0 for PRIMARY
      },
      {
        card: makeCard({
          id: "b",
          vector: flavorVector([0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
          potency: 1.0,
          roles: new Set([StructuralRole.FAT]),
        }),
        quantity: 50, // α = 1.0 for SUPPORT
      },
    ];

    const result = computeDishVector({
      ingredients,
      method: CookingMethod.RAW,
      heatLevel: 0,
      dishType: DishType.COMPLETE_PLATE,
    });

    // V_dish[UMAMI] = 1.0 * 1.0 * 2 = 2.0
    expect(result.dishVector[FlavorDimension.UMAMI]).toBeCloseTo(2.0);
    // V_dish[SALT] = 1.0 * 1.0 * 3 = 3.0
    expect(result.dishVector[FlavorDimension.SALT]).toBeCloseTo(3.0);
  });

  it("respects α scaling based on quantity", () => {
    const card = makeCard({
      id: "test",
      vector: flavorVector([4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      potency: 1.0,
    });

    const full = computeDishVector({
      ingredients: [{ card, quantity: 200 }], // α = 1.0
      method: CookingMethod.RAW,
      heatLevel: 0,
      dishType: DishType.COMPLETE_PLATE,
    });

    const half = computeDishVector({
      ingredients: [{ card, quantity: 100 }], // α = 0.5
      method: CookingMethod.RAW,
      heatLevel: 0,
      dishType: DishType.COMPLETE_PLATE,
    });

    expect(full.dishVector[0]).toBeCloseTo(2 * half.dishVector[0]);
  });

  it("applies method kernel transformations", () => {
    const herbCard = makeCard({
      id: "herb",
      vector: flavorVector([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 3, 0, 0, 0, 0, 0, 0, 0]),
      potency: 1.0,
      volatility: 0.8,
      roles: new Set([StructuralRole.HERB_FINISH]),
    });

    const raw = computeDishVector({
      ingredients: [{ card: herbCard, quantity: 10 }],
      method: CookingMethod.RAW,
      heatLevel: 0,
      dishType: DishType.COMPLETE_PLATE,
    });

    const seared = computeDishVector({
      ingredients: [{ card: herbCard, quantity: 10 }],
      method: CookingMethod.HIGH_HEAT_SEAR,
      heatLevel: 0.9,
      dishType: DishType.COMPLETE_PLATE,
    });

    // High heat sear should reduce herbal values
    expect(seared.dishVector[FlavorDimension.HERBAL]).toBeLessThan(
      raw.dishVector[FlavorDimension.HERBAL]
    );
  });

  it("supports per-ingredient method overrides", () => {
    const protein = makeCard({
      id: "protein",
      vector: flavorVector([3, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2]),
      potency: 0.8,
    });
    const herb = makeCard({
      id: "herb",
      vector: flavorVector([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 3, 0, 0, 0, 0, 1, 0, 0]),
      potency: 0.8,
      volatility: 0.8,
      roles: new Set([StructuralRole.HERB_FINISH]),
    });

    const overrides = new Map([
      ["herb", { method: CookingMethod.RAW_FINISH, heatLevel: 0 }],
    ]);

    const result = computeDishVector({
      ingredients: [
        { card: protein, quantity: 200 },
        { card: herb, quantity: 10 },
      ],
      method: CookingMethod.HIGH_HEAT_SEAR,
      heatLevel: 0.8,
      dishType: DishType.COMPLETE_PLATE,
      methodOverrides: overrides,
    });

    // Herb should have RAW_FINISH modifiers (boosted HERBAL), not HIGH_HEAT_SEAR
    expect(result.contributions.length).toBe(2);
    expect(result.contributions[1].ingredientId).toBe("herb");
  });

  it("returns per-ingredient contribution breakdown", () => {
    const ingredients: DishIngredient[] = [
      {
        card: makeCard({
          id: "a",
          vector: flavorVector([2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
        }),
        quantity: 200,
      },
      {
        card: makeCard({
          id: "b",
          vector: flavorVector([0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
          roles: new Set([StructuralRole.FAT]),
        }),
        quantity: 50,
      },
    ];

    const result = computeDishVector({
      ingredients,
      method: CookingMethod.RAW,
      heatLevel: 0,
      dishType: DishType.COMPLETE_PLATE,
    });

    expect(result.contributions.length).toBe(2);
    expect(result.contributions[0].ingredientId).toBe("a");
    expect(result.contributions[1].ingredientId).toBe("b");

    // Verify contributions sum to dish vector (Section 1.5 tolerance)
    for (let k = 0; k < FLAVOR_DIMENSIONS; k++) {
      const sum = result.contributions.reduce((s, c) => s + c.contribution[k], 0);
      expect(withinTolerance(sum, result.dishVector[k])).toBe(true);
    }
  });
});
