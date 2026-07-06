import { useCountUp } from "../hooks/useCountUp";

function StatCard({ label, value, accent, sub }) {
  const animated = useCountUp(value);
  return (
    <div className="surface animate-rise flex-1 rounded-2xl p-5 sm:p-6" style={{ borderTopColor: accent, borderTopWidth: 3 }}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">{label}</p>
      <p className="font-mono mt-2 text-3xl font-semibold text-ink sm:text-4xl">{animated.toFixed(3)}</p>
      {sub && <p className="mt-1 text-xs text-ink-soft">{sub}</p>}
    </div>
  );
}

export default function StatCards({ result }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard label="Mother total" value={result.motherTotal} accent="var(--color-mother)" sub="Sum of maternal values" />
      <StatCard label="Grand total" value={result.grandTotal} accent="var(--color-legacy)" sub="Mother + Father, always 100" />
      <StatCard label="Father total" value={result.fatherTotal} accent="var(--color-father)" sub="Sum of paternal values" />
    </div>
  );
}
