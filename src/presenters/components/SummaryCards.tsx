import type { DigestSummary } from "../../models/types";

interface Props {
  digest: DigestSummary;
}

export function SummaryCards({ digest }: Props) {
  const cards = [
    { label: "Total", value: digest.totalPoints, className: "card--total" },
    { label: "Open", value: digest.openCount, className: "card--open" },
    {
      label: "Resolved",
      value: digest.resolvedCount,
      className: "card--resolved",
    },
    {
      label: "Critical",
      value: digest.criticalCount,
      className: "card--critical",
    },
  ];

  return (
    <section className="summary-cards" aria-label="Summary metrics">
      {cards.map((c) => (
        <div key={c.label} className={`card ${c.className}`}>
          <span className="card__value">{c.value}</span>
          <span className="card__label">{c.label}</span>
        </div>
      ))}
    </section>
  );
}
