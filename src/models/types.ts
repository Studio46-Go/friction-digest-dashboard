/** Severity of a friction point */
export type Severity = "critical" | "high" | "medium" | "low";

/** Current lifecycle status */
export type Status = "open" | "investigating" | "resolved";

/** Broad category for grouping friction points */
export type Category =
  | "ux"
  | "performance"
  | "reliability"
  | "onboarding"
  | "accessibility";

/** Core domain entity – a single friction point reported by users or systems */
export interface FrictionPoint {
  id: string;
  title: string;
  description: string;
  category: Category;
  severity: Severity;
  status: Status;
  reportCount: number;
  firstReported: string; // ISO date
  lastReported: string; // ISO date
  tags: string[];
}

/** Aggregated summary for the digest view */
export interface DigestSummary {
  totalPoints: number;
  openCount: number;
  resolvedCount: number;
  criticalCount: number;
  bySeverity: Record<Severity, number>;
  byCategory: Record<Category, number>;
  byStatus: Record<Status, number>;
  topFrictionPoints: FrictionPoint[];
}

/** Filters that can be applied to the friction point list */
export interface FrictionFilters {
  severity: Severity | "all";
  status: Status | "all";
  category: Category | "all";
  search: string;
}
