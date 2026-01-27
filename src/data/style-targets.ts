/**
 * MFP v1.1 - Style/Cuisine Target Profiles (Section 3.2)
 *
 * B_target and W_bal for common cuisine styles.
 * Each target profile represents the ideal normalized flavor shape
 * for a particular cuisine or dish style.
 */

import { flavorVector } from "../types/flavor-space.js";
import type { FlavorVector } from "../types/flavor-space.js";

export interface StyleTarget {
  id: string;
  name: string;
  /** Target profile B_target ∈ ℝ²⁰ (normalized scale, 0-1) */
  profile: FlavorVector;
  /** Balance weights W_bal ∈ ℝ²⁰ */
  weights: FlavorVector;
}

/** Default balanced weights (all dimensions equally weighted) */
const UNIFORM_WEIGHTS = flavorVector([
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
]);

export const STYLE_TARGETS: Map<string, StyleTarget> = new Map();

// ─── Italian ────────────────────────────────────────────────────────────────

STYLE_TARGETS.set("italian", {
  id: "italian",
  name: "Italian (Classic)",
  profile: flavorVector([
    //  UMA  SLT  SWT  SOR  BIT  HEA  WRM  SMK  RST  FAT  CRM  HRB  CIT  ALL  FRM  ERT  NUT  FLO  CRP  TND
    0.65, 0.50, 0.30, 0.35, 0.15, 0.10, 0.15, 0.05, 0.30, 0.55, 0.30, 0.60, 0.25, 0.55, 0.20, 0.20, 0.15, 0.10, 0.25, 0.50,
  ]),
  weights: flavorVector([
    1.2, 0.8, 0.6, 0.9, 0.5, 0.4, 0.5, 0.3, 0.7, 1.0, 0.6, 1.2, 0.8, 1.1, 0.6, 0.5, 0.4, 0.3, 0.5, 0.7,
  ]),
});

// ─── Japanese ───────────────────────────────────────────────────────────────

STYLE_TARGETS.set("japanese", {
  id: "japanese",
  name: "Japanese (Washoku)",
  profile: flavorVector([
    0.80, 0.40, 0.25, 0.20, 0.10, 0.05, 0.05, 0.05, 0.15, 0.30, 0.10, 0.15, 0.15, 0.20, 0.40, 0.15, 0.10, 0.10, 0.30, 0.60,
  ]),
  weights: flavorVector([
    1.5, 0.8, 0.6, 0.7, 0.4, 0.3, 0.3, 0.3, 0.5, 0.7, 0.4, 0.5, 0.6, 0.6, 1.2, 0.5, 0.4, 0.3, 0.7, 0.9,
  ]),
});

// ─── Mexican ────────────────────────────────────────────────────────────────

STYLE_TARGETS.set("mexican", {
  id: "mexican",
  name: "Mexican (Traditional)",
  profile: flavorVector([
    0.50, 0.45, 0.25, 0.40, 0.10, 0.60, 0.40, 0.30, 0.35, 0.40, 0.25, 0.45, 0.50, 0.40, 0.15, 0.30, 0.10, 0.05, 0.35, 0.45,
  ]),
  weights: flavorVector([
    0.8, 0.7, 0.5, 1.0, 0.4, 1.2, 0.9, 0.8, 0.6, 0.8, 0.5, 1.0, 1.1, 0.8, 0.5, 0.6, 0.3, 0.2, 0.7, 0.6,
  ]),
});

// ─── Thai ───────────────────────────────────────────────────────────────────

STYLE_TARGETS.set("thai", {
  id: "thai",
  name: "Thai",
  profile: flavorVector([
    0.55, 0.50, 0.45, 0.55, 0.05, 0.65, 0.20, 0.05, 0.10, 0.30, 0.25, 0.55, 0.50, 0.35, 0.30, 0.10, 0.20, 0.15, 0.25, 0.40,
  ]),
  weights: flavorVector([
    0.9, 0.8, 1.0, 1.2, 0.3, 1.3, 0.5, 0.2, 0.3, 0.6, 0.5, 1.1, 1.1, 0.7, 0.8, 0.3, 0.5, 0.4, 0.5, 0.6,
  ]),
});

// ─── French ─────────────────────────────────────────────────────────────────

STYLE_TARGETS.set("french", {
  id: "french",
  name: "French (Classic)",
  profile: flavorVector([
    0.55, 0.45, 0.30, 0.30, 0.15, 0.05, 0.10, 0.05, 0.35, 0.65, 0.55, 0.55, 0.20, 0.45, 0.15, 0.20, 0.15, 0.20, 0.20, 0.60,
  ]),
  weights: flavorVector([
    1.0, 0.8, 0.6, 0.8, 0.4, 0.3, 0.4, 0.2, 0.8, 1.2, 1.1, 1.0, 0.7, 0.9, 0.4, 0.5, 0.4, 0.5, 0.4, 0.9,
  ]),
});

// ─── Indian ─────────────────────────────────────────────────────────────────

STYLE_TARGETS.set("indian", {
  id: "indian",
  name: "Indian (North)",
  profile: flavorVector([
    0.45, 0.45, 0.30, 0.25, 0.10, 0.50, 0.70, 0.10, 0.25, 0.45, 0.40, 0.35, 0.15, 0.50, 0.10, 0.30, 0.15, 0.20, 0.15, 0.55,
  ]),
  weights: flavorVector([
    0.7, 0.7, 0.5, 0.6, 0.4, 1.1, 1.5, 0.4, 0.5, 0.9, 0.8, 0.7, 0.4, 1.0, 0.3, 0.6, 0.4, 0.5, 0.3, 0.7,
  ]),
});

// ─── American BBQ ───────────────────────────────────────────────────────────

STYLE_TARGETS.set("bbq", {
  id: "bbq",
  name: "American BBQ",
  profile: flavorVector([
    0.60, 0.55, 0.50, 0.30, 0.10, 0.35, 0.25, 0.70, 0.65, 0.55, 0.15, 0.10, 0.10, 0.35, 0.10, 0.15, 0.10, 0.00, 0.25, 0.70,
  ]),
  weights: flavorVector([
    0.9, 0.8, 0.9, 0.6, 0.3, 0.7, 0.5, 1.4, 1.2, 0.9, 0.3, 0.3, 0.3, 0.6, 0.3, 0.3, 0.3, 0.1, 0.5, 1.0,
  ]),
});

// ─── Mediterranean ──────────────────────────────────────────────────────────

STYLE_TARGETS.set("mediterranean", {
  id: "mediterranean",
  name: "Mediterranean",
  profile: flavorVector([
    0.40, 0.40, 0.20, 0.35, 0.20, 0.10, 0.20, 0.05, 0.20, 0.55, 0.15, 0.65, 0.45, 0.50, 0.15, 0.25, 0.20, 0.15, 0.30, 0.40,
  ]),
  weights: UNIFORM_WEIGHTS,
});

/** Get a style target by ID */
export function getStyleTarget(id: string): StyleTarget | undefined {
  return STYLE_TARGETS.get(id);
}

/** Get all style target IDs */
export function getStyleTargetIds(): string[] {
  return Array.from(STYLE_TARGETS.keys());
}
