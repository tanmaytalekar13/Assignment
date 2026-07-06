import { Moon, Sun, ScrollText, LogOut, User } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ onOpenAuth, onOpenHistory }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-legacy)]/15 text-[var(--color-legacy)]">
            <ScrollText size={17} strokeWidth={2.2} />
          </span>
          <div className="leading-tight">
            <p className="font-display text-[1.05rem] font-semibold tracking-tight">Lineage Ledger</p>
            <p className="text-[0.68rem] uppercase tracking-[0.16em] text-ink-soft">Parental Legacy Calculator</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenHistory}
            className="rounded-full border border-hairline px-3.5 py-2 text-sm font-medium text-ink-soft transition hover:border-[var(--color-legacy)] hover:text-ink"
          >
            History
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="grid h-9 w-9 place-items-center rounded-full border border-hairline text-ink-soft transition hover:border-[var(--color-legacy)] hover:text-ink"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {user ? (
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 rounded-full border border-hairline px-3.5 py-2 text-sm font-medium text-ink-soft transition hover:border-[var(--color-mother)] hover:text-ink"
              title={`Signed in as ${user.username}`}
            >
              <User size={14} />
              <span className="hidden sm:inline">{user.username}</span>
              <LogOut size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              style={{ backgroundColor: "var(--ink)", color: "var(--bg)" }}
              className="rounded-full px-4 py-2 text-sm font-semibold transition hover:opacity-90"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
