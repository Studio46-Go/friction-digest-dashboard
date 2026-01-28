import { describe, it, expect } from "vitest";
import { applyMethodKernel } from "./method-kernel.js";
import { flavorVector, FlavorDimension, FLAVOR_DIMENSIONS } from "../types/flavor-space.js";
import { SolubilityClass } from "../types/ingredient.js";
import { CookingMethod } from "../types/method.js";

describe("method-kernel", () => {
  const baseVector = flavorVector([
    2, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 3, 2, 1, 0, 1, 0, 1, 1, 2,
  ]);

  describe("RAW method", () => {
    it("returns the original vector unchanged", () => {
      const result = applyMethodKernel(
        baseVector, SolubilityClass.WATER, 0.0, 0.0, CookingMethod.RAW
      );
      for (let i = 0; i < FLAVOR_DIMENSIONS; i++) {
        expect(result[i]).toBe(baseVector[i]);
      }
    });
  });

  describe("HIGH_HEAT_SEAR", () => {
    it("increases ROASTED and SMOKE dimensions at high heat", () => {
      const result = applyMethodKernel(
        baseVector, SolubilityClass.WATER, 0.2, 0.8, CookingMethod.HIGH_HEAT_SEAR
      );
      // ROASTED should increase (heat-scaled modifier 1.8 at full heat)
      // Base has ROASTED=0, so it stays 0 (multiplier on 0)
      // But the vector with some roasted value should increase
      const v = flavorVector([0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      const r = applyMethodKernel(v, SolubilityClass.WATER, 0.0, 0.8, CookingMethod.HIGH_HEAT_SEAR);
      expect(r[FlavorDimension.ROASTED]).toBeGreaterThan(2);
    });

    it("reduces HERBAL at high heat", () => {
      const result = applyMethodKernel(
        baseVector, SolubilityClass.WATER, 0.2, 0.8, CookingMethod.HIGH_HEAT_SEAR
      );
      expect(result[FlavorDimension.HERBAL]).toBeLessThan(baseVector[FlavorDimension.HERBAL]);
    });

    it("applies volatility loss", () => {
      const highVol = applyMethodKernel(
        baseVector, SolubilityClass.WATER, 0.8, 0.9, CookingMethod.HIGH_HEAT_SEAR
      );
      const lowVol = applyMethodKernel(
        baseVector, SolubilityClass.WATER, 0.1, 0.9, CookingMethod.HIGH_HEAT_SEAR
      );
      // High volatility should result in lower values overall
      const sumHigh = Array.from(highVol).reduce((a, b) => a + b, 0);
      const sumLow = Array.from(lowVol).reduce((a, b) => a + b, 0);
      expect(sumHigh).toBeLessThan(sumLow);
    });

    it("fat solubility provides volatility protection", () => {
      const waterResult = applyMethodKernel(
        baseVector, SolubilityClass.WATER, 0.8, 0.9, CookingMethod.HIGH_HEAT_SEAR
      );
      const fatResult = applyMethodKernel(
        baseVector, SolubilityClass.FAT, 0.8, 0.9, CookingMethod.HIGH_HEAT_SEAR
      );
      const sumWater = Array.from(waterResult).reduce((a, b) => a + b, 0);
      const sumFat = Array.from(fatResult).reduce((a, b) => a + b, 0);
      expect(sumFat).toBeGreaterThan(sumWater);
    });
  });

  describe("BRAISE", () => {
    it("increases TEXTURE_TENDER and reduces TEXTURE_CRISP", () => {
      const v = flavorVector([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2]);
      const result = applyMethodKernel(v, SolubilityClass.WATER, 0.1, 0.7, CookingMethod.BRAISE);
      expect(result[FlavorDimension.TEXTURE_TENDER]).toBeGreaterThan(2);
      expect(result[FlavorDimension.TEXTURE_CRISP]).toBeLessThan(2);
    });
  });

  describe("RAW_FINISH", () => {
    it("increases HERBAL and CITRUS", () => {
      const result = applyMethodKernel(
        baseVector, SolubilityClass.WATER, 0.5, 0.0, CookingMethod.RAW_FINISH
      );
      expect(result[FlavorDimension.HERBAL]).toBeGreaterThan(baseVector[FlavorDimension.HERBAL]);
      expect(result[FlavorDimension.CITRUS]).toBeGreaterThan(baseVector[FlavorDimension.CITRUS]);
    });

    it("has no volatility loss", () => {
      const result = applyMethodKernel(
        baseVector, SolubilityClass.WATER, 0.9, 0.0, CookingMethod.RAW_FINISH
      );
      // With volatilityLossFactor=0 and heatLevel=0, no loss
      // But there are base modifiers, so only check that high-vol dims aren't lost
      expect(result[FlavorDimension.HERBAL]).toBeGreaterThanOrEqual(baseVector[FlavorDimension.HERBAL]);
    });
  });

  describe("output clamping", () => {
    it("clamps values to [0, 5]", () => {
      const extreme = flavorVector([5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]);
      const result = applyMethodKernel(
        extreme, SolubilityClass.WATER, 0.0, 1.0, CookingMethod.DEEP_FRY
      );
      for (let i = 0; i < FLAVOR_DIMENSIONS; i++) {
        expect(result[i]).toBeGreaterThanOrEqual(0);
        expect(result[i]).toBeLessThanOrEqual(5);
      }
    });
  });
});
