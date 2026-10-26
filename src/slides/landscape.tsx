import { useState } from 'react'
import { motion } from 'framer-motion'
import { useDeck, useNav, useSession } from '../engine/context'
import { PAIN_MOMENTS } from '../decks/workshop/data'
import { fade } from '../ui/primitives'

const mix = (c: string, p: number) => `color-mix(in srgb, ${c} ${p}%, transparent)`

type Group = 'core' | 'ops' | 'talent' | 'exp' | 'intel'
const GROUPS: Record<Group, { name: string; color: string }> = {
  core: { name: 'Core HR', color: '#3b6be0' },
  ops: { name: 'Workforce operations', color: '#0ea5e9' },
  talent: { name: 'Talent', color: '#a78bfa' },
  exp: { name: 'Employee experience', color: '#34d399' },
  intel: { name: 'Intelligence & control', color: '#f59e0b' },
}

/** One card = one module and its headline features. `w` = the Workshop slide it opens, `t` = the Platform Tour slide. */
interface Mod { name: string; group: Group; feats: string[]; w: string; t: string }
export const LANDSCAPE: Mod[] = [
  // Core HR
  { name: 'Organization', group: 'core', feats: ['Hierarchy & org chart', 'Units & reporting lines', 'Bulk upload'], w: 'know-org', t: 'org' },
  { name: 'Employee master 360', group: 'core', feats: ['26 profile sections', 'Document management', 'Full change history'], w: 'know-emp', t: 'employee' },
  { name: 'Life cycle', group: 'core', feats: ['Probation & confirmation', 'Promotions & transfers', 'One journey view'], w: 'know-life', t: 'lifecycle' },
  { name: 'Recruitment & onboarding', group: 'core', feats: ['Automated recruitment', 'Candidate experience', 'Automated onboarding journey'], w: 'hire-recruit', t: 'recruitment' },
  { name: 'Letter generator', group: 'core', feats: ['Templates & merge fields', 'Auto-generate on events', 'Digital copies'], w: 'hire-letters', t: 'recruitment' },
  { name: 'Tasks & checklists', group: 'core', feats: ['Assign with deadlines', 'Priorities', 'Onboarding checklists'], w: 'hire-onboard', t: 'tasks' },
  { name: 'Termination & exit', group: 'core', feats: ['Exit checklist', 'Final settlement', 'Asset return'], w: 'grow-exit', t: 'termination' },
  // Workforce operations
  { name: 'Time & attendance', group: 'ops', feats: ['Real-time data capture', 'Multiple shift rosters', 'Late & leave policy'], w: 'time-capture', t: 'attendance' },
  { name: 'Mobile app', group: 'ops', feats: ['Mobile clock in/out', 'Geo tracking', 'Leave & OT approval'], w: 'serve-mobile', t: 'ess' },
  { name: 'Leave management', group: 'ops', feats: ['Online application', 'Online approval', 'Entitlements & balance'], w: 'leave-types', t: 'leave' },
  { name: 'Meal management', group: 'ops', feats: ['Meal token generation', 'Meal planning', 'Linked to attendance'], w: 'time-meal', t: 'attendance' },
  { name: 'Payroll', group: 'ops', feats: ['Weekly / monthly runs', 'Payslips', 'Statutory deductions'], w: 'pay-engine', t: 'payroll' },
  { name: 'Staff loans & advances', group: 'ops', feats: ['Staff loan management', 'Salary advance', 'Auto recovery'], w: 'pay-advance', t: 'loans' },
  { name: 'Benefits & claims', group: 'ops', feats: ['Benefit enrolment', 'Reimbursements', 'Claim approvals'], w: 'pay-benefits', t: 'benefits' },
  { name: 'Salary banking', group: 'ops', feats: ['Bank file automation', 'GL & cost centres', 'Finance export'], w: 'pay-finance', t: 'payroll' },
  // Talent
  { name: 'Performance', group: 'talent', feats: ['Goal & objective setting', 'Feedback & 360° reviews', 'Competency & appraisals'], w: 'grow-perf', t: 'performance' },
  { name: 'Learning & development', group: 'talent', feats: ['Orientation', 'Training needs', 'Training gap analysis'], w: 'grow-learn', t: 'training' },
  { name: 'Succession planning', group: 'talent', feats: ['Critical role identification', 'Talent development', 'Progress tracking'], w: 'grow-succ', t: 'succession' },
  { name: 'Engagement', group: 'talent', feats: ['Pulse surveys', 'Recognition & awards', 'Leisure zone'], w: 'grow-engage', t: 'engagement' },
  // Employee experience
  { name: 'Self-service portal', group: 'exp', feats: ['Personal data & dashboard', 'Payslip & attendance patterns', 'Balances at a glance'], w: 'serve-ess', t: 'ess' },
  { name: 'Grievance reporting', group: 'exp', feats: ['Open or anonymous', 'Escalation workflow', 'Case tracking'], w: 'serve-grievance', t: 'grievance' },
  { name: 'Service desk', group: 'exp', feats: ['HR / IT / facility tickets', 'SLA timers', 'Every request tracked'], w: 'serve-tickets', t: 'tickets' },
  { name: 'Asset tracker', group: 'exp', feats: ['Allocation & return', 'Maintenance', 'Exit clearance'], w: 'serve-assets', t: 'assets' },
  { name: 'Knowledge base', group: 'exp', feats: ['Searchable policies', 'Acknowledgements', 'Versioned documents'], w: 'serve-kb', t: 'kb' },
  { name: 'Chat & AI assistant', group: 'exp', feats: ['Answers before the question', 'HR chat', 'Policy-aware'], w: 'serve-chat', t: 'chat' },
  { name: 'News broadcasting', group: 'exp', feats: ['Company announcements', 'Targeted audiences', 'Read tracking'], w: 'serve-news', t: 'notifications' },
  { name: 'Approvals & notifications', group: 'exp', feats: ['Workflow builder', 'Higher authorization', 'Email · SMS · WhatsApp · in-app'], w: 'approve-builder', t: 'notifications' },
  // Intelligence & control
  { name: 'Analytics & reports', group: 'intel', feats: ['Live dashboards', 'Build-your-own reports', 'Pin & share'], w: 'data-dash', t: 'analytics' },
  { name: 'Compliance & statutory', group: 'intel', feats: ['Government portal reporting', 'Statutory returns', 'Audit-ready'], w: 'data-compliance', t: 'compliance' },
  { name: 'Security & audit', group: 'intel', feats: ['Roles & permissions', 'MFA & sign-in', 'System audit logs'], w: 'secure-sec', t: 'security' },
  { name: 'Integrations & ERP', group: 'intel', feats: ['ERP integration', 'Biometric devices', 'Open APIs'], w: 'secure-integ', t: 'integration' },
]

