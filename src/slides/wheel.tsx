import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNav } from '../engine/context'
import { fade } from '../ui/primitives'
import { LANDSCAPE, GROUPS, type Mod } from './landscape'

const mix = (c: string, p: number) => `color-mix(in srgb, ${c} ${p}%, transparent)`
const C = 500

/** Three layers, innermost first: the core, then what runs and grows the business, then experience and insight. */
const LAYERS = [
  { name: 'Layer 1 · Core HR', groups: ['core'], r0: 134, r1: 236, font: 17 },
  { name: 'Layer 2 · Operate & grow', groups: ['ops', 'talent'], r0: 242, r1: 354, font: 17 },
  { name: 'Layer 3 · Experience & insight', groups: ['exp', 'intel'], r0: 360, r1: 482, font: 19 },
] as const

/** One recognisable icon per module — the wheel shows pictures; names appear on hover and in the panel. */
const ICON: Record<string, string> = {
  'Organization': '🏢', 'Employee master 360': '🪪', 'Life cycle': '🔄', 'Recruitment & onboarding': '🧲', 'Letter generator': '📝', 'Tasks & checklists': '📋', 'Termination & exit': '🚪',
  'Time & attendance': '🕒', 'Mobile app': '📱', 'Leave management': '🌴', 'Meal management': '🍽️', 'Payroll': '💰', 'Staff loans & advances': '🏦', 'Benefits & claims': '🎁', 'Salary banking': '🏧',
  'Performance': '🎯', 'Learning & development': '🎓', 'Succession planning': '🌱', 'Engagement': '💬',
  'Self-service portal': '🙋', 'Grievance reporting': '📣', 'Service desk': '🎧', 'Asset tracker': '💻', 'Knowledge base': '📚', 'Chat & AI assistant': '🤖', 'News broadcasting': '📰', 'Approvals': '✅', 'Notifications': '🔔',
  'Analytics & reports': '📊', 'Compliance & statutory': '🛡️', 'Security & audit': '🔐', 'Integrations & ERP': '🔌',
}

/** Short wheel labels (the full names live on the cards and slides). */
const SHORT: Record<string, string> = {
  'Organization': 'Org chart', 'Employee master 360': 'Employees', 'Life cycle': 'Life cycle', 'Recruitment & onboarding': 'Hiring', 'Letter generator': 'Letters', 'Tasks & checklists': 'Tasks', 'Termination & exit': 'Exit',
  'Time & attendance': 'Attendance', 'Mobile app': 'Mobile app', 'Leave management': 'Leave', 'Meal management': 'Meals', 'Payroll': 'Payroll', 'Staff loans & advances': 'Loans', 'Benefits & claims': 'Benefits', 'Salary banking': 'Banking',
  'Performance': 'Performance', 'Learning & development': 'Learning', 'Succession planning': 'Succession', 'Engagement': 'Engagement',
  'Self-service portal': 'Self-service', 'Grievance reporting': 'Grievance', 'Service desk': 'Service desk', 'Asset tracker': 'Assets', 'Knowledge base': 'Knowledge', 'Chat & AI assistant': 'Chat & AI', 'News broadcasting': 'News', 'Approvals': 'Approvals', 'Notifications': 'Notifications',
  'Analytics & reports': 'Analytics', 'Compliance & statutory': 'Compliance', 'Security & audit': 'Security', 'Integrations & ERP': 'Integrations',
}

const pt = (r: number, deg: number) => { const a = ((deg - 90) * Math.PI) / 180; return [C + r * Math.cos(a), C + r * Math.sin(a)] as const }
const seg = (r0: number, r1: number, a0: number, a1: number) => {
  const [x0, y0] = pt(r1, a0), [x1, y1] = pt(r1, a1), [x2, y2] = pt(r0, a1), [x3, y3] = pt(r0, a0)
  return `M${x0} ${y0} A${r1} ${r1} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${r0} ${r0} 0 0 0 ${x3} ${y3} Z`
}

interface Cell { m: Mod; i: number; layer: number; a0: number; a1: number }
const cells: Cell[] = LAYERS.flatMap((L, layer) => {
  const mods = LANDSCAPE.filter(m => (L.groups as readonly string[]).includes(m.group))
  const step = 360 / mods.length, gap = layer === 0 ? 2.6 : layer === 1 ? 1.9 : 1.5
  return mods.map((m, k) => ({ m, i: 0, layer, a0: k * step + gap / 2, a1: (k + 1) * step - gap / 2 }))
}).map((c, i) => ({ ...c, i }))

