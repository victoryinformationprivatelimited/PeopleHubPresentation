import type { IndustryProfile } from './types'

export interface Pain {
  id: string; icon: string; label: string; modules: string[]
  /** Set only on country-/industry-specific pains. */
  countries?: string[]; industries?: string[]
  /** Outcomes (wall) and slides that answer a context pain; core pains are mapped in decks/workshop/data.ts. */
  outcomes?: string[]; moments?: string[]
}

/** Common HR pain points a client can pick in the launcher; each maps to the modules that solve it. */
export const painOptions: Pain[] = [
  { id: 'attendance', icon: '🕒', label: 'Manual attendance & overtime sheets', modules: ['attendance'] },
  { id: 'payroll', icon: '💳', label: 'Payroll errors & disputes', modules: ['payroll', 'loans'] },
  { id: 'leave', icon: '🌴', label: 'Leave approvals lost in email or paper', modules: ['leave', 'ess'] },
  { id: 'data', icon: '🗂️', label: 'Employee data scattered across files', modules: ['employee', 'org'] },
  { id: 'hiring', icon: '🧲', label: 'Slow hiring & onboarding', modules: ['recruitment', 'tasks'] },
  { id: 'compliance', icon: '⚖️', label: 'Statutory & audit compliance risk', modules: ['compliance', 'security'] },
  { id: 'insight', icon: '📊', label: 'No real-time HR reporting', modules: ['analytics'] },
  { id: 'attrition', icon: '🚪', label: 'Low engagement & high attrition', modules: ['engagement', 'performance', 'succession'] },
  { id: 'queries', icon: '🙋', label: 'Employees keep asking HR the same questions', modules: ['kb', 'chat', 'tickets'] },
  { id: 'training', icon: '🎓', label: 'Training & certifications not tracked', modules: ['training'] },
]

