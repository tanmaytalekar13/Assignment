import { X, Trash2, History as HistoryIcon } from "lucide-react";
import { deleteFromHistory, clearHistory } from "../utils/storage";
import { useAuth } from "../context/AuthContext";

export default function HistoryPanel({ history, setHistory, onSelect, onClose }) {
  const { user } = useAuth();

  function handleDelete(dob) {
    setHistory(deleteFromHistory(user?.username, dob));
  }

  function handleClear() {
    setHistory(clearHistory(user?.username));
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="animate-rise h-full w-full max-w-sm overflow-y-auto surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HistoryIcon size={18} className="text-[var(--color-legacy)]" />
            <h2 className="font-display text-lg font-semibold text-ink">Saved ledgers</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-ink-soft hover:text-ink">
            <X size={18} />
          </button>
        </div>

        {!user && (
          <p className="mb-4 rounded-lg bg-[var(--color-legacy)]/10 px-3 py-2 text-xs text-ink-soft">
            You're browsing as a guest — results are saved to this browser only. Sign in to keep a personal history.
          </p>
        )}

        {history.length === 0 ? (
          <p className="text-sm text-ink-soft">No saved results yet. Calculate a result and tap "Save" to keep it here.</p>
        ) : (
          <ul className="space-y-3">
            {history.map((entry) => (
              <li
                key={entry.dob}
                className="flex items-center justify-between rounded-xl border border-hairline px-4 py-3 transition hover:border-[var(--color-legacy)]"
              >
                <button type="button" onClick={() => onSelect(entry.dob)} className="flex-1 text-left">
                  <p className="font-mono text-sm font-semibold text-ink">{entry.dob}</p>
                  <p className="text-xs text-ink-soft">
                    Dominant:{" "}
                    <span
                      className="font-semibold"
                      style={{
                        color: entry.dominantParent === "mother" ? "var(--color-mother)" : "var(--color-father)",
                      }}
                    >
                      {entry.dominantParent}
                    </span>
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(entry.dob)}
                  aria-label={`Delete result for ${entry.dob}`}
                  className="ml-3 text-ink-soft hover:text-[var(--color-mother)]"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}

        {history.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="mt-5 w-full rounded-lg border border-hairline py-2 text-sm text-ink-soft hover:border-[var(--color-mother)] hover:text-[var(--color-mother)]"
          >
            Clear all history
          </button>
        )}
      </div>
    </div>
  );
}
