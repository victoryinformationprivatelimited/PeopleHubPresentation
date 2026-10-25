import type { DeckCtx } from '../../engine/context'
import { contextPains } from '../../profiles/pains'

/** The ten business outcomes the client chooses from. Each is a chapter of the Outcome Workshop. */
export interface Moment { key: string; name: string }
export interface Outcome {
  id: string
  name: string
  short: string                      // short label for chips
  icon: string
  color: string
  promise: string                    // one-line promise shown on the wall and chapter card
  kpi: { value: number; suffix: string; label: string }   // illustrative
  pillar: 'core' | 'ops' | 'talent' | 'exp' | 'intel'
  modules: string[]                  // module ids (see slides/modules.ts) this outcome covers
  moments: Moment[]
}

export const OUTCOMES: Outcome[] = [
  { id: 'know', name: 'Know every person', short: 'People', icon: '🧬', color: '#3b6be0', pillar: 'core', modules: ['org', 'employee', 'lifecycle'],
    promise: 'One trusted record for every employee — structure, history and live workforce insight.',
    kpi: { value: 100, suffix: '%', label: 'of people data in one place' },
    moments: [{ key: 'org', name: 'Organization & hierarchy' }, { key: 'emp', name: 'Employee master 360' }, { key: 'live', name: 'Workforce Live dashboard' }, { key: 'life', name: 'Employee life cycle' }, { key: 'bulk', name: 'Bulk upload & custom fields' }] },
  { id: 'hire', name: 'Hire & onboard', short: 'Hiring', icon: '🧲', color: '#22d3ee', pillar: 'core', modules: ['recruitment', 'tasks'],
    promise: 'From vacancy to productive day one — with every letter and checklist handled.',
    kpi: { value: 40, suffix: '%', label: 'faster time-to-hire' },
    moments: [{ key: 'recruit', name: 'Recruitment pipeline' }, { key: 'onboard', name: 'Onboarding & tasks' }, { key: 'letters', name: 'Letters engine' }] },
  { id: 'time', name: 'Time you can trust', short: 'Attendance', icon: '🕒', color: '#0ea5e9', pillar: 'ops', modules: ['attendance'],
    promise: 'Every punch captured, every rule applied, every exception visible — across sites and shifts.',
    kpi: { value: 90, suffix: '%', label: 'less attendance reconciliation' },
    moments: [{ key: 'capture', name: 'Capture: biometric, mobile & geofence' }, { key: 'manual', name: 'Manual attendance & uploads' }, { key: 'roster', name: 'Rosters & shifts' }, { key: 'policy', name: 'Policy & formula engine' }, { key: 'process', name: 'Holidays, process & reports' }] },
  { id: 'leave', name: 'Leave without the chase', short: 'Leave', icon: '🌴', color: '#34d399', pillar: 'ops', modules: ['leave'],
    promise: 'Policies that enforce themselves, approvals that happen on the phone.',
    kpi: { value: 75, suffix: '%', label: 'faster leave approvals' },
    moments: [{ key: 'types', name: 'Leave types, policies & entitlements' }, { key: 'apply', name: 'Apply & approve on the phone' }, { key: 'calendar', name: 'Unused & lieu leave, team calendar' }] },
  { id: 'pay', name: 'Pay people right', short: 'Payroll', icon: '💳', color: '#f59e0b', pillar: 'ops', modules: ['payroll', 'loans', 'benefits'],
    promise: 'Accurate payroll from attendance to bank file — with advances, loans, claims and benefits.',
    kpi: { value: 70, suffix: '%', label: 'shorter payroll cycle' },
    moments: [{ key: 'engine', name: 'Pay engine' }, { key: 'payslips', name: 'Payslips' }, { key: 'advance', name: 'Salary advance & loans' }, { key: 'claims', name: 'Reimbursements & claims' }, { key: 'finance', name: 'Finance: GL, cost centres & banking' }, { key: 'benefits', name: 'Benefits administration' }] },
  { id: 'approve', name: 'Approve faster, stay in control', short: 'Approvals', icon: '✅', color: '#a78bfa', pillar: 'exp', modules: ['notifications'],
    promise: 'Design your own approval flows, escalate automatically and tell the right people on the right channel.',
    kpi: { value: 60, suffix: '%', label: 'less approval chasing' },
    moments: [{ key: 'builder', name: 'Workflow Builder' }, { key: 'higher', name: 'Higher Authorization' }, { key: 'inbox', name: 'Manager approvals inbox' }, { key: 'rules', name: 'Notification rules' }] },
  { id: 'grow', name: 'Grow and keep your people', short: 'Talent', icon: '🌱', color: '#8b5cf6', pillar: 'talent', modules: ['performance', 'training', 'succession', 'engagement', 'termination'],
    promise: 'Goals, learning, succession and engagement — and a clean exit when people move on.',
    kpi: { value: 30, suffix: '%', label: 'lower regretted attrition' },
    moments: [{ key: 'perf', name: 'Performance & 360°' }, { key: 'learn', name: 'Training & development' }, { key: 'succ', name: 'Succession planning' }, { key: 'engage', name: 'Engagement & pulse' }, { key: 'recog', name: 'Recognition & Leisure zone' }, { key: 'exit', name: 'Termination & exit' }] },
  { id: 'serve', name: 'Serve every employee', short: 'Service', icon: '🙋', color: '#10b981', pillar: 'exp', modules: ['ess', 'grievance', 'tickets', 'assets', 'kb', 'chat', 'leisure'],
    promise: 'Self-service on web and phone, answers before the question, and every request tracked.',
    kpi: { value: 50, suffix: '%', label: 'fewer routine HR queries' },
    moments: [{ key: 'ess', name: 'Employee self-service' }, { key: 'mobile', name: 'Android & iPhone apps' }, { key: 'kb', name: 'Knowledge base' }, { key: 'tickets', name: 'Ticketing & service desk' }, { key: 'grievance', name: 'Grievance handling' }, { key: 'assets', name: 'Asset management' }, { key: 'chat', name: 'Chat & AI assistant' }, { key: 'news', name: 'News & announcements' }] },
  { id: 'data', name: 'Decide with data, stay compliant', short: 'Data', icon: '📊', color: '#eab308', pillar: 'intel', modules: ['analytics', 'compliance'],
    promise: 'Live dashboards, build-your-own reports and audit-ready statutory reporting.',
    kpi: { value: 85, suffix: '%', label: 'faster compliance reporting' },
    moments: [{ key: 'dash', name: 'Dashboards & report builder' }, { key: 'compliance', name: 'Compliance & statutory reporting' }, { key: 'audit', name: 'Audit & system logs' }] },
  { id: 'secure', name: 'Secure, scalable, yours', short: 'Security', icon: '🛡️', color: '#ef4444', pillar: 'intel', modules: ['security', 'integration'],
    promise: 'Role-based access, multi-company isolation, billing control and open integrations.',
    kpi: { value: 100, suffix: '%', label: 'of access governed & audited' },
    moments: [{ key: 'sec', name: 'Security & access control' }, { key: 'tenancy', name: 'Multi-tenancy & module gating' }, { key: 'billing', name: 'Billing, subscription & tenant lock' }, { key: 'arch', name: 'Architecture' }, { key: 'integ', name: 'Integrations & APIs' }] },
]

