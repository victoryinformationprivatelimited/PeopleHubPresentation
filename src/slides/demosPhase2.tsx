import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useDeck, money } from '../engine/context'
import { Avatar, Badge, Bar, Window } from '../ui/primitives'

/* Clickable module screens, phase 2: Core HR and workforce operations. All data is fictional. */

const mix = (c: string, p: number) => `color-mix(in srgb, ${c} ${p}%, transparent)`
const Hint = ({ children }: { children: ReactNode }) => <div className="text-[13.5px] mt-3" style={{ color: 'var(--mute)' }}>👆 {children}</div>
const Btn = ({ children, onClick, tone = 'brand', disabled }: { children: ReactNode; onClick: () => void; tone?: 'brand' | 'ok' | 'ghost'; disabled?: boolean }) => (
  <button onClick={onClick} disabled={disabled} className="rounded-xl px-4 py-2 text-[15px] font-bold transition active:scale-95 disabled:opacity-40"
    style={tone === 'ghost' ? { background: 'var(--card)', border: '1px solid var(--line)' } : { background: tone === 'ok' ? 'var(--ok)' : 'var(--brand)', color: tone === 'ok' ? '#06281c' : '#fff' }}>{children}</button>
)
function Tabs({ tabs, active, onPick }: { tabs: string[]; active: number; onPick: (i: number) => void }) {
  return (
    <div className="flex gap-1.5 mb-4 p-1 rounded-xl w-fit" style={{ background: 'var(--bg)', border: '1px solid var(--line)' }}>
      {tabs.map((t, i) => <button key={t} onClick={() => onPick(i)} className="px-4 py-1.5 rounded-lg text-[15px] font-bold" style={i === active ? { background: 'var(--brand)', color: '#fff' } : { color: 'var(--mute)' }}>{t}</button>)}
    </div>
  )
}

/* ───────── Organization: move a unit and watch the chart redraw ───────── */
export function OrgDemo() {
  const { country, industry, company } = useDeck()
  const n = country.sampleNames
  const heads = industry.departments.slice(1, 4)
  const [teams, setTeams] = useState<Record<string, string[]>>(() => ({ [heads[0]]: industry.departments.slice(4, 6), [heads[1]]: [], [heads[2]]: [] }))
  const [pick, setPick] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const all = Object.values(teams).flat()
  const moveTo = (h: string) => {
    if (!pick) return
    setTeams(t => Object.fromEntries(Object.entries(t).map(([k, v]) => [k, k === h ? [...v.filter(x => x !== pick), pick] : v.filter(x => x !== pick)])))
    setPick(null); setDone(true)
  }
  const Node = ({ name, role, c = 'var(--brand2)' }: { name: string; role: string; c?: string }) => (
    <div className="card px-4 py-3 flex items-center gap-3 min-w-[200px]" style={{ borderColor: c }}><Avatar name={name} size={40} /><div><div className="font-bold text-[16px]">{name}</div><div className="text-[13px]" style={{ color: 'var(--mute)' }}>{role}</div></div></div>
  )
  return (
    <Window title={`${company} · Organization · live org chart`}>
      <div className="flex flex-col items-center gap-5 py-1">
        <Node name={n[0]} role={industry.roles[0]} c="var(--accent)" />
        <div className="flex gap-5">
          {heads.map((h, k) => (
            <div key={h} className="flex flex-col items-center gap-3 min-w-[210px]">
              <Node name={n[k + 1]} role={`Head · ${h}`} />
              <div className="flex flex-col gap-2 w-full min-h-[74px] rounded-xl p-2 transition-colors" style={{ border: `1.5px dashed ${pick ? 'var(--brand2)' : 'var(--line)'}`, background: pick ? mix('var(--brand)', 8) : 'transparent' }}>
                <AnimatePresence>
                  {teams[h].map(t => (
                    <motion.button layout layoutId={t} key={t} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 160, damping: 20 }} onClick={() => { setPick(p => (p === t ? null : t)); setDone(false) }}
                      className="card px-4 py-2 text-[15px] text-left" style={{ borderStyle: 'dashed', borderColor: pick === t ? 'var(--accent)' : undefined, background: pick === t ? mix('var(--accent)', 18) : undefined }}>{t}</motion.button>
                  ))}
                </AnimatePresence>
                {pick && !teams[h].includes(pick) && <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => moveTo(h)} className="rounded-lg py-2 text-[14px] font-bold" style={{ background: 'var(--brand)', color: '#fff' }}>Move “{pick}” here ▶</motion.button>}
                {!teams[h].length && !pick && <div className="text-[12.5px] text-center py-3" style={{ color: 'var(--mute)' }}>No units yet</div>}
              </div>
            </div>
          ))}
        </div>
        <Badge tone={done ? 'ok' : 'mute'}>{done ? '✓ Restructure applied — chart, reporting lines and approvals updated' : `${all.length} unit${all.length === 1 ? '' : 's'} · pick one to move it`}</Badge>
      </div>
      <Hint>Click a unit, then “Move here” under another head.</Hint>
    </Window>
  )
}

