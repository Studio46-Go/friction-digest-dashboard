interface BarItem {
  label: string;
  value: number;
  colorVar: string;
}

interface Props {
  title: string;
  items: BarItem[];
}

/** Simple horizontal bar chart rendered with CSS */
export function BreakdownChart({ title, items }: Props) {
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className="breakdown-chart">
      <h3 className="breakdown-chart__title">{title}</h3>
      <ul className="breakdown-chart__bars">
        {items.map((item) => (
          <li key={item.label} className="breakdown-chart__row">
            <span className="breakdown-chart__label">{item.label}</span>
            <div className="breakdown-chart__track">
              <div
                className="breakdown-chart__fill"
                style={{
                  width: `${(item.value / max) * 100}%`,
                  backgroundColor: `var(${item.colorVar})`,
                }}
              />
            </div>
            <span className="breakdown-chart__value">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
