import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { poss, useDeck } from '../engine/context'
import { Avatar, Badge, Bar, Counter, Window } from '../ui/primitives'

/* Clickable module screens, phase 3: employee experience and intelligence. All data is fictional. */

const mix = (c: string, p: number) => `color-mix(in srgb, ${c} ${p}%, transparent)`
const Hint = ({ children }: { children: ReactNode }) => <div className="text-[13.5px] mt-3" style={{ color: 'var(--mute)' }}>👆 {children}</div>
const Btn = ({ children, onClick, tone = 'brand', disabled }: { children: ReactNode; onClick: () => void; tone?: 'brand' | 'ok' | 'ghost'; disabled?: boolean }) => (
  <button onClick={onClick} disabled={disabled} className="rounded-xl px-4 py-2 text-[15px] font-bold transition active:scale-95 disabled:opacity-40"
    style={tone === 'ghost' ? { background: 'var(--card)', border: '1px solid var(--line)' } : { background: tone === 'ok' ? 'var(--ok)' : 'var(--brand)', color: tone === 'ok' ? '#06281c' : '#fff' }}>{children}</button>
)
const Chips = ({ items, on, onPick }: { items: string[]; on: number; onPick: (i: number) => void }) => (
  <div className="flex gap-1.5 flex-wrap">{items.map((t, i) => <button key={t} onClick={() => onPick(i)} className="rounded-full px-3.5 py-1 text-[14px] font-semibold" style={on === i ? { background: 'var(--brand)', color: '#fff' } : { background: 'var(--card)', border: '1px solid var(--line)' }}>{t}</button>)}</div>
)

/* ───────── Engagement: answer the pulse survey ───────── */
export function EngagementDemo() {
  const { industry, company } = useDeck()
  const [score, setScore] = useState(industry.survey.map(([, p]) => p as number))
  const [voted, setVoted] = useState<number[]>([])
  const enps = Math.round(score.reduce((a, b) => a + b, 0) / score.length - 40)
  return (
    <Window title={`${company} · Pulse survey`}>
      <div className="grid grid-cols-3 gap-4 mb-3">
        <div className="card p-4 text-center"><div className="text-[14px]" style={{ color: 'var(--mute)' }}>eNPS</div><motion.div key={enps} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className="text-[54px] font-extrabold grad-text">{enps >= 0 ? '+' : ''}{enps}</motion.div><Badge tone="ok">{voted.length} responses today</Badge></div>
        <div className="col-span-2 card p-4"><div className="text-[12px] uppercase tracking-wider mb-2" style={{ color: 'var(--mute)' }}>Sentiment trend</div>
          <svg viewBox="0 0 300 80" className="w-full"><motion.polyline fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" animate={{ points: [58, 61, 60, 66, 70, 74, Math.round(score.reduce((a, b) => a + b, 0) / score.length)].map((v, i) => `${i * 48 + 6},${80 - (v - 40) * 1.3}`).join(' ') }} /></svg></div>
      </div>
      <div className="flex flex-col gap-2">
        {industry.survey.map(([q], k) => (
          <div key={q as string} className="card px-3.5 py-2"><div className="flex justify-between items-center text-[14.5px] mb-1"><span>{q}</span><b>{score[k]}%</b></div>
            <div className="flex items-center gap-3"><div className="flex-1"><Bar pct={score[k]} /></div>
              {voted.includes(k) ? <Badge tone="ok">✓ thanks</Badge> : <div className="flex gap-1"><button onClick={() => { setScore(s => s.map((v, i) => (i === k ? Math.min(99, v + 3) : v))); setVoted(v => [...v, k]) }} className="text-[20px] hover:scale-125 transition">👍</button><button onClick={() => { setScore(s => s.map((v, i) => (i === k ? Math.max(1, v - 3) : v))); setVoted(v => [...v, k]) }} className="text-[20px] hover:scale-125 transition">👎</button></div>}</div></div>
        ))}
      </div>
      <Hint>Answer each statement — scores and eNPS move live.</Hint>
    </Window>
  )
}

