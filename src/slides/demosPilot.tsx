import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useDeck, money } from '../engine/context'
import { Avatar, Badge, Bar, Counter, Window } from '../ui/primitives'

/* Clickable module screens (pilot). Layouts follow the real PeopleHub screens: Time & Attendance (geofence + work patterns),
   Payroll process → approve → bank file, Recruitment pipeline (drag & drop), Performance, Tasks and Leave. All data is fictional. */

const mix = (c: string, p: number) => `color-mix(in srgb, ${c} ${p}%, transparent)`
const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`

function Tabs({ tabs, active, onPick }: { tabs: string[]; active: number; onPick: (i: number) => void }) {
  return (
    <div className="flex gap-1.5 mb-4 p-1 rounded-xl w-fit" style={{ background: 'var(--bg)', border: '1px solid var(--line)' }}>
      {tabs.map((t, i) => (
        <button key={t} onClick={() => onPick(i)} className="px-4 py-1.5 rounded-lg text-[15px] font-bold transition-colors" style={i === active ? { background: 'var(--brand)', color: '#fff' } : { color: 'var(--mute)' }}>{t}</button>
      ))}
    </div>
  )
}
const Hint = ({ children }: { children: ReactNode }) => <div className="text-[13.5px] mt-3" style={{ color: 'var(--mute)' }}>👆 {children}</div>
const Btn = ({ children, onClick, tone = 'brand', disabled }: { children: ReactNode; onClick: () => void; tone?: 'brand' | 'ok' | 'ghost'; disabled?: boolean }) => (
  <button onClick={onClick} disabled={disabled} className="rounded-xl px-4 py-2 text-[15px] font-bold transition active:scale-95 disabled:opacity-40"
    style={tone === 'ghost' ? { background: 'var(--card)', border: '1px solid var(--line)' } : { background: tone === 'ok' ? 'var(--ok)' : 'var(--brand)', color: tone === 'ok' ? '#06281c' : '#fff' }}>{children}</button>
)

/* ───────── Time & Attendance ───────── */
export function AttendanceDemo() {
  const { country, industry, company } = useDeck()
  const [tab, setTab] = useState(0)
  const names = country.sampleNames
  type Punch = { who: string; ok: boolean; time: string; note: string; approved?: boolean; x: number; y: number }
  const [punches, setPunches] = useState<Punch[]>([
    { who: names[0], ok: true, time: '08:10', note: 'In zone', x: 200, y: 170 }, { who: names[1], ok: true, time: '08:14', note: 'In zone', x: 260, y: 230 },
    { who: names[2], ok: true, time: '08:18', note: 'In zone', x: 150, y: 240 }, { who: names[4], ok: false, time: '08:22', note: 'Outside zone · 410 m', x: 470, y: 120 },
  ])
  const svgRef = useRef<SVGSVGElement>(null)
  const place = (e: React.MouseEvent) => {
    const r = svgRef.current!.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * 560, y = ((e.clientY - r.top) / r.height) * 380
    const d = Math.hypot(x - 240, y - 190), ok = d <= 120, m = Math.round(d * 1.25)
    const who = names[(punches.length + 1) % names.length], t = 8 * 60 + 22 + punches.length * 3
    setPunches(p => [{ who, ok, time: hhmm(t), note: ok ? 'In zone' : `Outside zone · ${m} m`, x, y }, ...p].slice(0, 7))
  }
  const approve = (i: number) => setPunches(p => p.map((q, k) => (k === i ? { ...q, approved: true } : q)))

  // work pattern
  const [mode, setMode] = useState(0)
  const [grace, setGrace] = useState(10)
  const [first, setFirst] = useState(8 * 60 + 42)
  const modes = ['First in – last out', 'First in – next out']
  const shiftStart = 8 * 60 + 30, shiftEnd = 17 * 60 + 30
  const raw = [first, 12 * 60 + 30, 13 * 60 + 10, 17 * 60 + 45]
  const worked = mode === 0 ? raw[3] - raw[0] : raw[1] - raw[0] + (raw[3] - raw[2])
  const late = Math.max(0, first - shiftStart - grace), ot = Math.max(0, raw[3] - shiftEnd)
  const pct = (m: number) => `${((m - 6 * 60) / (16 * 60)) * 100}%`
  return (
    <Window title={`${company} · Time & Attendance · ${industry.site}`}>
      <Tabs tabs={['Geofence punches', 'Work pattern rules']} active={tab} onPick={setTab} />
      {tab === 0 ? (
        <div className="grid grid-cols-5 gap-5">
          <div className="col-span-3">
            <div className="rounded-2xl overflow-hidden relative" style={{ background: mix('var(--brand)', 10), height: 360 }}>
              <svg ref={svgRef} viewBox="0 0 560 380" className="w-full h-full cursor-crosshair" onClick={place}>
                {[...Array(8)].map((_, k) => <line key={k} x1={0} x2={560} y1={k * 54} y2={k * 54} stroke="var(--line)" />)}
                {[...Array(11)].map((_, k) => <line key={k} y1={0} y2={380} x1={k * 56} x2={k * 56} stroke="var(--line)" />)}
                <circle cx="240" cy="190" r="120" fill="var(--brand)" fillOpacity=".15" stroke="var(--brand2)" strokeWidth="2" strokeDasharray="8 6" className="flow-line" />
                <circle cx="240" cy="190" r="120" fill="none" stroke="var(--accent)" strokeWidth="2"><animate attributeName="r" values="30;130" dur="2.4s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.7;0" dur="2.4s" repeatCount="indefinite" /></circle>
                <text x="240" y="195" textAnchor="middle" fill="var(--ink)" fontSize="13" fontWeight="700">{industry.site.split(' · ')[0]}</text>
                {punches.map((p, k) => <motion.circle key={p.who + p.time} cx={p.x} cy={p.y} r="9" fill={p.ok || p.approved ? 'var(--ok)' : 'var(--bad)'} initial={{ r: 30, opacity: 0 }} animate={{ r: 9, opacity: 1 }} className={k === 0 ? 'pulse-dot' : ''} />)}
              </svg>
            </div>
            <Hint>Click anywhere on the map to simulate an employee punching in from their phone.</Hint>
          </div>
          <div className="col-span-2 flex flex-col gap-2">
            <AnimatePresence initial={false}>
              {punches.slice(0, 5).map((p, i) => (
                <motion.div key={p.who + p.time} layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="card p-2.5 flex items-center gap-3 text-[14.5px]">
                  <Avatar name={p.who} size={32} />
                  <div className="flex-1 min-w-0"><div className="font-semibold truncate">{p.who}</div><div className="text-[12px]" style={{ color: 'var(--mute)' }}>{p.time} · {p.note}</div></div>
                  {p.ok ? <Badge tone="ok">✓ Recorded</Badge> : p.approved ? <Badge tone="ok">✓ Approved</Badge> : <button onClick={() => approve(i)}><Badge tone="warn">Approve ▶</Badge></button>}
                </motion.div>
              ))}
            </AnimatePresence>
            <div className="text-[12.5px]" style={{ color: 'var(--mute)' }}>Also: biometric · time clock · manual entry (approved)</div>
          </div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="card p-3"><div className="text-[12px] uppercase tracking-wider mb-1.5" style={{ color: 'var(--mute)' }}>Pairing mode</div>
              <div className="flex flex-col gap-1.5">{modes.map((m, k) => <button key={m} onClick={() => setMode(k)} className="text-left rounded-lg px-3 py-1.5 text-[14px] font-semibold" style={mode === k ? { background: 'var(--brand)', color: '#fff' } : { background: 'var(--bg)', border: '1px solid var(--line)' }}>{m}</button>)}</div></div>
            <div className="card p-3"><div className="text-[12px] uppercase tracking-wider mb-1.5" style={{ color: 'var(--mute)' }}>Late grace</div>
              <div className="flex items-center gap-3"><Btn tone="ghost" onClick={() => setGrace(g => Math.max(0, g - 5))}>−</Btn><b className="text-[26px] tabular-nums">{grace} min</b><Btn tone="ghost" onClick={() => setGrace(g => Math.min(30, g + 5))}>＋</Btn></div></div>
            <div className="card p-3"><div className="text-[12px] uppercase tracking-wider mb-1.5" style={{ color: 'var(--mute)' }}>First punch · {hhmm(first)}</div>
              <input type="range" min={8 * 60} max={9 * 60 + 30} step={2} value={first} onChange={e => setFirst(Number(e.target.value))} className="w-full" />
              <div className="text-[12px]" style={{ color: 'var(--mute)' }}>Drag to arrive earlier or later</div></div>
          </div>
          <div className="card p-4">
            <div className="relative h-[84px]">
              <div className="absolute inset-x-0 top-9 h-3 rounded-full" style={{ background: 'var(--line)' }} />
              <div className="absolute top-9 h-3 rounded-full" style={{ left: pct(7 * 60 + 30), width: `calc(${pct(20 * 60)} - ${pct(7 * 60 + 30)})`, background: mix('var(--brand2)', 35) }} />
              <div className="absolute top-9 h-3 rounded-full" style={{ left: pct(shiftStart), width: `calc(${pct(shiftEnd)} - ${pct(shiftStart)})`, background: 'var(--brand)' }} />
              {[['Earliest entry', 7 * 60 + 30], ['Shift start', shiftStart], ['Shift end', shiftEnd], ['Latest exit', 20 * 60]].map(([l, m], k) => (
                <div key={l as string} className="absolute text-[11.5px] text-center -translate-x-1/2" style={{ left: pct(m as number), top: k % 2 ? 0 : 56, color: 'var(--mute)' }}><b style={{ color: 'var(--ink)' }}>{hhmm(m as number)}</b><br />{l}</div>
              ))}
              {raw.map((m, k) => <motion.i key={k} className="absolute top-[34px] w-[14px] h-[14px] rounded-full -translate-x-1/2" style={{ background: 'var(--accent)', boxShadow: '0 0 12px var(--accent)' }} animate={{ left: pct(m) }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} />)}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3 mt-3">
            {[['Worked', `${Math.floor(worked / 60)}h ${worked % 60}m`, 'ok'], ['Late', late ? `${late} min` : 'On time', late ? 'warn' : 'ok'], ['Overtime', ot ? `${ot} min` : '—', ot ? 'brand' : 'mute'], ['Punches', `${raw.length} → ${mode === 0 ? 1 : 2} pair${mode === 0 ? '' : 's'}`, 'mute']].map(([k, v, t]) => (
              <div key={k} className="card px-4 py-3"><div className="text-[12px] uppercase tracking-wider" style={{ color: 'var(--mute)' }}>{k}</div><div className="mt-1"><Badge tone={t as 'ok' | 'warn' | 'brand' | 'mute'}>{v}</Badge></div></div>
            ))}
          </div>
          <Hint>Change the pairing mode, grace or the first punch — worked hours, lateness and overtime recalculate instantly.</Hint>
        </div>
      )}
    </Window>
  )
}

/* ───────── Payroll ───────── */
export function PayrollDemo() {
  const { country, company } = useDeck()
  const emps = country.sampleNames.slice(0, 6).map((n, i) => ({ n, f: [1, 0.8, 1.3, 0.9, 1.1, 0.75][i] }))
  const emp = country.statutory.filter(s => s.who === 'employee'), er = country.statutory.filter(s => s.who === 'employer')
  const calc = (f: number) => {
    const gross = Math.round(country.salary * f), ded = emp.map(s => ({ label: s.label, amt: Math.round((gross * s.rate) / 100) })), tax = Math.round(country.taxSample * f)
    return { gross, ded, tax, net: gross - ded.reduce((a, b) => a + b.amt, 0) - tax }
  }
  const [step, setStep] = useState(0)          // 0 ready · 1 processing · 2 processed · 3 awaiting approval · 4 approved · 5 bank file
  const [prog, setProg] = useState(0)
  const [open, setOpen] = useState<number | null>(null)
  useEffect(() => {
    if (step !== 1) return
    const t = setInterval(() => setProg(p => { if (p >= emps.length) { clearInterval(t); setStep(2); return p } return p + 1 }), 420)
    return () => clearInterval(t)
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps
  const total = emps.reduce((a, e) => a + calc(e.f).net, 0)
  const action = [['▶ Run payroll', () => { setProg(0); setStep(1) }], ['Processing…', () => {}], ['Send for approval', () => setStep(3)], ['✔ Approve (Finance)', () => setStep(4)], ['Generate bank file', () => setStep(5)], ['↺ Start again', () => { setStep(0); setProg(0); setOpen(null) }]] as const
  const stages = ['Period', 'Process', 'Approve', 'Bank file']
  const stageAt = step === 0 ? 0 : step <= 2 ? 1 : step === 3 ? 2 : step === 4 ? 2 : 3
  return (
    <Window title={`${company} · Payroll · ${country.name} · Oct 2026`}>
      <div className="flex items-center gap-2 mb-4">
        {stages.map((s, k) => (
          <div key={s} className="contents"><div className="rounded-full px-4 py-1.5 text-[14px] font-bold flex items-center gap-2" style={{ background: k <= stageAt ? 'var(--brand)' : 'var(--card)', color: k <= stageAt ? '#fff' : 'var(--mute)', border: '1px solid var(--line)' }}>{k < stageAt || (k === stageAt && step >= 4 && k < 3) ? '✓' : k + 1} {s}</div>{k < 3 && <span style={{ color: 'var(--mute)' }}>—</span>}</div>
        ))}
        <div className="flex-1" /><Btn tone={step === 3 ? 'ok' : 'brand'} disabled={step === 1} onClick={action[step][1]}>{action[step][0]}</Btn>
      </div>
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 card overflow-hidden">
          <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] px-4 py-2 text-[12px] uppercase tracking-wider" style={{ color: 'var(--mute)', borderBottom: '1px solid var(--line)' }}><span>Employee</span><span className="text-right">Gross</span><span className="text-right">Deductions</span><span className="text-right">Net pay</span></div>
          {emps.map((e, k) => {
            const c = calc(e.f), done = step >= 2 || (step === 1 && prog > k), cur = step === 1 && prog === k
            return (
              <button key={e.n} onClick={() => done && setOpen(k)} className="grid grid-cols-[1.6fr_1fr_1fr_1fr] px-4 py-2.5 items-center w-full text-left text-[14.5px] transition-colors" style={{ borderBottom: '1px solid var(--line)', background: open === k ? mix('var(--brand)', 14) : 'transparent', opacity: done || cur ? 1 : 0.45 }}>
                <span className="flex items-center gap-2 min-w-0"><Avatar name={e.n} size={26} /><span className="truncate">{e.n}</span>{done && <span style={{ color: 'var(--ok)' }}>✓</span>}{cur && <span className="pulse-dot" style={{ color: 'var(--warn)' }}>●</span>}</span>
                <span className="text-right tabular-nums">{money(country, c.gross)}</span><span className="text-right tabular-nums" style={{ color: 'var(--mute)' }}>{done ? money(country, c.gross - c.net) : '—'}</span><span className="text-right tabular-nums font-bold">{done ? money(country, c.net) : '—'}</span>
              </button>
            )
          })}
          <div className="px-4 py-2.5 flex justify-between text-[14px]" style={{ background: mix('var(--brand)', 8) }}><span>Run total (net)</span><b className="tabular-nums">{step >= 2 ? money(country, total) : '—'}</b></div>
        </div>
        <div className="col-span-2 flex flex-col gap-3">
          <AnimatePresence mode="wait">
            {open !== null ? (
              <motion.div key={open} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="card p-4">
                <div className="flex items-center justify-between mb-2"><b className="text-[16px]">Payslip · {emps[open].n.split(' ')[0]}</b><button onClick={() => setOpen(null)} className="text-[13px]" style={{ color: 'var(--mute)' }}>✕</button></div>
                {(() => { const c = calc(emps[open].f); return (
                  <div className="text-[14px] flex flex-col gap-1">
                    <div className="flex justify-between"><span>Basic + allowances</span><b>{money(country, c.gross)}</b></div>
                    {c.ded.map(d => <div key={d.label} className="flex justify-between" style={{ color: 'var(--mute)' }}><span>{d.label}</span><span>− {money(country, d.amt)}</span></div>)}
                    <div className="flex justify-between" style={{ color: 'var(--mute)' }}><span>{country.taxName}</span><span>− {money(country, c.tax)}</span></div>
                    <div className="flex justify-between pt-1.5 mt-1 text-[16px]" style={{ borderTop: '1px solid var(--line)' }}><b>Net pay</b><b style={{ color: 'var(--ok)' }}>{money(country, c.net)}</b></div>
                    <div className="text-[12px] mt-1" style={{ color: 'var(--mute)' }}>Employer: {er.map(x => `${x.label} ${x.rate}%`).join(' · ')}</div>
                  </div>) })()}
              </motion.div>
            ) : <motion.div key="ph" className="card p-4 text-[14px]" style={{ color: 'var(--mute)' }}>{step < 2 ? 'Run payroll to compute every employee from attendance, allowances and statutory rules.' : 'Click any employee to open the payslip.'}</motion.div>}
          </AnimatePresence>
          <div className="card p-4 text-[14px] flex flex-col gap-2">
            <div className="flex items-center justify-between"><span>Status</span><Badge tone={step >= 4 ? 'ok' : step >= 2 ? 'warn' : 'mute'}>{['Draft', 'Processing…', 'Processed', 'Awaiting approval', 'Approved', 'Bank file ready'][step === 2 ? 2 : step]}</Badge></div>
            <Bar pct={step === 1 ? (prog / emps.length) * 100 : step === 0 ? 0 : 100} color="var(--ok)" />
            {step >= 5 && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg px-3 py-2 flex items-center gap-2" style={{ background: mix('var(--ok)', 14), border: '1px solid var(--ok)' }}>🏦 <b>SALARY_OCT2026.txt</b><span style={{ color: 'var(--mute)' }}>· {emps.length} credits · {money(country, total)}</span></motion.div>}
          </div>
        </div>
      </div>
    </Window>
  )
}

/* ───────── Recruitment ───────── */
export function RecruitmentDemo() {
  const { country, industry, company } = useDeck()
  const stages = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired']
  const names = country.sampleNames
  const [cards, setCards] = useState(() => names.slice(0, 7).map((n, i) => ({ n, s: [0, 0, 1, 1, 2, 3, 0][i], score: 62 + ((i * 7) % 30) })))
  const [sel, setSel] = useState<string | null>(null), [drag, setDrag] = useState<string | null>(null), [over, setOver] = useState<number | null>(null)
  const move = (n: string, d: number | 'x') => setCards(cs => cs.map(c => (c.n === n ? { ...c, s: d === 'x' ? -1 : Math.max(0, Math.min(4, c.s + d)) } : c)))
  const drop = (s: number) => { if (drag) setCards(cs => cs.map(c => (c.n === drag ? { ...c, s } : c))); setDrag(null); setOver(null) }
  const cur = cards.find(c => c.n === sel)
  const hired = cards.filter(c => c.s === 4)
  return (
    <Window title={`${company} · Recruitment · ${industry.roles[2]}`}>
      <div className="grid grid-cols-5 gap-2.5">
        {stages.map((st, k) => (
          <div key={st} onDragOver={e => { e.preventDefault(); setOver(k) }} onDragLeave={() => setOver(null)} onDrop={() => drop(k)} className="rounded-xl p-2 min-h-[250px] transition-colors" style={{ background: over === k ? mix('var(--brand)', 18) : 'var(--bg)', border: `1px dashed ${over === k ? 'var(--brand2)' : 'var(--line)'}` }}>
            <div className="flex justify-between text-[13px] mb-2 px-1" style={{ color: 'var(--mute)' }}><span>{st}</span><b style={{ color: 'var(--ink)' }}>{cards.filter(c => c.s === k).length}</b></div>
            <div className="flex flex-col gap-2">
              <AnimatePresence>
                {cards.filter(c => c.s === k).map(c => (
                  <motion.div key={c.n} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} draggable onDragStart={() => { setDrag(c.n); setSel(c.n) }} onClick={() => setSel(c.n)}
                    className="card px-2 py-2 flex items-center gap-1.5 text-[13.5px] cursor-grab active:cursor-grabbing" style={{ borderColor: sel === c.n ? 'var(--brand2)' : undefined, boxShadow: sel === c.n ? '0 0 20px -6px var(--brand2)' : undefined }}>
                    <Avatar name={c.n} size={24} /><span className="flex-1 min-w-0 truncate">{c.n.split(' ')[0]}</span><span className="text-[12px] font-bold tabular-nums" style={{ color: c.score > 80 ? 'var(--ok)' : 'var(--mute)' }}>{c.score}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
      <div className="card p-3.5 mt-3 flex items-center gap-3 min-h-[62px]">
        {cur ? (
          <>
            <Avatar name={cur.n} size={38} />
            <div className="flex-1"><div className="font-bold text-[16px]">{cur.n}</div><div className="text-[13px]" style={{ color: 'var(--mute)' }}>{industry.roles[2]} · fit score {cur.score} · {cur.s < 0 ? 'Rejected' : stages[cur.s]}</div></div>
            <Btn tone="ghost" onClick={() => move(cur.n, -1)} disabled={cur.s <= 0}>◀ Back</Btn><Btn onClick={() => move(cur.n, 1)} disabled={cur.s >= 4 || cur.s < 0}>{cur.s === 3 ? '🎉 Offer accepted' : 'Advance ▶'}</Btn>
          </>
        ) : <span className="text-[14px]" style={{ color: 'var(--mute)' }}>👆 Drag a candidate to another stage — or click one to advance them.</span>}
      </div>
      <AnimatePresence>
        {hired.length > 0 && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2.5 rounded-xl px-4 py-2.5 flex items-center justify-between text-[14.5px]" style={{ background: mix('var(--ok)', 14), border: '1px solid var(--ok)' }}><span>🎉 <b>{hired.map(h => h.n).join(', ')}</b> hired</span><Badge tone="ok">9 onboarding tasks created · employee record started</Badge></motion.div>}
      </AnimatePresence>
    </Window>
  )
}

/* ───────── Performance ───────── */
export function PerformanceDemo() {
  const { country, industry, company } = useDeck()
  const [tab, setTab] = useState(0)
  const names = country.sampleNames
  const [goals, setGoals] = useState([
    { t: `Cut ${industry.departments[0].toLowerCase()} reconciliation time by half`, kr: [['Automate punch import', true], ['Weekly exceptions review', false], ['Train line supervisors', false]] as [string, boolean][] },
    { t: 'Improve on-time delivery to 95%', kr: [['Fix top 3 bottlenecks', true], ['Daily stand-ups', true], ['Supplier scorecards', false]] as [string, boolean][] },
    { t: 'Develop two successors', kr: [['Skills assessment', false], ['Mentoring plan', false]] as [string, boolean][] },
  ])
  const toggle = (g: number, k: number) => setGoals(gs => gs.map((x, i) => (i === g ? { ...x, kr: x.kr.map(([n, d], j) => [n, j === k ? !d : d] as [string, boolean]) } : x)))
  const pctOf = (g: typeof goals[number]) => Math.round((g.kr.filter(k => k[1]).length / g.kr.length) * 100)
  const overall = Math.round(goals.reduce((a, g) => a + pctOf(g), 0) / goals.length)

  const stagesR = ['Self review', 'Manager review', 'Calibration', 'Sign-off']
  const [rs, setRs] = useState(0)
  const [rate, setRate] = useState<number[]>([4, 3, 4])
  const comps = ['Delivery', 'Teamwork', 'Leadership']
  const avg = rate.reduce((a, b) => a + b, 0) / rate.length

  const [feed, setFeed] = useState<{ to: string; v: string }[]>([{ to: names[2], v: 'Ownership' }])
  const [to, setTo] = useState(names[1]), [val, setVal] = useState('Teamwork')

  return (
    <Window title={`${company} · Performance`}>
      <Tabs tabs={['Dashboard', 'Goals & OKRs', 'Reviews', 'Feedback']} active={tab} onPick={setTab} />
      {tab === 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="card p-4 text-center"><div className="text-[13px] uppercase tracking-wider mb-2" style={{ color: 'var(--mute)' }}>Goal progress</div>
            <svg viewBox="0 0 120 120" className="w-[150px] mx-auto"><circle cx="60" cy="60" r="50" fill="none" stroke="var(--line)" strokeWidth="12" /><motion.circle cx="60" cy="60" r="50" fill="none" stroke="var(--ok)" strokeWidth="12" strokeLinecap="round" strokeDasharray={314} animate={{ strokeDashoffset: 314 - (314 * overall) / 100 }} transform="rotate(-90 60 60)" /><text x="60" y="68" textAnchor="middle" fill="var(--ink)" fontSize="26" fontWeight="800">{overall}%</text></svg>
            <div className="text-[13px] mt-1" style={{ color: 'var(--mute)' }}>Tick key results on the Goals tab</div></div>
          <div className="card p-4"><div className="text-[13px] uppercase tracking-wider mb-2" style={{ color: 'var(--mute)' }}>Review cycle</div><div className="flex flex-col gap-1.5">{stagesR.map((s, k) => <div key={s} className="flex items-center gap-2 text-[14.5px]"><span style={{ color: k < rs ? 'var(--ok)' : k === rs ? 'var(--warn)' : 'var(--mute)' }}>{k < rs ? '✓' : k === rs ? '●' : '○'}</span>{s}</div>)}</div></div>
          <div className="card p-4"><div className="text-[13px] uppercase tracking-wider mb-2" style={{ color: 'var(--mute)' }}>Recognition this month</div><div className="text-[40px] font-extrabold grad-text"><Counter to={feed.length + 11} /></div><div className="text-[13px]" style={{ color: 'var(--mute)' }}>kudos given across teams</div></div>
        </div>
      )}
      {tab === 1 && (
        <div className="flex flex-col gap-2.5">
          {goals.map((g, gi) => (
            <div key={g.t} className="card p-3.5">
              <div className="flex items-center justify-between mb-1.5"><b className="text-[15.5px]">{g.t}</b><Badge tone={pctOf(g) === 100 ? 'ok' : 'brand'}>{pctOf(g)}%</Badge></div>
              <Bar pct={pctOf(g)} color={pctOf(g) === 100 ? 'var(--ok)' : 'var(--brand2)'} />
              <div className="flex flex-wrap gap-2 mt-2.5">{g.kr.map(([n, d], k) => <button key={n} onClick={() => toggle(gi, k)} className="rounded-lg px-3 py-1 text-[13.5px] flex items-center gap-1.5" style={{ background: d ? mix('var(--ok)', 16) : 'var(--bg)', border: `1px solid ${d ? 'var(--ok)' : 'var(--line)'}` }}>{d ? '☑' : '☐'} {n}</button>)}</div>
            </div>
          ))}
          <Hint>Tick key results — progress bars and the dashboard ring update live.</Hint>
        </div>
      )}
      {tab === 2 && (
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-3 flex flex-col gap-2.5">
            {comps.map((c, i) => (
              <div key={c} className="card p-3 flex items-center justify-between"><b>{c}</b><div className="flex gap-1">{[1, 2, 3, 4, 5].map(n => <button key={n} onClick={() => setRate(r => r.map((x, j) => (j === i ? n : x)))} className="text-[26px] leading-none transition-transform hover:scale-125" style={{ color: n <= rate[i] ? 'var(--warn)' : 'var(--line)' }}>★</button>)}</div></div>
            ))}
            <div className="text-[14px]" style={{ color: 'var(--mute)' }}>Overall rating <b style={{ color: 'var(--ink)' }}>{avg.toFixed(1)}</b> / 5</div>
          </div>
          <div className="col-span-2 flex flex-col gap-2">
            {stagesR.map((s, k) => <div key={s} className="rounded-lg px-3 py-2 text-[14px] flex items-center gap-2" style={{ background: k === rs ? mix('var(--brand)', 22) : 'var(--card)', border: `1px solid ${k === rs ? 'var(--brand2)' : 'var(--line)'}`, opacity: k > rs ? 0.5 : 1 }}>{k < rs ? '✓' : k + 1} {s}</div>)}
            <Btn tone={rs >= 3 ? 'ok' : 'brand'} onClick={() => setRs(s => (s >= 3 ? 0 : s + 1))}>{rs >= 3 ? '↺ Restart cycle' : rs === 2 ? 'Finish calibration ▶' : 'Submit & continue ▶'}</Btn>
          </div>
        </div>
      )}
      {tab === 3 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="card p-4"><div className="text-[13px] uppercase tracking-wider mb-2" style={{ color: 'var(--mute)' }}>Give feedback</div>
            <div className="flex flex-wrap gap-1.5 mb-3">{names.slice(1, 6).map(n => <button key={n} onClick={() => setTo(n)} className="rounded-full px-3 py-1 text-[13.5px]" style={{ background: to === n ? 'var(--brand)' : 'var(--bg)', color: to === n ? '#fff' : 'var(--ink)', border: '1px solid var(--line)' }}>{n.split(' ')[0]}</button>)}</div>
            <div className="flex flex-wrap gap-1.5 mb-3">{['Teamwork', 'Ownership', 'Quality', 'Initiative'].map(v => <button key={v} onClick={() => setVal(v)} className="rounded-full px-3 py-1 text-[13.5px]" style={{ background: val === v ? 'var(--accent)' : 'var(--bg)', color: val === v ? '#06281c' : 'var(--ink)', border: '1px solid var(--line)' }}>{v}</button>)}</div>
            <Btn onClick={() => setFeed(f => [{ to, v: val }, ...f].slice(0, 5))}>Send kudos ✨</Btn></div>
          <div className="flex flex-col gap-2"><AnimatePresence initial={false}>{feed.map((f, i) => <motion.div key={f.to + f.v + i} layout initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="card p-3 flex items-center gap-2.5 text-[14.5px]"><Avatar name={f.to} size={30} /><span><b>{f.to.split(' ')[0]}</b> recognised for <b style={{ color: 'var(--accent)' }}>{f.v}</b></span></motion.div>)}</AnimatePresence></div>
        </div>
      )}
    </Window>
  )
}

/* ───────── Tasks (onboarding) ───────── */
export function TasksDemo() {
  const { country, industry, company } = useDeck()
  const owners = country.sampleNames
  type T = { t: string; col: number; who: number }
  const [tasks, setTasks] = useState<T[]>(() => [...industry.tasks.todo.map(t => [t, 0] as const), ...industry.tasks.doing.map(t => [t, 1] as const), ...industry.tasks.done.map(t => [t, 2] as const)].map(([t, col], i) => ({ t, col, who: (i + 1) % 6 })))
  const [txt, setTxt] = useState('')
  const adv = (i: number) => setTasks(ts => ts.map((x, k) => (k === i ? { ...x, col: (x.col + 1) % 3 } : x)))
  const done = tasks.filter(t => t.col === 2).length, pct = Math.round((done / tasks.length) * 100)
  const cols: [string, string][] = [['To do', 'var(--mute)'], ['In progress', 'var(--warn)'], ['Done', 'var(--ok)']]
  return (
    <Window title={`${company} · Onboarding · ${owners[3]}`}>
      <div className="flex items-center gap-4 mb-3">
        <div className="flex-1"><div className="flex justify-between text-[13.5px] mb-1" style={{ color: 'var(--mute)' }}><span>Onboarding progress</span><b style={{ color: 'var(--ink)' }}>{done} of {tasks.length} done</b></div><Bar pct={pct} color="var(--ok)" /></div>
        {pct === 100 ? <Badge tone="ok">✓ Ready for day one</Badge> : <Badge tone="warn">{tasks.length - done} open</Badge>}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {cols.map(([c, col], ci) => (
          <div key={c} className="rounded-xl p-2 min-h-[240px]" style={{ background: 'var(--bg)', border: '1px solid var(--line)' }}>
            <div className="text-[13.5px] font-bold mb-2 px-1" style={{ color: col }}>● {c} <span style={{ color: 'var(--mute)' }}>· {tasks.filter(t => t.col === ci).length}</span></div>
            <div className="flex flex-col gap-2">
              <AnimatePresence>
                {tasks.map((t, i) => t.col === ci && (
                  <motion.button key={t.t} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} onClick={() => adv(i)} className="card p-2.5 text-left text-[13.5px] hover:brightness-125">
                    {t.t}<div className="flex justify-between items-center mt-1.5"><Badge tone={ci === 2 ? 'ok' : ci === 1 ? 'warn' : 'mute'}>{ci === 2 ? 'Done' : 'Due Fri'}</Badge><Avatar name={owners[t.who]} size={22} /></div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-3"><input value={txt} onChange={e => setTxt(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && txt.trim()) { setTasks(ts => [...ts, { t: txt.trim(), col: 0, who: 2 }]); setTxt('') } }} placeholder="Add a task and press Enter…" className="flex-1 rounded-xl px-4 py-2 text-[14.5px] outline-none" style={{ background: 'var(--card)', border: '1px solid var(--line)', color: 'var(--ink)' }} /><Btn onClick={() => { if (txt.trim()) { setTasks(ts => [...ts, { t: txt.trim(), col: 0, who: 2 }]); setTxt('') } }}>＋ Add</Btn></div>
      <Hint>Click a task to move it along: To do → In progress → Done.</Hint>
    </Window>
  )
}

/* ───────── Leave ───────── */
export function LeaveDemo({ start = 0 }: { start?: number }) {
  const { country, company } = useDeck()
  const [tab, setTab] = useState(start)
  const types = country.leaveTypes as unknown as [string, number, number][]
  const [bal, setBal] = useState(types.map(t => t[1]))
  const [ty, setTy] = useState(0)
  const [range, setRange] = useState<[number, number] | null>(null)
  const [stage, setStage] = useState(-1)         // -1 not submitted · 0..3 approval chain
  const [pol, setPol] = useState(0)
  const days = Array.from({ length: 14 }, (_, i) => i + 1)                      // next two weeks, Mon-first
  const weekend = (d: number) => d % 7 === 6 || d % 7 === 0
  const picked = range ? days.filter(d => d >= range[0] && d <= range[1] && !weekend(d)).length : 0
  useEffect(() => { if (stage < 0 || stage >= 4) return; const t = setTimeout(() => setStage(s => s + 1), 1000); return () => clearTimeout(t) }, [stage])
  useEffect(() => { if (stage === 4) setBal(b => b.map((x, i) => (i === ty ? Math.max(0, x - picked) : x))) }, [stage]) // eslint-disable-line react-hooks/exhaustive-deps
  const click = (d: number) => { if (stage >= 0) return; setRange(r => (!r || r[0] !== r[1] ? [d, d] : [Math.min(r[0], d), Math.max(r[0], d)])) }
  const chain = [['Applied', country.sampleNames[2]], ['Line manager', 'Approved'], ['HR', 'Approved'], ['Payroll & calendar', 'Updated']]
  const rules = ['Granted each January', 'Pro-rated for joiners', 'Medical certificate after 2 days', 'Carry forward up to 5 days']
  return (
    <Window title={`${company} · Leave`}>
      <Tabs tabs={['Apply', 'Entitlements & policy']} active={tab} onPick={setTab} />
      {tab === 0 ? (
        <div className="grid grid-cols-5 gap-5">
          <div className="col-span-3">
            <div className="flex gap-2 mb-3 flex-wrap">{types.map(([n], i) => <button key={n} onClick={() => stage < 0 && setTy(i)} className="rounded-xl px-3.5 py-1.5 text-[14.5px] font-bold" style={ty === i ? { background: 'var(--brand)', color: '#fff' } : { background: 'var(--card)', border: '1px solid var(--line)' }}>{n} · {bal[i]}d</button>)}</div>
            <div className="grid grid-cols-7 gap-1.5">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <div key={d} className="text-[12px] text-center" style={{ color: 'var(--mute)' }}>{d}</div>)}
              {days.map(d => { const inR = range && d >= range[0] && d <= range[1]; return (
                <button key={d} onClick={() => click(d)} className="rounded-lg py-2.5 text-[15px] font-semibold transition" style={{ background: inR ? (weekend(d) ? mix('var(--brand)', 25) : 'var(--brand)') : weekend(d) ? 'var(--bg)' : 'var(--card)', color: inR && !weekend(d) ? '#fff' : weekend(d) ? 'var(--mute)' : 'var(--ink)', border: '1px solid var(--line)' }}>{d + 25 > 31 ? d - 6 : d + 25}</button>) })}
            </div>
            <Hint>Click a start day, then an end day. Weekends are not counted.</Hint>
          </div>
          <div className="col-span-2 flex flex-col gap-2.5">
            <div className="card p-3 text-[14.5px]"><div className="flex justify-between"><span>{types[ty][0]}</span><b>{picked} day{picked === 1 ? '' : 's'}</b></div><div className="text-[12.5px]" style={{ color: 'var(--mute)' }}>Balance after: {Math.max(0, bal[ty] - (stage < 4 ? picked : 0))} days</div></div>
            <Btn disabled={!picked || stage >= 0} onClick={() => setStage(0)}>Submit request</Btn>
            {stage >= 0 && chain.map(([a, b], k) => (
              <motion.div key={a} initial={{ opacity: 0, x: 20 }} animate={{ opacity: stage >= k ? 1 : 0.35, x: 0 }} className="card p-2.5 flex items-center justify-between text-[14px]"><span className="font-semibold">{a}</span><span style={{ color: stage > k || (k === 0) ? 'var(--ok)' : 'var(--warn)' }}>{k === 0 ? b : stage > k ? '✓ ' + b : stage === k ? 'Reviewing…' : 'Waiting'}</span></motion.div>
            ))}
            {stage === 4 && <Btn tone="ghost" onClick={() => { setStage(-1); setRange(null) }}>↺ New request</Btn>}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2.5">
            {types.map(([n, a, t], i) => (
              <button key={n} onClick={() => setPol(i)} className="card p-3 text-left" style={{ borderColor: pol === i ? 'var(--brand2)' : undefined }}>
                <div className="flex justify-between text-[14.5px]"><b>{n}</b><span style={{ color: 'var(--mute)' }}>{bal[i]} left · {t - a} taken · {t} / yr</span></div><div className="mt-1.5"><Bar pct={(bal[i] / t) * 100} color="var(--ok)" /></div>
              </button>
            ))}
          </div>
          <div className="card p-4"><div className="font-bold text-[17px] mb-2">{types[pol][0]} policy</div><AnimatePresence mode="wait"><motion.ul key={pol} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2 text-[14.5px]">{rules.map(r => <li key={r} className="flex gap-2"><span style={{ color: 'var(--ok)' }}>✓</span>{r}</li>)}</motion.ul></AnimatePresence></div>
        </div>
      )}
    </Window>
  )
}
