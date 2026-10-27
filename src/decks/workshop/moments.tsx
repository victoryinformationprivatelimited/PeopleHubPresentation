import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useDeck, type DeckCtx, type SlideDef } from '../../engine/context'
import { Badge, fade } from '../../ui/primitives'
import { FitDemo } from '../../ui/FitDemo'
import { AutoPlay } from '../../ui/AutoPlay'
import { PainBanner } from '../../ui/PainBanner'
import { SkipBar } from './extra'
import { OIcon } from '../../ui/OutcomeIcons'
import { AttendanceDemo, BenefitsDemo, EmployeeDemo, LifecycleDemo, OrgDemo, PayrollDemo, RecruitmentDemo, TasksDemo } from '../../slides/demosA'
import { MealDemo } from './demosP4'
import { AdvanceDemo, BulkDemo, ClaimsDemo, FinanceDemo, LeaveCalendarDemo, LeavePhoneDemo, LeaveTypesDemo, LettersDemo, LiveDemo, ManualAttDemo, PayslipPhoneDemo, PolicyDemo, ProcessDemo, RosterDemo } from './demosP3'
import { PAIN_MOMENTS, momentSlideId, outcomeById } from './data'

/** One scenario slide: a short story (who does what), the screen, and what changes. */
export interface MomentDef {
  outcome: string
  key: string
  title: string
  headline: string
  scenario: (c: DeckCtx) => string
  results: string[]
  included: string[]
  demo: () => ReactNode
  wide?: boolean              // give the demo more room (a dense, real screen)
  notes: string               // talk track + private readiness line (shown only in presenter notes)
  secs?: number
}

function MomentSlide({ def }: { def: MomentDef }) {
  const o = outcomeById[def.outcome]
  const ctx = useDeck()
  const id = momentSlideId(def.outcome, def.key)
  const idx = o.moments.findIndex(m => m.key === def.key)
  const hit = ctx.pains.filter(p => PAIN_MOMENTS[p.id]?.includes(id))
  return (
    <div className="absolute inset-0 px-16 pt-14 pb-24 grid grid-cols-12 gap-10 items-center">
      <div className={`${def.wide ? 'col-span-4' : 'col-span-5'} flex flex-col gap-4`}>
        <div>
          <motion.div {...fade(0)} className="text-[18px] tracking-[0.2em] uppercase font-bold mb-2 flex items-center gap-2" style={{ color: o.color }}>
            <OIcon id={o.id} size={38} color={o.color} />{o.name} · {idx + 1}/{o.moments.length}
          </motion.div>
          <motion.h2 {...fade(0.06)} className={`serif ${def.wide ? 'text-[46px]' : 'text-[58px]'} leading-[1.04] font-bold mb-2`}>{def.title}</motion.h2>
          <motion.div {...fade(0.12)} className="text-[28px] font-semibold grad-text leading-snug">{def.headline}</motion.div>
        </div>
        {hit.length > 0 && <PainBanner pains={hit} solver={def.title} />}
        <motion.div {...fade(0.2)} className="card px-5 py-4" style={{ borderLeft: `5px solid ${o.color}` }}>
          <div className="text-[14px] tracking-[0.2em] uppercase font-bold mb-1.5" style={{ color: o.color }}>Scenario</div>
          <div className="text-[23px] leading-snug">{def.scenario(ctx)}</div>
        </motion.div>
        <motion.div {...fade(0.3)}>
          <div className="text-[14px] tracking-[0.2em] uppercase font-bold mb-2" style={{ color: 'var(--ok)' }}>What changes</div>
          <ul className="flex flex-col gap-2">{def.results.map(r => <li key={r} className="flex gap-3 text-[22px] leading-snug"><span style={{ color: 'var(--ok)' }}>✓</span>{r}</li>)}</ul>
        </motion.div>
        {hit.length === 0 && <motion.div {...fade(0.4)} className="flex flex-wrap gap-2">{def.included.map(x => <Badge key={x} tone="mute">{x}</Badge>)}</motion.div>}
      </div>
      <motion.div className={def.wide ? 'col-span-8' : 'col-span-7'} initial={{ opacity: 0, scale: 0.94, x: 40 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ delay: 0.15, duration: 0.6, ease: 'easeOut' }}>
        <FitDemo maxHeight={860}><AutoPlay id={def.key}>{def.demo()}</AutoPlay></FitDemo>
      </motion.div>
      <SkipBar />
    </div>
  )
}

