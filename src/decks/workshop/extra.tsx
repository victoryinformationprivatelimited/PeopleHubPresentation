import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { poss, useDeck, useNav, useSession } from '../../engine/context'
import { painsFor } from '../../profiles/pains'
import { Badge, Counter, fade } from '../../ui/primitives'
import { Section } from '../../slides/layouts'
import { OIcon, OIconBody, OIconDefs } from '../../ui/OutcomeIcons'
import { OUTCOMES, PAIN_MOMENTS, chapterSlideId, momentSlideId, outcomeById } from './data'

const mix = (c: string, p: number) => `color-mix(in srgb, ${c} ${p}%, transparent)`
const momentName = (slideId: string) => { const [o, k] = slideId.split('-'); return outcomeById[o]?.moments.find(m => m.key === k)?.name ?? slideId }

/* ───────── Opener: the platform assembles itself ───────── */
export function HeroBuild() {
  const { client, logo, country, industry, presenter } = useDeck()
  const C = 380, R = 285
  const nodes = OUTCOMES.map((o, k) => {
    const a = (Math.PI * 2 * k) / OUTCOMES.length - Math.PI / 2
    return { o, x: C + Math.cos(a) * R, y: C + Math.sin(a) * R, vx: Math.cos(a) * 520, vy: Math.sin(a) * 520 }
  })
  return (
    <div className="absolute inset-0">
      <div className="absolute left-20 top-[92px] w-[1000px]">
        <motion.div {...fade(0)} className="flex items-center gap-6 mb-10">
          <img src="./logo-black.png" alt="PeopleHub" className="h-24 w-24 rounded-full bg-white p-1" />
          {logo && <><span className="text-[40px]" style={{ color: 'var(--mute)' }}>×</span><img src={logo} alt={client} className="h-24 max-w-[300px] object-contain rounded-2xl bg-white px-4 py-2" /></>}
        </motion.div>
        <motion.div {...fade(0.1)} className="text-[20px] tracking-[0.3em] uppercase font-bold mb-5" style={{ color: 'var(--accent)' }}>PeopleHub HRIS{client ? ` · Prepared for ${client}` : ''}</motion.div>
        <motion.h1 {...fade(0.2)} className="serif text-[104px] leading-[1.02] font-bold">Run every people process</motion.h1>
        <motion.h1 {...fade(0.35)} className="serif text-[104px] leading-[1.02] font-bold shimmer-text">on one platform.</motion.h1>
        <motion.p {...fade(0.55)} className="text-[32px] mt-8 max-w-[900px] leading-snug" style={{ color: 'var(--mute)' }}>
          From hire to retire — attendance, payroll, approvals, talent and more — in one system built for {industry.name.toLowerCase()} in {country.name}.
        </motion.p>
        <motion.div {...fade(0.75)} className="flex gap-5 mt-10">
          {[[27, 'modules'], [10, 'outcomes']].map(([v, l]) => <div key={l as string} className="card px-6 py-4"><div className="serif text-[56px] leading-none font-bold grad-text"><Counter to={v as number} /></div><div className="text-[20px] mt-1" style={{ color: 'var(--mute)' }}>{l}</div></div>)}
          <div className="card px-6 py-4"><div className="serif text-[34px] leading-tight font-bold grad-text">Web · Android · iPhone</div><div className="text-[20px] mt-2" style={{ color: 'var(--mute)' }}>one source of truth</div></div>
        </motion.div>
      </div>

      <svg viewBox="0 0 760 810" className="absolute right-10 top-[96px] w-[780px]">
        <OIconDefs /><defs><radialGradient id="hubg" cx="50%" cy="40%"><stop offset="0" stopColor="var(--brand2)" /><stop offset="1" stopColor="var(--brand)" /></radialGradient></defs>
        <circle cx={C} cy={C} r={R + 48} fill="none" stroke="var(--line)" strokeWidth="2" strokeDasharray="4 12" />
        <circle cx={C} cy={C} r={R - 70} fill="none" stroke="var(--line)" strokeWidth="1.5" strokeDasharray="2 10" />
        {nodes.map((n, k) => <motion.line key={n.o.id} x1={C} y1={C} x2={n.x} y2={n.y} stroke={n.o.color} strokeWidth="2.5" strokeOpacity="0.55" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.9 + k * 0.12, duration: 0.7 }} />)}
        <motion.circle cx={C} cy={C} r="120" fill="none" stroke="var(--accent)" strokeWidth="2" initial={{ opacity: 0.6, scale: 1 }} animate={{ opacity: 0, scale: 1.7 }} transition={{ repeat: Infinity, duration: 3.2, ease: 'easeOut' }} style={{ transformOrigin: `${C}px ${C}px` }} />
        <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring', stiffness: 120 }} style={{ transformOrigin: `${C}px ${C}px` }}>
          <circle cx={C} cy={C} r="118" fill="url(#hubg)" />
          <circle cx={C} cy={C} r="100" fill="#fff" />
          <image href="./logo-black.png" x={C - 92} y={C - 92} width="184" height="184" />
        </motion.g>
        {nodes.map((n, k) => (
          <g key={n.o.id} transform={`translate(${n.x} ${n.y})`}>
            <motion.g initial={{ x: n.vx, y: n.vy, opacity: 0, scale: 0.3 }} animate={{ x: 0, y: 0, opacity: 1, scale: 1 }} transition={{ delay: 0.6 + k * 0.12, type: 'spring', stiffness: 70, damping: 14 }}>
              <motion.g animate={{ y: [0, -9, 0] }} transition={{ repeat: Infinity, duration: 3 + (k % 4) * 0.6, delay: 2 + k * 0.2, ease: 'easeInOut' }}>
                <circle r="68" fill={mix(n.o.color, 14)} stroke={n.o.color} strokeOpacity=".35" strokeWidth="2" />
                <g transform="scale(2.5) translate(-24 -24)"><OIconBody id={n.o.id} color={n.o.color} /></g>
                <text y="100" textAnchor="middle" fontSize="19" fontWeight="700" fill="var(--ink)">{n.o.short}</text>
              </motion.g>
            </motion.g>
          </g>
        ))}
      </svg>
      <div className="absolute left-20 bottom-24 text-[18px]" style={{ color: 'var(--mute)' }}>Presented by <b>{presenter.company}</b>{presenter.name ? ` · ${presenter.name}` : ''} · {poss(client || 'your')} blueprint starts here →</div>
    </div>
  )
}

