# Lineage Ledger

Parental Legacy & Life Factors Calculator — built for the Neutrino Veda MERN
assessment.

You put in a date of birth, and it works out how 7 "life factors" split
between a Mother side and a Father side. The two always add up to exactly
100, per the brief.

## Repo / demo

- Repo: _add your GitHub link here once you push_
- Live: _add your Vercel/Netlify link here once deployed_

## What's in it

Everything asked for in the task doc:

- Date of birth picker, validated (no future dates, nothing before 1900)
- Results calculate the moment you pick a date, no submit button
- Mother / Father / Total for each of the 7 factors
- Mother total, Father total, and a Grand Total that's always 100
- A banner telling you which parent's line is higher, and by how much
- A bar chart (mother vs father per factor) and a donut chart (overall split)
- Responsive — tested down to a small phone width

And the bonus stuff, all of it:

- CSV export
- PDF export (jsPDF, loaded lazily so it doesn't bloat the initial bundle)
- Dark/light toggle, remembers your choice
- Save results — stored in localStorage, per account
- Login/signup with JWT-style tokens (more on this below, it's client-only)

## The actual math

This was the annoying part. The brief gives a min/max range for each factor,
but if you just add up all the maximums you get ~54, and all the minimums
you get ~47 — nowhere near 100. So the ranges can't be literal totals, they
have to be more like a starting point that gets normalized.

Here's what I went with (`src/utils/calculator.js`):

1. Hash the date of birth, feed it into a small seeded PRNG, and pull one
   value per factor from inside its min/max range. Same date always gives
   the same numbers — needed this for it to feel deterministic rather than
   "refresh and get a new answer."
2. Scale all 7 values so they add up to exactly 100. Round to 3 decimals,
   and stick any leftover rounding difference onto the last factor so the
   grand total never shows up as 99.999 or 100.001.
3. Split each factor between the two parents. Odd day of birth → mother gets
   the bigger half, even day → father does, matching the brief. The winning
   side gets a random-ish edge somewhere between 6-15%, and the other side
   is just `total - mother`, not its own separate calculation — that way the
   two numbers can never drift apart from the total by a rounding error.

Because of step 3, `mother + father = total` is exact for every single
factor, which means the two grand totals also add up to exactly 100 without
any extra correction needed. Worked through a handful of test dates by hand
to make sure this actually holds, it does.

## About the login

The task says backend/DB are optional, so there's no real server here —
auth is done entirely in the browser. Passwords get hashed with SHA-256
(Web Crypto, built into the browser), and a JWT-shaped token gets stored in
localStorage after login. It looks and behaves like real JWT auth, but
there's no server to actually verify a signature against, so don't treat
this as secure — it's here to hit the "JWT auth" bonus point, not to protect
real accounts. If this became a real product, the obvious next step is
moving `src/utils/auth.js`'s logic into an Express route and issuing real
signed tokens server-side.

## Stack

- Vite + React 19 (hooks, no class components)
- Tailwind v4
- Recharts for the charts
- lucide-react for icons
- jsPDF + jspdf-autotable for the PDF, file-saver for CSV
- Context API for theme + auth state — didn't feel like this needed Redux
- localStorage for everything else (history, accounts, session, theme)

## Folder layout

```
src/
  components/     one component per concern — form, charts, cards, panels
  context/        ThemeContext, AuthContext
  hooks/          useCountUp (the number tick-up animation on the stat cards)
  utils/
    calculator.js   the actual math, no React/DOM in here at all
    exportUtils.js  CSV + PDF
    storage.js      localStorage history helpers
    auth.js         the demo auth described above
  App.jsx
  main.jsx
  index.css       colors/fonts/tokens + tailwind import
```

Kept `calculator.js` free of any React or browser dependency on purpose —
it's just plain functions, so you could copy it into a real backend later
without touching it.

## Running it

Needs Node 18+.

```bash
npm install
npm run dev
```

Opens on `http://localhost:5173`.

```bash
npm run build     # production build
npm run preview   # serve that build locally to double check it
npm run lint
```

## Deploying

It's a static build, no server required, so any of these work fine:

**Vercel** — `vercel` (after `npm i -g vercel`), follow the prompts.

**Netlify** — `npm run build`, then drag the `dist` folder onto
app.netlify.com/drop, or `netlify deploy --prod --dir=dist`.

**GitHub Pages** — `npm run build`, push `dist` to a `gh-pages` branch (the
`gh-pages` npm package makes this a one-liner if you don't want to do it by
hand).

## A note on the design

Went with two colors that actually mean something rather than being random
accents — a deep rose for Mother and a steel blue for Father, used
consistently everywhere (charts, badges, the balance bars). Each factor row
is a single bar split at the real mother/father ratio, so the bar itself
is the data, not just decoration next to the numbers.

Headings are set in Fraunces (wanted something with a bit of warmth, given
the "ledger of inheritance" framing), body text is Manrope, and all the
calculated numbers use JetBrains Mono so they line up cleanly in columns.
Animation is kept to one entrance sequence plus the number count-up —
`prefers-reduced-motion` is respected.
