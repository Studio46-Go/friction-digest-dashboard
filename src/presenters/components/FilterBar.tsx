import type { FrictionFilters } from "../../models/types";

interface Props {
  filters: FrictionFilters;
  onChange: (partial: Partial<FrictionFilters>) => void;
}

export function FilterBar({ filters, onChange }: Props) {
  return (
    <section className="filter-bar" aria-label="Filters">
      <input
        type="search"
        placeholder="Search friction points..."
        value={filters.search}
        onChange={(e) => onChange({ search: e.target.value })}
        className="filter-bar__search"
      />

      <select
        value={filters.severity}
        onChange={(e) =>
          onChange({ severity: e.target.value as FrictionFilters["severity"] })
        }
        aria-label="Filter by severity"
      >
        <option value="all">All Severities</option>
        <option value="critical">Critical</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <select
        value={filters.status}
        onChange={(e) =>
          onChange({ status: e.target.value as FrictionFilters["status"] })
        }
        aria-label="Filter by status"
      >
        <option value="all">All Statuses</option>
        <option value="open">Open</option>
        <option value="investigating">Investigating</option>
        <option value="resolved">Resolved</option>
      </select>

      <select
        value={filters.category}
        onChange={(e) =>
          onChange({ category: e.target.value as FrictionFilters["category"] })
        }
        aria-label="Filter by category"
      >
        <option value="all">All Categories</option>
        <option value="ux">UX</option>
        <option value="performance">Performance</option>
        <option value="reliability">Reliability</option>
        <option value="onboarding">Onboarding</option>
        <option value="accessibility">Accessibility</option>
      </select>
    </section>
  );
}
