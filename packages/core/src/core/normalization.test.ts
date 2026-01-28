import { describe, it, expect } from "vitest";
import { computeAlpha, getNormalizationConstants } from "./normalization.js";
import { StructuralRole } from "../types/ingredient.js";
import { DishType } from "../types/method.js";

describe("normalization", () => {
  describe("getNormalizationConstants", () => {
    it("returns constants for COMPLETE_PLATE", () => {
      const c = getNormalizationConstants(DishType.COMPLETE_PLATE);
      expect(c.Q_primary).toBe(200);
      expect(c.Q_support).toBe(50);
      expect(c.Q_finish).toBe(10);
    });

    it("returns constants for SNACK", () => {
      const c = getNormalizationConstants(DishType.SNACK);
      expect(c.Q_primary).toBe(100);
    });
  });

  describe("computeAlpha", () => {
    it("normalizes PRIMARY ingredient against Q_primary", () => {
      const roles = new Set([StructuralRole.PROTEIN]);
      // 100g of protein for COMPLETE_PLATE (Q_primary=200) → α = 0.5
      expect(computeAlpha(100, roles, DishType.COMPLETE_PLATE)).toBeCloseTo(0.5);
    });

    it("normalizes SUPPORT ingredient against Q_support", () => {
      const roles = new Set([StructuralRole.FAT]);
      // 25g of fat for COMPLETE_PLATE (Q_support=50) → α = 0.5
      expect(computeAlpha(25, roles, DishType.COMPLETE_PLATE)).toBeCloseTo(0.5);
    });

    it("normalizes FINISH ingredient against Q_finish", () => {
      const roles = new Set([StructuralRole.HERB_FINISH]);
      // 5g of herb for COMPLETE_PLATE (Q_finish=10) → α = 0.5
      expect(computeAlpha(5, roles, DishType.COMPLETE_PLATE)).toBeCloseTo(0.5);
    });

    it("clamps at 1.0 for large quantities", () => {
      const roles = new Set([StructuralRole.PROTEIN]);
      expect(computeAlpha(500, roles, DishType.COMPLETE_PLATE)).toBe(1.0);
    });

    it("returns 0 for zero quantity", () => {
      const roles = new Set([StructuralRole.PROTEIN]);
      expect(computeAlpha(0, roles, DishType.COMPLETE_PLATE)).toBe(0);
    });
  });
});
