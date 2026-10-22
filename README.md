# PeopleHub HRIS – Sales Presentation

Interactive web deck (42 slides, all 27 modules + IT deep-dive, packages, ROI estimator).

## Run
- Dev: `npm install && npm run dev`
- Website build: `npm run build` → `dist/` (small first load; 3D and charts load on demand, assets cached for a year). Used by `npm run deploy`.
- Offline build: `npm run build:offline` → open `dist-offline/index.html` directly (single file, no server or internet needed). Copy `dist-offline/` to a USB stick.

## Launcher screen
Opening the deck shows a configuration screen (country, industry, client name, theme). Press **Load presentation** to start; press **C** during the show to return to it. Last choices are remembered in the browser. Query parameters below skip the launcher.

## Variants (country / industry / client)
Add query parameters: `index.html?country=lk&industry=apparel&client=Acme`
- country: `lk` (default), `in`, `ae`, `fj` – edit/add in `src/profiles/countries.ts`
- industry: `generic` (default), `apparel`, `retail`, `bpo`, `healthcare`, `education`, `finance`, `construction`, `logistics`, `hospitality`, `plantation` – edit/add in `src/profiles/industries.ts`
- client: shown on opener and closing slide
- headcount, hrTeam: client numbers (personalise the value estimator and dashboards)
- pains: comma list of ids — attendance,payroll,leave,data,hiring,compliance,insight,attrition,queries,training (add customPain=text)

## Keys
←/→ or click edges: navigate · G: slide grid · N: presenter notes · T: light/dark · F: fullscreen · C: back to settings

## Editing content
Module text/notes: `src/slides/modules.ts`. Demo visuals: `src/slides/demosA.tsx`, `demosB.tsx`. Slide order: `buildSlides()` in `src/slides/slides.tsx`.

## Personalisation
Country drives currency, statutory deductions, tax, leave types, compliance reports and sample names. Industry drives departments, roles, shifts and module demo data (assets, courses, tickets, benefits, KPIs, quiz…) plus a per-module use-case callout. The client name and uploaded logo appear across slides and demo screens. Statutory rates in the profiles are illustrative — confirm before quoting.

## Presenting tools
- **Module spotlight:** on the overview slide click any module to jump to it (even if it is not in the agenda); Backspace or the button returns.
- **Agenda & timer:** the launcher can shorten the deck to 20 / 30 / 45 / custom minutes (keeps the must-have slides, then adds the modules most relevant to the client's industry and pain points) or lets you pick and order slides manually. **D** toggles the timer with pace (ahead/behind); click it to restart.
- **Pointer:** **L** cycles laser → spotlight → off. **.** gives a black screen. Works with presentation clickers (Page Up/Down, arrows).
- **PDF leave-behind:** **E** (or the launcher button) opens a print view; choose Save as PDF (landscape, margins none, background graphics on). Add `&print=1` to the address to open it directly.
- **QR code:** enter the private page where the deck is hosted in the launcher; the closing slide and PDF show a QR code to it (personalised with the client's settings by default). The deck itself is a static site, so host the `dist` folder somewhere access-controlled (SharePoint, Azure Static Web Apps with login, etc.).

## Hosting on Cloudflare Pages (presentation.peoplehub.biz)
1. `npx wrangler login` (once), then `npm run deploy` — builds and uploads `dist/` to the Pages project `peoplehub-presentation` (created on first run).
2. Cloudflare dashboard → Workers & Pages → peoplehub-presentation → Custom domains → add `presentation.peoplehub.biz` (DNS is already on Cloudflare, so the record is created for you).
3. Make it private: Zero Trust → Access → Applications → add a self-hosted app for `presentation.peoplehub.biz` with an allow policy (e.g. your company emails or a one-time PIN for client emails). Without this the page is public to anyone with the link.
`public/_headers` and `robots.txt` tell search engines not to index the site.