/* ───────── Employee self-service ───────── */
export function EssDemo() {
  const { country, company, logo } = useDeck()
  const [tile, setTile] = useState(0)
  const [apps, setApps] = useState(['Leave · 2 days', 'Shift change', 'Salary advance'])
  const [letter, setLetter] = useState(false)
  const [phone, setPhone] = useState(country.phoneExample)
  const tiles = [['🌴', 'Apply leave'], ['💳', 'My payslips'], ['🕒', 'Attendance'], ['👤', 'My profile'], ['📄', 'Letters'], ['✅', `Approvals (${apps.length})`]]
  const net = Math.round(country.salary * 0.91)
  const panel: ReactNode[] = [
    <div key="l" className="flex flex-col gap-2">{(country.leaveTypes as unknown as [string, number, number][]).map(([n, a, t]) => <div key={n}><div className="flex justify-between text-[14.5px] mb-1"><span>{n}</span><b>{a} / {t} days</b></div><Bar pct={(a / t) * 100} color="var(--ok)" /></div>)}<Btn onClick={() => setTile(5)}>Request leave ▶</Btn></div>,
    <div key="p" className="flex flex-col gap-2">{['Oct', 'Sep', 'Aug'].map((m, i) => <div key={m} className="card px-3 py-2 flex justify-between text-[14.5px]"><span>{m} 2026 payslip</span><b>{country.currency} {(net - i * 450).toLocaleString()}</b></div>)}</div>,
    <div key="a" className="flex flex-col gap-2 text-[14.5px]">{[['In', '08:12', 'Head office'], ['Out', '17:36', 'Head office']].map(([a, b, c]) => <div key={a} className="card px-3 py-2 flex justify-between"><span>{a} · {b}</span><Badge tone="ok">{c}</Badge></div>)}<div style={{ color: 'var(--mute)' }}>This month: 21 days present · 2 late</div></div>,
    <div key="u" className="flex flex-col gap-2"><div className="text-[12px] uppercase tracking-wider" style={{ color: 'var(--mute)' }}>Mobile number (editable)</div><input value={phone} onChange={e => setPhone(e.target.value)} className="rounded-lg px-3 py-2 text-[15px] outline-none" style={{ background: 'var(--bg)', border: '1.5px solid var(--line)', color: 'var(--ink)' }} /><div className="text-[12.5px]" style={{ color: 'var(--mute)' }}>Changes go to HR for approval · full change history kept</div></div>,
    <div key="le" className="flex flex-col gap-2 text-[14.5px]"><div className="card px-3 py-2">Employment confirmation letter</div><Btn tone={letter ? 'ok' : 'brand'} onClick={() => setLetter(true)}>{letter ? '✓ Ready — download PDF' : 'Request letter ▶'}</Btn></div>,
    <div key="ap" className="flex flex-col gap-2">{apps.length ? apps.map(a => <div key={a} className="card px-3 py-2 flex items-center gap-2 text-[14.5px]"><span className="flex-1">{a}</span><button onClick={() => setApps(x => x.filter(y => y !== a))}><Badge tone="ok">Approve</Badge></button></div>) : <div className="text-[14.5px]" style={{ color: 'var(--ok)' }}>✓ All caught up — nothing waiting.</div>}</div>,
  ]
  return (
    <Window title={`${company} · Employee portal`}>
      <div className="flex items-center justify-between mb-3"><div className="text-[22px] font-bold">Good morning, {country.sampleNames[1].split(' ')[0]} 👋</div>{logo && <img src={logo} alt="" className="h-8 max-w-[110px] object-contain rounded bg-white px-1" />}</div>
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-2 grid grid-cols-2 gap-2.5 content-start">{tiles.map(([i, t], k) => <button key={t} onClick={() => setTile(k)} className="card p-3 text-left" style={{ borderColor: tile === k ? 'var(--brand2)' : undefined, background: tile === k ? mix('var(--brand)', 16) : undefined }}><div className="text-[26px]">{i}</div><div className="text-[14px] font-semibold">{t}</div></button>)}</div>
        <div className="col-span-3 card p-4 min-h-[250px]"><div className="font-bold text-[17px] mb-2.5">{tiles[tile][0]} {tiles[tile][1]}</div><AnimatePresence mode="wait"><motion.div key={tile} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{panel[tile]}</motion.div></AnimatePresence></div>
      </div>
    </Window>
  )
}

/* ───────── Grievance: advance the case ───────── */
export function GrievanceDemo() {
  const { industry, company } = useDeck()
  const stages = ['Submitted (anonymous)', 'Acknowledged · 24h', 'Investigation', 'Escalated to HR Head', 'Resolved']
  const [s, setS] = useState(0)
  return (
    <Window title={`${company} · Grievance · Case GR-0087`}>
      <div className="flex gap-2 mb-4 items-center"><Badge tone="warn">{industry.grievance}</Badge><Badge>Anonymous</Badge><Badge tone={s === 4 ? 'ok' : 'bad'}>{s === 4 ? 'Resolved' : 'SLA running'}</Badge><div className="flex-1" /><Btn tone={s === 4 ? 'ghost' : 'brand'} onClick={() => setS(x => (x === 4 ? 0 : x + 1))}>{s === 4 ? '↺ New case' : s === 0 ? 'Acknowledge ▶' : s === 3 ? 'Resolve ▶' : 'Next step ▶'}</Btn></div>
      <div className="flex flex-col gap-2">
        {stages.map((t, k) => (
          <button key={t} onClick={() => setS(k)} className="card px-4 py-2.5 flex items-center gap-3 text-[16.5px] text-left" style={{ opacity: s >= k ? 1 : 0.35, borderColor: s === k ? 'var(--brand2)' : undefined }}>
            <span className="w-6 h-6 rounded-full grid place-items-center text-[13px]" style={{ background: s > k ? 'var(--ok)' : s === k ? 'var(--warn)' : 'var(--line)', color: '#06281c' }}>{s > k ? '✓' : ''}</span>{t}
            {s === k && k < 4 && <span className="ml-auto text-[13px]" style={{ color: 'var(--warn)' }}>● in progress</span>}
          </button>
        ))}
      </div>
      <Hint>Click “Next step” (or any stage) to move the case along the escalation path.</Hint>
    </Window>
  )
}

