import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { SlideDef } from '../../engine/context'
import { useNav } from '../../engine/context'
import { fade } from '../../ui/primitives'
import { MIcon } from '../../ui/ModuleIcons'
import { LANDSCAPE, type Mod } from '../../slides/landscape'
import { SELL } from '../../slides/pillars'
import { MOMENTS_P3 } from './moments'
import { MOMENTS_P4 } from './moments4'

const mix = (c: string, p: number) => `color-mix(in srgb, ${c} ${p}%, transparent)`
const included: Record<string, string[]> = Object.fromEntries([...MOMENTS_P3, ...MOMENTS_P4].map(m => [`${m.outcome}-${m.key}`, m.included]))

/** The system screens (Workshop slide ids) that belong to each module, in the order they are shown. */
const SCREENS: Record<string, string[]> = {
  'Organization': ['know-org'], 'Employee master 360': ['know-emp', 'know-live', 'know-bulk'], 'Life cycle': ['know-life'], 'Termination & exit': ['grow-exit'],
  'Time & attendance': ['time-capture', 'time-manual', 'time-roster', 'time-policy', 'time-process'], 'Meal management': ['time-meal'], 'Leave management': ['leave-types', 'leave-apply', 'leave-calendar'],
  'Staff loans & advances': ['pay-advance'], 'Benefits & claims': ['pay-claims', 'pay-benefits'], 'Payroll': ['pay-engine', 'pay-payslips'], 'Salary banking': ['pay-finance'],
  'Self-service portal': ['serve-ess'], 'Mobile app': ['serve-mobile'], 'Approvals': ['approve-builder', 'approve-higher', 'approve-inbox'], 'Notifications': ['approve-rules'],
  'Security & audit': ['secure-sec', 'data-audit'], 'Recruitment & onboarding': ['hire-recruit'], 'Letter generator': ['hire-letters'], 'Tasks & checklists': ['hire-onboard'],
  'Performance': ['grow-perf'], 'Learning & development': ['grow-learn'], 'Succession planning': ['grow-succ'], 'Engagement': ['grow-engage', 'grow-recog'],
  'Grievance reporting': ['serve-grievance'], 'Analytics & reports': ['data-dash'], 'Compliance & statutory': ['data-compliance'], 'Service desk': ['serve-tickets'],
  'Asset tracker': ['serve-assets'], 'Knowledge base': ['serve-kb'], 'Chat & AI assistant': ['serve-chat'], 'News broadcasting': ['serve-news'], 'Integrations & ERP': ['secure-integ'],
}

/** Related modules shown as links on the nine main modules (and as “works with” links back on the others). */
const RELATED: Record<string, string[]> = {
  'Employee master 360': ['Life cycle', 'Letter generator', 'Termination & exit', 'Self-service portal'],
  'Organization': ['Approvals', 'Security & audit'],
  'Time & attendance': ['Mobile app', 'Meal management'],
  'Leave management': ['Approvals', 'Notifications'],
  'Payroll': ['Staff loans & advances', 'Benefits & claims', 'Salary banking', 'Compliance & statutory'],
  'Performance': ['Engagement', 'Tasks & checklists'],
  'Learning & development': ['Knowledge base', 'Tasks & checklists'],
  'Succession planning': ['Analytics & reports', 'Life cycle'],
  'Recruitment & onboarding': ['Letter generator', 'Tasks & checklists'],
}
const WORKS_WITH: Record<string, string[]> = {}
Object.entries(RELATED).forEach(([main, rel]) => rel.forEach(r => { (WORKS_WITH[r] ??= []).includes(main) || WORKS_WITH[r].push(main) }))

const SHOW: Record<string, string> = { 'Organization': 'Structure & hierarchy', 'Employee master 360': 'Employee master 360' }
const byName = (n: string) => LANDSCAPE.find(m => m.name === n) as Mod

function points(name: string, n: number) {
  const m = byName(name)
  const more = (SCREENS[name] ?? []).flatMap(id => included[id] ?? [])
  const seen = new Set<string>(), out: string[] = []
  for (const p of [...m.feats, ...more]) {
    const k = p.toLowerCase()
    if ([...seen].some(x => x === k || x.includes(k) || k.includes(x))) continue
    seen.add(k); out.push(p)
  }
  return out.slice(0, n)
}

