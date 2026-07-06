import { useState } from "react";
import { X, LockKeyhole } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthPanel({ onClose }) {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "login") {
        await login(username, password);
      } else {
        await signup(username, password);
      }
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4" role="dialog" aria-modal="true">
      <div className="animate-rise w-full max-w-sm rounded-2xl surface p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-[var(--color-legacy)]">
            <LockKeyhole size={18} />
            <h2 className="font-display text-lg font-semibold text-ink">
              {mode === "login" ? "Sign in" : "Create an account"}
            </h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-ink-soft hover:text-ink">
            <X size={18} />
          </button>
        </div>

        <p className="mt-1.5 text-sm text-ink-soft">
          {mode === "login"
            ? "Sign in to save your ledger entries across visits."
            : "Create a local account to keep a history of your results."}
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
          <div>
            <label htmlFor="username" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              minLength={3}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-hairline bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none focus:border-[var(--color-legacy)]"
              placeholder="e.g. asha_rao"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={4}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-hairline bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none focus:border-[var(--color-legacy)]"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-[var(--color-mother)]/10 px-3 py-2 text-sm text-[var(--color-mother-deep)]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-[var(--color-legacy)] py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError("");
          }}
          className="mt-4 w-full text-center text-sm text-ink-soft hover:text-ink"
        >
          {mode === "login" ? "New here? Create an account" : "Already have an account? Sign in"}
        </button>

        <p className="mt-4 text-center text-[0.7rem] text-ink-soft/80">
          Demo authentication only — accounts are stored in this browser, not on a server.
        </p>
      </div>
    </div>
  );
}
