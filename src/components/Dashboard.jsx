import { useState, useMemo } from "react";
import {
  RefreshCcw,
  ShieldAlert,
  Search,
  Download,
} from "lucide-react";
import ExecutiveSummary from "./ExecutiveSummary";
import DeviceChart from "./DeviceChart";
import AssetTable from "./AssetTable";

// ─── CSV Exporter ─────────────────────────────────────────────────────────────
function exportToCSV(data) {
  if (!data.length) return;
  const headers = [
    "manufacturer",
    "model",
    "serial_number",
    "device_type",
    "manufactured_date",
    "status",
    "confidenceScore",
  ];
  const rows = data.map((row) =>
    headers
      .map((h) => {
        const val = row[h] ?? "";
        return `"${String(val).replace(/"/g, '""')}"`;
      })
      .join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `equipment_export_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const STATUS_OPTIONS = ["All", "Good", "Warning", "Critical"];

export default function Dashboard({ data = [], onReset }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredData = useMemo(() => {
    const term = search.trim().toLowerCase();
    return data.filter((row) => {
      const matchesStatus =
        statusFilter === "All" || row.status === statusFilter;
      const matchesSearch =
        !term ||
        (row.manufacturer || "").toLowerCase().includes(term) ||
        (row.model || "").toLowerCase().includes(term) ||
        (row.serial_number || "").toLowerCase().includes(term) ||
        (row.device_type || "").toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [data, search, statusFilter]);

  const criticalRatio =
    data.length > 0
      ? (data.filter((r) => r.status === "Critical").length / data.length) * 100
      : 0;

  return (
    <div className="min-h-screen bg-brand-bg text-brand-textMain">
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-brand-border">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-brand-textMuted uppercase tracking-widest font-semibold">
                Active Inventory Analysis
              </span>
            </div>
            <h2 className="text-3xl font-extrabold text-brand-textMain tracking-tight">
              Lifecycle Dashboard
            </h2>
            <p className="text-sm text-brand-textMuted mt-1">
              {filteredData.length} of {data.length} assets shown
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Primary action — export */}
            <button
              onClick={() => exportToCSV(filteredData)}
              disabled={filteredData.length === 0}
              className="flex items-center gap-2 bg-brand-accent hover:bg-brand-accentHover text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 active:scale-[0.97] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-brand-accent/20"
            >
              <Download size={15} />
              Export CSV
            </button>

            {/* Secondary action — subdued surface */}
            <button
              onClick={onReset}
              className="flex items-center gap-2 bg-brand-surface hover:bg-brand-bg border border-brand-border hover:border-brand-accent/50 text-brand-textMuted hover:text-brand-textMain font-semibold py-2 px-4 rounded-xl transition-all duration-200 active:scale-[0.97] cursor-pointer"
            >
              <RefreshCcw size={15} />
              Upload New File
            </button>
          </div>
        </div>

        {/* ── Alert banner ─────────────────────────────────────────────────── */}
        {criticalRatio > 25 && (
          <div className="mb-6 flex items-center gap-3 bg-rose-50 border border-rose-200 p-4 rounded-2xl text-rose-700 text-sm">
            <ShieldAlert size={20} className="shrink-0" />
            <div>
              <span className="font-bold">Urgent Action Required: </span>
              {Math.round(criticalRatio)}% of your assets are{" "}
              <span className="underline font-semibold">Critical</span>. Plan
              immediate maintenance or replacements.
            </div>
          </div>
        )}

        {/* ── KPI cards ─────────────────────────────────────────────────────── */}
        <ExecutiveSummary data={filteredData} />

        {/* ── Filter bar ───────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-8 mb-2">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-textMuted pointer-events-none"
            />
            <input
              id="dashboard-search"
              type="search"
              placeholder="Search manufacturer, model, serial, device type…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-brand-surface border border-brand-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-brand-textMain placeholder-brand-textMuted focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all shadow-sm"
            />
          </div>

          {/* Status pills */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {STATUS_OPTIONS.map((opt) => {
              const active = statusFilter === opt;
              const activeMap = {
                All: "bg-brand-accent/10 border-brand-accent text-brand-accent",
                Good: "bg-emerald-50 border-emerald-400 text-emerald-700",
                Warning: "bg-amber-50 border-amber-400 text-amber-700",
                Critical: "bg-rose-50 border-rose-400 text-rose-700",
              };
              return (
                <button
                  key={opt}
                  onClick={() => setStatusFilter(opt)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-150 cursor-pointer ${
                    active
                      ? activeMap[opt]
                      : "bg-brand-surface border-brand-border text-brand-textMuted hover:text-brand-textMain hover:border-brand-accent/40 shadow-sm"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Charts ───────────────────────────────────────────────────────── */}
        <DeviceChart data={filteredData} />

        {/* ── Table ────────────────────────────────────────────────────────── */}
        <div className="mt-6">
          <AssetTable data={filteredData} />
        </div>
      </div>
    </div>
  );
}