interface Page { id: string; tab: string; name: string; eyebrow: string; tagline: string; color: string; mods: string[]; big: boolean; notes: string }
const PAGES: Page[] = [
  {
    id: 'ws-cat-ops', tab: 'Operational HR', name: 'Operational HR', eyebrow: 'Landscape · 1 of 5', tagline: 'The five modules HR and payroll run on every single day.', color: '#0ea5e9', big: true,
    mods: ['Employee master 360', 'Organization', 'Time & attendance', 'Leave management', 'Payroll'],
    notes: 'Landscape page 1 of 5 — the daily engine. Five modules: the employee record, the structure, time and attendance, leave and payroll. Read the feature points, then use the related-module links under each card (for example Payroll links to loans, benefits, salary banking and compliance) so the client sees how the pieces connect. Tap any card or link to open its screen; Back returns here.',
  },
  {
    id: 'ws-cat-strat', tab: 'Strategic HR', name: 'Strategic HR', eyebrow: 'Landscape · 2 of 5', tagline: 'Hire the right people, grow them and know who steps up next.', color: '#a78bfa', big: true,
    mods: ['Recruitment & onboarding', 'Performance', 'Learning & development', 'Succession planning'],
    notes: 'Landscape page 2 of 5 — the value conversation for owners and leadership: recruitment, performance, training and succession. Ask: if your best performer resigned tomorrow, who is ready to step up? Related links show letters, tasks, engagement and analytics that support each. Tap a card to open the screen; Back returns here.',
  },
  {
    id: 'ws-cat-comp-1', tab: 'Complementary 1', name: 'Complementary · people & pay support', eyebrow: 'Landscape · 3 of 5', tagline: 'Everything that surrounds the employee record and the payroll run.', color: '#34d399', big: false,
    mods: ['Life cycle', 'Termination & exit', 'Mobile app', 'Meal management', 'Staff loans & advances', 'Benefits & claims', 'Salary banking', 'Self-service portal'],
    notes: 'Landscape page 3 of 5 — complementary modules, part 1: the life cycle and exit, the mobile app and meals, loans, benefits, salary banking and self-service. Each card says which main module it works with; tap the “works with” link to jump to it.',
  },
  {
    id: 'ws-cat-comp-2', tab: 'Complementary 2', name: 'Complementary · control & communication', eyebrow: 'Landscape · 4 of 5', tagline: 'Approvals, messages, documents and knowledge — tied to every process.', color: '#10b981', big: false,
    mods: ['Approvals', 'Notifications', 'Security & audit', 'Letter generator', 'Tasks & checklists', 'News broadcasting', 'Chat & AI assistant', 'Knowledge base'],
    notes: 'Landscape page 4 of 5 — complementary modules, part 2: approvals, notifications, security, letters, tasks, news, chat and the knowledge base. Approvals and notifications are the usual favourites for HR; security matters to the IT Manager.',
  },
  {
    id: 'ws-cat-comp-3', tab: 'Complementary 3', name: 'Complementary · engage, serve & insight', eyebrow: 'Landscape · 5 of 5', tagline: 'Listen, support, measure and connect to the systems you already run.', color: '#14b8a6', big: false,
    mods: ['Engagement', 'Grievance reporting', 'Service desk', 'Asset tracker', 'Analytics & reports', 'Compliance & statutory', 'Integrations & ERP'],
    notes: 'Landscape page 5 of 5 — complementary modules, part 3: engagement, grievance, service desk, assets, analytics, compliance and integrations. Finish with “Start the walkthrough” to move into the system screens.',
  },
]
const TABS = PAGES.map(p => ({ id: p.id, label: p.tab, color: p.color }))

