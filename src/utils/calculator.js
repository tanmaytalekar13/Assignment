// The math behind the calculator.
//
// Problem: the brief gives a min/max range per factor, but those ranges
// don't sum to 100 (add up all the maxes and you get ~54, all the mins and
// you get ~47). So the ranges are treated as a starting point, not a final
// answer, and get normalized down to 100. Steps:
//
// 1. Pull one value per factor from inside its range, using a PRNG seeded
//    off the date of birth so the same date always gives the same result.
// 2. Scale all seven values so they add up to exactly 100.
// 3. Split each factor between Mother and Father. Odd day of birth favours
//    Mother, even day favours Father (per the brief). The favoured side gets
//    a random-ish edge, and the other side is just `total - mother` so the
//    two numbers can never drift apart from a rounding error.
//
// Because of #3, every factor's mother+father equals its total exactly,
// which means the two grand totals add up to 100 automatically - no extra
// correction step needed anywhere.

export const FACTORS = [
  { key: "geneticInheritance", label: "Genetic Inheritance", min: 9.333, max: 10.777 },
  { key: "constitutionalVitality", label: "Constitutional Vitality", min: 8.111, max: 9.111 },
  { key: "mentalPatterns", label: "Mental Patterns", min: 6.111, max: 7.111 },
  { key: "intellectualCapacity", label: "Intellectual Capacity", min: 6.333, max: 6.999 },
  { key: "emotionalFoundation", label: "Emotional Foundation", min: 7.111, max: 7.999 },
  { key: "spiritualLineage", label: "Spiritual Lineage", min: 5.011, max: 6.011 },
  { key: "soulConnections", label: "Soul Connections", min: 5.111, max: 6.222 },
];

// djb2 string hash - just need something quick to turn a date string into a seed
function hashString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0;
}

// Mulberry32 PRNG - small, fast, good enough for this. Returns a fn producing [0,1).
function mulberry32(seed) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function round3(value) {
  return Number(value.toFixed(3));
}

/**
 * Validates a date-of-birth string (YYYY-MM-DD, as produced by <input type="date">).
 * Returns { valid: boolean, error?: string, date?: Date }
 */
export function validateDOB(isoDateString) {
  if (!isoDateString) {
    return { valid: false, error: "Please choose a date of birth." };
  }

  const parsed = new Date(`${isoDateString}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return { valid: false, error: "That date isn't valid." };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (parsed.getTime() > today.getTime()) {
    return { valid: false, error: "Date of birth cannot be in the future." };
  }

  const earliest = new Date("1900-01-01T00:00:00");
  if (parsed.getTime() < earliest.getTime()) {
    return { valid: false, error: "Please enter a date after 1 Jan 1900." };
  }

  return { valid: true, date: parsed };
}

/**
 * Generates the full legacy breakdown for a given date of birth.
 * @param {string} isoDateString - date in YYYY-MM-DD format
 * @returns {object} breakdown
 */
export function generateLegacyBreakdown(isoDateString) {
  const { valid, error, date } = validateDOB(isoDateString);
  if (!valid) {
    throw new Error(error);
  }

  const day = date.getDate();
  const isOddDay = day % 2 === 1;
  const seedBase = hashString(isoDateString);

  // Step 1: deterministic raw value per factor, within its documented range.
  const rawTotals = FACTORS.map((factor, index) => {
    const rng = mulberry32(seedBase + index * 7919 + 1);
    return factor.min + rng() * (factor.max - factor.min);
  });

  const rawSum = rawTotals.reduce((a, b) => a + b, 0);
  const scale = 100 / rawSum;
  const scaledTotals = rawTotals.map((v) => v * scale);

  // Step 2: round to 3 decimals, assigning the rounding residual to the last
  // factor so the displayed grand total is always exactly 100.000.
  const roundedTotals = scaledTotals.map((v) => round3(v));
  const runningSum = roundedTotals.slice(0, -1).reduce((a, b) => a + b, 0);
  roundedTotals[roundedTotals.length - 1] = round3(100 - runningSum);

  // Step 3: split each factor's total between Mother and Father.
  const factors = FACTORS.map((factor, index) => {
    const biasRng = mulberry32(seedBase + index * 104729 + day * 31 + 7);
    const biasMagnitude = 0.06 + biasRng() * 0.09; // 6%–15% edge for the favoured parent
    const motherShare = isOddDay ? 0.5 + biasMagnitude : 0.5 - biasMagnitude;

    const total = roundedTotals[index];
    const mother = round3(total * motherShare);
    const father = round3(total - mother); // exact complement, never approximate

    return {
      key: factor.key,
      label: factor.label,
      min: factor.min,
      max: factor.max,
      mother,
      father,
      total,
      higherParent: mother === father ? "equal" : mother > father ? "mother" : "father",
    };
  });

  const motherTotal = round3(factors.reduce((a, f) => a + f.mother, 0));
  const fatherTotal = round3(factors.reduce((a, f) => a + f.father, 0));
  const grandTotal = round3(motherTotal + fatherTotal);

  return {
    dob: isoDateString,
    day,
    isOddDay,
    dominantParent: motherTotal === fatherTotal ? "equal" : motherTotal > fatherTotal ? "mother" : "father",
    factors,
    motherTotal,
    fatherTotal,
    grandTotal,
    generatedAt: new Date().toISOString(),
  };
}
