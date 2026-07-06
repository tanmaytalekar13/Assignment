import { useEffect, useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import DOBForm from "./components/DOBForm";
import BraidDivider from "./components/BraidDivider";
import StatCards from "./components/StatCards";
import DominantBanner from "./components/DominantBanner";
import FactorLedger from "./components/FactorLedger";
import ChartsSection from "./components/ChartsSection";
import ExportActions from "./components/ExportActions";
import AuthPanel from "./components/AuthPanel";
import HistoryPanel from "./components/HistoryPanel";
import Footer from "./components/Footer";
import { generateLegacyBreakdown } from "./utils/calculator";
import { getHistory } from "./utils/storage";

function Dashboard() {
  const { user } = useAuth();
  const [result, setResult] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getHistory(user?.username));
  }, [user]);

  function handleCalculate(dob) {
    try {
      const breakdown = generateLegacyBreakdown(dob);
      setResult(breakdown);
    } catch {
      setResult(null);
    }
  }

  function handleSelectHistory(dob) {
    handleCalculate(dob);
    setShowHistory(false);
  }

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Navbar onOpenAuth={() => setShowAuth(true)} onOpenHistory={() => setShowHistory(true)} />

      <main className="mx-auto max-w-6xl px-5 pb-20 pt-14 sm:px-8 sm:pt-20">
        <section className="text-center">
          <p className="animate-rise mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-legacy)]">
            A ledger of inherited traits
          </p>
          <h1 className="animate-rise font-display text-3xl font-semibold leading-tight text-ink sm:text-5xl">
            Where does your legacy
            <br className="hidden sm:block" /> come from — mother, or father?
          </h1>
          <p className="animate-rise mx-auto mt-4 max-w-xl text-sm text-ink-soft sm:text-base" style={{ animationDelay: "40ms" }}>
            Enter a date of birth. Seven foundational life factors are calculated instantly, split
            between maternal and paternal lines, always totalling exactly 100.
          </p>
        </section>

        <div className="mt-10">
          <DOBForm onCalculate={handleCalculate} />
        </div>

        {result && (
          <div className="mt-14 space-y-10">
            <BraidDivider />

            <StatCards result={result} />
            <DominantBanner result={result} />
            <FactorLedger result={result} />
            <ChartsSection result={result} />
            <ExportActions result={result} onSaved={setHistory} />
          </div>
        )}
      </main>

      <Footer />

      {showAuth && <AuthPanel onClose={() => setShowAuth(false)} />}
      {showHistory && (
        <HistoryPanel
          history={history}
          setHistory={setHistory}
          onSelect={handleSelectHistory}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </ThemeProvider>
  );
}
