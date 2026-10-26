import type { ReactNode } from 'react'

/** Presenter guide — one page you can read in the app or print / save as a PDF handout. */

const keys: [string, string][] = [
  ['→  Space  Enter  Page Down  (clicker next)', 'Next slide'],
  ['←  Page Up  (clicker back)', 'Previous slide'],
  ['Backspace', 'Previous slide — or return from a module jump'],
  ['Home / End', 'First / last slide'],
  ['G', 'Slide grid: jump anywhere, or open slides hidden by the agenda'],
  ['N', 'Presenter notes + planned time for the current slide'],
  ['D', 'Timer with pace (ahead / behind). Click the timer to restart it'],
  ['L', 'Pointer: laser → spotlight → off (for projectors)'],
  ['M', 'Magnifier lens that follows the mouse — wheel or + / − to zoom, M or Esc to close'],
  ['.', 'Black screen (any key returns)'],
  ['T', 'Light / dark theme'],
  ['F', 'Fullscreen'],
  ['E', 'Export the PDF leave-behind'],
  ['C', 'Back to the settings screen'],
  ['?', 'Shortcut cheat-sheet on screen'],
]

const Section = ({ n, title, children }: { n: number; title: string; children: ReactNode }) => (
  <section className="mb-8">
    <h2 className="serif text-[26px] font-bold mb-3 flex items-baseline gap-3"><span className="text-[15px] font-extrabold" style={{ color: 'var(--brand)' }}>{String(n).padStart(2, '0')}</span>{title}</h2>
    {children}
  </section>
)
const List = ({ items }: { items: ReactNode[] }) => <ul className="list-disc pl-6 space-y-1.5 text-[15.5px] leading-snug">{items.map((t, i) => <li key={i}>{t}</li>)}</ul>
const Tip = ({ children }: { children: ReactNode }) => <div className="mt-3 rounded-xl px-4 py-3 text-[14.5px]" style={{ background: '#eef4ff', border: '1px solid #c7d7fb' }}>{children}</div>

