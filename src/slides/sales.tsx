import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { poss, useDeck } from '../engine/context'
import { Badge, Counter, fade } from '../ui/primitives'
import { Section } from './layouts'
import { modById, modules } from './modules'

/* ================= Challenge (uses the client's own pain points when provided) ================= */
export function Challenge() {
  const { industry, client, pains } = useDeck()
  if (pains.length) {
    return (
      <Section eyebrow="What we heard" title={`What ${client || 'you'} told us`} sub="These are the challenges we’ll solve together — we’ll tick each one off as we go." zoom={pains.length > 4 ? 0.92 : 1.1}>
        <div className="grid grid-cols-2 gap-6 mt-4">
          {pains.map((p, k) => (
            <motion.div key={p.id} {...fade(0.2 + 0.18 * k)} className="card p-8 flex gap-6 items-center">
              <span className="text-[64px]">{p.icon}</span>
              <div>
                <div className="serif text-[34px] leading-tight font-bold">{p.label}</div>
                <div className="text-[17px] mt-2" style={{ color: 'var(--mute)' }}>{p.modules.length ? `Solved by: ${p.modules.map(m => modById[m]?.name).join(' · ')}` : 'To be covered in the discovery workshop'}</div>
              </div>
            </motion.div>
          ))}
        </div>
        {pains.length <= 3 && <motion.div {...fade(1.2)} className="mt-8 flex gap-3 flex-wrap">
          {industry.pains.map(p => <span key={p.label} className="card px-5 py-3 text-[18px]"><b className="grad-text">{p.stat}</b> <span style={{ color: 'var(--mute)' }}>{p.label}</span></span>)}
        </motion.div>}
      </Section>
    )
  }
  return (
    <Section eyebrow="The challenge" title={`HR is drowning in admin — and it’s costing ${client || 'you'}.`} sub="Spreadsheets, paper forms and disconnected tools quietly drain time, money and trust." zoom={1.15}>
      <div className="grid grid-cols-3 gap-8 mt-6">
        {industry.pains.map((p, k) => (
          <motion.div key={p.label} {...fade(0.3 + 0.2 * k)} className="card p-10">
            <div className="serif text-[110px] leading-none font-bold grad-text">{p.stat}</div>
            <div className="text-[26px] mt-4" style={{ color: 'var(--mute)' }}>{p.label}</div>
          </motion.div>
        ))}
      </div>
      <motion.div {...fade(1)} className="mt-10 flex gap-4 flex-wrap">
        {['Scattered employee data', 'Manual attendance & OT', 'Payroll errors & disputes', 'Approvals lost in email', 'Compliance risk', 'No real-time insight'].map(t => <span key={t} className="card px-5 py-3 text-[20px]">⚠ {t}</span>)}
      </motion.div>
    </Section>
  )
}

