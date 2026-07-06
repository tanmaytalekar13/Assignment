import { useState } from "react";
import { FileDown, FileSpreadsheet, Save, Check } from "lucide-react";
import { exportToCSV, exportToPDF } from "../utils/exportUtils";
import { saveResultToHistory } from "../utils/storage";
import { useAuth } from "../context/AuthContext";

export default function ExportActions({ result, onSaved }) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  async function handleExportPdf() {
    setExportingPdf(true);
    try {
      await exportToPDF(result);
    } finally {
      setExportingPdf(false);
    }
  }

  function handleSave() {
    const updated = saveResultToHistory(user?.username, result);
    onSaved?.(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  const buttonClass =
    "flex items-center gap-2 rounded-full border border-hairline px-4 py-2.5 text-sm font-medium text-ink transition hover:border-[var(--color-legacy)] hover:text-[var(--color-legacy)]";

  return (
    <div className="animate-rise flex flex-wrap items-center justify-center gap-3">
      <button type="button" onClick={() => exportToCSV(result)} className={buttonClass}>
        <FileSpreadsheet size={16} /> Export CSV
      </button>
      <button type="button" onClick={handleExportPdf} disabled={exportingPdf} className={buttonClass}>
        <FileDown size={16} /> {exportingPdf ? "Preparing PDF…" : "Export PDF"}
      </button>
      <button type="button" onClick={handleSave} className={buttonClass}>
        {saved ? <Check size={16} className="text-green-600" /> : <Save size={16} />}
        {saved ? "Saved" : user ? "Save to ledger" : "Save locally"}
      </button>
    </div>
  );
}