export const outcomeById = Object.fromEntries(OUTCOMES.map(o => [o.id, o])) as Record<string, Outcome>
export const chapterSlideId = (outcomeId: string) => `ch-${outcomeId}`
export const momentSlideId = (outcomeId: string, key: string) => `${outcomeId}-${key}`
export const moduleOutcome = Object.fromEntries(OUTCOMES.flatMap(o => o.modules.map(m => [m, o.id]))) as Record<string, string>

/** The four audiences in the room. */
export interface Role { id: string; name: string; icon: string; line: string; bullets: string[]; outcomes: string[] }
export const ROLES: Role[] = [
  { id: 'owner', name: 'Owner / CEO', icon: '🏛️', line: 'See the whole business, protect continuity, control cost.',
    bullets: ['Live workforce picture on your phone', 'Succession and retention risk visible early', 'One platform, one bill, every company'], outcomes: ['data', 'grow', 'know', 'secure'] },
  { id: 'hr', name: 'HR', icon: '🧑‍💼', line: 'Hand the admin to the system, keep the people work.',
    bullets: ['One record, letters and policies in seconds', 'Hiring, leave, performance and exits in flow', 'Employees self-serve; managers approve'], outcomes: ['know', 'hire', 'leave', 'grow', 'serve'] },
  { id: 'finance', name: 'Finance & Payroll', icon: '💼', line: 'Accurate pay, clean journals, no month-end scramble.',
    bullets: ['Attendance flows straight into payroll', 'Advances, loans and claims recovered automatically', 'GL mapping, cost centres and audit trail'], outcomes: ['pay', 'time', 'data', 'approve'] },
  { id: 'it', name: 'IT Manager', icon: '🖧', line: 'Secure, standard, integrable — and easy to run.',
    bullets: ['Role-based access, MFA, SSO and audit logs', 'Multi-tenant isolation, module gating, open APIs', 'Biometric, accounting and messaging integrations'], outcomes: ['secure', 'approve', 'time', 'serve'] },
]
export const roleById = Object.fromEntries(ROLES.map(r => [r.id, r])) as Record<string, Role>

