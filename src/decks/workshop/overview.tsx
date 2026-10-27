import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { SlideDef } from '../../engine/context'
import { useDeck } from '../../engine/context'
import { fade, Counter } from '../../ui/primitives'
import { OIcon } from '../../ui/OutcomeIcons'
import { PHLogo } from '../../ui/PHLogo'
import { LENSES } from '../../slides/pillars'
import { outcomeById } from './data'

const mix = (c: string, p: number) => `color-mix(in srgb, ${c} ${p}%, transparent)`

/* ───────── Overview 1 · the whole employee journey on one platform ───────── */
const STAGES: [string, string, string][] = [
  ['hire', 'Hire & onboard', 'From vacancy to a productive first day'],
  ['know', 'Know every person', 'One record, 26 sections, full history'],
  ['time', 'Time & leave', 'Every punch and every leave, policy-checked'],
  ['pay', 'Pay people right', 'Attendance to bank file with nothing re-keyed'],
  ['grow', 'Grow & keep', 'Goals, learning, succession and engagement'],
  ['serve', 'Serve everyone', 'Self-service on web, Android and iPhone'],
]
const FOUNDATION: [string, string, string][] = [
  ['approve', 'Approvals & notifications', 'the right people told, on the right channel'],
  ['data', 'Analytics & compliance', 'live dashboards, audit-ready statutory reports'],
  ['secure', 'Security & integrations', 'role-based access, your ERP and devices connected'],
]

