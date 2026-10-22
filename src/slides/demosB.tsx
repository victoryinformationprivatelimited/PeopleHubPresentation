import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Chart from '../ui/LazyChart'
import { useDeck, money } from '../engine/context'
import { Avatar, Badge, Bar, Counter, Phone, Window, fade } from '../ui/primitives'

const axis = { labels: { style: { colors: '#94a3c0' } }, axisBorder: { show: false }, axisTicks: { show: false } }
const baseChart = { chart: { toolbar: { show: false }, background: 'transparent', foreColor: '#94a3c0', animations: { enabled: true, speed: 1200 } }, grid: { borderColor: 'rgba(148,163,192,.18)' }, theme: { mode: 'dark' as const }, tooltip: { theme: 'dark' as const } }

/* ---------- TALENT (last) ---------- */
export function EngagementDemo() {
  const { industry, company } = useDeck()
  return (
    <Window title={`${company} · Pulse survey`}>
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center"><div className="text-[14px]" style={{ color: 'var(--mute)' }}>eNPS</div><div className="text-[56px] font-extrabold grad-text">+<Counter to={42} /></div><Badge tone="ok">▲ 8 vs last quarter</Badge></div>
        <div className="col-span-2"><Chart type="area" height={230} series={[{ name: 'Sentiment', data: [58, 61, 60, 66, 70, 74, 79] }]} options={{ ...baseChart, stroke: { curve: 'smooth', width: 3 }, colors: ['#22d3ee'], fill: { type: 'gradient', gradient: { opacityFrom: 0.5, opacityTo: 0.02 } }, dataLabels: { enabled: false }, xaxis: { ...axis, categories: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'] }, yaxis: { show: false } }} /></div>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {industry.survey.map(([q, p], k) => <div key={q as string}><div className="flex justify-between text-[14px] mb-1"><span>{q}</span><b>{p}%</b></div><Bar pct={p as number} delay={0.2 * k} /></div>)}
      </div>
    </Window>
  )
}

/* ---------- EXPERIENCE ---------- */
export function EssDemo() {
  const { country, company, logo } = useDeck()
  return (
    <div className="flex items-center gap-8 justify-center">
      <Window title={`${company} · Employee portal`} className="w-[560px]">
        <div className="flex items-center justify-between mb-3"><div className="text-[22px] font-bold">Good morning, {country.sampleNames[1].split(' ')[0]} 👋</div>{logo && <img src={logo} alt="" className="h-9 max-w-[120px] object-contain bg-white rounded-lg px-2" />}</div>
        <div className="grid grid-cols-2 gap-3">
          {[['Apply leave', '🌴'], ['My payslips', '💳'], ['Attendance', '🕒'], ['Update profile', '👤'], ['Letters', '📄'], ['Approvals (3)', '✅']].map(([t, i], k) => <motion.div key={t} {...fade(0.1 * k)} className="card p-4 flex gap-3 items-center text-[16px]"><span className="text-[26px]">{i}</span>{t}</motion.div>)}
        </div>
      </Window>
      <Phone>
        <div className="flex items-center justify-between mb-1"><span className="text-[12px] font-bold truncate max-w-[150px]">{company}</span>{logo && <img src={logo} alt="" className="h-6 max-w-[70px] object-contain bg-white rounded px-1" />}</div>
        <div className="text-[13px]" style={{ color: 'var(--mute)' }}>Net pay · Oct</div>
        <div className="text-[30px] font-extrabold grad-text mb-3">{money(country, Math.round(country.salary * 0.91))}</div>
        <div className="flex flex-col gap-2">
          {[['Leave balance', `${country.leaveTypes[0][1]} days`], ['Next shift', 'Mon 08:00'], ['Pending approval', '2 requests']].map(([a, b], k) => <motion.div key={a} {...fade(0.3 + 0.15 * k)} className="card p-3 flex justify-between text-[14px]"><span>{a}</span><b>{b}</b></motion.div>)}
          <motion.div {...fade(0.9)} className="rounded-2xl p-3 text-center font-bold" style={{ background: 'linear-gradient(90deg,var(--brand),var(--accent))' }}>📍 Check in</motion.div>
          <motion.div {...fade(1.3)} className="card p-3 text-[13px]">🔔 Your leave request was approved</motion.div>
        </div>
      </Phone>
    </div>
  )
}

export function GrievanceDemo() {
  const { industry, company } = useDeck()
  const stages = ['Submitted (anonymous)', 'Acknowledged · 24h', 'Investigation', 'Escalated to HR Head', 'Resolved']
  const [s, setS] = useState(0)
  useEffect(() => { const t = setInterval(() => setS(x => Math.min(x + 1, 4)), 900); return () => clearInterval(t) }, [])
  return (
    <Window title={`${company} · Grievance · Case GR-0087`}>
      <div className="flex gap-2 mb-5"><Badge tone="warn">{industry.grievance}</Badge><Badge>Anonymous</Badge><Badge tone={s === 4 ? 'ok' : 'bad'}>{s === 4 ? 'Resolved' : 'SLA running'}</Badge></div>
      <div className="flex flex-col gap-2.5">
        {stages.map((t, k) => (
          <div key={t} className="card px-4 py-3 flex items-center gap-3 text-[17px]" style={{ opacity: s >= k ? 1 : 0.3, borderColor: s === k ? 'var(--brand2)' : undefined }}>
            <span className="w-7 h-7 rounded-full grid place-items-center text-[13px]" style={{ background: s > k ? 'var(--ok)' : 'var(--line)', color: '#06281c' }}>{s > k ? '✓' : k + 1}</span>{t}
            {k === 3 && s >= 3 && <Badge tone="warn">auto-escalated</Badge>}
          </div>
        ))}
      </div>
    </Window>
  )
}

export function TicketsDemo() {
  const { country, industry, company } = useDeck()
  const t = industry.tickets
  return (
    <Window title={`${company} · Service desk queue`}>
      <div className="flex flex-col gap-2.5">
        {t.map(([q, n, p, sla], k) => (
          <motion.div key={n} {...fade(0.15 * k)} className="card p-4 grid grid-cols-12 items-center gap-3 text-[16px]">
            <span className="col-span-1"><Badge tone={q === 'IT' ? 'brand' : q === 'HR' ? 'ok' : 'warn'}>{q}</Badge></span>
            <span className="col-span-5">{n}</span>
            <span className="col-span-2"><Badge tone={p === 'High' ? 'bad' : 'mute'}>{p}</Badge></span>
            <span className="col-span-3"><div className="text-[11px] mb-1" style={{ color: 'var(--mute)' }}>SLA used</div><Bar pct={sla} color={sla > 80 ? 'var(--bad)' : sla > 60 ? 'var(--warn)' : 'var(--ok)'} delay={0.3} /></span>
            <span className="col-span-1"><Avatar name={country.sampleNames[k]} size={30} /></span>
          </motion.div>
        ))}
      </div>
    </Window>
  )
}

export function AssetsDemo() {
  const { country, industry, company } = useDeck()
  const rows = industry.assets.map(([i, n], k) => [i, n, k === 3 ? 'In maintenance' : 'Assigned', k === 3 ? 'warn' : 'ok'] as const)
  return (
    <Window title={`${company} · Assets · ${country.sampleNames[5]}`}>
      <div className="flex flex-col gap-2.5">
        {rows.map(([i, n, s, t], k) => <motion.div key={n} {...fade(0.15 * k)} className="card p-4 flex items-center gap-4 text-[17px]"><span className="text-[28px]">{i}</span><span className="flex-1">{n}</span><Badge tone={t}>{s}</Badge></motion.div>)}
      </div>
      <motion.div {...fade(1.2)} className="card p-3 mt-4 text-[15px] flex justify-between"><span>On exit: all {rows.length} assets auto-added to the clearance checklist</span><Badge tone="ok">Linked to Termination</Badge></motion.div>
    </Window>
  )
}

export function KbDemo() {
  const { industry, company } = useDeck()
  const q = industry.kb.query
  const [n, setN] = useState(0)
  useEffect(() => { const t = setInterval(() => setN(x => (x < q.length ? x + 1 : x)), 70); return () => clearInterval(t) }, [])
  return (
    <Window title={`${company} · Knowledge Base`}>
      <div className="card px-5 py-3 text-[20px] mb-4 flex gap-2">🔍 {q.slice(0, n)}<span className="pulse-dot">|</span></div>
      <div className="flex flex-col gap-2.5" style={{ opacity: n > 6 ? 1 : 0.2 }}>
        {industry.kb.results.map(([a, b, c], k) => (
          <motion.div key={a} {...fade(0.15 * k)} className="card p-4 flex justify-between items-center"><div><div className="font-bold text-[18px]">{a}</div><div className="text-[13px]" style={{ color: 'var(--mute)' }}>{b}</div></div><Badge tone="ok">{c}</Badge></motion.div>
        ))}
        <div className="flex gap-2"><Badge>✓ Read acknowledgement</Badge><Badge tone="ok">👍 Helpful 96%</Badge><Badge tone="mute">Audience: All employees</Badge></div>
      </div>
    </Window>
  )
}

export function ChatDemo() {
  const { country, industry, company } = useDeck()
  const msgs = [
    { me: true, t: `How many ${country.leaveTypes[0][0].toLowerCase()} leave days do I have left?` },
    { me: false, t: `You have ${country.leaveTypes[0][1]} of ${country.leaveTypes[0][2]} ${country.leaveTypes[0][0].toLowerCase()} leave days remaining. Would you like to apply now?`, ai: true },
    { me: true, t: 'Yes — 3 days from Monday' },
    { me: false, t: 'Done! Request sent to your manager. I’ll notify you when it’s approved.', ai: true },
    { me: false, t: `Hi ${country.sampleNames[1].split(' ')[0]}, ${industry.chatTip}`, ai: false },
  ]
  const [n, setN] = useState(1)
  useEffect(() => { const t = setInterval(() => setN(x => Math.min(x + 1, msgs.length)), 1100); return () => clearInterval(t) }, [msgs.length])
  return (
    <Window title={`${company} · HR Assistant`}>
      <div className="flex flex-col gap-3 min-h-[430px]">
        {msgs.slice(0, n).map((m, k) => (
          <motion.div key={k} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className={`max-w-[75%] px-4 py-3 rounded-2xl text-[17px] ${m.me ? 'self-end' : 'self-start card'}`} style={m.me ? { background: 'var(--brand)', color: '#fff' } : {}}>
            {!m.me && <div className="text-[11px] mb-1" style={{ color: 'var(--accent)' }}>{m.ai ? `✨ ${company} AI assistant · from HR policies` : '👩‍💼 HR Officer'}</div>}{m.t}
          </motion.div>
        ))}
        {n < msgs.length && <div className="self-start card px-4 py-2 text-[20px] pulse-dot">• • •</div>}
      </div>
    </Window>
  )
}

export function LeisureDemo() {
  const { country, industry, company } = useDeck()
  return (
    <Window title={`${company} · Leisure Zone · Friday Quiz`}>
      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-3 card p-5">
          <div className="text-[13px]" style={{ color: 'var(--accent)' }}>Question 3 of 5 · ⏱ 12s</div>
          <div className="text-[22px] font-bold my-3">{industry.quiz.q}</div>
          {industry.quiz.options.map((o, k) => <motion.div key={o} {...fade(0.15 * k)} className="card px-4 py-3 mb-2 text-[17px]" style={k === 0 ? { borderColor: 'var(--ok)', background: 'color-mix(in srgb,var(--ok) 15%,transparent)' } : {}}>{o}{k === 0 && ' ✓'}</motion.div>)}
        </div>
        <div className="col-span-2 card p-5">
          <div className="font-bold mb-3">🏆 Leaderboard</div>
          {[0, 3, 5].map((n, k) => <motion.div key={n} {...fade(0.3 * k)} className="flex items-center gap-3 mb-3"><b className="w-5">{k + 1}</b><Avatar name={country.sampleNames[n]} size={34} /><span className="flex-1 text-[15px]">{country.sampleNames[n].split(' ')[0]}</span><b>{1200 - k * 150}</b></motion.div>)}
          <Badge tone="ok">🎂 2 birthdays this week</Badge>
        </div>
      </div>
    </Window>
  )
}

export function NotificationsDemo() {
  const { country, company } = useDeck()
  const ch = country.channels
  return (
    <Window title={`${company} · Notification engine`}>
      <div className="relative h-[430px]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 700 430">
          {ch.map((_, k) => { const y = 40 + k * 88; return <path key={k} d={`M 170 215 C 300 215, 330 ${y}, 470 ${y}`} stroke="var(--brand2)" strokeWidth="2" fill="none" className="flow-line" /> })}
        </svg>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute left-4 top-[160px] card p-4 w-[150px] text-center glow"><div className="text-[34px]">🔔</div><div className="font-bold text-[15px]">Leave approved</div></motion.div>
        {ch.map((c, k) => (
          <motion.div key={c} {...fade(0.5 + 0.2 * k)} className="absolute right-0 card px-5 py-3 w-[200px] flex items-center gap-3 text-[17px]" style={{ top: 14 + k * 88 }}>
            <span className="text-[24px]">{['✉️', '💬', '🟢', '📲', '📳'][k]}</span>{c}<span className="ml-auto" style={{ color: 'var(--ok)' }}>✓</span>
          </motion.div>
        ))}
      </div>
    </Window>
  )
}

/* ---------- INTELLIGENCE ---------- */
export function AnalyticsDemo() {
  const { industry, company, headcount } = useDeck()
  const base = industry.dash
  const ratio = headcount ? headcount / base.headcount : 1
  const d = { ...base, headcount: headcount ?? base.headcount, deptCounts: base.deptCounts.map(x => Math.max(1, Math.round(x * ratio))) }
  return (
    <Window title={`${company} · HR dashboard`}>
      <div className="grid grid-cols-4 gap-3 mb-3">
        {[['Headcount', d.headcount, ''], ['Attrition', d.attrition, '%'], ['Absenteeism', d.absent, '%'], ['Open roles', d.open, '']].map(([l, v, s], k) => <motion.div key={l as string} {...fade(0.1 * k)} className="card p-3"><div className="text-[13px]" style={{ color: 'var(--mute)' }}>{l}</div><div className="text-[30px] font-extrabold"><Counter to={v as number} suffix={s as string} /></div></motion.div>)}
      </div>
      <div className="grid grid-cols-5 gap-3">
        <div className="col-span-3"><Chart type="bar" height={230} series={[{ name: 'Headcount', data: d.deptCounts }]} options={{ ...baseChart, plotOptions: { bar: { borderRadius: 6, columnWidth: '55%' } }, colors: ['#6ea0ff'], dataLabels: { enabled: false }, xaxis: { ...axis, categories: industry.departments.map(d => d.split(' ')[0]) }, yaxis: { show: false } }} /></div>
        <div className="col-span-2"><Chart type="donut" height={230} series={d.mix} options={{ ...baseChart, labels: ['Permanent', 'Contract', 'Intern'], colors: ['#3b6be0', '#22d3ee', '#a78bfa'], legend: { position: 'bottom', labels: { colors: '#94a3c0' } }, stroke: { show: false }, dataLabels: { enabled: false } }} /></div>
      </div>
    </Window>
  )
}

export function ComplianceDemo() {
  const { country, industry, company } = useDeck()
  const reports = [...country.complianceReports.slice(0, 4), ...industry.extraReports]
  return (
    <Window title={`${company} · Compliance · ${country.name}`}>
      <div className="grid grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          {reports.map((r, k) => <motion.div key={r} {...fade(0.2 * k)} className="card px-4 py-3 flex justify-between items-center text-[16px]"><span>{r}</span><Badge tone={k === 2 ? 'warn' : 'ok'}>{k === 2 ? 'Due in 3 days' : 'Generated'}</Badge></motion.div>)}
        </div>
        <div className="card p-4"><div className="text-[13px] tracking-widest uppercase mb-2" style={{ color: 'var(--mute)' }}>Audit trail</div>
          {[['Salary changed', 'HR Manager', '09:12'], ['Leave policy edited', 'Admin', '08:47'], ['Employee exported', 'Payroll', 'Yesterday'], ['Role granted', 'IT Admin', 'Yesterday']].map(([a, b, c], k) => <motion.div key={a} {...fade(0.8 + 0.2 * k)} className="py-2 border-b text-[14px] flex justify-between" style={{ borderColor: 'var(--line)' }}><span>{a} <span style={{ color: 'var(--mute)' }}>· {b}</span></span><span style={{ color: 'var(--mute)' }}>{c}</span></motion.div>)}
        </div>
      </div>
    </Window>
  )
}

export function SecurityDemo() {
  const roles = ['Employee', 'Manager', 'HR', 'Payroll', 'Admin']
  const perms = ['View profile', 'Approve leave', 'Edit salary', 'Run payroll', 'Manage roles']
  const m = [[1, 0, 0, 0, 0], [1, 1, 0, 0, 0], [1, 1, 0, 0, 0], [1, 0, 1, 1, 0], [1, 1, 1, 1, 1]]
  return (
    <Window title="Security · Roles & permissions">
      <div className="grid grid-cols-6 gap-1.5 text-[14px] items-center">
        <span />{perms.map(p => <span key={p} className="text-center text-[12px]" style={{ color: 'var(--mute)' }}>{p}</span>)}
        {roles.map((r, i) => (<div key={r} className="contents"><b>{r}</b>{perms.map((_, j) => <motion.span key={j} {...fade(0.05 * (i * 5 + j))} className="card h-9 grid place-items-center" style={m[i][j] ? { color: 'var(--ok)' } : { color: 'var(--mute)', opacity: 0.4 }}>{m[i][j] ? '✓' : '—'}</motion.span>)}</div>))}
      </div>
      <div className="flex gap-2 mt-5 flex-wrap"><Badge tone="ok">🔐 MFA</Badge><Badge>Microsoft SSO</Badge><Badge tone="warn">🔒 Field-level encryption</Badge><Badge tone="mute">Rate-limited login</Badge><Badge tone="mute">Full audit logs</Badge></div>
    </Window>
  )
}

export function IntegrationDemo() {
  const left = ['ERP', 'Accounting', 'Biometric devices', 'Power BI / Metabase']
  const right = ['Email / SMS / WhatsApp', 'Azure Functions', 'Banks (salary files)', 'Your APIs']
  return (
    <Window title="Integration hub">
      <div className="relative h-[430px] flex items-center justify-between">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 700 430">
          {[0, 1, 2, 3].map(k => <path key={'l' + k} d={`M 190 ${50 + k * 110} C 270 ${50 + k * 110}, 270 215, 330 215`} stroke="var(--accent)" fill="none" strokeWidth="2" className="flow-line" />)}
          {[0, 1, 2, 3].map(k => <path key={'r' + k} d={`M 370 215 C 430 215, 430 ${50 + k * 110}, 510 ${50 + k * 110}`} stroke="var(--brand2)" fill="none" strokeWidth="2" className="flow-line" />)}
        </svg>
        <div className="flex flex-col gap-[56px] z-10">{left.map((l, k) => <motion.div key={l} {...fade(0.15 * k)} className="card px-3 py-2.5 w-[170px] text-[14px] text-center">{l}</motion.div>)}</div>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="z-10 w-24 h-24 rounded-3xl grid place-items-center glow font-extrabold text-[18px]" style={{ background: 'linear-gradient(135deg,var(--brand),var(--accent))' }}>API</motion.div>
        <div className="flex flex-col gap-[56px] z-10">{right.map((l, k) => <motion.div key={l} {...fade(0.15 * k + 0.4)} className="card px-3 py-2.5 w-[170px] text-[14px] text-center">{l}</motion.div>)}</div>
      </div>
    </Window>
  )
}