/* ================= Before / After — a day in the life of the HR manager ================= */
export function BeforeAfter() {
  const { industry, country, hrTeam, client } = useDeck()
  const rows: [string, string, string][] = [
    ['08:30', 'Collecting attendance sheets from every site and department', 'Attendance already reconciled — you only review the exceptions'],
    ['10:00', 'Re-keying leave and claim requests from email and paper', 'Managers approve on their phones; HR just monitors'],
    ['13:00', 'Fixing payroll errors and answering “why is my pay short?”', 'Payroll validated automatically; payslips explain every line'],
    ['15:30', 'Answering the same policy questions again and again', 'Employees self-serve from the Knowledge Base and AI chat'],
    ['17:30', `Compiling ${country.complianceReports[0]} and other returns by hand`, 'Statutory returns generated on schedule with a full audit trail'],
  ]
  const kpi = industry.kpis[0]
  return (
    <Section eyebrow="A day in the life" title={`An HR manager’s day at ${client || 'your company'} — before and after`} zoom={1.3}>
      <div className="grid grid-cols-[1fr_90px_1fr] gap-x-4 gap-y-3 mt-4 items-stretch">
        <div className="text-[22px] font-extrabold px-2" style={{ color: 'var(--bad)' }}>✕ Today</div><div /><div className="text-[22px] font-extrabold px-2" style={{ color: 'var(--ok)' }}>✓ With PeopleHub</div>
        {rows.map(([t, b, a], k) => (
          <div key={t} className="contents">
            <motion.div {...fade(0.3 + 0.55 * k)} className="card px-5 py-4 text-[19px] leading-snug" style={{ borderLeft: '4px solid var(--bad)' }}>{b}</motion.div>
            <motion.div {...fade(0.3 + 0.55 * k)} className="grid place-items-center text-[18px] font-bold" style={{ color: 'var(--mute)' }}>{t}</motion.div>
            <motion.div {...fade(0.55 + 0.55 * k)} className="card px-5 py-4 text-[19px] leading-snug" style={{ borderLeft: '4px solid var(--ok)', background: 'color-mix(in srgb, var(--ok) 10%, var(--card))' }}>{a}</motion.div>
          </div>
        ))}
      </div>
      <motion.div {...fade(3.6)} className="mt-6 flex gap-4 flex-wrap items-center">
        <Badge tone="ok">{kpi.label}: <Counter to={kpi.value} suffix={kpi.suffix} /></Badge>
        {hrTeam ? <Badge>≈ {hrTeam * 20} hours a week back to your {hrTeam}-person HR team</Badge> : null}
        <span className="text-[15px]" style={{ color: 'var(--mute)' }}>Illustrative, based on typical customer outcomes.</span>
      </motion.div>
    </Section>
  )
}

/* ================= Competitor / alternatives comparison ================= */
export function Versus() {
  const { country } = useDeck()
  const labels = [...new Set(country.statutory.map(s => s.label))].join(' / ')
  // 0 = no, 1 = partial, 2 = yes
  const rows: [string, number, number, number][] = [
    ['One source of truth for every employee', 0, 1, 2],
    ['Attendance flows straight into payroll', 0, 1, 2],
    ['Multi-level approvals & workflows', 0, 1, 2],
    ['Employee & manager mobile self-service', 0, 1, 2],
    [`${country.name} statutory returns (${labels})`, 0, 1, 2],
    ['Role-based access & full audit trail', 0, 1, 2],
    ['Live dashboards across all HR data', 0, 1, 2],
    ['No re-keying or custom integrations', 0, 0, 2],
  ]
  const mark = (v: number) => v === 2 ? <span style={{ color: 'var(--ok)' }}>✓</span> : v === 1 ? <span style={{ color: 'var(--warn)' }}>◐</span> : <span style={{ color: 'var(--bad)' }}>✕</span>
  const head = ['Spreadsheets & email', 'Separate point tools', 'PeopleHub']
  return (
    <Section eyebrow="Why switch" title="Patchwork tools can’t keep up." sub="See how the alternatives compare with one connected platform." zoom={1.05}>
      <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] gap-x-3 gap-y-2 mt-4 items-center">
        <div />
        {head.map((h, k) => <div key={h} className="text-center text-[18px] font-extrabold py-3 rounded-xl" style={k === 2 ? { background: 'linear-gradient(90deg,var(--brand),var(--accent))', color: '#fff' } : { color: 'var(--mute)' }}>{h}</div>)}
        {rows.map(([label, a, b, c], k) => (
          <motion.div key={label} {...fade(0.15 + 0.2 * k)} className="contents">
            <div className="card px-5 py-2 text-[18px]">{label}</div>
            {[a, b, c].map((v, j) => <div key={j} className="card py-1.5 text-center text-[26px] font-bold" style={j === 2 ? { outline: '2px solid var(--brand2)', background: 'color-mix(in srgb, var(--brand) 14%, var(--card))' } : {}}>{mark(v)}</div>)}
          </motion.div>
        ))}
      </div>
      <motion.div {...fade(2.2)} className="mt-5 text-[22px] font-bold text-center grad-text">All {modules.length} modules. One login. One source of truth.</motion.div>
    </Section>
  )
}

