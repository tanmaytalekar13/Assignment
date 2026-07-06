import { useState } from "react";
import { CalendarHeart } from "lucide-react";
import { validateDOB } from "../utils/calculator";

export default function DOBForm({ onCalculate }) {
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");
  const todayISO = new Date().toISOString().slice(0, 10);

  function handleChange(e) {
    const value = e.target.value;
    setDob(value);

    const { valid, error: validationError } = validateDOB(value);
    if (!valid) {
      setError(validationError);
      return;
    }
    setError("");
    onCalculate(value);
  }

  return (
    <div className="animate-rise mx-auto max-w-md text-center" style={{ animationDelay: "80ms" }}>
      <label htmlFor="dob-input" className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
        Date of birth
      </label>

      <div className="relative">
        <CalendarHeart
          size={20}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-legacy)]"
        />
        <input
          id="dob-input"
          type="date"
          value={dob}
          max={todayISO}
          onChange={handleChange}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "dob-error" : undefined}
          className="font-mono w-full rounded-xl border-2 border-hairline bg-elevated py-4 pl-12 pr-4 text-center text-lg text-ink shadow-sm outline-none transition focus:border-[var(--color-legacy)]"
        />
      </div>

      <div className="mx-auto mt-3 h-px w-2/3 bg-hairline" style={{ backgroundColor: "var(--line)" }} />

      {error ? (
        <p id="dob-error" role="alert" className="mt-3 text-sm font-medium text-[var(--color-mother-deep)]">
          {error}
        </p>
      ) : (
        <p className="mt-3 text-sm text-ink-soft">
          {dob ? "Validated · results calculated automatically below" : "Select a date to reveal your ledger"}
        </p>
      )}
    </div>
  );
}
