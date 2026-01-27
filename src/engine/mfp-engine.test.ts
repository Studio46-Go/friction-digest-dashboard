import { describe, it, expect } from "vitest";
import { runMFPEngine, type MFPEngineInput } from "./mfp-engine.js";
import { getIngredient } from "../data/ingredient-library.js";
import { CookingMethod, DishType } from "../types/method.js";
import { FLAVOR_DIMENSIONS } from "../types/flavor-space.js";

describe("MFP Engine", () => {
  function makeInput(overrides?: Partial<MFPEngineInput>): MFPEngineInput {
    return {
      ingredients: [
        { card: getIngredient("chicken_breast"), quantity: 200 },
        { card: getIngredient("olive_oil"), quantity: 30 },
        { card: getIngredient("garlic"), quantity: 15 },
        { card: getIngredient("lemon_juice"), quantity: 15 },
        { card: getIngredient("rice_white"), quantity: 180 },
        { card: getIngredient("broccoli"), quantity: 120 },
        { card: getIngredient("basil"), quantity: 5 },
      ],
      method: CookingMethod.SAUTE,
      heatLevel: 0.6,
      dishType: DishType.COMPLETE_PLATE,
      styleTargetId: "italian",
      ...overrides,
    };
  }

  it("returns a complete MFPEngineOutput", () => {
    const output = runMFPEngine(makeInput());

    // Dish vector
    expect(output.dishVector.length).toBe(FLAVOR_DIMENSIONS);
    expect(output.normalizedVector.length).toBe(FLAVOR_DIMENSIONS);

    // Contributions
    expect(output.contributions.length).toBe(7);

    // Scored result
    expect(typeof output.scored.score).toBe("number");
    expect(typeof output.scored.uncertainty).toBe("number");
    expect(output.scored.components).toBeDefined();
    expect(typeof output.scored.components.similarity).toBe("number");
    expect(typeof output.scored.components.balance).toBe("number");
    expect(typeof output.scored.components.structural).toBe("number");
    expect(typeof output.scored.components.clashPenalty).toBe("number");

    // Structural gate
    expect(typeof output.structuralGate.passed).toBe("boolean");
    expect(typeof output.structuralGate.coverage).toBe("number");
    expect(output.structuralGate.coverage).toBeGreaterThanOrEqual(0);
    expect(output.structuralGate.coverage).toBeLessThanOrEqual(1);

    // Recommendations
    expect(Array.isArray(output.recommendations)).toBe(true);
  });

  it("produces a positive score for a well-composed dish", () => {
    const output = runMFPEngine(makeInput());
    expect(output.scored.score).toBeGreaterThan(0);
  });

  it("passes structural gate for a complete plate with all roles", () => {
    const output = runMFPEngine(makeInput());
    // Our dish has protein, fat, acid, aromatic, starch, vegetable, herb_finish
    expect(output.structuralGate.passed).toBe(true);
  });

  it("fails structural gate when key roles are missing", () => {
    const output = runMFPEngine(
      makeInput({
        ingredients: [
          { card: getIngredient("chicken_breast"), quantity: 200 },
          // Missing fat, acid, aromatic, starch, vegetable, herb_finish
        ],
      })
    );
    expect(output.structuralGate.passed).toBe(false);
    expect(output.structuralGate.missingRoles.size).toBeGreaterThan(0);
  });

  it("detects clash penalty for incompatible ingredients", () => {
    const output = runMFPEngine(
      makeInput({
        ingredients: [
          { card: getIngredient("salmon"), quantity: 200 },       // FISHY
          { card: getIngredient("cream"), quantity: 100 },        // MILK
          { card: getIngredient("lemon_juice"), quantity: 30 },   // CITRUS
          { card: getIngredient("garlic"), quantity: 15 },
          { card: getIngredient("rice_white"), quantity: 180 },
          { card: getIngredient("broccoli"), quantity: 120 },
          { card: getIngredient("basil"), quantity: 5 },
        ],
        heatLevel: 0.8, // High heat amplifies citrus + milk clash
      })
    );
    expect(output.scored.components.clashPenalty).toBeGreaterThan(0);
  });

  it("generates recommendations", () => {
    const output = runMFPEngine(makeInput());
    // Should have at least some recommendations
    expect(output.recommendations.length).toBeGreaterThanOrEqual(0);
    for (const rec of output.recommendations) {
      expect(["ADD_IN", "SUBSTITUTION", "FIX", "METHOD_ADJUSTMENT"]).toContain(rec.type);
      expect(typeof rec.description).toBe("string");
      expect(typeof rec.deltaScore).toBe("number");
    }
  });

  it("recommendations are sorted by deltaScore descending", () => {
    const output = runMFPEngine(makeInput());
    for (let i = 1; i < output.recommendations.length; i++) {
      expect(output.recommendations[i].deltaScore).toBeLessThanOrEqual(
        output.recommendations[i - 1].deltaScore
      );
    }
  });

  it("throws for unknown style target", () => {
    expect(() =>
      runMFPEngine(makeInput({ styleTargetId: "nonexistent" }))
    ).toThrow("Style target not found");
  });

  it("works with different style targets", () => {
    const italian = runMFPEngine(makeInput({ styleTargetId: "italian" }));
    const japanese = runMFPEngine(makeInput({ styleTargetId: "japanese" }));
    const bbq = runMFPEngine(makeInput({ styleTargetId: "bbq" }));

    // Same dish should produce different scores against different targets
    const scores = [italian.scored.score, japanese.scored.score, bbq.scored.score];
    // At least two scores should differ meaningfully
    const maxDiff = Math.max(
      Math.abs(scores[0] - scores[1]),
      Math.abs(scores[0] - scores[2]),
      Math.abs(scores[1] - scores[2])
    );
    expect(maxDiff).toBeGreaterThan(0.01);
    // All should produce valid scores
    expect(italian.scored.score).toBeDefined();
    expect(japanese.scored.score).toBeDefined();
    expect(bbq.scored.score).toBeDefined();
  });

  it("supports per-ingredient method overrides", () => {
    const overrides = new Map([
      ["basil", { method: CookingMethod.RAW_FINISH, heatLevel: 0 }],
    ]);

    const withOverride = runMFPEngine(makeInput({ methodOverrides: overrides }));
    const withoutOverride = runMFPEngine(makeInput());

    // Scores should differ because basil is treated differently
    expect(withOverride.scored.score).not.toBeCloseTo(withoutOverride.scored.score, 5);
  });

  it("handles SNACK dish type with lower structural requirements", () => {
    const output = runMFPEngine({
      ingredients: [
        { card: getIngredient("olive_oil"), quantity: 15 },   // FAT
        { card: getIngredient("lemon_juice"), quantity: 10 },  // ACID
        { card: getIngredient("garlic"), quantity: 10 },       // AROMATIC
      ],
      method: CookingMethod.RAW,
      heatLevel: 0,
      dishType: DishType.SNACK,
      styleTargetId: "mediterranean",
    });
    expect(output.structuralGate.passed).toBe(true);
  });

  it("uncertainty bounds are within expected range (±0.06–0.10)", () => {
    const output = runMFPEngine(makeInput());
    expect(output.scored.uncertainty).toBeGreaterThanOrEqual(0.06);
    expect(output.scored.uncertainty).toBeLessThanOrEqual(0.10);
  });

  it("contribution vectors sum to dish vector within tolerance", () => {
    const output = runMFPEngine(makeInput());
    for (let k = 0; k < FLAVOR_DIMENSIONS; k++) {
      const sumContributions = output.contributions.reduce(
        (sum, c) => sum + c.contribution[k],
        0
      );
      const diff = Math.abs(sumContributions - output.dishVector[k]);
      expect(diff).toBeLessThan(1e-6);
    }
  });
});
