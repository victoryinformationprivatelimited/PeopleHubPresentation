import { useEffect, useState } from 'react'
import { LeaveDemo } from '../../slides/demosPilot'
import { motion } from 'framer-motion'
import { money, useDeck } from '../../engine/context'
import Chart from '../../ui/LazyChart'
import { Avatar, Badge, Counter, Phone, Window, fade } from '../../ui/primitives'

const mix = (c: string, p: number) => `color-mix(in srgb, ${c} ${p}%, transparent)`
const chartBase = { chart: { toolbar: { show: false }, background: 'transparent', foreColor: '#94a3c0', animations: { enabled: true, speed: 900 } }, grid: { borderColor: 'rgba(148,163,192,.18)' }, theme: { mode: 'dark' as const }, tooltip: { theme: 'dark' as const } }

/* ───────── Workforce Live ───────── */
export function LiveDemo() {
  const { industry, company } = useDeck()
  const d = industry.dash
  const [seg, setSeg] = useState<number | null>(null)
  const trend = [...Array(24)].map((_, k) => Math.round(d.headcount * (0.8 + 0.2 * (k / 23)) + (k % 4) * 3))
  const labels = ['Permanent', 'Contract', 'Intern']
  const colors = ['#3b6be0', '#22d3ee', '#a78bfa']
  return (
    <Window title={`${company} · Workforce Live`}>
      <div className="grid grid-cols-3 gap-3 mb-3">
        {[['Headcount', Math.round(d.headcount * (seg === null ? 1 : d.mix[seg] / 100)), ''], ['Attrition', d.attrition, '%'], ['Compliance', 94, '%']].map(([l, v, s]) => (
          <div key={l as string} className="card p-3"><div className="text-[13px]" style={{ color: 'var(--mute)' }}>{l}{l === 'Compliance' ? ' · target 95%' : ''}</div><div className="text-[30px] font-extrabold"><Counter to={v as number} suffix={s as string} /></div></div>
        ))}
      </div>
      <Chart type="area" height={150} series={[{ name: 'Headcount', data: trend }]} options={{ ...chartBase, stroke: { curve: 'smooth', width: 3 }, colors: ['#6ea0ff'], fill: { type: 'gradient', gradient: { opacityFrom: 0.45, opacityTo: 0.02 } }, dataLabels: { enabled: false }, xaxis: { labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } }, yaxis: { show: false } }} />
      <div className="text-[12px] mt-1 mb-2" style={{ color: 'var(--mute)' }}>24-month trend · click a segment to filter the whole dashboard</div>
      <div className="flex gap-1.5 mb-3">
        {d.mix.map((m, k) => (
          <button key={k} onClick={() => setSeg(seg === k ? null : k)} className="rounded-lg py-2 text-[13px] font-bold transition" style={{ flex: m, minWidth: 70, background: mix(colors[k], seg === null || seg === k ? 45 : 14), border: `1.5px solid ${seg === k ? colors[k] : 'transparent'}` }}>{labels[k]} {m}%</button>
        ))}
      </div>
      <div className="flex flex-col gap-1.5">
        {[['Medical certificates expiring this month', 14, 'warn'], ['Contracts ending in 30 days', 9, 'bad'], ['Retirements this year', 6, 'brand']].map(([t, n, tone], k) => (
          <motion.div key={t as string} {...fade(0.15 * k)} className="card px-3 py-2 flex justify-between items-center text-[14px]"><span>{t}</span><Badge tone={tone as 'warn' | 'bad' | 'brand'}>{n}</Badge></motion.div>
        ))}
      </div>
    </Window>
  )
}