/* ───────── What's holding you back? (pain picker) ───────── */
export function PainsPickSlide() {
  const { pains, togglePain, customPain, setCustomPain } = useSession()
  const { country, industry } = useDeck()
  const options = painsFor(country.id, industry.id)
  const n = pains.length + (customPain.trim() ? 1 : 0)
  return (
    <Section eyebrow="What’s holding you back?" title="Tap the pains you want gone." sub={`Pick as many as you like — shown first: what ${industry.name.split(' & ')[0]} teams in ${country.name} tell us. For each one we’ll show exactly how PeopleHub removes it.`} zoom={options.length > 15 ? 0.98 : 1.1}>
      <div className="grid grid-cols-5 gap-4 mt-3">
        {options.map(({ pain: p, tag }, k) => {
          const on = pains.includes(p.id)
          const by = momentName(PAIN_MOMENTS[p.id]?.[0] ?? '')
          return (
            <motion.button key={p.id} {...fade(0.05 * k)} onClick={() => togglePain(p.id)} whileTap={{ scale: 0.96 }} className="card p-4 text-left relative transition-colors" style={{ minHeight: 168, borderColor: on ? 'var(--ok)' : undefined, background: on ? mix('var(--ok)', 12) : undefined, boxShadow: on ? '0 0 36px -10px var(--ok)' : undefined }}>
              <div className="flex items-start justify-between"><div className="text-[38px] leading-none">{p.icon}</div>
                {tag && <span className="text-[12px] font-bold tracking-wider uppercase rounded-full px-2.5 py-0.5" style={{ color: 'var(--accent)', background: mix('var(--accent)', 16) }}>{tag === 'country' ? country.name : industry.name.split(' & ')[0]}</span>}</div>
              <div className="text-[19px] font-semibold leading-snug mt-2.5" style={{ textDecoration: on ? 'line-through' : 'none', textDecorationColor: 'var(--bad)', opacity: on ? 0.7 : 1 }}>{p.label}</div>
              <AnimatePresence>{on && (
                <motion.div key="s" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1.5 text-[15px] font-bold leading-snug" style={{ color: 'var(--ok)' }}>✓ Solved by {by}</motion.div>
              )}</AnimatePresence>
            </motion.button>
          )
        })}
      </div>
      <div className="mt-5 flex items-center gap-4">
        <input value={customPain} onChange={e => setCustomPain(e.target.value)} placeholder="Something else? Say it in your own words…" className="flex-1 rounded-2xl px-5 py-4 text-[22px] outline-none" style={{ background: 'var(--card)', border: '1.5px solid var(--line)', color: 'var(--ink)' }} />
        <Badge tone={n ? 'ok' : 'mute'}>{n} pain{n === 1 ? '' : 's'} to solve</Badge>
      </div>
    </Section>
  )
}