function OverviewJourney() {
  const { industry, country, company } = useDeck()
  const [on, setOn] = useState(0)
  useEffect(() => { const t = setInterval(() => setOn(k => (k + 1) % STAGES.length), 2600); return () => clearInterval(t) }, [])
  const X0 = 190, X1 = 1730, step = (X1 - X0) / (STAGES.length - 1)
  return (
    <div className="absolute inset-0">
      <div className="absolute left-14 right-14 top-[60px]">
        <motion.div {...fade(0)} className="text-[19px] tracking-[0.26em] uppercase font-bold mb-2" style={{ color: 'var(--brand2)' }}>PeopleHub overview · 1 of 2</motion.div>
        <motion.h2 {...fade(0.06)} className="serif text-[64px] leading-[1.04] font-bold">One platform for the whole <span className="grad-text">employee journey.</span></motion.h2>
        <motion.p {...fade(0.14)} className="text-[27px] mt-3" style={{ color: 'var(--mute)' }}>From the day {company} posts a vacancy to the day someone moves on — built for {industry.name.toLowerCase()} in {country.name}.</motion.p>
      </div>

      {/* journey rail */}
      <svg viewBox="0 0 1920 360" className="absolute left-0 top-[232px] w-full" style={{ height: 360 }}>
        <motion.line x1={X0} y1={102} x2={X1} y2={102} stroke="var(--line)" strokeWidth="6" strokeLinecap="round" />
        <motion.line x1={X0} y1={102} x2={X1} y2={102} stroke="url(#rail)" strokeWidth="6" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4, duration: 1.8, ease: 'easeInOut' }} />
        <defs><linearGradient id="rail" x1="0" x2="1"><stop offset="0" stopColor="#22d3ee" /><stop offset=".5" stopColor="#3b6be0" /><stop offset="1" stopColor="#34d399" /></linearGradient></defs>
        <motion.circle r="13" cy="102" fill="#fff" stroke="var(--brand2)" strokeWidth="5" animate={{ cx: X0 + on * step }} transition={{ type: 'spring', stiffness: 70, damping: 16 }} style={{ filter: 'drop-shadow(0 0 12px var(--brand2))' }} />
      </svg>
      {STAGES.map(([id, name, line], k) => {
        const o = outcomeById[id], active = on === k, x = X0 + k * step
        return (
          <motion.button key={id} {...fade(0.5 + k * 0.12)} onClick={() => setOn(k)} className="absolute text-center" style={{ left: x - 150, top: 270, width: 300 }}>
            <motion.div animate={{ scale: active ? 1.14 : 1 }} transition={{ type: 'spring', stiffness: 220, damping: 16 }} className="mx-auto w-[128px] h-[128px] rounded-full grid place-items-center"
              style={{ background: mix(o.color, active ? 30 : 14), border: `3px solid ${active ? o.color : mix(o.color, 45)}`, boxShadow: active ? `0 0 56px -6px ${o.color}` : 'none' }}>
              <OIcon id={id} size={78} color={o.color} />
            </motion.div>
            <div className="text-[27px] font-bold mt-4 leading-tight" style={{ color: active ? o.color : 'var(--ink)' }}>{name}</div>
            <div className="text-[19px] mt-1.5 leading-snug mx-auto" style={{ color: 'var(--mute)', maxWidth: 250, opacity: active ? 1 : 0.8 }}>{line}</div>
          </motion.button>
        )
      })}

      {/* the foundation every stage sits on */}
      <motion.div {...fade(1.3)} className="absolute left-14 right-14 top-[705px]">
        <div className="text-[15px] tracking-[0.24em] uppercase font-bold mb-3" style={{ color: 'var(--mute)' }}>…and underneath all of it</div>
        <div className="grid grid-cols-3 gap-4">
          {FOUNDATION.map(([id, name, line]) => (
            <div key={id} className="card px-5 py-3.5 flex items-center gap-4" style={{ borderLeft: `5px solid ${outcomeById[id].color}` }}>
              <OIcon id={id} size={52} color={outcomeById[id].color} />
              <div><div className="text-[23px] font-bold leading-tight">{name}</div><div className="text-[18px]" style={{ color: 'var(--mute)' }}>{line}</div></div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div {...fade(1.5)} className="absolute left-14 right-14 bottom-[78px] flex items-center gap-4">
        {[[32, 'modules'], [10, 'business outcomes']].map(([v, l]) => (
          <div key={l as string} className="card px-6 py-2.5 flex items-baseline gap-3"><span className="serif text-[44px] font-bold grad-text leading-none"><Counter to={v as number} /></span><span className="text-[21px]" style={{ color: 'var(--mute)' }}>{l}</span></div>
        ))}
        <div className="card px-6 py-3 text-[24px] font-bold grad-text">Web · Android · iPhone</div>
        <div className="flex-1" />
        <div className="text-[20px]" style={{ color: 'var(--mute)' }}>One system. One source of truth.</div>
      </motion.div>
    </div>
  )
}

/* ───────── Overview 2 · how it helps: run it, grow it, enable it ───────── */
const HELPS: { key: 'ops' | 'strat' | 'comp'; verb: string; who: string[] }[] = [
  { key: 'ops', verb: 'Run it', who: ['HR', 'Payroll & finance'] },
  { key: 'strat', verb: 'Grow it', who: ['Owners & leadership', 'HR'] },
  { key: 'comp', verb: 'Enable it', who: ['Employees', 'Managers & IT'] },
]
function OverviewHelps() {
  const { pains, company } = useDeck()
  return (
    <div className="absolute inset-0">
      <div className="absolute left-14 right-14 top-[60px]">
        <motion.div {...fade(0)} className="text-[19px] tracking-[0.26em] uppercase font-bold mb-2" style={{ color: 'var(--brand2)' }}>PeopleHub overview · 2 of 2</motion.div>
        <motion.h2 {...fade(0.06)} className="serif text-[64px] leading-[1.04] font-bold">How PeopleHub helps <span className="grad-text">{company}.</span></motion.h2>
        <motion.p {...fade(0.14)} className="text-[27px] mt-3" style={{ color: 'var(--mute)' }}>Three jobs, one platform — 32 modules working from the same data.</motion.p>
      </div>
      <div className="absolute left-14 right-14 top-[262px] grid grid-cols-3 gap-6" style={{ height: 634 }}>
        {HELPS.map(({ key, verb, who }, k) => {
          const L = LENSES[key], mods = L.stages.flatMap(s => s[1]), n = mods.length
          return (
            <motion.div key={key} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + k * 0.18, type: 'spring', stiffness: 120, damping: 18 }}
              className="rounded-3xl overflow-hidden flex flex-col" style={{ background: 'var(--card)', border: `2px solid ${mix(L.color, 55)}`, boxShadow: `0 24px 60px -28px ${L.color}` }}>
              <div className="px-7 py-5 flex items-center justify-between" style={{ background: `linear-gradient(135deg, ${mix(L.color, 45)}, ${mix(L.color, 12)})` }}>
                <div>
                  <div className="text-[16px] tracking-[0.22em] uppercase font-bold" style={{ color: L.color }}>{L.name}</div>
                  <div className="serif text-[50px] font-bold leading-none mt-1">{verb}</div>
                </div>
                <div className="text-right"><div className="serif text-[64px] font-bold leading-none" style={{ color: L.color }}><Counter to={n} /></div><div className="text-[16px]" style={{ color: 'var(--mute)' }}>modules</div></div>
              </div>
              <div className="px-7 py-5 flex flex-col gap-4 flex-1">
                <div className="text-[26px] font-semibold leading-snug" style={{ color: L.color }}>{L.tagline}</div>
                <ul className="flex flex-col gap-3">{L.gains.slice(0, 3).map(g => <li key={g} className="flex gap-3 text-[22px] leading-snug"><span style={{ color: 'var(--ok)' }}>✓</span>{g}</li>)}</ul>
                <div className="flex-1" />
                <div>
                  <div className="text-[14px] tracking-[0.18em] uppercase font-bold mb-2" style={{ color: 'var(--mute)' }}>Includes</div>
                  <div className="flex flex-wrap gap-1.5">{mods.slice(0, 6).map(m => <span key={m} className="rounded-lg px-2.5 py-1 text-[16px]" style={{ background: 'var(--bg2)', border: '1px solid var(--line)' }}>{m}</span>)}{mods.length > 6 && <span className="rounded-lg px-2.5 py-1 text-[16px] font-bold" style={{ color: L.color }}>+{mods.length - 6} more</span>}</div>
                </div>
                <div className="flex flex-wrap items-center gap-2"><span className="text-[14px] tracking-[0.18em] uppercase font-bold" style={{ color: 'var(--mute)' }}>Who gains</span>
                  {who.map(w => <span key={w} className="rounded-full px-3.5 py-1 text-[17px] font-semibold" style={{ background: mix(L.color, 20), border: `1px solid ${mix(L.color, 55)}` }}>{w}</span>)}</div>
              </div>
            </motion.div>
          )
        })}
      </div>
      <motion.div {...fade(1.1)} className="absolute left-14 right-14 bottom-[74px] rounded-2xl px-6 py-3.5 flex items-center gap-4 flex-wrap" style={{ background: mix('#3b6be0', 12), border: '1.5px dashed var(--brand2)' }}>
        <span className="text-[16px] tracking-[0.2em] uppercase font-bold" style={{ color: 'var(--brand2)' }}>{pains.length ? 'What you told us' : 'Fewer spreadsheets · fewer errors · faster decisions'}</span>
        {pains.slice(0, 4).map(p => <span key={p.id} className="rounded-full px-4 py-1.5 text-[19px] font-semibold" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>{p.icon} {p.label}</span>)}
        {pains.length > 0 && <span className="text-[19px]" style={{ color: 'var(--mute)' }}>— each one is solved by modules you are about to see.</span>}
      </motion.div>
    </div>
  )
}