/** Pain-point ids (profiles/pains.ts) → outcomes. */
const PAIN_OUTCOME_CORE: Record<string, string[]> = {
  attendance: ['time'], payroll: ['pay'], leave: ['leave'], data: ['know'], hiring: ['hire'],
  compliance: ['data', 'secure'], insight: ['data'], attrition: ['grow'], queries: ['serve'], training: ['grow'],
}

/** Slides (moments) that answer each pain point — used for the animated “this will solve your pain” banner. */
const PAIN_MOMENTS_CORE: Record<string, string[]> = {
  attendance: ['time-capture', 'time-manual', 'time-policy', 'time-process'],
  payroll: ['pay-engine', 'pay-payslips', 'pay-advance'],
  leave: ['leave-types', 'leave-apply', 'leave-calendar'],
  data: ['know-org', 'know-emp', 'know-bulk'],
  hiring: ['hire-recruit', 'hire-onboard', 'hire-letters'],
  compliance: ['data-compliance', 'data-audit', 'secure-sec'],
  insight: ['know-live', 'data-dash'],
  attrition: ['grow-perf', 'grow-engage', 'grow-succ'],
  queries: ['serve-ess', 'serve-kb', 'serve-chat', 'serve-tickets'],
  training: ['grow-learn'],
}

export const PAIN_OUTCOME: Record<string, string[]> = { ...PAIN_OUTCOME_CORE, ...Object.fromEntries(contextPains.map(p => [p.id, p.outcomes ?? []])) }
export const PAIN_MOMENTS: Record<string, string[]> = { ...PAIN_MOMENTS_CORE, ...Object.fromEntries(contextPains.map(p => [p.id, p.moments ?? []])) }

/** Outcomes pre-ticked on the discovery wall: the client's pains, else the industry's focus modules. */
export function defaultOutcomes(ctx: Pick<DeckCtx, 'pains' | 'industry'>): string[] {
  const out: string[] = []
  const add = (id?: string) => { if (id && !out.includes(id)) out.push(id) }
  ctx.pains.forEach(p => (PAIN_OUTCOME[p.id] ?? []).forEach(add))
  if (!out.length) ctx.industry.focusModules.forEach(m => add(moduleOutcome[m]))
  return out.slice(0, 5)
}

/** Smallest package that covers the chosen outcomes (packages are cumulative: Starter ⊂ Professional ⊂ Enterprise). */
export function packageFor(outcomes: string[]): 'Starter' | 'Professional' | 'Enterprise' {
  const pillars = new Set(outcomes.map(o => outcomeById[o]?.pillar))
  if (pillars.has('intel')) return 'Enterprise'
  if (pillars.has('talent') || pillars.has('exp')) return 'Professional'
  return 'Starter'
}

/** Platform foundation shared by every outcome (shown on the system map). */
export const FOUNDATION = ['Multi-tenant platform', 'Roles & permissions', 'Workflow engine', 'Notifications', 'Audit & logs', 'Bulk upload', 'Custom fields', 'Module subscription']