/* ───────── Your PeopleHub toolkit (explore any feature, come back) ───────── */
export function ToolkitSlide() {
  const { outcomes, pains } = useSession()
  const { jump, goTo } = useNav()
  const painSlides = new Set(pains.flatMap(id => PAIN_MOMENTS[id] ?? []))
  const first = outcomes[0] ?? OUTCOMES[0].id
  const [sel, setSel] = useState(Math.max(0, OUTCOMES.findIndex(o => o.id === first)))
  const [touched, setTouched] = useState(false)
  const [tick, setTick] = useState(0)
  const STEP = 7000

  // gentle auto-tour through the outcomes until the presenter or client takes over
  useEffect(() => {
    if (touched) return
    const t = setTimeout(() => { setSel(s => (s + 1) % OUTCOMES.length); setTick(k => k + 1) }, STEP)
    return () => clearTimeout(t)
  }, [sel, touched, tick])

  const o = OUTCOMES[sel]
  const pick = (k: number) => { setTouched(true); setSel(k) }
  return (
    <div className="absolute inset-0">
      <div className="absolute left-20 top-[84px]">
        <motion.div {...fade(0)} className="text-[22px] tracking-[0.24em] uppercase font-bold mb-2" style={{ color: 'var(--brand2)' }}>Your PeopleHub toolkit</motion.div>
        <motion.h2 {...fade(0.08)} className="serif text-[72px] leading-[1.02] font-bold">Everything PeopleHub can do.</motion.h2>
      </div>
      <div className="absolute right-20 top-[96px] flex flex-col gap-3 w-[520px]">
        <motion.button {...fade(0.3)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => goTo(chapterSlideId(first))} className="rounded-2xl px-7 py-4 text-[26px] font-bold text-left" style={{ background: 'var(--card)', border: '2px solid var(--brand2)' }}>▶ Walk me through my blueprint</motion.button>
        <motion.button {...fade(0.4)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => goTo('ws-solved')} className="glow rounded-2xl px-7 py-4 text-[26px] font-bold text-white text-left" style={{ background: 'linear-gradient(90deg,var(--brand),var(--accent))' }}>✔ Done exploring — next step ➜</motion.button>
      </div>

      <div className="absolute left-20 right-20 top-[262px] bottom-[84px] flex gap-8">
        {/* outcome rail */}
        <div className="w-[560px] flex-none flex flex-col gap-[7px]">
          {OUTCOMES.map((x, k) => {
            const on = k === sel, mine = outcomes.includes(x.id)
            return (
              <motion.button key={x.id} initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: on ? 14 : 0 }} transition={{ delay: on ? 0 : 0.05 * k, type: 'spring', stiffness: 220, damping: 22 }}
                onClick={() => pick(k)} onMouseEnter={() => pick(k)} whileTap={{ scale: 0.97 }}
                className="relative flex-1 min-h-0 rounded-2xl pl-4 pr-5 flex items-center gap-4 text-left overflow-hidden"
                style={{ background: on ? mix(x.color, 26) : 'var(--card)', border: `${on ? 2.5 : 1}px solid ${on ? x.color : 'var(--line)'}`, boxShadow: on ? `0 0 44px -12px ${x.color}` : 'none' }}>
                <motion.div animate={on ? { scale: [1, 1.12, 1] } : { scale: 1 }} transition={{ duration: 1.6, repeat: on ? Infinity : 0 }}><OIcon id={x.id} size={52} color={x.color} /></motion.div>
                <span className="text-[28px] font-bold leading-tight flex-1">{x.name}</span>
                {mine && <span className="text-[17px] font-bold rounded-full px-3 py-1" style={{ color: 'var(--ok)', background: mix('var(--ok)', 16) }}>✓ yours</span>}
                {on && !touched && <motion.i key={`${sel}-${tick}`} className="absolute left-0 bottom-0 h-[4px]" style={{ background: x.color }} initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: STEP / 1000, ease: 'linear' }} />}
              </motion.button>
            )
          })}
        </div>

        {/* selected outcome: its capabilities */}
        <AnimatePresence mode="wait">
          <motion.div key={o.id} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35 }}
            className="flex-1 min-w-0 rounded-3xl p-8 flex flex-col relative overflow-hidden" style={{ background: mix(o.color, 11), border: `2px solid ${mix(o.color, 55)}` }}>
            <motion.div className="absolute -right-24 -top-24 w-[420px] h-[420px] rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${mix(o.color, 38)}, transparent 68%)` }} animate={{ scale: [1, 1.18, 1] }} transition={{ duration: 5, repeat: Infinity }} />
            <div className="relative flex items-center gap-6 mb-5">
              <motion.div initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }}><OIcon id={o.id} size={104} color={o.color} /></motion.div>
              <div className="flex-1 min-w-0">
                <div className="serif text-[50px] leading-[1.05] font-bold">{o.name}</div>
                <div className="text-[25px] leading-snug mt-1" style={{ color: 'var(--mute)' }}>{o.promise}</div>
              </div>
              <div className="text-center flex-none pl-4">
                <div className="serif text-[64px] leading-none font-bold" style={{ color: o.color }}><Counter key={o.id} to={o.kpi.value} suffix={o.kpi.suffix} duration={1.2} /></div>
                <div className="text-[16px] max-w-[170px] leading-tight mt-1" style={{ color: 'var(--mute)' }}>{o.kpi.label}</div>
              </div>
            </div>
            <div className="relative grid grid-cols-2 gap-3 auto-rows-fr flex-1 min-h-0">
              {o.moments.map((m, k) => {
                const id = momentSlideId(o.id, m.key), hot = painSlides.has(id)
                return (
                  <motion.button key={m.key} initial={{ opacity: 0, y: 26, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.12 + 0.07 * k, type: 'spring', stiffness: 240, damping: 20 }}
                    whileHover={{ scale: 1.03, y: -3 }} whileTap={{ scale: 0.97 }} onClick={() => jump(id)}
                    className="rounded-2xl px-5 py-3 text-left flex items-center gap-4 relative" style={{ background: 'var(--card)', border: `${hot ? 2 : 1}px solid ${hot ? 'var(--ok)' : 'var(--line)'}`, boxShadow: hot ? '0 0 30px -10px var(--ok)' : 'none' }}>
                    <span className="w-11 h-11 rounded-xl grid place-items-center text-[22px] font-bold flex-none text-white" style={{ background: o.color }}>{k + 1}</span>
                    <span className="text-[26px] font-semibold leading-tight flex-1">{m.name}</span>
                    {hot && <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }} className="text-[26px]" style={{ color: 'var(--ok)' }}>⚡</motion.span>}
                    <span className="text-[26px] flex-none" style={{ color: o.color }}>▶</span>
                  </motion.button>
                )
              })}
            </div>
            <div className="relative text-[19px] mt-3" style={{ color: 'var(--mute)' }}>
              Tap any capability to see it live, then use <b>Back</b> to return here{painSlides.size ? ' · ⚡ answers a pain you picked' : ''}{touched ? '' : ' · touring automatically — tap to take over'}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/* Small buttons on every capability slide: open the toolkit, or finish and move on */