/* ───────── Service desk ───────── */
export function TicketsDemo() {
  const { industry, company, country } = useDeck()
  type T = { q: string; n: string; p: string; sla: number; st: 'Open' | 'In progress' | 'Resolved'; who: number }
  const [t, setT] = useState<T[]>(industry.tickets.map(([q, n, p, sla], i) => ({ q, n, p, sla, st: 'Open', who: i })))
  const [f, setF] = useState(0), [sel, setSel] = useState<number | null>(null)
  const queues = ['All', ...[...new Set(industry.tickets.map(x => x[0]))]]
  const shown = t.map((x, i) => [x, i] as const).filter(([x]) => f === 0 || x.q === queues[f])
  const open = t.filter(x => x.st !== 'Resolved').length
  const set = (i: number, st: T['st']) => setT(ts => ts.map((x, k) => (k === i ? { ...x, st, sla: st === 'Resolved' ? x.sla : x.sla } : x)))
  return (
    <Window title={`${company} · Service desk queue`}>
      <div className="flex items-center justify-between mb-3"><Chips items={queues} on={f} onPick={setF} /><Badge tone={open ? 'warn' : 'ok'}>{open} open</Badge></div>
      <div className="flex flex-col gap-2">
        {shown.map(([x, i]) => (
          <div key={x.n}>
            <button onClick={() => setSel(sel === i ? null : i)} className="card w-full p-3 grid grid-cols-12 items-center gap-3 text-[15px] text-left" style={{ opacity: x.st === 'Resolved' ? 0.55 : 1, borderColor: sel === i ? 'var(--brand2)' : undefined }}>
              <span className="col-span-1"><Badge tone={x.q === 'IT' ? 'brand' : x.q === 'HR' ? 'ok' : 'warn'}>{x.q}</Badge></span><span className="col-span-5">{x.n}</span><span className="col-span-2"><Badge tone={x.p === 'High' ? 'bad' : 'mute'}>{x.p}</Badge></span>
              <span className="col-span-2 text-[13px]" style={{ color: x.st === 'Resolved' ? 'var(--ok)' : 'var(--mute)' }}>{x.st === 'Resolved' ? '✓ Resolved' : x.st}</span><span className="col-span-2"><Bar pct={x.sla} color={x.sla > 80 ? 'var(--bad)' : x.sla > 60 ? 'var(--warn)' : 'var(--ok)'} /></span>
            </button>
            <AnimatePresence>{sel === i && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><div className="card mt-1 px-4 py-2.5 flex items-center gap-3 text-[14px]"><Avatar name={country.sampleNames[x.who % 8]} size={28} /><span className="flex-1">Assigned to <b>{country.sampleNames[x.who % 8]}</b> · SLA {x.sla}% used</span>{x.st === 'Open' && <Btn tone="ghost" onClick={() => set(i, 'In progress')}>Start</Btn>}{x.st !== 'Resolved' && <Btn tone="ok" onClick={() => set(i, 'Resolved')}>Resolve ✓</Btn>}</div></motion.div>}</AnimatePresence>
          </div>
        ))}
      </div>
    </Window>
  )
}

/* ───────── Assets ───────── */
export function AssetsDemo() {
  const { country, industry, company } = useDeck()
  const [st, setSt] = useState<string[]>(industry.assets.map((_, k) => (k === 3 ? 'In maintenance' : 'Assigned')))
  const cycle = ['Assigned', 'In maintenance', 'Returned']
  const rows = industry.assets
  const returned = st.filter(s => s === 'Returned').length
  return (
    <Window title={`${company} · Assets · ${country.sampleNames[5]}`}>
      <div className="flex flex-col gap-2">
        {rows.map(([i, n], k) => (
          <button key={n} onClick={() => setSt(s => s.map((v, j) => (j === k ? cycle[(cycle.indexOf(v) + 1) % 3] : v)))} className="card p-3.5 flex items-center gap-4 text-[16.5px] text-left">
            <span className="text-[26px]">{i}</span><span className="flex-1">{n}</span><motion.span key={st[k]} initial={{ scale: 0.8 }} animate={{ scale: 1 }}><Badge tone={st[k] === 'Assigned' ? 'ok' : st[k] === 'Returned' ? 'brand' : 'warn'}>{st[k]}</Badge></motion.span>
          </button>
        ))}
      </div>
      <div className="card p-3 mt-3 text-[14.5px] flex justify-between items-center"><span>Exit clearance: <b>{returned}</b> of {rows.length} assets returned</span><Badge tone={returned === rows.length ? 'ok' : 'mute'}>{returned === rows.length ? '✓ Clearance complete' : 'Linked to Termination'}</Badge></div>
      <Hint>Click an asset to cycle it: Assigned → In maintenance → Returned.</Hint>
    </Window>
  )
}

