import { useMemo } from "react";
import { useStore } from "../../models/store";
import { applyFilters, buildDigest, sortPoints } from "../../facades";

/**
 * Presenter hook – composes Model state through the Facade layer and
 * exposes derived data ready for rendering.
 */
export function useDashboard() {
  const { points, filters, setFilters, updateStatus } = useStore();

  const filtered = useMemo(
    () => applyFilters(points, filters),
    [points, filters],
  );

  const sorted = useMemo(
    () => sortPoints(filtered, "reportCount"),
    [filtered],
  );

  const digest = useMemo(() => buildDigest(points), [points]);

  return {
    /** All points after filtering, sorted by report count */
    frictionPoints: sorted,
    /** Summary digest across all (unfiltered) points */
    digest,
    /** Current active filters */
    filters,
    /** Update one or more filter fields */
    setFilters,
    /** Change a friction point's status */
    updateStatus,
  };
}
