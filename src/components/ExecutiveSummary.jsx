import { ShieldAlert, AlertTriangle, Server, Award } from "lucide-react";

export default function ExecutiveSummary({ data = [] }) {
  const total = data.length;
  const criticalCount = data.filter((r) => r.status === "Critical").length;
  const warningCount  = data.filter((r) => r.status === "Warning").length;
  const goodCount     = data.filter((r) => r.status === "Good").length;

  const avgConfidence =
    total > 0
      ? Math.round(
          data.reduce((sum, r) => sum + (r.confidenceScore ?? 0), 0) / total
        )
      : 0;

  const cards = [
    {
      title:      "Total Assets",
      value:      total,
      sub:        `${goodCount} Good · ${warningCount} Warning`,
      icon:       <Server size={20} className="text-brand-accent" />,
      accent:     "bg-brand-accent/10 border border-brand-accent/20",
      valueColor: "text-brand-textMain",
    },
    {
      title:      "Critical",
      value:      criticalCount,
      sub:        "Needs urgent review",
      icon:       <ShieldAlert size={20} className="text-rose-500" />,
      accent:     "bg-rose-100 border border-rose-200",
      valueColor: criticalCount > 0 ? "text-rose-600" : "text-brand-textMain",
    },
    {
      title:      "Warning",
      value:      warningCount,
      sub:        "Approaching end-of-life",
      icon:       <AlertTriangle size={20} className="text-amber-500" />,
      accent:     "bg-amber-100 border border-amber-200",
      valueColor: "text-brand-textMain",
    },
    {
      title:      "Date Confidence",
      value:      `${avgConfidence}%`,
      sub:        "Serial parsing accuracy",
      icon:       <Award size={20} className="text-emerald-500" />,
      accent:     "bg-emerald-100 border border-emerald-200",
      valueColor: "text-brand-textMain",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-brand-surface border border-brand-border rounded-2xl p-5 transition-all duration-300 hover:border-brand-accent/40"
        >
          <div className="flex justify-between items-start mb-3">
            <p className="text-xs font-semibold text-brand-textMuted uppercase tracking-wider">
              {card.title}
            </p>
            <div className={`p-1.5 rounded-lg ${card.accent}`}>
              {card.icon}
            </div>
          </div>
          <p className={`text-3xl font-extrabold tabular-nums ${card.valueColor}`}>
            {card.value}
          </p>
          <p className="text-xs text-brand-textMuted mt-2 font-medium">
            {card.sub}
          </p>
        </div>
      ))}
    </div>
  );
}
