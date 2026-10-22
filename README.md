# PeopleHub HRIS – Sales Presentation

Interactive web deck (42 slides, all 27 modules + IT deep-dive, packages, ROI estimator).

## Run
- Dev: `npm install && npm run dev`
- Offline build: `npm run build` → open `dist/index.html` directly (single file, no server or internet needed). Copy `dist/` to a USB stick.

## Launcher screen
Opening the deck shows a configuration screen (country, industry, client name, theme). Press **Load presentation** to start; press **C** during the show to return to it. Last choices are remembered in the browser. Query parameters below skip the launcher.

## Variants (country / industry / client)
Add query parameters: `index.html?country=lk&industry=apparel&client=Acme`
- country: `lk` (default), `in`, `ae`, `fj` – edit/add in `src/profiles/countries.ts`
- industry: `generic` (default), `apparel`, `retail`, `bpo`, `healthcare`, `education`, `finance`, `construction`, `logistics`, `hospitality`, `plantation` – edit/add in `src/profiles/industries.ts`
- client: shown on opener and closing slide

## Keys
←/→ or click edges: navigate · G: slide grid · N: presenter notes · T: light/dark · F: fullscreen · C: back to settings

## Editing content
Module text/notes: `src/slides/modules.ts`. Demo visuals: `src/slides/demosA.tsx`, `demosB.tsx`. Slide order: `buildSlides()` in `src/slides/slides.tsx`.

## Personalisation
Country drives currency, statutory deductions, tax, leave types, compliance reports and sample names. Industry drives departments, roles, shifts and module demo data (assets, courses, tickets, benefits, KPIs, quiz…) plus a per-module use-case callout. The client name and uploaded logo appear across slides and demo screens. Statutory rates in the profiles are illustrative — confirm before quoting.