/* ───────── Knowledge base: type to search ───────── */
export function KbDemo() {
  const { industry, company } = useDeck()
  const [q, setQ] = useState(industry.kb.query)
  const [ack, setAck] = useState<string[]>([])
  const words = q.toLowerCase().split(/\s+/).filter(Boolean)
  const hits = industry.kb.results.filter(([a, b]) => !words.length || words.some(w => (a + ' ' + b).toLowerCase().includes(w)))
  return (
    <Window title={`${company} · Knowledge Base`}>
      <div className="card px-4 py-2.5 mb-3 flex items-center gap-2 text-[18px]">🔍<input value={q} onChange={e => setQ(e.target.value)} className="flex-1 bg-transparent outline-none" style={{ color: 'var(--ink)' }} placeholder="Search policies and guides…" />{q && <button onClick={() => setQ('')} style={{ color: 'var(--mute)' }}>✕</button>}</div>
      <div className="flex flex-col gap-2">
        {hits.length ? hits.map(([a, b, c]) => (
          <motion.div layout key={a} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-3.5 flex justify-between items-center gap-3"><div><div className="font-bold text-[17px]">{a}</div><div className="text-[13px]" style={{ color: 'var(--mute)' }}>{b}</div></div>
            <div className="flex gap-2 items-center"><Badge tone="ok">{c}</Badge>{ack.includes(a) ? <Badge tone="ok">✓ Acknowledged</Badge> : <Btn tone="ghost" onClick={() => setAck(x => [...x, a])}>Acknowledge</Btn>}</div></motion.div>
        )) : <div className="text-[15px] p-4" style={{ color: 'var(--mute)' }}>No matching document — try “leave” or “policy”.</div>}
      </div>
      <Hint>Type to search live; acknowledge a policy to log your read receipt.</Hint>
    </Window>
  )
}