export function Guide({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 overflow-auto guide-scroll" style={{ background: '#e8ecf3' }}>
      <div className="no-print sticky top-0 z-10 flex items-center justify-between px-6 py-3" style={{ background: '#0f172a', color: '#fff' }}>
        <b>PeopleHub presentation — presenter guide</b>
        <span className="flex gap-3">
          <button onClick={() => window.print()} className="rounded-lg px-4 py-1.5 text-[14px] font-bold" style={{ background: 'linear-gradient(90deg,#3b6be0,#22d3ee)' }}>Print / Save as PDF</button>
          <button onClick={onClose} className="rounded-lg px-4 py-1.5 text-[14px] font-bold border border-white/30">Close</button>
        </span>
      </div>

      <article className="guide-doc mx-auto my-0 sm:my-6 px-5 sm:px-12 py-6 sm:py-10 max-w-[860px] shadow-xl" style={{ background: '#fff', color: '#0f172a' }}>
        <header className="mb-8 pb-5 border-b" style={{ borderColor: '#dbe2ee' }}>
          <div className="text-[13px] tracking-[0.2em] uppercase font-bold" style={{ color: '#3b6be0' }}>Victory Information · PeopleHub HRIS</div>
          <h1 className="serif text-[30px] sm:text-[38px] font-bold leading-tight mt-1">Presenter guide</h1>
          <p className="text-[16px] mt-2" style={{ color: '#52627f' }}>How to prepare, run and follow up a client presentation with the interactive PeopleHub deck. Keep this open or printed on your first few visits.</p>
        </header>

        <Section n={1} title="Before the visit (15 minutes)">
          <List items={[
            <><b>Learn the client.</b> Note their industry, country, headcount, HR team size, current tools, and the 3–4 things that hurt most. Use a short call or email beforehand.</>,
            <><b>Configure the deck</b> on the settings screen (see section 2). Spending five minutes here is what makes the demo feel like it was built for them.</>,
            <><b>Pick the length.</b> Ask how long you really have, then choose a 20 / 30 / 45-minute agenda. Leave 25% of the meeting for discussion.</>,
            <><b>Test on the real kit.</b> Open the hosted site (or the offline copy) on the laptop you will take. Check fullscreen (F) on the client’s screen or projector, the sound, and your clicker.</>,
            <><b>Have a backup.</b> Keep the offline copy (<code>dist-offline/index.html</code>) on the laptop and a USB stick — it needs no internet or server. Also export the PDF (section 6) in case a screen fails.</>,
          ]} />
          <Tip><b>Rule of thumb:</b> the deck is a conversation, not a lecture. Plan to ask more than you tell.</Tip>
        </Section>

        <Section n={2} title="The settings screen — what to fill in">
          <List items={[
            <><b>Choose presentation</b> (very top) — pick <i>Outcome Workshop</i> (client co-design session) or <i>Platform Tour</i> (full module walk-through). Each keeps its own length and slide selection, and the team link / QR opens the same one.</>,
            <><b>Presenter / partner</b> (below that) — enter your company, name, title, email, phone, website and logo. These replace the Victory Information contact details on the opener, thank-you slide, PDF and client team link. Leave Company blank to present as Victory Information. Sales partners should fill this in once; it is remembered on that laptop.</>,
            <><b>1 Country</b> sets currency, statutory deductions (e.g. EPF/ETF, FNPF), tax name, leave types, compliance reports and sample names.</>,
            <><b>2 Industry</b> sets the headline, departments, roles, shifts, the illustration, and the sample data inside every module demo.</>,
            <><b>3 Client</b> name appears on the opener, ribbons, demo screens and the closing slide. <b>4 Logo</b> — upload a PNG/JPG/SVG (a transparent PNG works best).</>,
            <><b>6 Client numbers</b> (employees, HR team size) personalise the dashboards and the value estimator. Use the client’s real figures if you have them.</>,
            <><b>7 Pain points</b> — tick up to four, and type any extra in their own words. These become the “What we heard” slide, a green “Solves…” tag on each relevant module, and a closing “challenges solved” recap.</>,
            <><b>8 Agenda</b> — Full deck, 20 / 30 / 45 min, a custom length, or Manual (tick slides, reorder with ▲ ▼). Auto mode always keeps the must-have slides and prioritises the modules matching the client’s industry and pains.</>,
            <><b>9 Team link (QR)</b> — pre-filled with the hosted address. Leave “Client view” ticked so the client’s team gets a safe version.</>,
          ]} />
          <Tip>Press <b>Load presentation</b> to start. Your choices are remembered in this browser for next time, so remember to change the client name between meetings.</Tip>
        </Section>

        <Section n={3} title="Running the session">
          <p className="text-[15.5px] mb-3">A typical 30-minute flow (the timer in the footer shows whether you are ahead or behind):</p>
          <table className="w-full text-[14.5px] border-collapse">
            <thead><tr style={{ background: '#f1f5f9' }}><th className="text-left p-2 border" style={{ borderColor: '#dbe2ee' }}>Part</th><th className="text-left p-2 border" style={{ borderColor: '#dbe2ee' }}>What to do</th></tr></thead>
            <tbody>
              {([
                ['Opening · ~3 min', 'Thank them, state the agenda and the time. Show the opener, then “What we heard”. Read their pain points back and ask: “Is this still right? What is missing?” Capture changes.'],
                ['Before & after · ~2 min', 'Walk down the HR manager’s day. Ask which row hurts most — that tells you which modules to linger on.'],
                ['Platform overview · ~2 min', 'On the module map, the pulsing items are the ones we expect to matter for their industry. Click a module to jump to it; Backspace returns here. Follow their interest, not the slide order.'],
                ['Modules · ~12 min', 'For each: one sentence of value, show the animated demo, read the green “Solves…” tag, ask “Does this match how you work today?” Skip fast if they nod; slow down if they lean in.'],
                ['IT questions · as needed', 'If an IT manager is present, open the IT deep-dive slides from the grid (G): architecture, tenancy & deployment, security, integration. Keep to capabilities.'],
                ['Why switch & value · ~4 min', 'Alternatives comparison, then the value estimator — drag the sliders with their numbers. Say the figures are indicative.'],
                ['Packages & close · ~4 min', 'Recommend a package based on what they reacted to (no prices on screen). Finish on Next steps and ask for the discovery workshop date before you leave.'],
              ] as const).map(([a, b]) => <tr key={a}><td className="p-2 border font-semibold align-top sm:w-[170px]" style={{ borderColor: '#dbe2ee' }}>{a}</td><td className="p-2 border" style={{ borderColor: '#dbe2ee' }}>{b}</td></tr>)}
            </tbody>
          </table>
          <h3 className="font-bold text-[17px] mt-5 mb-2">If you chose the Outcome Workshop</h3>
          <List items={[
            <>Open with the confident <b>Run every people process on one platform</b> screen, then <b>Who is in the room</b> (tap everyone present) and <b>A day at your company</b>.</>,
            <>On <b>What’s holding you back?</b> the client taps their pains (pre-ticked from your settings; they can add their own words). Every capability slide that answers a pain then plays an animated <i>“this will solve your pain”</i> moment, and the wrap-up replays the list.</>,
            <>On the <b>Discovery wall</b> hand the conversation over: the client taps the outcomes that matter, in priority order (number 1 = where we start). Pain points and industry pre-tick a few. Ask why for each pick.</>,
            <><b>Your PeopleHub toolkit</b> lets the client pick any capability to see it live — tap one, use the <b>Back</b> button to return — and <b>Done exploring — next step</b> (also on every capability slide) jumps to the wrap-up when they have seen enough.</>,
            <><b>Your blueprint, live</b> reads their choices back and lights the modules in scope. The chapters that follow are re-ordered to their picks. In the settings screen you can instead choose <i>Pick chapters</i> to set the chapters and order yourself.</>,
            <>Inside each chapter there is a scenario slide per capability (a short story, the screen, and what changes). Press <b>N</b> for the talk track — each slide's notes end with a <b>private readiness line</b> (Live / Partial / Preview / No code yet) so you know what you can demo live and what to describe as in build.</>,
            <>Close with challenges solved, the blueprint recap, rollout waves (no dates), <b>How your project runs</b> (presentation ⇄ proposal, approval, SOW, project plan, implementation, UAT, go-live, hypercare), packages, value and <b>Leave your details</b> — what they type stays in the browser session and prints in the PDF.</>,
          ]} />
          <h3 className="font-bold text-[17px] mt-5 mb-2">Presentation craft</h3>
          <List items={[
            <>Press <b>N</b> to read the talk track and likely objections for the current slide, and see its planned time. The client’s team won’t see these in their link.</>,
            <>Stand beside the screen, face the client, and use <b>L</b> (laser or spotlight) to point instead of turning your back.</>,
            <>Let animations finish before you speak over them; each demo plays once when the slide appears.</>,
            <>If the room goes quiet or time is short, press <b>G</b> and jump to the slide that answers their last question.</>,
            <>Never read slides aloud. Use the headline, then ask a question.</>,
          ]} />
        </Section>

        <Section n={4} title="Keyboard & clicker controls">
          <table className="w-full text-[14.5px] border-collapse">
            <tbody>{keys.map(([k, v]) => <tr key={k}><td className="p-2 border font-mono text-[13px] sm:w-[330px]" style={{ borderColor: '#dbe2ee', background: '#f8fafc' }}>{k}</td><td className="p-2 border" style={{ borderColor: '#dbe2ee' }}>{v}</td></tr>)}</tbody>
          </table>
          <p className="text-[14px] mt-2" style={{ color: '#52627f' }}>You can also click the left or right edge of the slide to go back or forward. Standard presentation clickers (Page Up / Page Down, or arrows) work without setup.</p>
        </Section>

        <Section n={5} title="Handling questions">
          <List items={[
            <><b>“Can it do X?”</b> — find the module on the overview (click it), or press G. If it isn’t in the agenda it is still reachable from “Not in this agenda — open anyway”.</>,
            <><b>“How is this different from what we have?”</b> — the “Why switch” comparison. Don’t name competitors; compare spreadsheets, patchwork tools and one connected platform.</>,
            <><b>“Is our data safe?”</b> — IT deep-dive security slide. Describe capabilities only (role-based access, MFA, SSO, encryption, audit logs). Do not claim certifications unless confirmed, and offer a security questionnaire under NDA.</>,
            <><b>“What does it cost?”</b> — the deck deliberately shows packages, not prices. Say a tailored proposal follows the discovery workshop.</>,
            <><b>“How long to go live?”</b> — the implementation slide is typical, not a commitment. Dates depend on scope and data quality.</>,
            <><b>“Can you build…?”</b> — note it, don’t promise a date, and confirm with the product team.</>,
          ]} />
        </Section>

        <Section n={6} title="After the meeting">
          <List items={[
            <><b>PDF leave-behind:</b> press <b>E</b> (or the settings screen’s Export button). When the preview is ready, choose <i>Save as PDF</i> — Landscape, Margins: None, Background graphics: on. It follows the agenda you presented and ends with the QR code.</>,
            <><b>Team link:</b> send the client the QR/link from the thank-you slide. It opens a client view with no presenter tools and a “Prepared for” ribbon.</>,
            <><b>Follow up within 24 hours:</b> thank them, attach the PDF, list the pain points you heard, propose two dates for the discovery workshop.</>,
            <><b>Update the notes:</b> record new requirements and objections so the next presenter benefits.</>,
          ]} />
        </Section>

        <Section n={7} title="Rules of the road">
          <List items={[
            <>The percentages and hours on the before/after and value-estimator slides are <b>illustrative</b>, not guaranteed results. Say so, and replace them with real customer figures when you have them.</>,
            <>Statutory rates and sample salaries are demo values. Do not quote them as current legal rates.</>,
            <>Sample employee names and data are fictional.</>,
            <>All 27 modules are presented as part of the platform. If a client needs something that is still being delivered, be honest about timing.</>,
            <>Keep the hosted site behind its access login. Don’t share the link outside the client’s team.</>,
          ]} />
        </Section>

        <Section n={8} title="Troubleshooting">
          <List items={[
            <><b>Slides look small or cropped:</b> press F for fullscreen. The deck scales to any screen at 16:9.</>,
            <><b>The 3D network on the opener is missing:</b> the machine has limited graphics support. Everything else still works.</>,
            <><b>Slow first load:</b> open the site once before the meeting so the browser caches it, or use the offline copy.</>,
            <><b>No internet at the venue:</b> open <code>dist-offline/index.html</code> from the USB stick; no server needed.</>,
            <><b>Wrong client data showing:</b> press C to return to settings and check the country, industry and name — the last settings are remembered.</>,
            <><b>Client logo not showing in the team link:</b> a logo can’t travel inside a QR code. Add the image to the site’s <code>public/logos/</code> folder, redeploy, and enter its web address on the settings screen.</>,
            <><b>PDF looks blank or cut off:</b> wait for “Preparing…” to finish, then print with Margins: None and Background graphics on.</>,
          ]} />
        </Section>

        <footer className="pt-4 border-t text-[13px]" style={{ borderColor: '#dbe2ee', color: '#52627f' }}>
          Questions or fixes? Contact the PeopleHub product team. This guide lives in the app (settings screen → Presenter guide, or add <code>?guide=1</code> to the address).
        </footer>
      </article>
    </div>
  )
}
