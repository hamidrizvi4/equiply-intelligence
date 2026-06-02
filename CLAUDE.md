# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (http://localhost:5173)
npm run build     # Production build → dist/
npm run lint      # ESLint across all JS/JSX files
npm run preview   # Serve production build locally
```

No test suite is configured.

## Architecture

This is a client-side-only React dashboard for medical equipment lifecycle analysis. There is no backend or API — all processing happens in the browser.

**Data flow:**

1. `main.jsx` mounts the app; `App.jsx` holds the single piece of global state: `equipmentData`
2. When `equipmentData` is null, `FileUpload` is shown — user drags in a CSV or loads a demo dataset
3. `FileUpload` calls `processPipeline()` from `src/utils/dataPipeline.js`, which parses the CSV (PapaParse) and enriches each row with device type, inferred manufacture date, age, and lifecycle status
4. The enriched array is set as `equipmentData`, switching the view to `Dashboard`
5. `Dashboard` renders three child components: `ExecutiveSummary` (KPI cards), `DeviceChart` (SVG donut + bar chart), `AssetTable` (filterable, sortable, paginated grid)

**`src/utils/dataPipeline.js` is the core logic layer:**
- A hardcoded lookup dictionary maps `manufacturer|||model` → standardized device type (40+ medical devices)
- Serial number regex patterns extract manufacture date (YYMM, letter-based, year-only; falls back to 2018-01-01 with low confidence)
- Lifecycle status is derived from device type and age: Critical (≥ lifespan), Warning (≥ lifespan − 2yr), Good otherwise
- Default lifespan is 10 years; specialized: Infusion Pump 5yr, Defibrillator 7yr, Patient Monitor 6yr, Ultrasonic Scaler 8yr

**Styling:** Tailwind CSS v4 (configured via `@tailwindcss/vite` plugin, imported in `index.css` with `@import "tailwindcss"`). Dark glassmorphism theme — base colors `bg-[#0d0e12]` / `text-gray-100`, backdrop-blur semi-transparent cards. All component styling is done with Tailwind utility classes inline in JSX.

**State management:** `useState` and `useMemo` only — no external state library.