/* ================= Pains solved recap ================= */
export function PainsSolved() {
  const { client, pains, focusPains } = useDeck()
  const custom = pains.length > 0
  return (
    <Section eyebrow={custom ? 'Your priorities' : 'Typical priorities'} title={`${custom ? `${client ? poss(client) : 'Your'} challenges` : 'The challenges we solve'} — solved.`} sub={custom ? 'Each challenge you shared, and the PeopleHub modules that answer it.' : 'Choose pain points in the launcher to personalise this slide.'} zoom={1.15}>
      <div className="flex flex-col gap-4 mt-4">
        {focusPains.map((p, k) => (
          <motion.div key={p.id} {...fade(0.2 + 0.3 * k)} className="card p-6 grid grid-cols-[60px_1fr_1.4fr_50px] gap-5 items-center">
            <span className="text-[44px]">{p.icon}</span>
            <div className="text-[24px] font-bold leading-snug">{p.label}</div>
            <div className="flex flex-wrap gap-2">
              {p.modules.length ? p.modules.map(m => <Badge key={m}>{modById[m]?.name}</Badge>) : <Badge tone="warn">Covered in discovery workshop</Badge>}
            </div>
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7 + 0.3 * k, type: 'spring' }} className="w-11 h-11 rounded-full grid place-items-center text-[22px]" style={{ background: 'var(--ok)', color: '#06281c' }}>✓</motion.span>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

/* ================= Value estimator (uses the client's headcount and HR team) ================= */
export function Roi() {
  const { industry, country, headcount, hrTeam } = useDeck()
  const start = headcount ?? industry.dash.headcount
  const max = Math.max(5000, Math.ceil(start / 50) * 50)
  const [emp, setEmp] = useState(Math.min(max, Math.max(50, Math.round(start / 50) * 50)))
  const [hrs, setHrs] = useState(6)
  const saved = useMemo(() => Math.round(emp * hrs * 0.62), [emp, hrs])
  const fte = Math.round((saved / 2000) * 10) / 10
  const capacity = hrTeam ? Math.min(100, Math.round((saved / (hrTeam * 2000)) * 100)) : null
  return (
    <Section eyebrow="Value estimator" title="What could you give back to your HR team?" sub={`Adjust the sliders to your organisation${headcount ? ' — we’ve started from your numbers' : ''}. Estimates are indicative and based on typical customer outcomes.`} zoom={1.2}>
      <div className="grid grid-cols-2 gap-10 mt-2">
        <div className="card p-8 flex flex-col gap-8">
          <label className="text-[22px]">Employees: <b className="grad-text">{emp.toLocaleString(country.locale)}</b>
            <input type="range" min={50} max={max} step={50} value={emp} onChange={e => setEmp(+e.target.value)} className="w-full mt-3 accent-blue-500" /></label>
          <label className="text-[22px]">HR admin hours per employee per year: <b className="grad-text">{hrs}</b>
            <input type="range" min={2} max={20} value={hrs} onChange={e => setHrs(+e.target.value)} className="w-full mt-3 accent-blue-500" /></label>
          <div className="text-[16px]" style={{ color: 'var(--mute)' }}>Assumes ~62% of manual HR administration is automated (leave, attendance, payroll inputs, letters, queries) and ~2,000 working hours per person per year.</div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="card p-8 glow"><div className="text-[20px]" style={{ color: 'var(--mute)' }}>Hours returned to HR each year</div><div className="serif text-[100px] leading-none font-bold grad-text">{saved.toLocaleString(country.locale)}</div><div className="text-[20px]">≈ {fte} full-time people{capacity !== null ? ` · ${capacity}% of your ${hrTeam}-person HR team’s capacity` : ''}</div></div>
          <div className="grid grid-cols-3 gap-3">{industry.kpis.map(k => <div key={k.label} className="card p-4"><div className="serif text-[30px] font-bold"><Counter to={k.value} suffix={k.suffix} /></div><div className="text-[14px]" style={{ color: 'var(--mute)' }}>{k.label}</div></div>)}</div>
        </div>
      </div>
    </Section>
  )
}
