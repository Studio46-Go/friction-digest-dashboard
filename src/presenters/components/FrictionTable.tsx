import type { FrictionPoint, Status } from "../../models/types";

interface Props {
  points: FrictionPoint[];
  onStatusChange: (id: string, status: Status) => void;
}

export function FrictionTable({ points, onStatusChange }: Props) {
  if (points.length === 0) {
    return <p className="empty-state">No friction points match your filters.</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="friction-table" aria-label="Friction points">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Reports</th>
            <th>Last Reported</th>
          </tr>
        </thead>
        <tbody>
          {points.map((p) => (
            <tr key={p.id}>
              <td>
                <strong>{p.title}</strong>
                <br />
                <span className="friction-table__desc">{p.description}</span>
              </td>
              <td>
                <span className={`badge badge--category-${p.category}`}>
                  {p.category}
                </span>
              </td>
              <td>
                <span className={`badge badge--${p.severity}`}>
                  {p.severity}
                </span>
              </td>
              <td>
                <select
                  value={p.status}
                  onChange={(e) =>
                    onStatusChange(p.id, e.target.value as Status)
                  }
                  aria-label={`Change status for ${p.title}`}
                >
                  <option value="open">Open</option>
                  <option value="investigating">Investigating</option>
                  <option value="resolved">Resolved</option>
                </select>
              </td>
              <td className="text-right">{p.reportCount}</td>
              <td>{p.lastReported}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