export function LandscapeSlide({ mode, doneTo }: { mode: 'workshop' | 'tour'; doneTo?: string }) {
  const { pains } = useDeck()
  const { jump, goTo, has } = useNav()
  const { outcomes } = useSession()
  const [hover, setHover] = useState<number | null>(null)
  const painSlides = new Set(pains.flatMap(p => PAIN_MOMENTS[p.id] ?? []))
  return (
    <div className="absolute inset-0">
      <div className="absolute left-14 right-14 top-[64px] flex items-end justify-between gap-8">
        <div>
          <motion.div {...fade(0)} className="text-[19px] tracking-[0.24em] uppercase font-bold mb-1" style={{ color: 'var(--brand2)' }}>PeopleHub landscape</motion.div>
          <motion.h2 {...fade(0.06)} className="serif text-[52px] leading-none font-bold">Every module. Every feature. One screen.</motion.h2>
        </div>
        <div className="flex items-center gap-3 flex-none pb-1">
          {doneTo && <motion.button {...fade(0.3)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => goTo(doneTo)} className="glow rounded-xl px-5 py-2.5 text-[19px] font-bold text-white" style={{ background: 'linear-gradient(90deg,var(--brand),var(--accent))' }}>✔ Done — next step ➜</motion.button>}
        </div>
      </div>

      <div className="absolute left-14 right-14 top-[166px] grid grid-cols-8 gap-3" style={{ gridAutoRows: "1fr", height: 812 }}>
        {LANDSCAPE.map((m, k) => {
          const target = mode === 'workshop' ? m.w : m.t
          const ok = has(target), g = GROUPS[m.group]
          const mine = mode === 'workshop' && outcomes.includes(m.w.split('-')[0])
          const hot = painSlides.has(m.w)
          const on = hover === k
          return (
            <motion.button key={m.name} initial={{ opacity: 0, y: 22, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: on ? 1.06 : 1 }} transition={{ delay: 0.03 * k, type: 'spring', stiffness: 260, damping: 22 }}
              onMouseEnter={() => setHover(k)} onMouseLeave={() => setHover(null)} onClick={() => ok && jump(target)} disabled={!ok}
              className="relative rounded-xl overflow-hidden text-left flex flex-col min-h-0" style={{ background: 'var(--card)', border: `${hot || mine ? 2 : 1}px solid ${hot ? 'var(--ok)' : mine ? g.color : 'var(--line)'}`, boxShadow: on ? `0 18px 50px -12px ${g.color}` : hot ? '0 0 26px -10px var(--ok)' : 'none', zIndex: on ? 5 : 0, opacity: ok ? 1 : 0.45 }}>
              <div className="px-3 py-2 text-[18.5px] font-bold leading-tight text-white flex items-start gap-1.5" style={{ background: `linear-gradient(135deg, ${g.color}, ${mix(g.color, 70)})` }}>
                <span className="flex-1">{m.name}</span>{hot && <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }}>⚡</motion.span>}
              </div>
              <ul className="px-3 py-2 flex flex-col gap-1 text-[16.5px] leading-snug">
                {m.feats.map(f => <li key={f} className="flex gap-1.5"><span style={{ color: g.color }}>•</span><span>{f}</span></li>)}
              </ul>
              {on && ok && <div className="absolute right-2 bottom-1.5 text-[13px] font-bold" style={{ color: g.color }}>Open ▶</div>}
            </motion.button>
          )
        })}
        {LANDSCAPE.length % 8 !== 0 && (
          <motion.div {...fade(0.9)} className="rounded-xl px-4 py-3 flex flex-col justify-center gap-1.5 text-[16px]" style={{ border: '1px dashed var(--line)' }}>
            <div className="text-[13px] tracking-widest uppercase font-bold mb-0.5" style={{ color: 'var(--mute)' }}>Tap a card to open it</div>
            {(Object.keys(GROUPS) as Group[]).map(g => <span key={g} className="flex items-center gap-2"><i className="w-3 h-3 rounded-full flex-none" style={{ background: GROUPS[g].color }} />{GROUPS[g].name}</span>)}
          </motion.div>
        )}
      </div>
    </div>
  )
}