/** Every module as a three-layer wheel: tap a segment to see its features, then open the module (Back returns here). */
export function WheelSlide({ mode, doneTo }: { mode: 'workshop' | 'tour'; doneTo?: string }) {
  const { jump, goTo, has } = useNav()
  const [sel, setSel] = useState(0)
  const [hov, setHov] = useState<number | null>(null)
  const [touched, setTouched] = useState(false)
  const [tick, setTick] = useState(0)
  const STEP = 4200

  // tour the wheel until someone taps it
  useEffect(() => {
    if (touched) return
    const t = setTimeout(() => { setSel(s => (s + 1) % cells.length); setTick(k => k + 1) }, STEP)
    return () => clearTimeout(t)
  }, [sel, touched, tick])

  const pick = (i: number) => { setTouched(true); setSel(i) }
  const cur = cells[sel], m = cur.m, g = GROUPS[m.group], L = LAYERS[cur.layer]
  const target = mode === 'workshop' ? m.w : m.t, ok = has(target)
  const siblings = cells.filter(c => c.layer === cur.layer)

  return (
    <div className="absolute inset-0">
      <div className="absolute left-14 top-[64px]">
        <motion.div {...fade(0)} className="text-[19px] tracking-[0.24em] uppercase font-bold mb-1" style={{ color: 'var(--brand2)' }}>The PeopleHub wheel · {cells.length} modules</motion.div>
        <motion.h2 {...fade(0.06)} className="serif text-[48px] leading-none font-bold">Tap a module. See what it does.</motion.h2>
      </div>
      {doneTo && <motion.button {...fade(0.3)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => goTo(doneTo)} className="glow absolute right-14 top-[76px] rounded-xl px-6 py-3 text-[21px] font-bold text-white" style={{ background: 'linear-gradient(90deg,var(--brand),var(--accent))' }}>✔ Done — next step ➜</motion.button>}

      <motion.svg viewBox="0 0 1000 1000" className="absolute left-8 top-[150px]" style={{ width: 830, height: 830, overflow: 'visible' }} initial={{ opacity: 0, scale: 0.8, rotate: -25 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.9, ease: 'easeOut' }}>
        {cells.map(c => {
          const L0 = LAYERS[c.layer], on = c.i === sel, mid = (c.a0 + c.a1) / 2, col = GROUPS[c.m.group].color
          const [dx, dy] = [Math.cos(((mid - 90) * Math.PI) / 180) * 16, Math.sin(((mid - 90) * Math.PI) / 180) * 16]
          const [tx, ty] = pt((L0.r0 + L0.r1) / 2, mid), big = c.i === hov || on
          return (
            <motion.g key={c.m.name} animate={{ x: on || c.i === hov ? dx : 0, y: on || c.i === hov ? dy : 0 }} transition={{ type: 'spring', stiffness: 240, damping: 18 }}
              onClick={() => pick(c.i)} onMouseEnter={() => setHov(c.i)} onMouseLeave={() => setHov(h => (h === c.i ? null : h))} style={{ cursor: 'pointer' }}>
              <motion.path d={seg(L0.r0, L0.r1, c.a0, c.a1)} fill={col} initial={{ opacity: 0 }} animate={{ opacity: on || c.i === hov ? 1 : 0.7 }} transition={{ delay: 0.012 * c.i, duration: 0.5 }}
                stroke={on ? '#fff' : 'none'} strokeWidth="3" style={{ filter: on || c.i === hov ? `drop-shadow(0 0 22px ${col})` : 'none' }} />
              <g transform={`translate(${tx} ${ty})`} style={{ pointerEvents: 'none' }}>
                <motion.g animate={{ scale: big ? 1.55 : 1 }} transition={{ type: 'spring', stiffness: 260, damping: 16 }}>
                  <circle r={L0.font + 9} fill="rgba(255,255,255,.2)" />
                  <text textAnchor="middle" dominantBaseline="central" fontSize={L0.font + 9} y="2">{ICON[c.m.name] ?? '•'}</text>
                </motion.g>
              </g>
            </motion.g>
          )
        })}
        {hov !== null && (() => {
          const c = cells[hov], L0 = LAYERS[c.layer], mid = (c.a0 + c.a1) / 2, [px, py] = pt((L0.r0 + L0.r1) / 2, mid)
          const name = c.m.name, w = Math.max(150, name.length * 15.5 + 44), x = Math.min(930 - w / 2, Math.max(70 + w / 2, px)), y = Math.max(34, py - 78)
          return (
            <g transform={`translate(${x} ${y})`} style={{ pointerEvents: 'none' }}>
              <rect x={-w / 2} y="-26" width={w} height="52" rx="26" fill="var(--bg2)" stroke={GROUPS[c.m.group].color} strokeWidth="3" />
              <text textAnchor="middle" dominantBaseline="central" fontSize="25" fontWeight="800" fill="var(--ink)">{name}</text>
            </g>
          )
        })()}
        {/* hub — everything stacked on the exact centre */}
        <circle cx={C} cy={C} r="126" fill="var(--bg2)" stroke="var(--line)" strokeWidth="2" />
        <motion.circle cx={C} cy={C} r="126" fill="none" stroke={g.color} strokeWidth="5" strokeDasharray="90 702" key={sel} initial={{ strokeDashoffset: 0 }} animate={{ strokeDashoffset: -792 }} transition={{ duration: touched ? 1 : STEP / 1000, ease: 'linear' }} style={{ transformOrigin: `${C}px ${C}px`, transform: 'rotate(-90deg)' }} />
        <circle cx={C} cy={C - 28} r="66" fill="#fff" />
        <image href="./logo-black.png" x={C - 62} y={C - 90} width="124" height="124" />
        <text x={C} y={C + 62} textAnchor="middle" fontSize="34" fontWeight="800" fill="var(--ink)" fontFamily="Fraunces, serif">HRIS</text>
        <text x={C} y={C + 92} textAnchor="middle" fontSize="17" fill="var(--mute)">3 layers · {cells.length} modules</text>
      </motion.svg>

      {/* the selected module */}
      <div className="absolute right-14 top-[150px] bottom-[84px]" style={{ left: 900 }}>
        <AnimatePresence mode="wait">
          <motion.div key={m.name} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} className="h-full rounded-3xl p-8 flex flex-col relative overflow-hidden" style={{ background: mix(g.color, 11), border: `2px solid ${mix(g.color, 55)}` }}>
            <motion.div className="absolute -right-24 -top-24 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${mix(g.color, 36)}, transparent 68%)` }} animate={{ scale: [1, 1.18, 1] }} transition={{ duration: 5, repeat: Infinity }} />
            <div className="relative text-[19px] tracking-[0.2em] uppercase font-bold" style={{ color: g.color }}>{L.name}{L.groups.length > 1 ? ` · ${g.name}` : ''}</div>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="relative serif text-[62px] leading-[1.03] font-bold mt-2 flex items-center gap-5"><span className="text-[64px] leading-none">{ICON[m.name]}</span>{m.name}</motion.div>
            <ul className="relative mt-6 flex flex-col gap-3.5">
              {m.feats.map((f, k) => (
                <motion.li key={f} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 + 0.1 * k }} className="flex items-center gap-4 text-[32px] font-semibold leading-snug">
                  <span className="w-11 h-11 rounded-xl grid place-items-center text-[24px] flex-none text-white" style={{ background: g.color }}>✓</span>{f}
                </motion.li>
              ))}
            </ul>
            <motion.button initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} whileHover={{ scale: ok ? 1.03 : 1 }} whileTap={{ scale: 0.97 }} onClick={() => ok && jump(target)} disabled={!ok}
              className="relative mt-7 self-start rounded-2xl px-8 py-4 text-[28px] font-bold text-white" style={{ background: `linear-gradient(90deg, ${g.color}, ${mix(g.color, 70)})`, boxShadow: `0 10px 40px -10px ${g.color}`, opacity: ok ? 1 : 0.45 }}>
              Open {m.name} ▶
            </motion.button>
            <div className="relative mt-8 flex flex-col gap-2.5">
              {LAYERS.map((l, k) => {
                const first = cells.findIndex(c => c.layer === k), on = k === cur.layer
                return (
                  <button key={l.name} onClick={() => pick(first)} className="rounded-xl px-5 py-3 flex items-center gap-4 text-left transition" style={{ background: on ? mix(g.color, 20) : 'var(--card)', border: `${on ? 2 : 1}px solid ${on ? g.color : 'var(--line)'}` }}>
                    <span className="flex gap-1 flex-none">{l.groups.map(gr => <i key={gr} className="w-4 h-4 rounded-full" style={{ background: GROUPS[gr].color }} />)}</span>
                    <span className="text-[22px] font-bold flex-1">{l.name}</span>
                    <span className="text-[17px]" style={{ color: 'var(--mute)' }}>{cells.filter(c => c.layer === k).length} modules</span>
                  </button>
                )
              })}
            </div>
            <div className="relative mt-auto pt-5">
              <div className="text-[15px] tracking-widest uppercase font-bold mb-2" style={{ color: 'var(--mute)' }}>Also in this layer — tap to switch</div>
              <div className="flex flex-wrap gap-2">
                {siblings.map(c => (
                  <button key={c.m.name} onClick={() => pick(c.i)} className="rounded-full px-3.5 py-1.5 text-[16px] font-semibold" style={{ background: c.i === sel ? GROUPS[c.m.group].color : 'var(--card)', color: c.i === sel ? '#fff' : 'var(--ink)', border: `1px solid ${c.i === sel ? 'transparent' : 'var(--line)'}` }}>{SHORT[c.m.name] ?? c.m.name}</button>
                ))}
              </div>
              <div className="text-[16px] mt-3" style={{ color: 'var(--mute)' }}>Then use <b>Back</b> to return to the wheel{touched ? '' : ' · touring automatically — tap any segment to take over'}</div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
