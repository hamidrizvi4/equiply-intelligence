import React, { useState, useMemo } from "react";

// ─── Colour palette for device-type slices ────────────────────────────────────
const PALETTE = [
  "#8b5cf6", "#6366f1", "#3b82f6", "#06b6d4",
  "#10b981", "#f59e0b", "#f43f5e", "#ec4899",
  "#a855f7", "#14b8a6", "#f97316", "#84cc16",
];

const STATUS_COLORS = {
  Critical: "#f43f5e",
  Warning: "#f59e0b",
  Good: "#10b981",
};

const VIEWS = [
  { key: "device_type", label: "Device Type" },
  { key: "lifecycle",   label: "Lifecycle Status" },
];

function Donut({ slices, total, centerLabel, centerSub }) {
  const radius = 50;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;

  let cumulative = 0;
  const segments = slices.map((s) => {
    const pct = total > 0 ? s.count / total : 0;
    const stroke = pct * circumference;
    const offset = cumulative;
    cumulative += stroke;
    return { ...s, pct, stroke, offset };
  });

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        {/* bg ring — muted neutral so it reads on white surface */}
        <circle
          cx="60" cy="60" r={radius}
          fill="transparent"
          stroke="#64748B"
          strokeOpacity={0.12}
          strokeWidth={strokeWidth}
        />
        {segments.map((seg, i) =>
          seg.stroke > 0 ? (
            <circle
              key={i}
              cx="60" cy="60" r={radius}
              fill="transparent"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${seg.stroke} ${circumference}`}
              strokeDashoffset={-seg.offset}
              className="transition-all duration-500 ease-out"
            />
          ) : null
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-brand-textMain">{centerLabel}</span>
        <span className="text-[10px] uppercase tracking-wider text-brand-textMuted font-semibold">
          {centerSub}
        </span>
      </div>
    </div>
  );
}

function Legend({ slices, total }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-6 border-t border-brand-border pt-4">
      {slices.map((s, i) => {
        const pct = total > 0 ? ((s.count / total) * 100).toFixed(1) : "0.0";
        return (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-brand-textMuted truncate">{s.label}</span>
            <span className="ml-auto text-brand-textMain font-semibold tabular-nums">
              {pct}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function DeviceChart({ data = [] }) {
  const [view, setView] = useState("device_type");

  const total = data.length;

  const deviceSlices = useMemo(() => {
    const counts = {};
    data.forEach((r) => {
      const t = r.device_type || "Unknown";
      counts[t] = (counts[t] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([label, count], i) => ({
        label,
        count,
        color: PALETTE[i % PALETTE.length],
      }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  const lifecycleSlices = useMemo(() => {
    const counts = { Critical: 0, Warning: 0, Good: 0 };
    data.forEach((r) => {
      const s = r.status || "Good";
      if (counts[s] !== undefined) counts[s]++;
    });
    return Object.entries(counts).map(([label, count]) => ({
      label,
      count,
      color: STATUS_COLORS[label],
    }));
  }, [data]);

  const slices = view === "device_type" ? deviceSlices : lifecycleSlices;

  return (
    <div className="mt-6 bg-brand-surface border border-brand-border rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h4 className="text-sm font-semibold text-brand-textMain">
          {view === "device_type"
            ? "Device Type Distribution"
            : "Lifecycle Status Distribution"}
        </h4>

        <div className="flex items-center gap-1 bg-brand-bg border border-brand-border rounded-lg p-0.5">
          {VIEWS.map((v) => (
            <button
              key={v.key}
              onClick={() => setView(v.key)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-150 cursor-pointer ${
                view === v.key
                  ? "bg-brand-accent text-white"
                  : "text-brand-textMuted hover:text-brand-textMain"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <Donut
        slices={slices}
        total={total}
        centerLabel={total}
        centerSub="Total Assets"
      />
      <Legend slices={slices} total={total} />
    </div>
  );
}