/* ───────── Demonstration title: “now we are going to see PeopleHub” ───────── */
function DemoTitle() {
  const { company, client } = useDeck()
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg viewBox="0 0 1920 1080" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        {[0, 1, 2, 3].map(i => (
          <motion.circle key={i} cx="960" cy="470" fill="none" stroke="var(--brand2)" strokeWidth="2.5" initial={{ r: 140, opacity: 0.35 }} animate={{ r: 820, opacity: 0 }} transition={{ duration: 6, repeat: Infinity, delay: i * 1.5, ease: 'easeOut' }} />
        ))}
        <circle cx="960" cy="470" r="330" fill="none" stroke="var(--line)" strokeWidth="2" strokeDasharray="4 14" />
        <circle cx="960" cy="470" r="520" fill="none" stroke="var(--line)" strokeWidth="1.5" strokeDasharray="2 16" />
      </svg>
      <div className="absolute inset-x-0 top-[150px] flex flex-col items-center text-center">
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 110, damping: 14 }} className="grid place-items-center rounded-full glow" style={{ width: 250, height: 250, background: 'var(--bg2)', border: '3px solid var(--brand2)' }}>
          <PHLogo className="h-[170px] w-[170px]" />
        </motion.div>
        <motion.div {...fade(0.5)} className="text-[24px] tracking-[0.42em] uppercase font-bold mt-12" style={{ color: 'var(--accent)' }}>PeopleHub demonstration</motion.div>
        <motion.h1 {...fade(0.65)} className="serif text-[128px] leading-[1.02] font-bold mt-3">Now, let’s see</motion.h1>
        <motion.h1 {...fade(0.85)} className="serif text-[128px] leading-[1.02] font-bold shimmer-text">PeopleHub.</motion.h1>
        <motion.p {...fade(1.1)} className="text-[31px] mt-9 max-w-[1250px] leading-snug" style={{ color: 'var(--mute)' }}>
          A live walk through {client ? `${company}’s` : 'your'} working day — every screen is real and clickable. Operational, strategic and enablement, one module at a time.
        </motion.p>
        <motion.div {...fade(1.4)} className="mt-10 rounded-full px-8 py-3 text-[23px] font-bold flex items-center gap-3" style={{ background: 'var(--card)', border: '1.5px solid var(--brand2)' }}>
          <motion.span animate={{ x: [0, 8, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>▶</motion.span>Press → to begin
        </motion.div>
      </div>
    </div>
  )
}

export function overviewSlides(): SlideDef[] {
  return [
    { id: 'ws-overview-1', section: 'Overview', title: 'PeopleHub overview: the whole journey', secs: 75, tier: 2, render: () => <OverviewJourney />,
      notes: 'Overview 1 of 2. Walk left to right: hire, know, time and leave, pay, grow, serve — the highlight tours on its own, tap a stage to hold it. Then the three foundations underneath (approvals, data and compliance, security and integrations). Message: one platform, one source of truth, the same record from hiring to leaving. Keep it under a minute; the detail comes in the demonstration.' },
    { id: 'ws-overview-2', section: 'Overview', title: 'PeopleHub overview: how it helps', secs: 75, tier: 2, render: () => <OverviewHelps />,
      notes: 'Overview 2 of 2. Three jobs: Run it (operational HR: people, time, pay, control), Grow it (strategic HR: hiring, performance, succession, data) and Enable it (letters, tasks, service desk, knowledge, AI, integrations). Name who gains in each. The strip at the bottom replays the pains the client chose earlier — say each one will be solved in what we are about to see.' },
    { id: 'ws-demo-title', section: 'Overview', title: 'PeopleHub demonstration', secs: 20, tier: 3, render: () => <DemoTitle />,
      notes: 'Title screen: pause, then say "Now we are going to see PeopleHub." Next slide starts the live demonstration. Let the client lean in; this is the hand-over from talking to showing.' },
  ]
}