export function SkipBar() {
  const { jump, goTo, has } = useNav()
  if (!has('ws-toolkit')) return null
  const btn = 'rounded-full px-6 py-3 text-[19px] font-bold shadow-lg transition hover:brightness-125'
  return (
    <div className="absolute right-20 bottom-[66px] z-30 flex gap-3">
      <button onClick={() => jump('ws-toolkit')} className={btn} style={{ background: 'var(--bg2)', border: '1.5px solid var(--brand2)' }}>▦ Toolkit</button>
      <button onClick={() => goTo('ws-solved')} className={`${btn} text-white`} style={{ background: 'linear-gradient(90deg,var(--brand),var(--accent))' }}>✔ Done — next step ➜</button>
    </div>
  )
}

/* ───────── How your project runs ───────── */
interface Stage { id: string; name: string; icon: string; group: string; what: string; we: string; you: string }
const STAGES: Record<string, Stage> = {
  pres: { id: 'pres', name: 'Presentation', icon: '🎤', group: 'Decide', what: 'We learn your priorities and show how PeopleHub meets them.', we: 'Run the discovery session and build your blueprint with you', you: 'A shared view of scope and priorities' },
  prop: { id: 'prop', name: 'Proposal', icon: '📄', group: 'Decide', what: 'Modules, users, package and commercial terms — in writing.', we: 'Prepare a proposal around your blueprint', you: 'A clear, itemised proposal' },
  appr: { id: 'appr', name: 'Approval', icon: '✅', group: 'Decide', what: 'Your internal sign-off to go ahead.', we: 'Answer questions and refine the proposal if needed', you: 'Approval to proceed' },
  sow: { id: 'sow', name: 'SOW', icon: '🖋️', group: 'Plan', what: 'Scope, deliverables, responsibilities and acceptance criteria agreed.', we: 'Draft the Statement of Work with you', you: 'A signed SOW' },
  plan: { id: 'plan', name: 'Project plan', icon: '🗺️', group: 'Plan', what: 'Milestones, team, data migration and training planned together.', we: 'Build the plan with your project lead', you: 'An agreed project plan' },
  impl: { id: 'impl', name: 'Implementation', icon: '🛠️', group: 'Deliver', what: 'Configuration, data migration, devices and integrations.', we: 'Configure PeopleHub to your policies and migrate your data', you: 'A system set up the way you work' },
  uat: { id: 'uat', name: 'UAT', icon: '🧪', group: 'Deliver', what: 'Your team tests real scenarios against the agreed scope.', we: 'Support the testing and fix what we find', you: 'Confidence — and a sign-off' },
  live: { id: 'live', name: 'Go-live', icon: '🚀', group: 'Deliver', what: 'Cut-over, training and launch to your employees.', we: 'Launch with you and watch closely', you: 'PeopleHub running your people processes' },
  care: { id: 'care', name: 'Hypercare', icon: '🛟', group: 'Support', what: 'Close support while your teams settle in, then steady-state support.', we: 'Fast response, tuning and training top-ups', you: 'A smooth hand-over into day-to-day support' },
}
const GROUP_COLOR: Record<string, string> = { Decide: '#3b6be0', Plan: '#a78bfa', Deliver: '#22d3ee', Support: '#34d399' }