export function momentSlide(def: MomentDef): SlideDef {
  const o = outcomeById[def.outcome]
  return {
    id: momentSlideId(def.outcome, def.key), section: o.name, title: o.moments.find(m => m.key === def.key)?.name ?? def.title,
    secs: def.secs ?? 60, tier: 1, chapter: def.outcome, notes: def.notes, render: () => <MomentSlide def={def} />,
  }
}

const N = (c: DeckCtx) => c.country.sampleNames
const first = (s: string) => s.split(' ')[0]

/* Readiness (private, presenter notes only): Live = real backend + screens · Partial = works with limits · Preview = UI only / no backend yet. */
export const MOMENTS_P3: MomentDef[] = [
  /* ───── 1 · Know every person ───── */
  { outcome: 'know', key: 'org', title: 'Organization & hierarchy', headline: 'Model any group — companies, units, roles.',
    scenario: c => `${c.company} adds a new company to the group. ${first(N(c)[3])} (HR) places it in the tree, names its head, and the org chart redraws itself.`,
    results: ['Entities, units and reporting lines in one tree', 'Roles with responsibilities, qualifications and skills', 'Locations on a map; export to PDF and Excel'],
    included: ['Multi-company', 'Custom fields', 'Hierarchy builder', 'Org chart export'], demo: () => <OrgDemo />,
    notes: 'Show how moving one head moves the whole branch. Ask: how do you keep your org chart today?\nReadiness (private): LIVE — structure, hierarchy, org chart and export are API-backed. Do NOT demo structure/hierarchy bulk upload (not merged).' },
  { outcome: 'know', key: 'emp', title: 'Employee master 360', headline: 'One record. 26 sections. Full history.',
    scenario: c => `Before the annual review, ${first(N(c)[3])} opens ${first(N(c)[1])}’s record: contracts, certificates, skills, visas, disciplinary history — and every change ever made.`,
    results: ['26 profile sections with documents', 'Change history on every field', 'Archive and restore — never lose a record'],
    included: ['Payroll accounts', 'Attendance locations', 'Policy acknowledgements', 'Health & insurance'], demo: () => <EmployeeDemo />, wide: true,
    notes: 'The backbone. Emphasise a single source of truth and the change history.\nReadiness (private): LIVE.' },
  { outcome: 'know', key: 'live', title: 'Workforce Live', headline: 'The state of your workforce, live.',
    scenario: c => `${first(N(c)[0])} (owner) opens the dashboard between meetings: headcount trend, who may leave, which certificates expire this month.`,
    results: ['Headcount trend with a projection', 'Attrition, composition and compliance in one view', 'Click a segment to filter everything'],
    included: ['Needs-attention list', 'Internal mobility', 'Live HR activity', 'Recognition'], demo: () => <LiveDemo />,
    notes: 'Owner/CEO favourite. Click a segment to show the whole view filter. Numbers on screen are sample data scaled to the client headcount.\nReadiness (private): LIVE (dashboard API). The projection is a straight-line estimate of the last 3 months — say "estimate".' },
  { outcome: 'know', key: 'life', title: 'Employee life cycle', headline: 'From first day to farewell — automated.',
    scenario: c => `${first(N(c)[1])} is confirmed, promoted and transferred. Each milestone triggers its letters, approvals and history entry — nobody has to remember.`,
    results: ['Milestones trigger the right steps', 'Promotion and transfer workflows', 'One journey view per employee'],
    included: ['Probation reminders', 'Contract renewals', 'Letters on events', 'History preserved'], demo: () => <LifecycleDemo />,
    notes: 'Ties hire → exit together.\nReadiness (private): PREVIEW — the lifecycle screen is a static roadmap; milestones exist as profile history and workflow triggers. Present as the integrated journey; do not click through it as a live engine.' },
  { outcome: 'know', key: 'bulk', title: 'Bulk upload & custom fields', headline: 'Load a thousand people in minutes. Add the fields you need.',
    scenario: c => `${first(N(c)[3])} uploads ${c.headcount ?? 'a thousand'} employees from Excel, fixes the three flagged rows, then adds a “Safety badge” field for ${c.industry.site.split(' – ')[0]}.`,
    results: ['Excel upload with validation before import', 'Fix flagged rows, import the rest', 'Custom fields without a developer'],
    included: ['Excel templates', 'Validation report', 'Custom field types', 'Payroll bulk assign'], demo: () => <BulkDemo />,
    notes: 'Speed of go-live.\nReadiness (private): PARTIAL — employee bulk upload covers Basic and Employment sections only; custom-fields builder currently stores data in the browser. Say "start with the core sections".' },

  /* ───── 2 · Hire & onboard ───── */
  { outcome: 'hire', key: 'recruit', title: 'Recruitment pipeline', headline: 'From vacancy to offer without the spreadsheet.',
    scenario: c => `${c.company} opens vacancies for ${c.industry.roles[2]}. Candidates move from applied to offer; interviews are scheduled and scored.`,
    results: ['Requisitions, postings and a candidate pipeline', 'Interview scheduling and scorecards', 'Offer accepted → employee record'],
    included: ['Requisitions', 'Postings', 'Pipeline board', 'Offers', 'Communications'], demo: () => <RecruitmentDemo />,
    notes: 'Time-to-hire and candidate experience.\nReadiness (private): PREVIEW — recruitment screens exist but have no backend yet. Walk it as the designed experience; do not promise a live date.' },
  { outcome: 'hire', key: 'onboard', title: 'Onboarding & tasks', headline: 'Day one is ready before day one.',
    scenario: c => `${first(N(c)[3])} accepts the offer. Contract, bank details, laptop and induction become tasks for the right people, each with a deadline.`,
    results: ['A checklist per joiner, assigned to owners', 'Reminders and deadline tracking', 'Everything visible to HR and the manager'],
    included: ['Task boards', 'Priorities', 'Reminders', 'Linked to approvals'], demo: () => <TasksDemo />,
    notes: 'Onboarding as shared tasks.\nReadiness (private): PREVIEW — task management has no backend yet.' },
  { outcome: 'hire', key: 'letters', title: 'Letters engine', headline: 'Every letter on your letterhead, in seconds.',
    scenario: c => `${first(N(c)[3])} (HR) generates ${first(N(c)[1])}’s confirmation letter from a template, with the AI drafting the closing paragraph.`,
    results: ['Templates with tokens filled per employee', 'AI-drafted wording, snippet library, reference numbers', 'Generate, store and re-download as PDF'],
    included: ['Offer', 'Confirmation', 'Experience', 'Warning', 'Contract templates'], demo: () => <LettersDemo />,
    notes: 'A genuine differentiator — most HRIS tools do not do this well. Click "Draft with AI".\nReadiness (private): LIVE. AI drafting works but calls the AI provider from the browser — fine for demo/pilot; do not promise it passes a strict security review yet.' },

  /* ───── 3 · Time you can trust ───── */
  { outcome: 'time', key: 'capture', title: 'Capture: biometric, mobile & geofence', headline: 'Every punch captured, from any door.',
    scenario: c => `${first(N(c)[1])} arrives at ${c.industry.site}. The biometric terminal or the phone records the punch; outside the geofence it asks for approval.`,
    results: ['ZKTeco biometric devices synced automatically', 'Phone check-in with GPS and camera', 'Outside the zone? Sent for approval, not silently accepted'],
    included: ['ZKBio WDMS sync', 'Geofence radius', 'Per-employee locations', 'Camera proof'], demo: () => <AttendanceDemo />,
    notes: 'Geofencing resonates with multi-site and field teams.\nReadiness (private): LIVE — device sync, geofence locations and phone check-in are real.' },
  { outcome: 'time', key: 'manual', title: 'Manual attendance & uploads', headline: 'When a device fails, nothing is lost — or unapproved.',
    scenario: c => `The terminal at Gate 2 was offline. ${first(N(c)[3])} uploads the device file and a spreadsheet; every row waits for approval before it becomes a punch.`,
    results: ['Entry, Excel and device-file upload', 'Approve or reject whole batches', 'Full audit trail and upload log'],
    included: ['Batch approval', 'Upload log', 'Audit trail', 'Pending → approved'], demo: () => <ManualAttDemo />,
    notes: 'Control and auditability. Click Approve.\nReadiness (private): LIVE.' },
  { outcome: 'time', key: 'roster', title: 'Rosters & shifts', headline: 'Plan shifts in minutes, spot clashes before they happen.',
    scenario: c => `${first(N(c)[2])} (manager) plans next week’s roster by clicking shifts. A clash with approved leave is flagged before saving.`,
    results: ['Shift patterns and weekly rosters', 'Leave and holiday clashes flagged', 'Every change kept in a history'],
    included: ['Flexible hours', 'Swap requests', 'Roster history', 'Employee self-planning'], demo: () => <RosterDemo />,
    notes: 'Click cells to change shifts.\nReadiness (private): LIVE for rosters and history. Flexible-shift rules (punch window / required window length) exist only on a branch not yet merged — mention "flexible hours" only if it will be merged before the demo.' },
  { outcome: 'time', key: 'policy', title: 'Policy & formula engine', headline: 'Your attendance rules, configured — not coded.',
    scenario: c => `${c.company} decides: ten minutes’ grace, a half-day deduction after sixty, overtime paid in 15-minute steps. HR configures it as formulas, with no developer.`,
    results: ['Late, early, half-day, absence and overtime components', 'Brackets, rounding and formulas', 'The same rules applied to everyone, every day'],
    included: ['Formula builder', 'Weight brackets', 'Rounding', 'Per-group policies'], demo: () => <PolicyDemo />,
    notes: 'Drag the slider to show the rule applying live.\nReadiness (private): LIVE — policy configuration and formula builder are real.' },
  { outcome: 'time', key: 'process', title: 'Holidays, process & reports', headline: 'Month-end attendance without the spreadsheet.',
    scenario: c => `At month end, attendance is processed per shift with rosters, leave and ${c.country.holidaysLabel.toLowerCase()} applied. Exceptions are reviewed, then flow to payroll.`,
    results: ['Per-shift processing with leave and holidays applied', 'Exceptions listed for review', 'Reports comparing real and counted punches'],
    included: ['Holiday calendars', 'Per-employee holidays', 'Attendance reports', 'Migration'], demo: () => <ProcessDemo />,
    notes: 'Click Process attendance.\nReadiness (private): LIVE for processing and reports. Overtime is calculated, but there is no overtime-request workflow or OT-to-payroll pipeline yet — do not claim one.' },

  { outcome: 'time', key: 'meal', title: 'Meal management', headline: 'Right meals, right numbers, zero waste.',
    scenario: c => `At ${c.industry.site}, ${first(N(c)[1])} punches in and a meal token is generated for the shift. The canteen sees tomorrow’s headcount from attendance and leave.`,
    results: ['Meal tokens generated from attendance', 'Meal planning by day and shift', 'Canteen numbers that match who is actually in'],
    included: ['Token generation', 'Meal planning', 'Shift-linked', 'Headcount forecast'], demo: () => <MealDemo />,
    notes: 'Strong for factories, hotels and hospitals with canteens.\nReadiness (private): NO CODE — added from the sales sketch; the screen is a designed preview only. Do not promise a date; say it is on the build list.' },

  /* ───── 4 · Leave without the chase ───── */
  { outcome: 'leave', key: 'types', title: 'Leave types, policies & entitlements', headline: 'Policies that enforce themselves.',
    scenario: c => `${first(N(c)[3])} sets ${c.country.leaveTypes.map(l => l[0].toLowerCase()).join(', ')} leave with entitlements by category, notice rules and carry-forward limits.`,
    results: ['Any leave type, any entitlement rule', 'Notice, certificate and carry-forward rules', 'One policy, applied consistently'],
    included: ['Entitlements', 'Lieu-leave generation', 'Unused-leave expiry', 'Cancel approved leave'], demo: () => <LeaveTypesDemo />,
    notes: 'Policy configuration is the sell here.\nReadiness (private): LIVE. No scheduled accrual job yet — entitlements are assigned and formula-driven; say "granted" not "accrued monthly".' },
  { outcome: 'leave', key: 'apply', title: 'Apply & approve on the phone', headline: 'Three taps to request. One tap to approve.',
    scenario: c => `${first(N(c)[1])} applies for three days from the phone and names a covering colleague. ${first(N(c)[2])} approves in one tap.`,
    results: ['Balances, notice rules and cover checked on the spot', 'Approver notified instantly', 'Calendar and payroll update by themselves'],
    included: ['Covering person', 'Attachments', 'Half-day handling', 'Approval workflow'], demo: () => <LeavePhoneDemo />,
    notes: 'Click Submit request.\nReadiness (private): LIVE on the web portal and the Android app (a wrapper of the web portal; single-tenant today).' },
  { outcome: 'leave', key: 'calendar', title: 'Unused & lieu leave, team calendar', headline: 'See who is away. Never lose a day.',
    scenario: c => `${first(N(c)[2])} checks the team calendar before approving. Unused leave nearing expiry is flagged, and a holiday worked becomes a lieu day.`,
    results: ['Team calendar with clashes visible', 'Expiring leave flagged to employees', 'Lieu days generated automatically'],
    included: ['Team calendar', 'Lieu policies', 'Carry-forward', 'Leave reports'], demo: () => <LeaveCalendarDemo />,
    notes: 'Good for managers.\nReadiness (private): LIVE.' },

  /* ───── 5 · Pay people right ───── */
  { outcome: 'pay', key: 'engine', title: 'Pay engine', headline: 'Your pay rules, calculated every time.',
    scenario: c => `Payroll closes. Attendance, overtime and allowances flow into the run; your rules — formulas and slab tables — calculate every line for ${c.company}.`,
    results: ['Pay components as formulas, slab tables for tax brackets', 'Attendance and overtime feed the run', 'History kept for every period'],
    included: ['Pay periods', 'Slab tables', 'Bulk assign', 'Cost centres', 'Run history'], demo: () => <PayrollDemo />,
    notes: 'Sell flexibility: "your rules, not ours".\nReadiness (private): PARTIAL — the engine is real. Statutory rules (EPF/ETF/APIT, gratuity, etc.) are NOT built in: they are configured as components and slab tables. Say "configurable statutory formulas", never "built-in statutory compliance". The payslip numbers on screen are sample data.' },
  { outcome: 'pay', key: 'payslips', title: 'Payslips', headline: 'Every line explained, on the phone.',
    scenario: c => `${first(N(c)[1])} opens the October payslip on the phone and checks every line before asking HR anything.`,
    results: ['Choose a period, see every line', 'Fewer “why is my pay short?” questions', 'Available any time, anywhere'],
    included: ['View online', 'Period selector', 'Employee portal', 'Payslip designer'], demo: () => <PayslipPhoneDemo />,
    notes: 'Employee-facing proof.\nReadiness (private): PARTIAL — payslip view is real; the download is a plain-text file today (no PDF). Do not promise PDF or emailed payslips yet.' },
  { outcome: 'pay', key: 'advance', title: 'Salary advance & loans', headline: 'Advances approved and recovered — automatically.',
    scenario: c => `${first(N(c)[1])} requests a salary advance. ${first(N(c)[2])} and HR approve, and the recovery is scheduled into the next payrolls.`,
    results: ['Request, approve and schedule recovery in one flow', 'Limits and settings you control', 'Loans with guarantors and balances'],
    included: ['Advance settings', 'Recovery schedule', 'Loan categories', 'Guarantors'], demo: () => <AdvanceDemo />,
    notes: 'Popular in manufacturing and retail.\nReadiness (private): PARTIAL — salary advance requests and settings are real in the backend. Loans: screens exist but there is no loan backend yet (data is held in the browser). Lead with salary advance; present loans as the next step.' },
  { outcome: 'pay', key: 'claims', title: 'Reimbursements & claims', headline: 'Submit, approve, paid with payroll.',
    scenario: c => `${first(N(c)[1])} submits a travel claim with the receipt. It is approved and paid with the next payroll.`,
    results: ['Claims with receipts and policy limits', 'Multi-level approval', 'Paid in the next pay run'],
    included: ['Receipt upload', 'Limits', 'Approval trail', 'Payroll link'], demo: () => <ClaimsDemo />,
    notes: 'Employee convenience.\nReadiness (private): PREVIEW — the claim screens exist in the employee portal but the backend currently returns sample data. Present as the designed flow; do not promise a date.' },
  { outcome: 'pay', key: 'finance', title: 'Finance: GL, cost centres & banking', headline: 'From payroll to the ledger and the bank.',
    scenario: c => `After the run, payroll posts to the ledger by cost centre and the bank file goes to the bank — no re-keying at ${c.company}.`,
    results: ['GL accounts and mapping rules', 'Cost centres and divisions', 'Bank files and disbursement'],
    included: ['GL journal', 'Cost divisions', 'Bank file formats', 'Payroll approvals'], demo: () => <FinanceDemo />,
    notes: 'Finance & Payroll lens.\nReadiness (private): PARTIAL — GL accounts, mapping rules and cost centres have backend support; the banking, journal and bank-file screens currently keep data in the browser. Present GL/cost centres confidently; present banking as in build.' },
  { outcome: 'pay', key: 'benefits', title: 'Benefits administration', headline: 'Benefits employees actually understand.',
    scenario: c => `${first(N(c)[1])} enrols in the medical plan from the portal. HR sees eligibility, enrolment and contributions at a glance.`,
    results: ['Plans with eligibility rules', 'Self-service enrolment', 'Contributions tracked'],
    included: ['Medical', 'Bonus', 'Retirement', 'Allowances'], demo: () => <BenefitsDemo />,
    notes: 'Retention angle.\nReadiness (private): PREVIEW — no benefits backend yet (insurance data exists in the employee profile).' },
]

export const momentSlides = (): SlideDef[] => MOMENTS_P3.map(momentSlide)