/* ───────── Chat & AI assistant ───────── */
export function ChatDemo() {
  const { country, industry, company } = useDeck()
  const lt = country.leaveTypes as unknown as [string, number, number][]
  const [log, setLog] = useState<{ me: boolean; t: string }[]>([{ me: false, t: `Hi ${country.sampleNames[1].split(' ')[0]}, ${industry.chatTip}` }])
  const [typing, setTyping] = useState(false)
  const [txt, setTxt] = useState('')
  const answers: Record<string, string> = {
    'Leave balance': `You have ${lt[0][1]} of ${lt[0][2]} ${lt[0][0].toLowerCase()} leave days left. Want me to apply?`,
    'Payslip date': 'Payslips are published on the last working day — October’s is ready from 29 Oct.',
    'Apply 3 days leave': 'Done! 3 days from Monday sent to your manager. I’ll notify you when it’s approved.',
    'Holiday this month': `Next holiday: ${country.holidaysLabel.split(' ')[0]} — Friday.`,
  }
  const ask = (q: string) => {
    if (!q.trim() || typing) return
    setLog(l => [...l, { me: true, t: q }]); setTxt(''); setTyping(true)
    setTimeout(() => { setLog(l => [...l, { me: false, t: answers[q] ?? 'I can check leave, payslips, holidays and policies — or raise a ticket for HR.' }]); setTyping(false) }, 900)
  }
  return (
    <Window title={`${company} · HR Assistant`}>
      <div className="card p-3 min-h-[260px] flex flex-col gap-2 mb-3" style={{ background: 'var(--bg)' }}>
        {log.map((m, i) => <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-[78%] rounded-2xl px-3.5 py-2 text-[15px]" style={m.me ? { alignSelf: 'flex-end', background: 'var(--brand)', color: '#fff' } : { alignSelf: 'flex-start', background: 'var(--card)', border: '1px solid var(--line)' }}>{!m.me && i > 0 && <span className="text-[11px] mr-1.5" style={{ color: 'var(--accent)' }}>✦ AI</span>}{m.t}</motion.div>)}
        {typing && <div className="self-start text-[22px] pulse-dot" style={{ color: 'var(--mute)' }}>● ● ●</div>}
      </div>
      <div className="flex gap-1.5 flex-wrap mb-2.5">{Object.keys(answers).map(k => <button key={k} onClick={() => ask(k)} className="rounded-full px-3 py-1 text-[13.5px]" style={{ background: mix('var(--accent)', 14), border: '1px solid var(--accent)' }}>{k}</button>)}</div>
      <div className="flex gap-2"><input value={txt} onChange={e => setTxt(e.target.value)} onKeyDown={e => e.key === 'Enter' && ask(txt)} placeholder="Ask anything…" className="flex-1 rounded-xl px-4 py-2 text-[15px] outline-none" style={{ background: 'var(--card)', border: '1px solid var(--line)', color: 'var(--ink)' }} /><Btn onClick={() => ask(txt)}>Send</Btn></div>
    </Window>
  )
}

/* ───────── Leisure zone: play the quiz ───────── */
export function LeisureDemo() {
  const { country, industry, company } = useDeck()
  const [pick, setPick] = useState<number | null>(null)
  const [pts, setPts] = useState(120)
  const board = [[country.sampleNames[0], 340], [country.sampleNames[3], 310], [country.sampleNames[5], 275]] as [string, number][]
  const me = country.sampleNames[1]
  const all = [...board, [me, pts] as [string, number]].sort((a, b) => b[1] - a[1])
  return (
    <Window title={`${company} · Leisure Zone · Friday Quiz`}>
      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-3 card p-4">
          <div className="text-[13px]" style={{ color: 'var(--accent)' }}>Question 3 of 5</div>
          <div className="text-[21px] font-bold my-2.5">{industry.quiz.q}</div>
          {industry.quiz.options.map((o, k) => <button key={o} disabled={pick !== null} onClick={() => { setPick(k); if (k === 0) setPts(p => p + 50) }} className="card w-full px-4 py-2.5 mb-2 text-[16.5px] text-left" style={pick !== null && k === 0 ? { borderColor: 'var(--ok)', background: mix('var(--ok)', 16) } : pick === k ? { borderColor: 'var(--bad)', background: mix('var(--bad)', 16) } : {}}>{o}{pick !== null && k === 0 && ' ✓'}{pick === k && k !== 0 && ' ✕'}</button>)}
          {pick !== null && <Btn tone="ghost" onClick={() => { setPick(null); setPts(120) }}>↺ Play again</Btn>}
        </div>
        <div className="col-span-2 card p-4"><div className="font-bold mb-2.5">🏆 Leaderboard</div>
          <AnimatePresence>{all.map(([n, p], k) => <motion.div layout key={n} className="flex items-center gap-2.5 py-1.5 text-[15px]" style={{ fontWeight: n === me ? 800 : 400 }}><span className="w-5 text-center" style={{ color: 'var(--mute)' }}>{k + 1}</span><Avatar name={n} size={28} /><span className="flex-1 truncate">{n.split(' ')[0]}{n === me ? ' (you)' : ''}</span><b className="tabular-nums">{p}</b></motion.div>)}</AnimatePresence></div>
      </div>
      <Hint>Answer the question — correct answers climb the leaderboard.</Hint>
    </Window>
  )
}

/* ───────── Notifications: fire an event, watch it fan out ───────── */
export function NotificationsDemo() {
  const { country, company } = useDeck()
  const events = ['Leave approved', 'Payslip ready', 'Shift changed', 'Policy to acknowledge']
  const [ev, setEv] = useState(0), [fire, setFire] = useState(0)
  const [on, setOn] = useState<boolean[]>(country.channels.map(() => true))
  const ch = country.channels
  return (
    <Window title={`${company} · Notification engine`}>
      <div className="flex items-center justify-between mb-3"><Chips items={events} on={ev} onPick={i => { setEv(i); setFire(f => f + 1) }} /><Btn onClick={() => setFire(f => f + 1)}>🔔 Send now</Btn></div>
      <div className="relative h-[340px]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 700 340">
          {ch.map((_, k) => { const y = 34 + k * (272 / Math.max(1, ch.length - 1)); return <path key={k} d={`M 170 170 C 300 170, 330 ${y}, 470 ${y}`} stroke={on[k] ? 'var(--brand2)' : 'var(--line)'} strokeWidth="2" fill="none" className={on[k] ? 'flow-line' : ''} /> })}
        </svg>
        <motion.div key={fire} initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="absolute left-3 top-[118px] card p-4 w-[150px] text-center glow"><div className="text-[32px]">🔔</div><div className="font-bold text-[14.5px]">{events[ev]}</div></motion.div>
        {ch.map((c, k) => { const y = 34 + k * (272 / Math.max(1, ch.length - 1)); return (
          <button key={c} onClick={() => setOn(o => o.map((v, i) => (i === k ? !v : v)))} className="absolute right-0 card px-4 py-2 w-[210px] flex items-center justify-between text-[15px]" style={{ top: y - 24, opacity: on[k] ? 1 : 0.4 }}>
            {c}{on[k] ? <motion.span key={fire} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + 0.18 * k }} style={{ color: 'var(--ok)' }}>✓ sent</motion.span> : <span style={{ color: 'var(--mute)' }}>off</span>}</button>) })}
      </div>
      <Hint>Pick an event, then switch channels on or off — each message fans out to the channels you keep.</Hint>
    </Window>
  )
}

