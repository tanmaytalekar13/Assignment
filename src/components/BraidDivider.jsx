export default function BraidDivider({ className = "" }) {
  return (
    <div className={`w-full overflow-hidden ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="w-full h-10">
        <path
          d="M0 30 C 100 0, 200 60, 300 30 S 500 0, 600 30 S 800 60, 900 30 S 1100 0, 1200 30"
          fill="none"
          stroke="var(--color-mother)"
          strokeWidth="2.5"
          opacity="0.75"
        />
        <path
          d="M0 30 C 100 60, 200 0, 300 30 S 500 60, 600 30 S 800 0, 900 30 S 1100 60, 1200 30"
          fill="none"
          stroke="var(--color-father)"
          strokeWidth="2.5"
          opacity="0.75"
        />
        <circle cx="600" cy="30" r="4.5" fill="var(--color-legacy)" />
      </svg>
    </div>
  );
}
