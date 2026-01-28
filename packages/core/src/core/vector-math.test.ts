import { describe, it, expect } from "vitest";
import {
  dot,
  norm,
  normInf,
  cosineSimilarity,
  addVectors,
  subtractVectors,
  scaleVector,
  normalizeToProfile,
  bankersRound,
  withinTolerance,
  EPSILON_ABS,
} from "./vector-math.js";
import { flavorVector, createFlavorVector, FLAVOR_DIMENSIONS } from "../types/flavor-space.js";

describe("vector-math", () => {
  describe("dot", () => {
    it("computes dot product of two vectors", () => {
      const a = flavorVector([1, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      const b = flavorVector([4, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      expect(dot(a, b)).toBe(14); // 1*4 + 2*5 + 3*0 = 14
    });

    it("returns 0 for orthogonal vectors", () => {
      const a = flavorVector([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      const b = flavorVector([0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      expect(dot(a, b)).toBe(0);
    });
  });

  describe("norm", () => {
    it("computes L2 norm", () => {
      const v = flavorVector([3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      expect(norm(v)).toBe(5);
    });

    it("returns 0 for zero vector", () => {
      expect(norm(createFlavorVector())).toBe(0);
    });
  });

  describe("normInf", () => {
    it("returns maximum absolute value", () => {
      const v = flavorVector([1, 3, 2, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4]);
      expect(normInf(v)).toBe(5);
    });
  });

  describe("cosineSimilarity", () => {
    it("returns 1 for identical vectors", () => {
      const v = flavorVector([1, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      expect(cosineSimilarity(v, v)).toBeCloseTo(1.0);
    });

    it("returns 0 for orthogonal vectors", () => {
      const a = flavorVector([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      const b = flavorVector([0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      expect(cosineSimilarity(a, b)).toBe(0);
    });

    it("returns 0 for zero vectors", () => {
      const z = createFlavorVector();
      const v = flavorVector([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      expect(cosineSimilarity(z, v)).toBe(0);
    });

    it("is scale-invariant", () => {
      const a = flavorVector([1, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      const b = flavorVector([2, 4, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      expect(cosineSimilarity(a, b)).toBeCloseTo(1.0);
    });
  });

  describe("addVectors / subtractVectors", () => {
    it("adds element-wise", () => {
      const a = flavorVector([1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      const b = flavorVector([3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      const result = addVectors(a, b);
      expect(result[0]).toBe(4);
      expect(result[1]).toBe(6);
    });

    it("subtracts element-wise", () => {
      const a = flavorVector([5, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      const b = flavorVector([2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      const result = subtractVectors(a, b);
      expect(result[0]).toBe(3);
      expect(result[1]).toBe(2);
    });
  });

  describe("scaleVector", () => {
    it("scales all elements", () => {
      const v = flavorVector([1, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      const result = scaleVector(v, 2);
      expect(result[0]).toBe(2);
      expect(result[1]).toBe(4);
      expect(result[2]).toBe(6);
    });
  });

  describe("normalizeToProfile", () => {
    it("normalizes using max(5, ||V||∞)", () => {
      // If max value < 5, divides by 5
      const v = flavorVector([2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      const result = normalizeToProfile(v);
      expect(result[0]).toBeCloseTo(2 / 5);
      expect(result[1]).toBeCloseTo(3 / 5);
    });

    it("normalizes using ||V||∞ when > 5", () => {
      const v = flavorVector([10, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      const result = normalizeToProfile(v);
      expect(result[0]).toBeCloseTo(1.0);
      expect(result[1]).toBeCloseTo(0.5);
    });
  });

  describe("bankersRound", () => {
    it("rounds normally for non-half values", () => {
      expect(bankersRound(2.3, 0)).toBe(2);
      expect(bankersRound(2.7, 0)).toBe(3);
    });

    it("rounds to even for exactly 0.5", () => {
      expect(bankersRound(0.5, 0)).toBe(0); // even
      expect(bankersRound(1.5, 0)).toBe(2); // even
      expect(bankersRound(2.5, 0)).toBe(2); // even
      expect(bankersRound(3.5, 0)).toBe(4); // even
    });

    it("works with decimal places", () => {
      expect(bankersRound(1.245, 2)).toBeCloseTo(1.24); // round to even
      expect(bankersRound(1.255, 2)).toBeCloseTo(1.26); // round to even
    });
  });

  describe("withinTolerance", () => {
    it("passes for values within absolute tolerance", () => {
      expect(withinTolerance(0.0000001, 0)).toBe(true);
    });

    it("passes for values within relative tolerance", () => {
      expect(withinTolerance(100.005, 100.0)).toBe(true);
    });

    it("fails for values outside tolerance", () => {
      expect(withinTolerance(1.0, 2.0)).toBe(false);
    });
  });
});