/* ───────── Analytics: filter the dashboard ───────── */
export function AnalyticsDemo() {
  const { industry, company, headcount } = useDeck()
  const base = industry.dash
  const ratio = headcount ? headcount / base.headcount : 1
  const depts = ['All', ...industry.departments.slice(0, 5)]
  const [f, setF] = useState(0), [k, setK] = useState(0)
  const counts = base.deptCounts.map(x => Math.max(1, Math.round(x * ratio)))
  const total = headcount ?? base.headcount
  const share = f === 0 ? 1 : (counts[f - 1] ?? 1) / counts.reduce((a, b) => a + b, 0)
  const kp = [['Headcount', Math.round(total * share), ''], ['Attrition', Math.round(base.attrition * (f ? 0.8 + f * 0.12 : 1) * 10) / 10, '%'], ['Absenteeism', Math.round(base.absent * (f ? 0.7 + f * 0.15 : 1) * 10) / 10, '%'], ['Open roles', Math.max(0, Math.round(base.open * share)), '']] as [string, number, string][]
  const trend = [[58, 61, 60, 66, 70, 74], [14, 13, 15, 12, 11, 12], [5, 6, 5, 7, 6, 5], [3, 5, 4, 6, 8, 7]][k].map(v => v * (f ? 0.9 + f * 0.04 : 1))
  const mx = Math.max(...trend)
  return (
    <Window title={`${company} · HR dashboard`}>
      <div className="mb-3"><Chips items={depts} on={f} onPick={setF} /></div>
      <div className="grid grid-cols-4 gap-3 mb-3">
        {kp.map(([l, v, s], i) => <button key={l} onClick={() => setK(i)} className="card p-3 text-left" style={{ borderColor: k === i ? 'var(--brand2)' : undefined }}><div className="text-[13px]" style={{ color: 'var(--mute)' }}>{l}</div><div className="text-[28px] font-extrabold"><Counter key={f + l} to={v} suffix={s} /></div></button>)}
      </div>
      <div className="grid grid-cols-5 gap-3">
        <div className="col-span-3 card p-3"><div className="text-[12px] uppercase tracking-wider mb-2" style={{ color: 'var(--mute)' }}>{kp[k][0]} · 6-month trend</div>
          <div className="flex items-end gap-2 h-[150px]">{trend.map((v, i) => <motion.div key={f + '-' + k + i} className="flex-1 rounded-t" style={{ background: 'linear-gradient(180deg,var(--brand2),var(--brand))' }} initial={{ height: 0 }} animate={{ height: `${(v / mx) * 100}%` }} transition={{ delay: 0.06 * i }} />)}</div></div>
        <div className="col-span-2 card p-3 flex flex-col gap-1.5"><div className="text-[12px] uppercase tracking-wider" style={{ color: 'var(--mute)' }}>By department</div>{industry.departments.slice(0, 5).map((d, i) => <button key={d} onClick={() => setF(i + 1)} className="text-left"><div className="flex justify-between text-[13px]"><span>{d}</span><b>{counts[i]}</b></div><Bar pct={(counts[i] / Math.max(...counts)) * 100} color={f === i + 1 ? 'var(--accent)' : 'var(--brand2)'} /></button>)}</div>
      </div>
    </Window>
  )
}

/* ───────── Compliance ───────── */
export function ComplianceDemo() {
  const { country, industry, company } = useDeck()
  const reports = [...country.complianceReports.slice(0, 4), ...industry.extraReports]
  const [st, setSt] = useState<('due' | 'gen' | 'done')[]>(reports.map((_, k) => (k === 2 ? 'due' : 'done')))
  const [log, setLog] = useState<[string, string, string][]>([['Salary changed', 'HR Manager', '09:12'], ['Leave policy edited', 'Admin', '08:47']])
  const run = (k: number) => { setSt(s => s.map((v, i) => (i === k ? 'gen' : v))); setTimeout(() => { setSt(s => s.map((v, i) => (i === k ? 'done' : v))); setLog(l => [[`${reports[k]} generated`, 'Payroll', '10:0' + (l.length % 9)] as [string, string, string], ...l].slice(0, 5)) }, 1100) }
  return (
    <Window title={`${company} · Compliance · ${country.name}`}>
      <div className="grid grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          {reports.map((r, k) => (
            <button key={r} onClick={() => st[k] !== 'gen' && run(k)} className="card px-4 py-2.5 flex justify-between items-center text-[15.5px] text-left"><span>{r}</span>
              {st[k] === 'gen' ? <Badge tone="brand">Generating…</Badge> : <Badge tone={st[k] === 'due' ? 'warn' : 'ok'}>{st[k] === 'due' ? 'Due in 3 days ▶' : '✓ Generated'}</Badge>}</button>
          ))}
        </div>
        <div className="card p-4"><div className="text-[13px] tracking-widest uppercase mb-2" style={{ color: 'var(--mute)' }}>Audit trail</div>
          <AnimatePresence initial={false}>{log.map(([a, b, c]) => <motion.div layout key={a + c} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} className="flex justify-between text-[14px] py-1.5" style={{ borderBottom: '1px solid var(--line)' }}><span>{a}</span><span style={{ color: 'var(--mute)' }}>{b} · {c}</span></motion.div>)}</AnimatePresence></div>
      </div>
      <Hint>Click a report to generate it — it lands in the audit trail instantly.</Hint>
    </Window>
  )
}