function CategoryPage({ page, nextId, startId }: { page: Page; nextId?: string; startId: string }) {
  const { jump, goTo, has } = useNav()
  const L = page
  const open = (name: string) => { const id = (SCREENS[name] ?? []).find(has); if (id) jump(id) }
  const canOpen = (name: string) => (SCREENS[name] ?? []).some(has)
  const cols = L.big ? L.mods.length : 4
  const nPoints = L.big ? 8 : 4
  const [focus, setFocus] = useState(0)
  const [touched, setTouched] = useState(false)
  useEffect(() => {
    if (touched) return
    const t = setTimeout(() => setFocus(f => (f + 1) % L.mods.length), 3600)
    return () => clearTimeout(t)
  }, [focus, touched, L.mods.length])
  const fs = L.big ? { name: 'text-[27px]', sell: 'text-[20px]', pt: 'text-[22px]', rel: 'text-[16px]' } : { name: 'text-[22px]', sell: 'text-[16px]', pt: 'text-[18px]', rel: 'text-[14px]' }

  return (
    <div className="absolute inset-0" onMouseMove={() => !touched && setTouched(true)}>
      <div className="absolute left-14 right-14 top-[54px] flex items-start justify-between gap-8">
        <div>
          <motion.div {...fade(0)} className="flex items-center gap-2 mb-2 flex-wrap">
            {TABS.map(t => (
              <button key={t.id} onClick={() => t.id !== page.id && has(t.id) && goTo(t.id)} className="rounded-full px-4 py-1.5 text-[15px] font-bold transition"
                style={t.id === page.id ? { background: t.color, color: '#fff' } : { background: 'var(--card)', border: '1px solid var(--line)', color: 'var(--mute)' }}>{t.label}</button>
            ))}
          </motion.div>
          <motion.div {...fade(0.04)} className="text-[17px] tracking-[0.24em] uppercase font-bold" style={{ color: L.color }}>{L.eyebrow} · {L.mods.length} modules</motion.div>
          <motion.h2 {...fade(0.08)} className="serif text-[54px] leading-[1.05] font-bold">{L.name}</motion.h2>
          <motion.div {...fade(0.14)} className="text-[25px] font-semibold mt-1" style={{ color: L.color }}>{L.tagline}</motion.div>
        </div>
        <div className="flex items-center gap-3 flex-none pt-10">
          <motion.button {...fade(0.3)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => goTo(nextId ?? startId)} className="glow rounded-xl px-6 py-2.5 text-[19px] font-bold text-white" style={{ background: 'linear-gradient(90deg,var(--brand),var(--accent))' }}>
            {nextId ? 'Next ▶' : 'Start the walkthrough ➜'}
          </motion.button>
        </div>
      </div>

      <div className="absolute left-14 right-14 top-[248px] grid gap-3.5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridAutoRows: L.big ? '712px' : '350px' }}>
        {L.mods.map((name, k) => {
          const on = focus === k, ok = canOpen(name)
          const rel = (RELATED[name] ?? []), ww = (WORKS_WITH[name] ?? [])
          return (
            <motion.div key={name} initial={{ opacity: 0, y: 28, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: on ? 1.02 : 1 }} transition={{ delay: 0.06 * k + 0.15, type: 'spring', stiffness: 240, damping: 22 }}
              onMouseEnter={() => { setTouched(true); setFocus(k) }} onClick={() => ok && open(name)}
              className="relative rounded-2xl flex flex-col overflow-hidden min-h-0 text-left" style={{ cursor: ok ? 'pointer' : 'default', background: 'var(--card)', border: `${on ? 2 : 1}px solid ${on ? L.color : 'var(--line)'}`, boxShadow: on ? `0 18px 48px -14px ${L.color}` : 'none', zIndex: on ? 5 : 1 }}>
              <div className="px-4 py-3 flex items-center gap-3" style={{ background: `linear-gradient(135deg, ${mix(L.color, 40)}, ${mix(L.color, 10)})` }}>
                <MIcon name={name} size={L.big ? 56 : 44} color={L.color} />
                <span className={`${fs.name} font-bold leading-tight`}>{SHOW[name] ?? name}</span>
              </div>
              <div className="px-4 py-3 flex flex-col gap-2.5 flex-1 min-h-0">
                <div className={`${fs.sell} italic leading-snug`} style={{ color: 'var(--mute)' }}>{SELL[name]}</div>
                <ul className={`flex flex-col gap-1.5 ${fs.pt} leading-snug`}>
                  {points(name, nPoints).map(p => <li key={p} className="flex gap-2"><span style={{ color: L.color }}>•</span><span>{p}</span></li>)}
                </ul>
                <div className="flex-1" />
                {(rel.length > 0 || ww.length > 0) && (
                  <div>
                    <div className="text-[12.5px] tracking-[0.18em] uppercase font-bold mb-1.5" style={{ color: 'var(--mute)' }}>{rel.length ? 'Related modules' : 'Works with'}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {(rel.length ? rel : ww).map(r => {
                        const live = canOpen(r)
                        return <button key={r} disabled={!live} onClick={e => { e.stopPropagation(); open(r) }} className={`${fs.rel} rounded-lg px-2.5 py-1 font-semibold transition hover:brightness-125`}
                          style={{ background: mix(L.color, 18), border: `1px solid ${mix(L.color, 55)}`, opacity: live ? 1 : 0.55 }}>↗ {SHOW[r] ?? r}</button>
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
        {!L.big && L.mods.length % 4 !== 0 && (
          <motion.div {...fade(0.9)} className="rounded-2xl px-5 py-4 flex flex-col justify-center gap-2" style={{ border: '1px dashed var(--line)' }}>
            <div className="text-[14px] tracking-[0.18em] uppercase font-bold" style={{ color: 'var(--mute)' }}>Tap a card to open it</div>
            <div className="text-[18px]" style={{ color: 'var(--mute)' }}>Tap a ↗ link to jump to a related module. Back returns here.</div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export function categorySlides(startId: string): SlideDef[] {
  return PAGES.map((p, i) => ({
    id: p.id, section: 'Landscape', title: `Landscape: ${p.name}`, secs: p.big ? 90 : 75, tier: 2, notes: p.notes,
    render: () => <CategoryPage page={p} nextId={PAGES[i + 1]?.id} startId={startId} />,
  }))
}