/* ───────── Life cycle ───────── */
export function LifecycleDemo() {
  const { country } = useDeck()
  const steps = [['Hired', 'Day 1', 'Employee record, contract and onboarding checklist created'], ['Confirmed', 'Month 6', 'Probation review closed; confirmation letter generated'], ['Promoted', 'Year 2', 'Grade and pay updated; approval trail kept'], ['Transferred', 'Year 3', 'New unit and manager; leave and shifts carried over'], ['Promoted', 'Year 5', 'Succession plan refreshed'], ['Exit', 'Year 7', 'Exit checklist, assets and final settlement']]
  const [on, setOn] = useState(0)
  const [done, setDone] = useState<number[]>([0])
  return (
    <Window title={`Employee Life Cycle · ${country.sampleNames[1]}`}>
      <div className="relative py-8 px-2">
        <div className="absolute left-6 right-6 top-[54px] h-[3px] rounded" style={{ background: 'var(--line)' }} />
        <motion.div className="absolute left-6 top-[54px] h-[3px] rounded" style={{ background: 'linear-gradient(90deg,var(--brand2),var(--accent))' }} animate={{ width: `calc(${(Math.max(...done) / 5) * 100}% * 0.92)` }} />
        <div className="relative flex justify-between">
          {steps.map(([s, t], k) => (
            <button key={k} onClick={() => setOn(k)} className="flex flex-col items-center w-[110px] text-center">
              <motion.div animate={{ scale: on === k ? 1.25 : 1 }} className="w-9 h-9 rounded-full grid place-items-center text-[15px] font-bold" style={{ background: done.includes(k) ? 'var(--brand)' : 'var(--card)', border: `2px solid ${on === k ? 'var(--accent)' : 'var(--line)'}`, boxShadow: on === k ? '0 0 20px var(--accent)' : 'none' }}>{done.includes(k) ? '✓' : k + 1}</motion.div>
              <div className="mt-2.5 font-bold text-[16px]">{s}</div><div className="text-[12.5px]" style={{ color: 'var(--mute)' }}>{t}</div>
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={on} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="card p-4 flex items-center gap-4">
          <div className="flex-1"><div className="text-[12px] uppercase tracking-wider" style={{ color: 'var(--mute)' }}>{steps[on][1]} · automated</div><div className="font-bold text-[18px]">{steps[on][0]}</div><div className="text-[14.5px]" style={{ color: 'var(--mute)' }}>{steps[on][2]}</div></div>
          {done.includes(on) ? <Badge tone="ok">✓ Done</Badge> : <Btn onClick={() => setDone(d => [...new Set([...d, on, ...Array(on).keys()])])}>Trigger milestone ▶</Btn>}
        </motion.div>
      </AnimatePresence>
    </Window>
  )
}

/* ───────── Termination & exit ───────── */
export function TerminationDemo() {
  const { country, industry, company } = useDeck()
  const items = ['Resignation accepted', 'Notice period computed', `Assets returned (${industry.assets[0][1]}, ${industry.assets[2][1]})`, 'Exit interview completed', 'Leave encashment calculated', 'Final settlement approved']
  const [ok, setOk] = useState<boolean[]>([true, true, false, false, false, false])
  const all = ok.every(Boolean), count = ok.filter(Boolean).length
  return (
    <Window title={`${company} · Exit · ${country.sampleNames[4]}`}>
      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-3 flex flex-col gap-2">
          {items.map((t, k) => (
            <button key={t} onClick={() => setOk(o => o.map((v, i) => (i === k ? !v : v)))} className="card px-4 py-2.5 flex items-center gap-3 text-[16.5px] text-left" style={{ borderColor: ok[k] ? 'var(--ok)' : undefined }}>
              <motion.span animate={{ scale: ok[k] ? 1 : 0.85 }} className="w-6 h-6 rounded-full grid place-items-center text-[13px] flex-none" style={{ background: ok[k] ? 'var(--ok)' : 'var(--line)', color: '#06281c' }}>{ok[k] ? '✓' : ''}</motion.span>{t}
            </button>
          ))}
          <Hint>Tick each exit task — the final settlement unlocks when all are done.</Hint>
        </div>
        <div className="col-span-2 card p-5 flex flex-col justify-center text-center">
          <div className="text-[14px]" style={{ color: 'var(--mute)' }}>Final settlement</div>
          <motion.div animate={{ opacity: all ? 1 : 0.3, scale: all ? 1 : 0.95 }} className="text-[36px] font-extrabold grad-text">{money(country, country.settlement)}</motion.div>
          <div className="mt-2"><Bar pct={(count / items.length) * 100} color={all ? 'var(--ok)' : 'var(--brand2)'} /></div>
          <div className="mt-2">{all ? <Badge tone="ok">Cleared by all departments</Badge> : <Badge tone="warn">{items.length - count} task{items.length - count === 1 ? '' : 's'} pending</Badge>}</div>
        </div>
      </div>
    </Window>
  )
}

/* ───────── Staff loans: set amount & term, schedule recalculates ───────── */
export function LoansDemo() {
  const { country, company } = useDeck()
  const [amt, setAmt] = useState(country.loan)
  const [months, setMonths] = useState(6)
  const [applied, setApplied] = useState(false)
  const inst = Math.round(amt / months)
  const mon = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']
  return (
    <Window title={`${company} · Staff loan · ${country.sampleNames[5]}`}>
      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-2 flex flex-col gap-3">
          <div className="card p-3.5"><div className="text-[12px] uppercase tracking-wider" style={{ color: 'var(--mute)' }}>Loan amount</div><div className="text-[30px] font-extrabold">{money(country, amt)}</div>
            <input type="range" min={country.loan / 3} max={country.loan * 2} step={country.loan / 30} value={amt} onChange={e => { setAmt(Number(e.target.value)); setApplied(false) }} className="w-full" /></div>
          <div className="card p-3.5"><div className="text-[12px] uppercase tracking-wider mb-1.5" style={{ color: 'var(--mute)' }}>Repay over</div><div className="flex gap-1.5">{[3, 6, 9, 12].map(m => <button key={m} onClick={() => { setMonths(m); setApplied(false) }} className="flex-1 rounded-lg py-1.5 text-[15px] font-bold" style={months === m ? { background: 'var(--brand)', color: '#fff' } : { background: 'var(--bg)', border: '1px solid var(--line)' }}>{m} mo</button>)}</div></div>
          <div className="card p-3.5 flex justify-between items-center text-[15px]"><span>Monthly deduction</span><b className="text-[20px]">{money(country, inst)}</b></div>
          <Btn tone={applied ? 'ok' : 'brand'} onClick={() => setApplied(true)}>{applied ? '✓ Approved · deducted via payroll' : 'Apply for loan'}</Btn>
        </div>
        <div className="col-span-3 flex flex-col gap-1.5">
          {[...Array(months)].map((_, k) => (
            <motion.div key={months + mon[k]} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 * k }} className="card px-4 py-1.5 grid grid-cols-4 items-center text-[14.5px]">
              <span>{mon[k]}</span><span>{money(country, inst)}</span><span style={{ color: 'var(--mute)' }}>Bal. {money(country, Math.max(0, amt - inst * (k + 1)))}</span><Bar pct={((k + 1) / months) * 100} color={applied ? 'var(--ok)' : 'var(--brand2)'} />
            </motion.div>
          ))}
        </div>
      </div>
    </Window>
  )
}

/* ───────── Benefits ───────── */
export function BenefitsDemo() {
  const { industry, country } = useDeck()
  const [on, setOn] = useState(industry.benefits.map(b => b[3]))
  const cost = [4800, 2500, 1800, 3200]
  const monthly = on.reduce((a, v, i) => a + (v ? cost[i % 4] : 0), 0)
  return (
    <Window title="Benefits · My enrolment">
      <div className="grid grid-cols-2 gap-3.5">
        {industry.benefits.map(([i, n, d], k) => (
          <button key={n} onClick={() => setOn(o => o.map((v, j) => (j === k ? !v : v)))} className="card p-4 text-left" style={{ borderColor: on[k] ? 'var(--ok)' : undefined }}>
            <div className="flex justify-between items-start"><span className="text-[32px]">{i}</span>
              <span className="w-14 h-7 rounded-full p-1 flex transition-all" style={{ background: on[k] ? 'var(--ok)' : 'var(--line)', justifyContent: on[k] ? 'flex-end' : 'flex-start' }}><motion.span layout className="w-5 h-5 rounded-full bg-white" /></span></div>
            <div className="font-bold text-[18px] mt-1.5">{n}</div><div className="text-[13.5px]" style={{ color: 'var(--mute)' }}>{d}</div>
            <div className="mt-2">{on[k] ? <Badge tone="ok">Enrolled</Badge> : <Badge tone="warn">Tap to enrol</Badge>}</div>
          </button>
        ))}
      </div>
      <div className="card px-4 py-2.5 mt-3 flex justify-between items-center text-[15px]"><span>{on.filter(Boolean).length} of {on.length} benefits · employee contribution</span><b className="text-[20px]">{money(country, monthly)} / month</b></div>
    </Window>
  )
}

/* ───────── Training ───────── */
export function TrainingDemo() {
  const { industry, company } = useDeck()
  const sessions: Record<number, number> = { 4: 0, 11: 1, 16: 2 }
  const [sel, setSel] = useState<number | null>(null)
  const [enrolled, setEnrolled] = useState<number[]>([])
  const [prog, setProg] = useState(industry.courses.map(c => c[1] as number))
  const c = sel !== null ? sessions[sel] : null
  return (
    <Window title={`${company} · Training calendar`}>
      <div className="grid grid-cols-7 gap-1.5 mb-4">
        {[...Array(21)].map((_, k) => (
          <button key={k} onClick={() => k in sessions && setSel(k)} className="card h-[44px] grid place-items-center text-[13px]" style={k in sessions ? { background: enrolled.includes(sessions[k]) ? 'var(--ok)' : 'var(--brand)', borderColor: sel === k ? '#fff' : 'var(--brand2)', color: '#fff', fontWeight: 700 } : { color: 'var(--mute)' }}>{k + 1}</button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {c !== null ? (
          <motion.div key={c} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="card p-3 mb-3 flex items-center gap-3"><div className="flex-1"><b>{industry.courses[c][0]}</b><div className="text-[13px]" style={{ color: 'var(--mute)' }}>Session on day {sel! + 1} · 20 seats · 14 enrolled</div></div>
            {enrolled.includes(c) ? <Badge tone="ok">✓ You are enrolled</Badge> : <Btn onClick={() => { setEnrolled(e => [...e, c]); setProg(p => p.map((v, i) => (i === c ? Math.min(100, v + 25) : v))) }}>Enrol me ▶</Btn>}</motion.div>
        ) : <motion.div key="none" className="text-[13.5px] mb-3" style={{ color: 'var(--mute)' }}>👆 Click a highlighted day to see the session and enrol.</motion.div>}
      </AnimatePresence>
      <div className="flex flex-col gap-2.5">{industry.courses.map(([n], k) => <div key={n as string}><div className="flex justify-between text-[14.5px] mb-1"><span>{n}</span><b style={{ color: prog[k] === 100 ? 'var(--ok)' : 'var(--ink)' }}>{prog[k] === 100 ? 'Certified ✓' : `${prog[k]}%`}</b></div><Bar pct={prog[k]} color={prog[k] === 100 ? 'var(--ok)' : 'var(--brand2)'} /></div>)}</div>
    </Window>
  )
}

/* ───────── Succession: 9-box ───────── */
export function SuccessionDemo() {
  const { country } = useDeck()
  const cells = [['Rough diamond', 0, 2], ['Future leader', 1, 2], ['Star', 2, 2], ['Inconsistent', 0, 1], ['Core player', 1, 1], ['High performer', 2, 1], ['Risk', 0, 0], ['Effective', 1, 0], ['Trusted pro', 2, 0]] as const
  const people = country.sampleNames.slice(2, 8)
  const [pos, setPos] = useState<string[]>(['Star', 'Future leader', 'Core player', 'Core player', 'Effective', 'Rough diamond'])
  const [pick, setPick] = useState<number | null>(null)
  const ready = pos.filter(p => p === 'Star' || p === 'Future leader' || p === 'High performer').length
  return (
    <Window title="Succession · 9-box talent grid">
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-4 grid grid-cols-3 gap-2">
          {[...cells].sort((a, b) => (a[2] === b[2] ? a[1] - b[1] : b[2] - a[2])).map(([n, x, y]) => (
            <button key={n} onClick={() => { if (pick !== null) { setPos(p => p.map((v, i) => (i === pick ? n : v))); setPick(null) } }} className="card p-2.5 h-[108px] text-left relative" style={{ background: x + y >= 3 ? mix('var(--ok)', 16) : undefined, borderColor: pick !== null ? 'var(--brand2)' : undefined }}>
              <div className="text-[12px]" style={{ color: 'var(--mute)' }}>{n}</div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {people.map((p, i) => pos[i] === n && (
                  <motion.span layout layoutId={p} key={p} onClick={e => { e.stopPropagation(); setPick(pick === i ? null : i) }} className="rounded-full" style={{ outline: pick === i ? '3px solid var(--accent)' : 'none' }}><Avatar name={p} size={34} /></motion.span>
                ))}
              </div>
            </button>
          ))}
        </div>
        <div className="card p-3 flex flex-col justify-center text-center">
          <div className="text-[12px] uppercase tracking-wider" style={{ color: 'var(--mute)' }}>Successor-ready</div>
          <div className="text-[44px] font-extrabold grad-text">{ready}</div>
          <div className="text-[13px]" style={{ color: 'var(--mute)' }}>for the head role</div>
          <div className="mt-2"><Badge tone={ready >= 2 ? 'ok' : 'warn'}>{ready >= 2 ? 'Healthy bench' : 'Thin bench'}</Badge></div>
        </div>
      </div>
      <Hint>Click a person, then a box to re-rate them — the successor bench updates.</Hint>
    </Window>
  )
}

/* ───────── Leave calendar: team view with clash warning ───────── */
export function LeaveCalendarDemo() {
  const { country, company } = useDeck()
  const names = country.sampleNames
  const [off, setOff] = useState<Record<number, number[]>>({ 3: [1], 4: [1], 5: [1, 2], 12: [3], 13: [3, 4], 14: [3], 20: [5] })
  const [sel, setSel] = useState<number | null>(null)
  const [me] = useState(0)
  const toggle = (d: number) => setOff(o => { const cur = o[d] ?? []; return { ...o, [d]: cur.includes(me) ? cur.filter(x => x !== me) : [...cur, me] } })
  const clash = sel !== null && (off[sel]?.length ?? 0) >= 2
  return (
    <Window title={`${company} · Team calendar`}>
      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-3">
          <div className="grid grid-cols-7 gap-1.5">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <div key={d} className="text-[12px] text-center" style={{ color: 'var(--mute)' }}>{d}</div>)}
            {[...Array(28)].map((_, i) => { const d = i + 1, n = off[d]?.length ?? 0; return (
              <button key={d} onClick={() => setSel(d)} className="rounded-lg h-[46px] relative text-[14px] font-semibold" style={{ background: n >= 2 ? mix('var(--bad)', 22) : n ? mix('var(--warn)', 18) : 'var(--card)', border: `1.5px solid ${sel === d ? 'var(--accent)' : 'var(--line)'}`, color: i % 7 > 4 ? 'var(--mute)' : 'var(--ink)' }}>{d}{n > 0 && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">{[...Array(Math.min(n, 3))].map((_, k) => <i key={k} className="w-1.5 h-1.5 rounded-full" style={{ background: n >= 2 ? 'var(--bad)' : 'var(--warn)' }} />)}</span>}</button>) })}
          </div>
        </div>
        <div className="col-span-2">
          <AnimatePresence mode="wait">
            {sel !== null ? (
              <motion.div key={sel} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-2">
                <div className="font-bold text-[17px]">Day {sel}</div>
                {(off[sel] ?? []).length ? (off[sel] ?? []).map(i => <div key={i} className="card p-2.5 flex items-center gap-2.5 text-[14.5px]"><Avatar name={names[i]} size={30} />{names[i]}<span className="ml-auto" style={{ color: 'var(--mute)' }}>on leave</span></div>) : <div className="text-[14px]" style={{ color: 'var(--mute)' }}>Nobody is off.</div>}
                {clash && <Badge tone="bad">⚠ Clash — 2 or more people already off</Badge>}
                <Btn tone={(off[sel] ?? []).includes(me) ? 'ghost' : 'brand'} onClick={() => toggle(sel)}>{(off[sel] ?? []).includes(me) ? 'Cancel my leave' : `Add leave for ${names[me].split(' ')[0]}`}</Btn>
              </motion.div>
            ) : <div className="text-[14px]" style={{ color: 'var(--mute)' }}>👆 Click a day to see who is off, spot clashes and plan cover.</div>}
          </AnimatePresence>
        </div>
      </div>
    </Window>
  )
}

/* ───────── Finance: GL journal & bank files ───────── */
export function FinanceDemo() {
  const { country, industry, company } = useDeck()
  const [tab, setTab] = useState(0)
  const [cc, setCc] = useState(0)
  const [posted, setPosted] = useState(false)
  const [bank, setBank] = useState(0)
  const [made, setMade] = useState(false)
  const depts = ['All cost centres', ...industry.departments.slice(1, 4)]
  const share = [1, 0.45, 0.33, 0.22][cc], base = country.salary * 6 * share
  const lines: [string, string, number][] = [['Salaries & wages', 'Dr', Math.round(base)], [`${country.statutory[0]?.label ?? 'Statutory'} employer contribution`, 'Dr', Math.round(base * 0.12)], [`${country.statutory[0]?.label ?? 'Statutory'} payable`, 'Cr', Math.round(base * 0.2)], [`${country.taxName} payable`, 'Cr', Math.round(base * 0.05)], ['Net salaries — bank', 'Cr', Math.round(base * 0.87)]]
  const banks = ['National Bank', 'Commercial Bank', 'People’s Bank', 'Standard Chartered']
  return (
    <Window title={`${company} · Finance`}>
      <Tabs tabs={['GL journal', 'Bank files']} active={tab} onPick={setTab} />
      {tab === 0 ? (
        <>
          <div className="flex gap-1.5 mb-3 flex-wrap">{depts.map((d, i) => <button key={d} onClick={() => { setCc(i); setPosted(false) }} className="rounded-full px-3.5 py-1 text-[14px] font-semibold" style={cc === i ? { background: 'var(--brand)', color: '#fff' } : { background: 'var(--card)', border: '1px solid var(--line)' }}>{d}</button>)}</div>
          <div className="card overflow-hidden">
            {lines.map(([l, d, a], k) => <motion.div key={cc + l} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * k }} className="grid grid-cols-[2fr_.4fr_1fr] px-4 py-2 text-[14.5px]" style={{ borderBottom: '1px solid var(--line)' }}><span>{l}</span><b style={{ color: d === 'Dr' ? 'var(--brand2)' : 'var(--accent)' }}>{d}</b><span className="text-right tabular-nums">{money(country, a)}</span></motion.div>)}
          </div>
          <div className="flex items-center justify-between mt-3"><Badge tone={posted ? 'ok' : 'mute'}>{posted ? '✓ Posted to ERP / accounting' : 'Draft journal'}</Badge><Btn tone={posted ? 'ghost' : 'brand'} onClick={() => setPosted(p => !p)}>{posted ? 'Reverse' : 'Post to GL ▶'}</Btn></div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-2 mb-3">{banks.map((b, i) => <button key={b} onClick={() => { setBank(i); setMade(false) }} className="card p-3 text-[14px] font-bold" style={{ borderColor: bank === i ? 'var(--brand2)' : undefined, background: bank === i ? mix('var(--brand)', 16) : undefined }}>🏦 {b}</button>)}</div>
          <div className="card p-3 font-mono text-[12.5px] leading-relaxed" style={{ color: 'var(--mute)' }}>HDR,{banks[bank].toUpperCase().replace(/[^A-Z]/g, '')},OCT2026,{country.currency}<br />{country.sampleNames.slice(0, 3).map((n, i) => <span key={n}>DTL,{n.toUpperCase()},••••{7731 + i * 11},{Math.round(country.salary * 0.8)}<br /></span>)}TRL,6,{money(country, Math.round(country.salary * 5))}</div>
          <div className="flex items-center justify-between mt-3"><Badge tone={made ? 'ok' : 'mute'}>{made ? `✓ SALARY_${banks[bank].split(' ')[0].toUpperCase()}.txt ready` : 'Choose a bank format'}</Badge><Btn onClick={() => setMade(true)}>Generate file ▶</Btn></div>
        </>
      )}
    </Window>
  )
}

/* ───────── Claims ───────── */
export function ClaimsDemo() {
  const { country, company } = useDeck()
  const cats = [['✈️', 'Travel', 12500], ['🏥', 'Medical', 8400], ['🍽️', 'Meals', 3200], ['📱', 'Phone', 2500]] as const
  const [cat, setCat] = useState(0)
  const [receipt, setReceipt] = useState(false)
  const [stage, setStage] = useState(-1)
  const [list, setList] = useState<[string, number, string][]>([['Medical', 8400, 'Paid']])
  useEffect(() => { if (stage < 0 || stage >= 3) return; const t = setTimeout(() => setStage(s => s + 1), 900); return () => clearTimeout(t) }, [stage])
  useEffect(() => { if (stage === 3) setList(l => [[cats[cat][1], cats[cat][2], 'Scheduled for next payroll'], ...l]) }, [stage]) // eslint-disable-line react-hooks/exhaustive-deps
  const chain = ['Submitted', 'Line manager', 'Finance', 'Payroll']
  return (
    <Window title={`${company} · Claims · ${country.sampleNames[2]}`}>
      <div className="grid grid-cols-2 gap-5">
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-4 gap-2">{cats.map(([i, n], k) => <button key={n} disabled={stage >= 0} onClick={() => setCat(k)} className="card py-2.5 text-center" style={{ borderColor: cat === k ? 'var(--brand2)' : undefined, background: cat === k ? mix('var(--brand)', 16) : undefined }}><div className="text-[24px]">{i}</div><div className="text-[12.5px] font-semibold">{n}</div></button>)}</div>
          <div className="card p-3 flex justify-between items-center"><span>Amount</span><b className="text-[22px]">{money(country, cats[cat][2])}</b></div>
          <button disabled={stage >= 0} onClick={() => setReceipt(r => !r)} className="card p-3 text-left text-[14.5px]" style={{ borderStyle: 'dashed', borderColor: receipt ? 'var(--ok)' : undefined }}>{receipt ? '✓ receipt-0412.jpg attached' : '⬆ Attach receipt (tap)'}</button>
          {stage < 0 ? <Btn disabled={!receipt} onClick={() => setStage(0)}>Submit claim</Btn> : stage === 3 ? <Btn tone="ghost" onClick={() => { setStage(-1); setReceipt(false) }}>↺ New claim</Btn> : null}
        </div>
        <div className="flex flex-col gap-2">
          {chain.map((c, k) => <motion.div key={c} animate={{ opacity: stage >= k ? 1 : 0.35 }} className="card px-3.5 py-2.5 flex justify-between text-[14.5px]"><b>{c}</b><span style={{ color: stage > k ? 'var(--ok)' : 'var(--mute)' }}>{stage > k ? '✓' : stage === k ? 'Reviewing…' : '—'}</span></motion.div>)}
          <div className="text-[12px] uppercase tracking-wider mt-1" style={{ color: 'var(--mute)' }}>My claims</div>
          {list.slice(0, 3).map(([n, a, s], i) => <motion.div key={n + i + s} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between text-[14px]"><span>{n} · {money(country, a)}</span><Badge tone={s === 'Paid' ? 'ok' : 'warn'}>{s}</Badge></motion.div>)}
        </div>
      </div>
    </Window>
  )
}

/* ───────── Bulk upload ───────── */
export function BulkDemo() {
  const { country, company } = useDeck()
  const [step, setStep] = useState(0)            // 0 template · 1 uploading · 2 validate · 3 imported
  const [prog, setProg] = useState(0)
  const [fixed, setFixed] = useState<number[]>([])
  const rows: [string, string, string | null][] = [[country.sampleNames[0], 'EMP-0501', null], [country.sampleNames[1], 'EMP-0502', 'Date of birth is not a valid date'], [country.sampleNames[2], 'EMP-0503', null], [country.sampleNames[3], 'EMP-0501', 'Duplicate employee number'], [country.sampleNames[4], 'EMP-0505', null]]
  useEffect(() => { if (step !== 1) return; const t = setInterval(() => setProg(p => { if (p >= 100) { clearInterval(t); setStep(2); return 100 } return p + 10 }), 160); return () => clearInterval(t) }, [step])
  const errs = rows.map((r, i) => (r[2] ? i : -1)).filter(i => i >= 0), left = errs.filter(i => !fixed.includes(i)).length
  return (
    <Window title={`${company} · Bulk upload · Employees`}>
      <div className="flex items-center gap-2 mb-4">{['Template', 'Upload', 'Validate', 'Import'].map((s, k) => <div key={s} className="contents"><span className="rounded-full px-3.5 py-1 text-[14px] font-bold" style={{ background: k <= step ? 'var(--brand)' : 'var(--card)', color: k <= step ? '#fff' : 'var(--mute)', border: '1px solid var(--line)' }}>{k < step ? '✓' : k + 1} {s}</span>{k < 3 && <span style={{ color: 'var(--mute)' }}>—</span>}</div>)}</div>
      {step === 0 && <div className="card p-5 flex items-center gap-4"><span className="text-[40px]">📄</span><div className="flex-1"><b>Employees_template.xlsx</b><div className="text-[13.5px]" style={{ color: 'var(--mute)' }}>Basic and employment sections · drop-downs and formats built in</div></div><Btn onClick={() => { setProg(0); setStep(1) }}>Upload filled sheet ▶</Btn></div>}
      {step === 1 && <div className="card p-5"><div className="mb-2 text-[15px]">Uploading <b>employees_oct.xlsx</b>…</div><Bar pct={prog} color="var(--accent)" /></div>}
      {step >= 2 && (
        <div className="card overflow-hidden">
          {rows.map(([n, id, err], i) => (
            <div key={i} className="grid grid-cols-[1.4fr_1fr_2fr_.9fr] items-center px-4 py-2 text-[14.5px]" style={{ borderBottom: '1px solid var(--line)' }}><span>{n}</span><span style={{ color: 'var(--mute)' }}>{id}</span>
              <span style={{ color: err && !fixed.includes(i) ? 'var(--bad)' : 'var(--ok)' }}>{err ? (fixed.includes(i) ? '✓ fixed' : err) : '✓ valid'}</span>
              {err && !fixed.includes(i) ? <button onClick={() => setFixed(f => [...f, i])}><Badge tone="warn">Auto-fix</Badge></button> : <span />}</div>
          ))}
        </div>
      )}
      {step >= 2 && <div className="flex items-center justify-between mt-3"><Badge tone={step === 3 ? 'ok' : left ? 'warn' : 'ok'}>{step === 3 ? `✓ ${rows.length} employees imported` : left ? `${left} issue${left > 1 ? 's' : ''} to fix` : 'All rows valid'}</Badge>{step === 2 ? <Btn disabled={left > 0} tone="ok" onClick={() => setStep(3)}>Import {rows.length} employees</Btn> : <Btn tone="ghost" onClick={() => { setStep(0); setFixed([]) }}>↺ Again</Btn>}</div>}
    </Window>
  )
}
