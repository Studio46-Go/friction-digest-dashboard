import { useDashboard } from "../hooks/useDashboard";
import { SummaryCards } from "../components/SummaryCards";
import { FilterBar } from "../components/FilterBar";
import { FrictionTable } from "../components/FrictionTable";
import { BreakdownChart } from "../components/BreakdownChart";

export function DashboardView() {
  const { frictionPoints, digest, filters, setFilters, updateStatus } =
    useDashboard();

  const severityItems = [
    { label: "Critical", value: digest.bySeverity.critical, colorVar: "--color-critical" },
    { label: "High", value: digest.bySeverity.high, colorVar: "--color-high" },
    { label: "Medium", value: digest.bySeverity.medium, colorVar: "--color-medium" },
    { label: "Low", value: digest.bySeverity.low, colorVar: "--color-low" },
  ];

  const categoryItems = [
    { label: "UX", value: digest.byCategory.ux, colorVar: "--color-ux" },
    { label: "Performance", value: digest.byCategory.performance, colorVar: "--color-performance" },
    { label: "Reliability", value: digest.byCategory.reliability, colorVar: "--color-reliability" },
    { label: "Onboarding", value: digest.byCategory.onboarding, colorVar: "--color-onboarding" },
    { label: "Accessibility", value: digest.byCategory.accessibility, colorVar: "--color-a11y" },
  ];

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h1>Friction Digest</h1>
        <p className="dashboard__subtitle">
          Track, triage, and resolve user-facing friction points
        </p>
      </header>

      <SummaryCards digest={digest} />

      <div className="dashboard__charts">
        <BreakdownChart title="By Severity" items={severityItems} />
        <BreakdownChart title="By Category" items={categoryItems} />
      </div>

      <FilterBar filters={filters} onChange={setFilters} />

      <FrictionTable points={frictionPoints} onStatusChange={updateStatus} />
    </div>
  );
}
