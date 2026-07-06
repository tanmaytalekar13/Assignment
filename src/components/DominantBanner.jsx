import { Sparkles } from "lucide-react";

export default function DominantBanner({ result }) {
  const isMother = result.dominantParent === "mother";
  const accent = isMother ? "var(--color-mother)" : "var(--color-father)";
  const label = isMother ? "Mother" : "Father";
  const diff = Math.abs(result.motherTotal - result.fatherTotal);

  return (
    <div
      className="animate-rise flex flex-col items-center gap-1.5 rounded-2xl border px-6 py-5 text-center sm:flex-row sm:justify-center sm:gap-3"
      style={{ borderColor: accent, backgroundColor: `color-mix(in srgb, ${accent} 10%, transparent)` }}
    >
      <Sparkles size={18} style={{ color: accent }} />
      <p className="text-sm text-ink sm:text-base">
        <span className="font-display text-lg font-semibold" style={{ color: accent }}>
          {label} line
        </span>{" "}
        carries the dominant legacy — ahead by{" "}
        <span className="font-mono font-semibold">{diff.toFixed(3)}</span> points, driven by a{" "}
        {result.isOddDay ? "odd" : "even"}-numbered day of birth ({result.day}).
      </p>
    </div>
  );
}
