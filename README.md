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

## Client view (the QR / team link)
The link in the QR code opens the hosted deck with `view=client`: no presenter notes (N), settings (C), timer (D) or export (E), a "Prepared for <client>" ribbon, and it never reads the presenter's saved settings. It carries country, industry, client, numbers, pain points, theme and agenda. A logo can't fit in a QR code: put the image in `public/logos/`, redeploy, and enter its address in the launcher. Note this hides the tools but the notes text still ships inside the site code — keep the site behind Cloudflare Access for real privacy.

The QR / team-link address is pre-filled with `https://presentation.peoplehub.biz` (`HOSTED_URL` in `src/engine/Launcher.tsx`); change that constant if the site moves, or clear the launcher field to turn the QR code off.

## Presenter guide
In the app: settings screen → "Presenter guide" (or add `?guide=1` to the address); it prints to a 5-page A4 PDF. A copy is in `docs/PeopleHub-Presenter-Guide.pdf` (regenerate after editing `src/engine/Guide.tsx`).

## Presenter / partner details
The settings screen has a Presenter / partner block (company, name, title, email, phone, website, logo). Blank company = Victory Information defaults from `src/profiles/countries.ts`. A partner company shows only the details it filled in, with "PeopleHub is a product of Victory Information" credited. The details are carried in the client team link (`pco`, `pname`, `ptitle`, `pemail`, `pphone`, `pweb`) so the client's team sees the same contact card; the presenter logo is not (a logo can't travel in a QR code).

## Phones and tablets
On touch devices (or windows under 900px) the deck switches to a mobile shell: a control bar (◀ ☰ ▶, zoom Fit/Read/Large, fullscreen), swipe left/right to change slides (when zoomed, swipe from the slide's edge), a full-screen slide list, and the 3D opener is skipped to save battery. Phones held upright start in the Read zoom with a one-time tip to turn the phone sideways. The settings screen and presenter guide are responsive.

## Multiple presentations
`src/decks/registry.ts` lists the presentations (Outcome Workshop, Platform Tour). The settings screen opens with a chooser; each deck keeps its own agenda (`agendas` in the saved settings). `?deck=workshop|tour` selects one directly and the QR/team link carries it. `DEFAULT_DECK` is the one opened when nothing is chosen (currently the Platform Tour, to switch to the Outcome Workshop once that deck is complete). Add a deck by adding an entry to `decks` with a `build()` that returns its slides.

## Outcome Workshop (deck 2) — status
Phase 2 done: opener, role lens, a day at the client, what we heard, discovery wall, live blueprint, system map, ten outcome chapter cards and the close (recap, rollout waves, packages, value, leave-your-details, next steps, contact). The scenario slides inside each chapter (ids like `time-capture`, listed in `src/decks/workshop/data.ts`) arrive in the next phases; chapter cards link to them automatically once they exist. Live choices (wall, roles, details) are kept in memory only and carried in the team link (`outcomes`, `roles`).

### Phase 3 (chapters 1–5)
Scenario slides for Know every person, Hire & onboard, Time you can trust, Leave without the chase and Pay people right (22 slides, `src/decks/workshop/moments.tsx`, new demos in `demosP3.tsx`). Each slide's presenter notes end with a private **Readiness** line (Live / Partial / Preview) taken from the code review — shown only in presenter notes (N), never in the client view or PDF. Chapters 6–10 follow in phase 4.