export function JourneySlide() {
  const [propFirst, setPropFirst] = useState(false)
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(true)
  const order = [...(propFirst ? ['prop', 'pres'] : ['pres', 'prop']), 'appr', 'sow', 'plan', 'impl', 'uat', 'live', 'care']
  useEffect(() => {
    if (!auto) return
    const t = setInterval(() => setActive(a => (a + 1) % order.length), 2600)
    return () => clearInterval(t)
  }, [auto, order.length])
  const st = STAGES[order[active]]
  return (
    <Section eyebrow="How your project runs" title="From first conversation to hypercare." sub="Every step is agreed with you before it starts. Dates are set together once the scope is clear." zoom={1.5}>
      <div className="flex items-center gap-3 mt-1 mb-4">
        <button onClick={() => { setPropFirst(p => !p); setActive(0) }} className="rounded-full px-5 py-2 text-[17px] font-bold" style={{ background: mix('var(--brand)', 25), border: '1.5px solid var(--brand2)' }}>⇄ {propFirst ? 'Proposal first' : 'Presentation first'}</button>
        <span className="text-[16px]" style={{ color: 'var(--mute)' }}>Presentation and proposal can happen in either order — you choose.</span>
        <button onClick={() => setAuto(a => !a)} className="ml-auto rounded-full px-4 py-2 text-[16px] font-semibold" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>{auto ? '❚❚ Pause' : '▶ Play'}</button>
      </div>
      <div className="relative">
        <div className="absolute left-[5.5%] right-[5.5%] top-[34px] h-[5px] rounded-full" style={{ background: 'var(--line)' }} />
        <motion.div className="absolute left-[5.5%] top-[34px] h-[5px] rounded-full" style={{ background: 'linear-gradient(90deg,var(--brand2),var(--accent))' }} animate={{ width: `${(active / (order.length - 1)) * 89}%` }} transition={{ duration: 0.6 }} />
        <div className="relative grid grid-cols-9">
          {order.map((id, k) => {
            const s = STAGES[id], done = k < active, now = k === active
            return (
              <motion.button layout key={id} onClick={() => { setActive(k); setAuto(false) }} className="flex flex-col items-center text-center gap-2" transition={{ type: 'spring', stiffness: 160, damping: 20 }}>
                <motion.div animate={{ scale: now ? 1.18 : 1 }} className="w-[68px] h-[68px] rounded-full grid place-items-center text-[32px]" style={{ background: now ? GROUP_COLOR[s.group] : done ? mix(GROUP_COLOR[s.group], 55) : 'var(--card)', border: `3px solid ${GROUP_COLOR[s.group]}`, boxShadow: now ? `0 0 34px -4px ${GROUP_COLOR[s.group]}` : 'none' }}>{done ? '✓' : s.icon}</motion.div>
                <div className="text-[17px] font-bold leading-tight" style={{ color: now ? 'var(--ink)' : 'var(--mute)' }}>{s.name}</div>
                <div className="text-[12px] tracking-widest uppercase" style={{ color: GROUP_COLOR[s.group] }}>{s.group}</div>
              </motion.button>
            )
          })}
        </div>
      </div>
      <AnimatePresence initial={false}>
        <motion.div key={st.id + propFirst} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }} className="card mt-6 p-6 grid grid-cols-[1.1fr_1fr_1fr] gap-8" style={{ borderTop: `5px solid ${GROUP_COLOR[st.group]}` }}>
          <div><div className="text-[40px] leading-none">{st.icon}</div><div className="serif text-[36px] font-bold mt-1">{st.name}</div><div className="text-[19px] mt-2 leading-snug" style={{ color: 'var(--mute)' }}>{st.what}</div></div>
          <div><div className="text-[13px] tracking-[0.2em] uppercase font-bold mb-1.5" style={{ color: 'var(--brand2)' }}>We do</div><div className="text-[20px] leading-snug">{st.we}</div></div>
          <div><div className="text-[13px] tracking-[0.2em] uppercase font-bold mb-1.5" style={{ color: 'var(--ok)' }}>You get</div><div className="text-[20px] leading-snug">{st.you}</div></div>
        </motion.div>
      </AnimatePresence>
    </Section>
  )
}
