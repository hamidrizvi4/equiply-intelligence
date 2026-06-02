import { useMemo } from "react";
import { PackageOpen } from "lucide-react";

const STATUS_BADGE = {
  Critical: "bg-rose-100 text-rose-700 ring-rose-300",
  Warning:  "bg-amber-100 text-amber-700 ring-amber-300",
  Good:     "bg-emerald-100 text-emerald-700 ring-emerald-300",
};

function StatusBadge({ status }) {
  const cls =
    STATUS_BADGE[status] || "bg-slate-100 text-slate-700 ring-slate-300";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${cls}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === "Critical"
            ? "bg-rose-500"
            : status === "Warning"
            ? "bg-amber-500"
            : "bg-emerald-500"
        }`}
      />
      {status || "—"}
    </span>
  );
}

export default function AssetTable({ data = [] }) {
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const da = a.manufactured_date || "";
      const db = b.manufactured_date || "";
      return da.localeCompare(db); // YYYY-MM-DD sorts correctly as a string
    });
  }, [data]);

  const COLUMNS = [
    "Manufacturer",
    "Model",
    "Serial Number",
    "Device Type",
    "Manufactured",
    "Status",
    "Confidence",
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-brand-border bg-brand-surface shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-brand-border">
          <thead className="bg-brand-bg">
            <tr>
              {COLUMNS.map((h) => (
                <th
                  key={h}
                  className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-brand-textMuted"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-brand-border">
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="px-5 py-16">
                  <div className="flex flex-col items-center justify-center text-center">
                    <PackageOpen className="mb-3 h-10 w-10 text-brand-textMuted/50" />
                    <p className="text-sm font-medium text-brand-textMuted">
                      No assets found matching your criteria
                    </p>
                    <p className="mt-1 text-xs text-brand-textMuted/70">
                      Try adjusting your search or status filter.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((row, i) => (
                <tr
                  key={row.serial_number || i}
                  className="transition-colors hover:bg-brand-bg group"
                >
                  <td className="px-5 py-3.5 text-sm font-semibold text-brand-textMain group-hover:text-brand-accent transition-colors">
                    {row.manufacturer || "—"}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-brand-textMuted">
                    {row.model || "—"}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-brand-textMuted">
                    {row.serial_number || "—"}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-brand-textMuted">
                    {row.device_type || "—"}
                  </td>
                  <td className="px-5 py-3.5 text-sm tabular-nums text-brand-textMuted">
                    {row.manufactured_date || "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-5 py-3.5 text-sm tabular-nums">
                    {row.confidenceScore != null ? (
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            row.confidenceScore === 100
                              ? "text-emerald-600 font-semibold"
                              : "text-amber-600 font-semibold"
                          }
                        >
                          {row.confidenceScore}%
                        </span>
                        <div className="w-10 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              row.confidenceScore === 100
                                ? "bg-emerald-500"
                                : "bg-amber-500"
                            }`}
                            style={{ width: `${row.confidenceScore}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {sortedData.length > 0 && (
        <div className="px-5 py-3 border-t border-brand-border text-xs text-brand-textMuted font-medium bg-brand-bg">
          {sortedData.length} record{sortedData.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}