/* ───────── Letters engine ───────── */
export function LettersDemo() {
  const { country, industry, company } = useDeck()
  const name = country.sampleNames[3], role = industry.roles[1]
  const [ai, setAi] = useState(false)
  const Tok = ({ t }: { t: string }) => <span className="rounded px-1.5 py-0.5 text-[12.5px] font-bold" style={{ background: mix('var(--brand)', 30), color: 'var(--brand2)' }}>{`{{${t}}}`}</span>
  return (
    <Window title={`${company} · Letters · Confirmation of service`}>
      <div className="flex gap-2 mb-3">
        <button onClick={() => setAi(true)} className="rounded-lg px-3 py-1.5 text-[13px] font-bold text-white" style={{ background: 'linear-gradient(90deg,var(--brand),var(--accent))' }}>✨ Draft with AI</button>
        <Badge>REF/HR/2026/0147</Badge><Badge tone="ok">Signatory: HR Manager</Badge><Badge tone="mute">v3 · letterhead on</Badge>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="card p-3 text-[13.5px] leading-relaxed">
          <div className="text-[11px] tracking-widest uppercase mb-1" style={{ color: 'var(--mute)' }}>Template</div>
          <p>Dear <Tok t="EmployeeName" />,</p>
          <p className="mt-1.5">We confirm your appointment as <Tok t="Designation" /> in <Tok t="Department" /> with effect from <Tok t="ConfirmationDate" />.</p>
          <p className="mt-1.5">Your monthly salary is <Tok t="BasicSalary" />.</p>
          {ai && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1.5" style={{ color: 'var(--accent)' }}>✨ We value your contribution and look forward to your continued success at <Tok t="CompanyName" />.</motion.p>}
        </div>
        <div className="rounded-lg p-3 text-[13.5px] leading-relaxed" style={{ background: '#fff', color: '#0f172a' }}>
          <div className="text-[11px] tracking-widest uppercase mb-1 text-slate-400">Preview · {name}</div>
          <p>Dear {name},</p>
          <p className="mt-1.5">We confirm your appointment as <b>{role}</b> in <b>{industry.departments[1]}</b> with effect from <b>1 November 2026</b>.</p>
          <p className="mt-1.5">Your monthly salary is <b>{money(country, Math.round(country.salary * 0.85))}</b>.</p>
          {ai && <p className="mt-1.5">We value your contribution and look forward to your continued success at {company}.</p>}
          <p className="mt-3 text-slate-500">HR Manager · {company}</p>
        </div>
      </div>
      <div className="flex gap-2 mt-3 flex-wrap">{['Snippet library', 'Reference numbering', 'Follow-up letters', 'Download PDF', 'History'].map(x => <Badge key={x} tone="mute">{x}</Badge>)}</div>
    </Window>
  )
}

/* ───────── Bulk upload & custom fields ───────── */

/* ───────── Manual attendance ───────── */
export function ManualAttDemo() {
  const { country, industry, company } = useDeck()
  const [st, setSt] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const tabs = ['Manual entry', 'Excel upload', 'Device file', 'Records', 'Upload log']
  return (
    <Window title={`${company} · Manual attendance`}>
      <div className="flex gap-1.5 mb-3 flex-wrap">{tabs.map((t, k) => <span key={t} className="rounded-lg px-3 py-1.5 text-[13px] font-semibold" style={k === 4 ? { background: 'var(--brand)', color: '#fff' } : { background: 'var(--card)', color: 'var(--mute)' }}>{t}</span>)}</div>
      <div className="flex flex-col gap-2">
        {[['B-0412', 'gate2_device_export.dat', 'Device file', 214, st], ['B-0411', 'late_entries_oct.xlsx', 'Excel', 38, 'approved'], ['B-0410', 'manual_entry', 'Entry', 3, 'approved']].map(([id, f, kind, n, s], k) => (
          <motion.div key={id as string} {...fade(0.12 * k)} className="card px-3 py-2.5 grid grid-cols-[70px_1fr_80px_100px] items-center gap-2 text-[14px]">
            <b>{id}</b><span>{f} <span style={{ color: 'var(--mute)' }}>· {kind}</span></span><span style={{ color: 'var(--mute)' }}>{n} rows</span>
            <Badge tone={s === 'approved' ? 'ok' : s === 'rejected' ? 'bad' : 'warn'}>{s === 'approved' ? '✓ Approved' : s === 'rejected' ? '✕ Rejected' : '⏳ Pending'}</Badge>
          </motion.div>
        ))}
      </div>
      {st === 'pending' ? (
        <div className="card p-3 mt-3 flex items-center justify-between"><span className="text-[14px]">Batch B-0412 · Gate 2 terminal was offline 06:00–09:00 · {industry.site.split(' – ')[0]}</span>
          <span className="flex gap-2"><button onClick={() => setSt('approved')} className="rounded-lg px-3 py-1.5 text-[13px] font-bold" style={{ background: 'var(--ok)', color: '#06281c' }}>Approve</button><button onClick={() => setSt('rejected')} className="rounded-lg px-3 py-1.5 text-[13px] font-bold" style={{ background: 'var(--bad)', color: '#fff' }}>Reject</button></span></div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-3 mt-3 text-[14px]">{st === 'approved' ? `✓ 214 punches added to attendance. Audit entry recorded for ${country.sampleNames[3]}.` : '✕ Batch rejected — nothing was added. The reason is kept in the audit trail.'} <button onClick={() => setSt('pending')} className="underline ml-2" style={{ color: 'var(--mute)' }}>reset</button></motion.div>
      )}
    </Window>
  )
}

/* ───────── Rosters ───────── */
export function RosterDemo() {
  const { country, industry, company } = useDeck()
  const shifts = industry.shifts.map(s => s.replace(/\s*\d{1,2}:\d{2}.*$/, ''))
  const colors = ['#3b6be0', '#22d3ee', '#a78bfa']
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const [grid, setGrid] = useState<number[][]>(() => [0, 1, 2, 3].map(r => days.map((_, c) => (c > 4 ? -1 : (r + Math.floor(c / 2)) % 3))))
  const cycle = (r: number, c: number) => setGrid(g => g.map((row, i) => (i === r ? row.map((v, j) => (j === c ? (v + 2) % 4 - 1 : v)) : row)))
  return (
    <Window title={`${company} · Rosters · next week`}>
      <div className="grid grid-cols-[110px_repeat(7,1fr)] gap-1.5 text-[12.5px]">
        <span />{days.map(d => <span key={d} className="text-center font-bold" style={{ color: 'var(--mute)' }}>{d}</span>)}
        {grid.map((row, r) => (
          <div key={r} className="contents">
            <span className="flex items-center gap-1.5 font-semibold"><Avatar name={country.sampleNames[[1, 3, 4, 5][r]]} size={24} />{country.sampleNames[[1, 3, 4, 5][r]].split(' ')[0]}</span>
            {row.map((v, c) => r === 2 && c === 3
              ? <div key={c} className="rounded-md py-2 text-center font-bold" style={{ background: mix('var(--bad)', 30), border: '1.5px solid var(--bad)' }}>⚠ Leave</div>
              : <button key={c} onClick={() => cycle(r, c)} className="rounded-md py-2 text-center font-bold transition" style={v < 0 ? { background: 'var(--card)', color: 'var(--mute)', border: '1px dashed var(--line)' } : { background: mix(colors[v], 38), border: `1px solid ${colors[v]}` }}>{v < 0 ? 'Off' : shifts[v]}</button>)}
          </div>
        ))}
      </div>
      <div className="card p-3 mt-3 text-[13.5px] flex items-center gap-3"><Badge tone="bad">Clash</Badge>{country.sampleNames[4].split(' ')[0]} has approved leave on Thursday — the system warns before you save.</div>
      <div className="flex gap-2 mt-2 flex-wrap">{['Click a cell to change the shift', 'Change history kept', 'Flexible-hours shifts', 'Swap requests'].map(x => <Badge key={x} tone="mute">{x}</Badge>)}</div>
    </Window>
  )
}

/* ───────── Policy & formula engine ───────── */
export function PolicyDemo() {
  const { company } = useDeck()
  const [late, setLate] = useState(25)
  const deduction = late <= 10 ? 'No deduction' : late <= 60 ? '0.5 hour deducted' : 'Half-day deducted'
  const tone = late <= 10 ? 'ok' : late <= 60 ? 'warn' : 'bad'
  return (
    <Window title={`${company} · Attendance policy · Formula builder`}>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="card p-3"><div className="font-bold text-[14px] mb-2">Late arrival</div>
          {[['0 – 10 min', 'Grace — no deduction', 'ok'], ['11 – 60 min', '0.5 hour deducted', 'warn'], ['over 60 min', 'Half-day deducted', 'bad']].map(([a, b, t]) => <div key={a} className="flex justify-between text-[13px] py-1"><span>{a}</span><Badge tone={t as 'ok' | 'warn' | 'bad'}>{b}</Badge></div>)}</div>
        <div className="card p-3"><div className="font-bold text-[14px] mb-2">Overtime</div>
          {[['first 2 hours', '× 1.5'], ['beyond 2 hours', '× 2.0'], ['rounding', 'nearest 15 min']].map(([a, b]) => <div key={a} className="flex justify-between text-[13px] py-1"><span>{a}</span><Badge>{b}</Badge></div>)}</div>
      </div>
      <div className="card p-3 mb-3 font-mono text-[13px]" style={{ color: 'var(--accent)' }}>LateDeduction = bracket(lateMinutes) · OvertimePay = round(otMinutes, 15) × rate</div>
      <div className="card p-3">
        <div className="flex justify-between text-[14px] mb-2"><span>Try it: arrives <b>{late} min</b> late</span><Badge tone={tone}>{deduction}</Badge></div>
        <input type="range" min={0} max={120} value={late} onChange={e => setLate(+e.target.value)} className="w-full accent-blue-500" />
      </div>
      <div className="flex gap-2 mt-3 flex-wrap">{['Late', 'Early leave', 'Half-day', 'Absence', 'Overtime', 'Flexi window'].map(x => <Badge key={x} tone="mute">{x}</Badge>)}</div>
    </Window>
  )
}

/* ───────── Holidays, process & reports ───────── */
export function ProcessDemo() {
  const { country, industry, company } = useDeck()
  const [done, setDone] = useState(false)
  const rows: [number, string, string, string, string, string][] = [[0, '08:02', '17:05', 'Present', 'ok', '—'], [1, '08:41', '17:00', 'Late 41m', 'warn', '—'], [2, '—', '—', 'Leave', 'brand', '—'], [3, '—', '—', 'Holiday', 'mute', '—'], [4, '07:55', '19:30', 'Present', 'ok', '2h 30m OT']]
  return (
    <Window title={`${company} · Attendance process · ${industry.shifts[0]}`}>
      <div className="flex flex-col gap-1.5 mb-3">
        {rows.map(([n, i, o, s, t, ot], k) => (
          <motion.div key={n} {...fade(0.1 * k)} className="card px-3 py-2 grid grid-cols-[1fr_58px_58px_110px_80px] items-center gap-2 text-[13.5px]">
            <span className="flex items-center gap-2"><Avatar name={country.sampleNames[n]} size={26} />{country.sampleNames[n]}</span><span>{i}</span><span>{o}</span><Badge tone={t as 'ok' | 'warn' | 'brand' | 'mute'}>{s}</Badge><span style={{ color: 'var(--mute)' }}>{ot}</span>
          </motion.div>
        ))}
      </div>
      <div className="flex items-center gap-3 mb-3">
        <button onClick={() => setDone(true)} className="rounded-lg px-4 py-2 text-[14px] font-bold text-white" style={{ background: 'linear-gradient(90deg,var(--brand),var(--accent))' }}>Process attendance</button>
        {done ? <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[14px]" style={{ color: 'var(--ok)' }}>✓ Processed with rosters, leave and {country.holidaysLabel.toLowerCase()} — 1 exception to review</motion.span> : <span className="text-[13px]" style={{ color: 'var(--mute)' }}>Applies rosters, leave, holidays and policy per shift</span>}
      </div>
      <div className="flex gap-2 flex-wrap">{['Attendance reports', 'Real vs counted punches', 'Holiday calendar', 'Assign holidays', 'Export to payroll'].map(x => <Badge key={x} tone="mute">{x}</Badge>)}</div>
    </Window>
  )
}

/* ───────── Leave types & policies ───────── */
export const LeaveTypesDemo = () => <LeaveDemo start={1} />

/* ───────── Apply for leave on the phone ───────── */
export function LeavePhoneDemo() {
  const { country } = useDeck()
  const [step, setStep] = useState(0)
  useEffect(() => { if (step === 1) { const t = setTimeout(() => setStep(2), 1500); return () => clearTimeout(t) } }, [step])
  const lt = country.leaveTypes[0]
  return (
    <div className="flex justify-center">
      <Phone>
        <div className="text-[13px]" style={{ color: 'var(--mute)' }}>Apply for leave</div>
        <div className="card p-3 my-2"><div className="text-[12px]" style={{ color: 'var(--mute)' }}>{lt[0]} balance</div><div className="text-[26px] font-extrabold">{lt[1]} <span className="text-[13px] font-medium" style={{ color: 'var(--mute)' }}>of {lt[2]} days</span></div></div>
        {[['From', 'Mon 2 Nov'], ['To', 'Wed 4 Nov · 3 days'], ['Covering', country.sampleNames[5]], ['Attachment', '—']].map(([a, b]) => <div key={a} className="flex justify-between text-[13px] py-1.5 border-b" style={{ borderColor: 'var(--line)' }}><span style={{ color: 'var(--mute)' }}>{a}</span><b>{b}</b></div>)}
        {step === 0 && <button onClick={() => setStep(1)} className="w-full mt-3 rounded-2xl py-3 font-bold text-white" style={{ background: 'linear-gradient(90deg,var(--brand),var(--accent))' }}>Submit request</button>}
        {step >= 1 && (
          <div className="mt-3 flex flex-col gap-2 text-[13px]">
            <div className="card p-2.5">✓ Sent to {country.sampleNames[2].split(' ')[0]} (Manager)</div>
            <div className="card p-2.5" style={{ opacity: step === 2 ? 1 : 0.4 }}>{step === 2 ? '✓ Approved — calendar and payroll updated' : '⏳ Waiting for approval…'}</div>
            {step === 2 && <button onClick={() => setStep(0)} className="underline text-[12px]" style={{ color: 'var(--mute)' }}>try again</button>}
          </div>
        )}
      </Phone>
    </div>
  )
}

/* ───────── Team calendar & unused leave ───────── */

/* ───────── Payslips on the phone ───────── */
export function PayslipPhoneDemo() {
  const { country, industry } = useDeck()
  const [m, setM] = useState('Oct')
  const gross = country.salary, allow = Math.round(gross * 0.15)
  const emp = country.statutory.filter(s => s.who === 'employee').map(s => ({ ...s, amt: Math.round((gross * s.rate) / 100) }))
  const tax = country.taxSample
  const net = gross - emp.reduce((a, b) => a + b.amt, 0) - tax
  return (
    <div className="flex justify-center">
      <Phone>
        <div className="flex gap-1.5 mb-2">{['Aug', 'Sep', 'Oct'].map(x => <button key={x} onClick={() => setM(x)} className="rounded-full px-3 py-1 text-[12px] font-bold" style={m === x ? { background: 'var(--brand)', color: '#fff' } : { background: 'var(--card)', color: 'var(--mute)' }}>{x} 2026</button>)}</div>
        <div className="text-[12px]" style={{ color: 'var(--mute)' }}>Net pay · {m}</div>
        <div className="text-[28px] font-extrabold grad-text mb-2">{money(country, net)}</div>
        <div className="text-[12.5px] flex flex-col gap-1">
          <div className="flex justify-between"><span>Basic</span><span>{money(country, gross - allow)}</span></div>
          <div className="flex justify-between"><span>{industry.allowance}</span><span>{money(country, allow)}</span></div>
          {emp.map(e => <div key={e.label} className="flex justify-between" style={{ color: 'var(--bad)' }}><span>{e.label} ({e.rate}%)</span><span>− {money(country, e.amt)}</span></div>)}
          {tax > 0 && <div className="flex justify-between" style={{ color: 'var(--bad)' }}><span>{country.taxName}</span><span>− {money(country, tax)}</span></div>}
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3"><div className="card py-2 text-center text-[13px] font-bold">View</div><div className="card py-2 text-center text-[13px] font-bold">Download</div></div>
      </Phone>
    </div>
  )
}

/* ───────── Reimbursements & claims ───────── */

/* ───────── Finance: GL, cost centres, banking ───────── */

/* ───────── Salary advance & loans ───────── */
export function AdvanceDemo() {
  const { country, company } = useDeck()
  const max = Math.round(country.salary * 0.5)
  const [amt, setAmt] = useState(Math.round(max * 0.5))
  const [months, setMonths] = useState(2)
  return (
    <Window title={`${company} · Salary advance request`}>
      <div className="flex justify-between items-end mb-1"><div><div className="text-[12px]" style={{ color: 'var(--mute)' }}>Amount</div><div className="text-[34px] font-extrabold grad-text">{money(country, amt)}</div></div><Badge tone="mute">limit {money(country, max)} (50% of salary)</Badge></div>
      <input type="range" min={Math.round(max * 0.1)} max={max} step={Math.max(1, Math.round(max / 50))} value={amt} onChange={e => setAmt(+e.target.value)} className="w-full accent-blue-500 mb-3" />
      <div className="flex gap-2 mb-3">{[1, 2, 3].map(m => <button key={m} onClick={() => setMonths(m)} className="rounded-lg px-4 py-2 text-[14px] font-bold" style={months === m ? { background: 'var(--brand)', color: '#fff' } : { background: 'var(--card)', border: '1px solid var(--line)' }}>Recover over {m} month{m > 1 ? 's' : ''}</button>)}</div>
      <div className="flex flex-col gap-1.5 mb-3">{[...Array(months)].map((_, k) => <div key={k} className="card px-3 py-2 flex justify-between text-[14px]"><span>{['Nov', 'Dec', 'Jan'][k]} 2026 payroll</span><b>− {money(country, Math.round(amt / months))}</b></div>)}</div>
      <div className="flex items-center gap-2 flex-wrap"><Badge tone="ok">✓ Manager</Badge><Badge tone="ok">✓ HR</Badge><Badge tone="warn">⏳ Payroll</Badge><span className="mx-1" style={{ color: 'var(--mute)' }}>·</span><Badge tone="mute">Loans: guarantors & balances</Badge></div>
    </Window>
  )
}
export { LeaveCalendarDemo, FinanceDemo, ClaimsDemo, BulkDemo } from '../../slides/demosPhase2'
