function FactorRow({ factor, index }) {
  const motherPct = (factor.mother / factor.total) * 100;
  const fatherPct = 100 - motherPct;

  return (
    <li
      className="animate-rise border-b border-hairline py-4 last:border-none"
      style={{ animationDelay: `${index * 45}ms` }}
    >
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-sm font-semibold text-ink sm:text-[0.95rem]">{factor.label}</p>
        <p className="font-mono text-xs text-ink-soft">
          range {factor.min.toFixed(3)}–{factor.max.toFixed(3)} · total{" "}
          <span className="font-semibold text-ink">{factor.total.toFixed(3)}</span>
        </p>
      </div>

      <div
        className="relative flex h-6 w-full overflow-hidden rounded-full"
        role="img"
        aria-label={`${factor.label}: mother ${factor.mother.toFixed(3)}, father ${factor.father.toFixed(3)}`}
      >
        <div
          className="animate-grow flex items-center justify-start pl-2.5 text-[0.68rem] font-semibold text-white"
          style={{
            width: `${motherPct}%`,
            backgroundColor: "var(--color-mother)",
            transformOrigin: "left",
          }}
        >
          {motherPct > 14 && factor.mother.toFixed(3)}
        </div>
        <div
          className="animate-grow flex items-center justify-end pr-2.5 text-[0.68rem] font-semibold text-white"
          style={{
            width: `${fatherPct}%`,
            backgroundColor: "var(--color-father)",
            transformOrigin: "right",
          }}
        >
          {fatherPct > 14 && factor.father.toFixed(3)}
        </div>
      </div>
    </li>
  );
}

export default function FactorLedger({ result }) {
  return (
    <div className="surface animate-rise rounded-2xl p-5 sm:p-7">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-ink">Factor-by-factor ledger</h3>
        <div className="flex items-center gap-3 text-xs text-ink-soft">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "var(--color-mother)" }} /> Mother
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "var(--color-father)" }} /> Father
          </span>
        </div>
      </div>
      <ul>
        {result.factors.map((factor, index) => (
          <FactorRow key={factor.key} factor={factor} index={index} />
        ))}
      </ul>
    </div>
  );
}