/** Country- and industry-specific pains. Rows are intentionally phrased as everyday frustrations, not legal claims. */
export const contextPains: Pain[] = [
  // — country —
  { id: 'lk-epf', icon: '🏛️', label: 'EPF, ETF & APIT returns prepared by hand every month', modules: ['compliance', 'payroll'], countries: ['lk'], outcomes: ['data', 'pay'], moments: ['data-compliance', 'pay-engine'] },
  { id: 'lk-poya', icon: '🌕', label: 'Poya & statutory holiday pay worked out manually', modules: ['attendance', 'payroll'], countries: ['lk'], outcomes: ['time', 'pay'], moments: ['time-process', 'pay-engine'] },
  { id: 'lk-registers', icon: '📒', label: 'Shop & Office / leave registers kept on paper', modules: ['compliance', 'leave'], countries: ['lk'], outcomes: ['data', 'leave'], moments: ['data-compliance', 'leave-types'] },
  { id: 'in-pf', icon: '🏛️', label: 'PF, ESI & TDS filings every month under deadline pressure', modules: ['compliance', 'payroll'], countries: ['in'], outcomes: ['data', 'pay'], moments: ['data-compliance', 'pay-engine'] },
  { id: 'in-state', icon: '🗺️', label: 'State-wise holidays, Professional Tax & labour rules', modules: ['compliance', 'attendance'], countries: ['in'], outcomes: ['data', 'time'], moments: ['time-process', 'data-compliance'] },
  { id: 'in-multi', icon: '🏭', label: 'Many units & locations, each with its own Excel', modules: ['org', 'employee'], countries: ['in'], outcomes: ['know'], moments: ['know-org', 'know-bulk'] },
  { id: 'ae-wps', icon: '🏦', label: 'WPS salary files rejected by the bank', modules: ['payroll'], countries: ['ae'], outcomes: ['pay'], moments: ['pay-finance', 'pay-engine'] },
  { id: 'ae-visa', icon: '🛂', label: 'Visa, Emirates ID & labour-card expiries missed', modules: ['employee', 'compliance'], countries: ['ae'], outcomes: ['know', 'data'], moments: ['know-emp', 'know-live'] },
  { id: 'ae-eosb', icon: '🧮', label: 'End-of-service gratuity calculated by hand', modules: ['termination', 'payroll'], countries: ['ae'], outcomes: ['pay', 'grow'], moments: ['grow-exit', 'pay-engine'] },
  { id: 'fj-fnpf', icon: '🏛️', label: 'FNPF contributions & monthly returns done manually', modules: ['compliance', 'payroll'], countries: ['fj'], outcomes: ['data', 'pay'], moments: ['data-compliance', 'pay-engine'] },
  { id: 'fj-islands', icon: '🏝️', label: 'Staff spread across islands & remote sites', modules: ['attendance', 'ess'], countries: ['fj'], outcomes: ['time', 'serve'], moments: ['time-capture', 'serve-mobile'] },
  { id: 'fj-paye', icon: '🧾', label: 'PAYE & statutory reports compiled from spreadsheets', modules: ['compliance', 'payroll'], countries: ['fj'], outcomes: ['data', 'pay'], moments: ['data-compliance', 'pay-payslips'] },
  // — industry —
  { id: 'ap-line', icon: '🧵', label: 'Line-wise overtime & shift swaps tracked on paper', modules: ['attendance'], industries: ['apparel'], outcomes: ['time'], moments: ['time-roster', 'time-manual'] },
  { id: 'ap-absent', icon: '🚶', label: 'High operator turnover & absenteeism', modules: ['engagement', 'attendance'], industries: ['apparel'], outcomes: ['grow', 'time'], moments: ['grow-engage', 'time-policy'] },
  { id: 'rt-rosters', icon: '🏬', label: 'Outlet rosters & promoter attendance across stores', modules: ['attendance'], industries: ['retail'], outcomes: ['time'], moments: ['time-roster', 'time-capture'] },
  { id: 'rt-season', icon: '🎁', label: 'Seasonal hiring & part-timers’ pay', modules: ['recruitment', 'payroll'], industries: ['retail'], outcomes: ['hire', 'pay'], moments: ['hire-onboard', 'pay-engine'] },
  { id: 'bp-night', icon: '🌙', label: 'Night-shift, transport & meal allowances by hand', modules: ['attendance', 'payroll'], industries: ['bpo'], outcomes: ['time', 'pay'], moments: ['time-policy', 'pay-engine'] },
  { id: 'bp-talent', icon: '🧠', label: 'Losing skilled people faster than you can hire', modules: ['succession', 'recruitment'], industries: ['bpo'], outcomes: ['grow', 'hire'], moments: ['grow-succ', 'hire-recruit'] },
  { id: 'hc-roster', icon: '🩺', label: 'Doctor & nurse roster gaps and on-call pay', modules: ['attendance', 'payroll'], industries: ['healthcare'], outcomes: ['time', 'pay'], moments: ['time-roster', 'pay-engine'] },
  { id: 'hc-licence', icon: '📜', label: 'Licences & CPD certificates expiring unnoticed', modules: ['training', 'employee'], industries: ['healthcare'], outcomes: ['grow', 'know'], moments: ['grow-learn', 'know-live'] },
  { id: 'ed-hours', icon: '🧑‍🏫', label: 'Visiting-lecturer hours & workload payments', modules: ['attendance', 'payroll'], industries: ['education'], outcomes: ['time', 'pay'], moments: ['time-manual', 'pay-engine'] },
  { id: 'ed-contracts', icon: '📑', label: 'Academic-year contract renewals missed', modules: ['employee', 'lifecycle'], industries: ['education'], outcomes: ['know', 'hire'], moments: ['know-life', 'hire-letters'] },
  { id: 'fn-audit', icon: '🔍', label: 'Audit trail & segregation of duties are hard to prove', modules: ['security', 'compliance'], industries: ['finance'], outcomes: ['secure', 'data'], moments: ['data-audit', 'secure-sec'] },
  { id: 'fn-approvals', icon: '🪜', label: 'Multi-level branch approvals stuck with one person', modules: ['leave', 'tasks'], industries: ['finance'], outcomes: ['approve'], moments: ['approve-builder', 'approve-higher'] },
  { id: 'cn-site', icon: '🏗️', label: 'Site attendance & labour hours across projects', modules: ['attendance', 'org'], industries: ['construction'], outcomes: ['time'], moments: ['time-capture', 'time-manual'] },
  { id: 'cn-safety', icon: '🦺', label: 'Safety certificates & subcontract staff untracked', modules: ['training', 'employee'], industries: ['construction'], outcomes: ['grow', 'know'], moments: ['grow-learn', 'know-emp'] },
  { id: 'lg-driver', icon: '🚚', label: 'Driver hours, trips & allowances reconciled by hand', modules: ['attendance', 'payroll'], industries: ['logistics'], outcomes: ['time', 'pay'], moments: ['time-policy', 'pay-engine'] },
  { id: 'lg-depot', icon: '📍', label: 'No proof of presence across depots & routes', modules: ['attendance'], industries: ['logistics'], outcomes: ['time'], moments: ['time-capture', 'time-process'] },
  { id: 'hp-season', icon: '🏨', label: 'Seasonal rosters & split shifts are a daily puzzle', modules: ['attendance'], industries: ['hospitality'], outcomes: ['time'], moments: ['time-roster', 'time-policy'] },
  { id: 'hp-service', icon: '💎', label: 'Service-charge sharing & casual-staff pay disputes', modules: ['payroll'], industries: ['hospitality'], outcomes: ['pay'], moments: ['pay-engine', 'pay-payslips'] },
  { id: 'pl-muster', icon: '🌿', label: 'Estate muster & daily-rate pay recorded on paper', modules: ['attendance', 'payroll'], industries: ['plantation'], outcomes: ['time', 'pay'], moments: ['time-manual', 'pay-engine'] },
  { id: 'pl-remote', icon: '⛰️', label: 'Field staff in remote estates are hard to reach', modules: ['ess', 'chat'], industries: ['plantation'], outcomes: ['serve'], moments: ['serve-mobile', 'serve-news'] },
]

/** Core pains followed by every country/industry pain, so any id in a link or saved session still resolves. */
export const allPains: Pain[] = [...painOptions, ...contextPains]

/** The pains offered for a country + industry: its specific ones first (tagged), then the core list. */
export function painsFor(countryId: string, industryId: string): { pain: Pain; tag?: 'country' | 'industry' }[] {
  const ctx = contextPains.filter(p => p.countries?.includes(countryId) || p.industries?.includes(industryId))
  return [...ctx.map(pain => ({ pain, tag: pain.countries ? 'country' as const : 'industry' as const })), ...painOptions.map(pain => ({ pain }))]
}

export function resolvePains(ids: string[] = [], custom = ''): Pain[] {
  const picked = allPains.filter(p => ids.includes(p.id))
  const c = custom.trim()
  return c ? [...picked, { id: 'custom', icon: '💬', label: c, modules: [] }] : picked
}

/** When the client has not chosen any, suggest pains that match the industry's focus modules. */
export function defaultPains(industry: IndustryProfile): Pain[] {
  return painOptions.filter(p => p.modules.some(m => industry.focusModules.includes(m))).slice(0, 3)
}
