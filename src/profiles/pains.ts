import type { IndustryProfile } from './types'

export interface Pain { id: string; icon: string; label: string; modules: string[] }

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

export function resolvePains(ids: string[] = [], custom = ''): Pain[] {
  const picked = painOptions.filter(p => ids.includes(p.id))
  const c = custom.trim()
  return c ? [...picked, { id: 'custom', icon: '💬', label: c, modules: [] }] : picked
}

/** When the client has not chosen any, suggest pains that match the industry's focus modules. */
export function defaultPains(industry: IndustryProfile): Pain[] {
  return painOptions.filter(p => p.modules.some(m => industry.focusModules.includes(m))).slice(0, 3)
}