/* ───────── Security: edit the permission matrix ───────── */
export function SecurityDemo() {
  const roles = ['Employee', 'Manager', 'HR', 'Payroll', 'Admin']
  const perms = ['View profile', 'Approve leave', 'Edit salary', 'Run payroll', 'Manage roles']
  const [m, setM] = useState([[1, 0, 0, 0, 0], [1, 1, 0, 0, 0], [1, 1, 0, 0, 0], [1, 0, 1, 1, 0], [1, 1, 1, 1, 1]])
  const [last, setLast] = useState('')
  const toggle = (i: number, j: number) => { setM(x => x.map((r, a) => r.map((v, b) => (a === i && b === j ? 1 - v : v)))); setLast(`${m[i][j] ? 'Removed' : 'Granted'} “${perms[j]}” ${m[i][j] ? 'from' : 'to'} ${roles[i]}`) }
  const risky = (m[0][3] || m[0][2] || m[0][4]) ? 'Employees can now touch pay or roles — review this change.' : ''
  return (
    <Window title="Security · Roles & permissions">
      <div className="grid grid-cols-6 gap-1.5 text-[14px] items-center">
        <span />{perms.map(p => <span key={p} className="text-center text-[12px]" style={{ color: 'var(--mute)' }}>{p}</span>)}
        {roles.map((r, i) => (<div key={r} className="contents"><b>{r}</b>{perms.map((_, j) => <button key={j} onClick={() => toggle(i, j)} className="card h-9 grid place-items-center transition active:scale-90" style={m[i][j] ? { color: 'var(--ok)', background: mix('var(--ok)', 14) } : { color: 'var(--mute)', opacity: 0.5 }}>{m[i][j] ? '✓' : '—'}</button>)}</div>))}
      </div>
      <div className="flex gap-2 mt-4 flex-wrap"><Badge tone="ok">MFA enforced</Badge><Badge>SSO ready</Badge><Badge tone="warn">Every change audited</Badge></div>
      <AnimatePresence>{last && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="card px-4 py-2.5 mt-3 text-[14.5px]">📝 {last} — logged to the audit trail{risky && <div style={{ color: 'var(--warn)' }}>⚠ {risky}</div>}</motion.div>}</AnimatePresence>
      <Hint>Click any cell to grant or remove a permission.</Hint>
    </Window>
  )
}

/* ───────── Integrations ───────── */
export function IntegrationDemo() {
  const left = [['ERP', 'POST /api/journals — payroll journal'], ['Accounting', 'GL export — cost-centre split'], ['Biometric devices', 'Punch sync every 60 s'], ['Power BI / Metabase', 'Read-only reporting views']]
  const right = [['Email / SMS / WhatsApp', 'Template + recipient rules'], ['Azure Functions', 'Scheduled jobs & dispatch'], ['Banks (salary files)', 'Bank file per format'], ['Your APIs', 'REST + webhooks']]
  const [sel, setSel] = useState<[number, number]>([0, 0])
  const items = [...left, ...right]
  const cur = items[sel[0] * 4 + sel[1]]
  return (
    <Window title="Integration hub">
      <div className="relative h-[360px] flex items-center justify-between">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 700 360">
          {[0, 1, 2, 3].map(k => <path key={'l' + k} d={`M 190 ${48 + k * 88} C 270 ${48 + k * 88}, 270 180, 330 180`} stroke={sel[0] === 0 && sel[1] === k ? '#fff' : 'var(--accent)'} fill="none" strokeWidth={sel[0] === 0 && sel[1] === k ? 4 : 2} className="flow-line" />)}
          {[0, 1, 2, 3].map(k => <path key={'r' + k} d={`M 370 180 C 430 180, 430 ${48 + k * 88}, 510 ${48 + k * 88}`} stroke={sel[0] === 1 && sel[1] === k ? '#fff' : 'var(--brand2)'} fill="none" strokeWidth={sel[0] === 1 && sel[1] === k ? 4 : 2} className="flow-line" />)}
        </svg>
        <div className="flex flex-col gap-[28px] z-10">{left.map(([l], k) => <button key={l} onClick={() => setSel([0, k])} className="card px-4 py-2.5 text-[14.5px] w-[180px] text-left" style={{ borderColor: sel[0] === 0 && sel[1] === k ? 'var(--accent)' : undefined }}>{l}</button>)}</div>
        <div className="card p-4 text-center glow z-10 w-[110px]"><div className="text-[26px]">🔗</div><div className="font-bold text-[13px]">PeopleHub API</div></div>
        <div className="flex flex-col gap-[28px] z-10">{right.map(([l], k) => <button key={l} onClick={() => setSel([1, k])} className="card px-4 py-2.5 text-[14.5px] w-[190px] text-left" style={{ borderColor: sel[0] === 1 && sel[1] === k ? 'var(--brand2)' : undefined }}>{l}</button>)}</div>
      </div>
      <motion.div key={sel.join()} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card px-4 py-2.5 text-[14.5px]"><b>{cur[0]}</b> — <span style={{ color: 'var(--mute)' }}>{cur[1]}</span></motion.div>
    </Window>
  )
}

