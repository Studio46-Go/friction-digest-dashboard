import type {
  Category,
  DigestSummary,
  FrictionFilters,
  FrictionPoint,
  Severity,
  Status,
} from "../models/types";

// ---------------------------------------------------------------------------
// Facade: pure functions that transform Model data for Presenters
// ---------------------------------------------------------------------------

/** Apply the current filter set to the full list of friction points */
export function applyFilters(
  points: FrictionPoint[],
  filters: FrictionFilters,
): FrictionPoint[] {
  return points.filter((p) => {
    if (filters.severity !== "all" && p.severity !== filters.severity)
      return false;
    if (filters.status !== "all" && p.status !== filters.status) return false;
    if (filters.category !== "all" && p.category !== filters.category)
      return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const haystack =
        `${p.title} ${p.description} ${p.tags.join(" ")}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

/** Build a digest summary from a list of friction points */
export function buildDigest(points: FrictionPoint[]): DigestSummary {
  const bySeverity: Record<Severity, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };
  const byCategory: Record<Category, number> = {
    ux: 0,
    performance: 0,
    reliability: 0,
    onboarding: 0,
    accessibility: 0,
  };
  const byStatus: Record<Status, number> = {
    open: 0,
    investigating: 0,
    resolved: 0,
  };

  for (const p of points) {
    bySeverity[p.severity]++;
    byCategory[p.category]++;
    byStatus[p.status]++;
  }

  const topFrictionPoints = [...points]
    .sort((a, b) => b.reportCount - a.reportCount)
    .slice(0, 5);

  return {
    totalPoints: points.length,
    openCount: byStatus.open + byStatus.investigating,
    resolvedCount: byStatus.resolved,
    criticalCount: bySeverity.critical,
    bySeverity,
    byCategory,
    byStatus,
    topFrictionPoints,
  };
}

/** Sort friction points by a given key */
export function sortPoints(
  points: FrictionPoint[],
  key: "reportCount" | "severity" | "lastReported",
  direction: "asc" | "desc" = "desc",
): FrictionPoint[] {
  const severityOrder: Record<Severity, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  return [...points].sort((a, b) => {
    let cmp: number;
    switch (key) {
      case "reportCount":
        cmp = a.reportCount - b.reportCount;
        break;
      case "severity":
        cmp = severityOrder[a.severity] - severityOrder[b.severity];
        break;
      case "lastReported":
        cmp =
          new Date(a.lastReported).getTime() -
          new Date(b.lastReported).getTime();
        break;
    }
    return direction === "desc" ? -cmp : cmp;
  });
}
