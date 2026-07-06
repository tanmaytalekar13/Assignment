# Lineage Ledger — Parental Legacy & Life Factors Calculator

A React + Vite web app that takes a **Date of Birth** and instantly calculates how
seven foundational "life factors" split between a Mother line and a Father line —
with the two always summing to a **Grand Total of exactly 100**.

Built for the Neutrino Veda MERN Full Stack Developer assessment.

---

## Live demo & repo

- Repository: _add your GitHub URL here after pushing_
- Deployed app: _add your Vercel / Netlify URL here after deploying_

---

## Features

### Core requirements
- **Date of Birth input** using a native `<input type="date">`, with validation
  (rejects empty, invalid, and future dates, and dates before 1900).
- **Auto-calculation** — results are generated the instant a valid date is chosen,
  no submit button required.
- **Mother / Father / Total** shown for each of the 7 life factors:
  Genetic Inheritance, Constitutional Vitality, Mental Patterns, Intellectual
  Capacity, Emotional Foundation, Spiritual Lineage, Soul Connections.
- **Mother Total, Father Total and Grand Total (= 100)** displayed as stat cards.
- **Dominant parent banner** — clearly states which parent's line carries the
  higher overall legacy value, and by how much.
- **Charts** — a grouped bar chart (Mother vs Father per factor) and a donut
  chart (share of the grand total), built with Recharts.
- **Responsive design** — works from small phones to desktop, built with
  Tailwind CSS.

### Bonus features implemented
| Feature | Status |
|---|---|
| Export results as PDF | ✅ (`jsPDF` + `jspdf-autotable`) |
| Export results as CSV | ✅ |
| Dark / Light mode toggle | ✅ (persisted, respects system preference) |
| Save results (localStorage) | ✅ (per-user history, up to 25 entries) |
| User authentication (JWT-style) | ✅ (demo — see [Authentication](#authentication) below) |

---

## Calculation logic

The brief only gives a **range** per factor and two rules:

1. `Mother + Father = Total` for every factor.
2. `sum(Mother) + sum(Father) = 100`.

Since the sum of the seven documented ranges does not naturally add up to 100,
the app derives a deterministic value per factor and then scales it, as follows
(see `src/utils/calculator.js`):

1. **Deterministic draw** — the date of birth is hashed and fed into a seeded
   PRNG (Mulberry32), which draws one value per factor **inside its documented
   min–max range**. Same date of birth → same result, every time.
2. **Scale to 100** — the seven raw values are scaled so they sum to exactly
   100, then rounded to 3 decimals (the small rounding remainder is folded into
   the last factor so the grand total is never `99.999` or `100.001`).
3. **Split Mother / Father** — the day of the month decides which parent is
   favoured (odd day → Mother, even day → Father, per the brief). Each factor
   gets a deterministic 6–15% edge toward the favoured parent; the other
   parent's value is the **exact complement** (`father = total - mother`), so
   the two rules above hold exactly for every date, with no floating-point
   drift.

This keeps the app fully deterministic and reproducible (a requirement implied
by "auto-calculation on date selection") while still respecting every stated
constraint.

---

## Authentication

The brief marks backend/database as **optional**, so this project ships a
fully client-side, demo-grade auth flow instead of standing up an Express
server:

- Passwords are hashed with SHA-256 via the browser's Web Crypto API.
- A JWT-shaped token (`header.payload.signature`, base64url encoded) is issued
  on login/signup and stored in `localStorage`.
- Accounts and sessions never leave the browser.

This is **not** production security (there's no server to verify the signature
against, and the "secret" lives in client code) — it exists to demonstrate the
JWT-based auth flow requested in the bonus section. See
`src/utils/auth.js` for the implementation and a note on how it would be
swapped for a real Node/Express + `jsonwebtoken` backend.

---

## Tech stack

| Layer | Choice |
|---|---|
| Build tool | Vite 8 |
| Framework | React 19 (functional components + hooks only) |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`), custom design tokens |
| Charts | Recharts |
| Icons | lucide-react |
| PDF export | jsPDF + jspdf-autotable (lazy-loaded on demand) |
| CSV export | Hand-rolled CSV writer + file-saver |
| State | React hooks + Context API (`ThemeContext`, `AuthContext`) — no Redux needed for this scope |
| Persistence | `localStorage` (results history, accounts, theme, session) |

---

## Project structure

```
src/
  components/       Presentational + interactive components (one concern each)
  context/           ThemeContext (dark/light) and AuthContext (mock JWT auth)
  hooks/             useCountUp — animated number reveal
  utils/
    calculator.js    Core deterministic calculation engine (pure functions, unit-testable)
    exportUtils.js   CSV / PDF export
    storage.js       localStorage-backed results history
    auth.js          Demo JWT-style authentication
  App.jsx            Top-level layout & state orchestration
  main.jsx           React entry point
  index.css          Design tokens (colors, type, motion) + Tailwind import
```

The calculation engine in `utils/calculator.js` has no dependency on React or
the DOM — it's a set of pure functions, which makes it straightforward to unit
test or reuse (e.g. from a future Node/Express API) without change.

---

## Getting started

### Prerequisites
- Node.js 18+ and npm

### Install & run locally

```bash
git clone <your-repo-url>
cd legacy-calculator
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for production

```bash
npm run build
npm run preview   # serve the production build locally to sanity-check it
```

### Lint

```bash
npm run lint
```

---

## Deployment

This is a static single-page app (no required backend), so it deploys cleanly
to any static host:

**Vercel**
```bash
npm i -g vercel
vercel
```

**Netlify**
```bash
npm run build
# drag-and-drop the generated dist/ folder onto app.netlify.com/drop
# or: netlify deploy --prod --dir=dist
```

**GitHub Pages**
```bash
npm run build
# publish the dist/ folder to a gh-pages branch, e.g. using the gh-pages package
```

---

## Design notes

The visual direction is built around the subject itself — two intertwined
lines of inheritance:

- **Mother** is represented by a deep rose (`#c34670`), **Father** by a deep
  steel blue (`#2e6e8e`), used consistently across every chart, bar and badge
  so the color coding is learned once and reused everywhere.
- Each factor is shown as a **balance bar** — a single bar split at the exact
  Mother/Father ratio — so the layout itself encodes the data, not just the
  numbers next to it.
- Headings use **Fraunces** (a warm, editorial serif, fitting a "ledger of
  inheritance"); body copy uses **Manrope**; all calculated numbers use
  **JetBrains Mono** with tabular figures, so values align cleanly in columns.
- Motion is limited to one entrance sequence and a number count-up on
  calculation; `prefers-reduced-motion` is respected throughout.

---

## Evaluation checklist (self-assessment against the brief)

- [x] DOB input with validation
- [x] Auto-calculation on date selection
- [x] Mother / Father / Total shown per factor
- [x] Mother Total, Father Total, Grand Total (= 100, exactly)
- [x] Dominant parent indicator
- [x] Charts (bar + donut)
- [x] Responsive design
- [x] CSV export
- [x] PDF export
- [x] Dark / light mode
- [x] Save results (localStorage, per-user)
- [x] JWT-style authentication (client-side demo)