/* ───────── News & announcements ───────── */
export function NewsDemo() {
  const { country, company } = useDeck()
  type P = { c: string; t: string; by: string; r: number; cat: number; tone: 'warn' | 'brand' | 'ok'; liked: boolean; ack: boolean }
  const [posts, setPosts] = useState<P[]>([
    { c: '📌 Pinned', t: 'New leave policy from 1 November', by: 'HR', r: 78, cat: 1, tone: 'warn', liked: false, ack: false },
    { c: 'Company', t: `Welcome to ${poss(company)} new ${country.mapCenter} office`, by: 'Admin', r: 64, cat: 0, tone: 'brand', liked: false, ack: false },
    { c: 'Event', t: 'Friday quiz & team lunch', by: 'People team', r: 41, cat: 2, tone: 'ok', liked: false, ack: false },
  ])
  const [f, setF] = useState(0), [draft, setDraft] = useState(false), [txt, setTxt] = useState('')
  const cats = ['All', 'Policy', 'Events', 'Recognition']
  const shown = posts.filter(p => f === 0 || p.cat === f || (f === 1 && p.c.includes('Pinned')))
  const upd = (i: number, k: Partial<P>) => setPosts(ps => ps.map((p, j) => (j === i ? { ...p, ...k } : p)))
  return (
    <Window title={`${company} · News & announcements`}>
      <div className="flex justify-between items-center mb-3"><Chips items={cats} on={f} onPick={setF} /><button onClick={() => setDraft(d => !d)} className="rounded-lg px-3 py-1.5 text-[13.5px] font-bold text-white" style={{ background: 'linear-gradient(90deg,var(--brand),var(--accent))' }}>＋ Post</button></div>
      <AnimatePresence>{draft && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><div className="flex gap-2 mb-3"><input value={txt} onChange={e => setTxt(e.target.value)} placeholder="Announcement headline…" className="flex-1 rounded-xl px-4 py-2 text-[14.5px] outline-none" style={{ background: 'var(--card)', border: '1px solid var(--line)', color: 'var(--ink)' }} /><Btn onClick={() => { if (txt.trim()) { setPosts(p => [{ c: 'Company', t: txt.trim(), by: 'You', r: 0, cat: 0, tone: 'brand', liked: false, ack: false }, ...p]); setTxt(''); setDraft(false) } }}>Publish</Btn></div></motion.div>}</AnimatePresence>
      <div className="flex flex-col gap-2 mb-3">
        <AnimatePresence initial={false}>{shown.map(p => { const i = posts.indexOf(p); return (
          <motion.div layout key={p.t} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card px-3.5 py-2.5"><div className="flex justify-between items-center"><Badge tone={p.tone}>{p.c}</Badge><span className="text-[12px]" style={{ color: 'var(--mute)' }}>Read by {p.r + (p.ack ? 1 : 0)}%</span></div><div className="font-bold text-[16px] mt-1">{p.t}</div>
            <div className="flex items-center gap-3 mt-1.5 text-[13px]" style={{ color: 'var(--mute)' }}><span>Posted by {p.by}</span><div className="flex-1" /><button onClick={() => upd(i, { liked: !p.liked })} style={{ color: p.liked ? 'var(--bad)' : undefined }}>{p.liked ? '❤️' : '🤍'} Like</button><button onClick={() => upd(i, { ack: true })}>{p.ack ? <Badge tone="ok">✓ Read</Badge> : <Badge tone="warn">Mark as read</Badge>}</button></div></motion.div>) })}</AnimatePresence>
      </div>
      <div className="grid grid-cols-2 gap-3"><div className="card p-3 text-[13.5px]">🎂 <b>{country.sampleNames[5].split(' ')[0]}</b> and 2 others have birthdays this week</div><div className="card p-3 text-[13.5px]">🏖 Next holiday: <b>{country.holidaysLabel.split(' ')[0]}</b> · Friday</div></div>
    </Window>
  )
}

/* ───────── Architecture: tap a layer ───────── */
export function ArchitectureDemo() {
  const layers: [string, string, string, string][] = [
    ['Web · Manager workspace · Android', 'React single-page apps', '#22d3ee', 'Employees and managers use the browser or the Android app; both talk to the same secured API.'],
    ['API layer', '.NET 8 · JWT · MFA · SSO · rate limiting', '#3b6be0', 'Stateless API with token authentication, optional MFA/SSO and request throttling.'],
    ['Business services', 'approvals · payroll · letters · attendance · billing', '#a78bfa', 'Domain services with a shared workflow engine — one approval model for every module.'],
    ['Tenant resolution + RBAC', 'schema per company · module gating · audit', '#34d399', 'Each company is isolated in its own schema; roles and subscribed modules gate every call; every change is audited.'],
    ['PostgreSQL · Azure Storage', 'platform + tenant schemas · documents & files', '#fbbf24', 'Relational data in PostgreSQL, documents and files in Azure Storage; backups and scaling on Azure.'],
    ['Azure Functions', 'notifications · billing · scheduled jobs', '#f472b6', 'Serverless workers send notifications, run billing and process scheduled jobs.'],
  ]
  const [sel, setSel] = useState(1)
  return (
    <Window title="Architecture">
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 flex flex-col gap-2">
          {layers.map(([t, s, c], k) => (
            <button key={t} onClick={() => setSel(k)} className="rounded-xl px-4 py-2.5 text-left transition" style={{ background: mix(c, sel === k ? 30 : 14), border: `${sel === k ? 2 : 1.5}px solid ${c}`, boxShadow: sel === k ? `0 0 26px -8px ${c}` : 'none' }}>
              <div className="font-bold text-[15.5px]">{t}</div><div className="text-[12.5px]" style={{ color: 'var(--mute)' }}>{s}</div></button>
          ))}
        </div>
        <div className="col-span-2 card p-4 flex flex-col justify-center"><motion.div key={sel} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><div className="w-3 h-3 rounded-full mb-2" style={{ background: layers[sel][2] }} /><div className="font-bold text-[18px] mb-1">{layers[sel][0]}</div><div className="text-[14.5px] leading-snug" style={{ color: 'var(--mute)' }}>{layers[sel][3]}</div></motion.div></div>
      </div>
      <Hint>Tap a layer to see what it does. Ask the client which parts matter to their IT team.</Hint>
    </Window>
  )
}
