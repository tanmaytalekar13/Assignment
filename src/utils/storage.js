const HISTORY_KEY_PREFIX = "lineage-ledger:history:";

function historyKey(username) {
  return `${HISTORY_KEY_PREFIX}${username || "guest"}`;
}

export function getHistory(username) {
  try {
    const raw = localStorage.getItem(historyKey(username));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveResultToHistory(username, result) {
  const existing = getHistory(username);
  const withoutDuplicate = existing.filter((entry) => entry.dob !== result.dob);
  const updated = [{ ...result, savedAt: new Date().toISOString() }, ...withoutDuplicate].slice(0, 25);
  localStorage.setItem(historyKey(username), JSON.stringify(updated));
  return updated;
}

export function deleteFromHistory(username, dob) {
  const existing = getHistory(username);
  const updated = existing.filter((entry) => entry.dob !== dob);
  localStorage.setItem(historyKey(username), JSON.stringify(updated));
  return updated;
}

export function clearHistory(username) {
  localStorage.removeItem(historyKey(username));
  return [];
}
