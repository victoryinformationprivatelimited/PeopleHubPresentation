import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useDeck, money } from '../engine/context'
import { Avatar, Badge, Bar, Counter, Window, fade } from '../ui/primitives'

/* ---------- CORE HR ---------- */

export function OrgDemo() {
  const { country, industry, company } = useDeck()
  const [moved, setMoved] = useState(false)
  useEffect(() => { const t = setTimeout(() => setMoved(true), 2600); return () => clearTimeout(t) }, [])
  const heads = industry.departments.slice(1, 4)
  const teams = industry.departments.slice(4, 6)
  const Node = ({ name, role, c = 'var(--brand2)' }: { name: string; role: string; c?: string }) => (
    <div className="card px-4 py-3 flex items-center gap-3 min-w-[200px]" style={{ borderColor: c }}>
      <Avatar name={name} size={40} /><div><div className="font-bold text-[16px]">{name}</div><div className="text-[13px]" style={{ color: 'var(--mute)' }}>{role}</div></div>
    </div>
  )
  const n = country.sampleNames
  return (
    <Window title={`${company} · Organization · live org chart`}>
      <div className="flex flex-col items-center gap-6 py-2">
        <motion.div {...fade(0)}><Node name={n[0]} role={industry.roles[0]} c="var(--accent)" /></motion.div>
        <div className="flex gap-6">
          {heads.map((h, k) => (
            <motion.div layout key={h} {...fade(0.2 + k * 0.15)} className="flex flex-col items-center gap-4">
              <Node name={n[k + 1]} role={`Head · ${h}`} />
              <div className="flex flex-col gap-3">
                {(k === 0 && !moved ? teams : k === 1 && moved ? teams : []).map((t, j) => (
                  <motion.div layout layoutId={t} key={t} transition={{ type: 'spring', stiffness: 120, damping: 18 }} className="card px-4 py-2 text-[15px]" style={{ borderStyle: 'dashed' }}>
                    <span className="text-[12px] block" style={{ color: 'var(--mute)' }}>Unit {j + 1}</span>{t}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        <Badge tone={moved ? 'ok' : 'mute'}>{moved ? '✓ Restructure applied — chart updated automatically' : 'Reporting lines defined…'}</Badge>
      </div>
    </Window>
  )
}

const sections = ['Personal', 'Contact', 'Job', 'Compensation', 'Bank', 'Statutory', 'Education', 'Experience', 'Skills', 'Family', 'Emergency', 'Documents', 'Contracts', 'Assets', 'Leave', 'Attendance', 'Training', 'Performance', 'Disciplinary', 'Loans', 'Benefits', 'Letters', 'History']
export function EmployeeDemo() {
  const { country, industry, company } = useDeck()
  const [first, last] = country.sampleNames[1].toLowerCase().split(' ')
  const mail = `${first}.${last}@${company.toLowerCase().replace(/[^a-z0-9]/g, '') || 'company'}.com`
  return (
    <Window title="Employee · Profile">
      <div className="flex gap-6 items-center mb-5">
        <Avatar name={country.sampleNames[1]} size={84} />
        <div className="flex-1">
          <div className="text-[28px] font-bold">{country.sampleNames[1]}</div>
          <div style={{ color: 'var(--mute)' }}>{industry.roles[1]} · {industry.departments[1]} · EMP-00421</div>
          <div className="text-[14px]" style={{ color: 'var(--mute)' }}>✉ {mail} · ☎ {country.phoneExample}</div>
          <div className="flex gap-2 mt-2"><Badge tone="ok">Active</Badge><Badge>Confirmed</Badge><Badge tone="warn">🔒 Encrypted PII</Badge></div>
        </div>
      </div>
      <div className="text-[13px] tracking-widest uppercase mb-2" style={{ color: 'var(--mute)' }}>23 profile sections</div>
      <div className="flex flex-wrap gap-2">
        {sections.map((s, k) => <motion.span key={s} {...fade(0.03 * k)} className="card px-3 py-1.5 text-[14px]">{s}</motion.span>)}
      </div>
    </Window>
  )
}

export function LifecycleDemo() {
  const steps = [['Hired', 'Day 1'], ['Confirmed', 'Month 6'], ['Promoted', 'Year 2'], ['Transferred', 'Year 3'], ['Promoted', 'Year 5'], ['Exit', 'Year 7']]
  return (
    <Window title="Employee Life Cycle · Journey">
      <div className="relative py-10 px-2">
        <div className="absolute left-6 right-6 top-[62px] h-[3px] rounded" style={{ background: 'var(--line)' }} />
        <motion.div className="absolute left-6 top-[62px] h-[3px] rounded" style={{ background: 'linear-gradient(90deg,var(--brand2),var(--accent))' }} initial={{ width: 0 }} animate={{ width: 'calc(100% - 48px)' }} transition={{ duration: 3.5, ease: 'easeInOut' }} />
        <div className="relative flex justify-between">
          {steps.map(([s, t], k) => (
            <motion.div key={k} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.55 * k }} className="flex flex-col items-center w-[110px] text-center">
              <div className="w-8 h-8 rounded-full grid place-items-center text-[14px] font-bold" style={{ background: 'var(--brand)', boxShadow: '0 0 20px var(--brand)' }}>{k + 1}</div>
              <div className="mt-3 font-bold text-[17px]">{s}</div><div className="text-[13px]" style={{ color: 'var(--mute)' }}>{t}</div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {['Letters auto-generated', 'Approvals routed', 'History preserved'].map((t, k) => <motion.div key={t} {...fade(3 + 0.2 * k)} className="card p-3 text-center text-[15px]">✓ {t}</motion.div>)}
      </div>
    </Window>
  )
}

export function TerminationDemo() {
  const { country, industry, company } = useDeck()
  const items = ['Resignation accepted', 'Notice period computed', `Assets returned (${industry.assets[0][1].toLowerCase()}, ${industry.assets[2][1].toLowerCase()})`, 'Exit interview completed', 'Leave encashment calculated', 'Final settlement approved']
  return (
    <Window title={`${company} · Exit · ${country.sampleNames[4]}`}>
      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-3 flex flex-col gap-2.5">
          {items.map((t, k) => (
            <motion.div key={t} {...fade(0.2)} className="card px-4 py-3 flex items-center gap-3 text-[17px]">
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + k * 0.5, type: 'spring' }} className="w-6 h-6 rounded-full grid place-items-center text-[13px]" style={{ background: 'var(--ok)', color: '#06281c' }}>✓</motion.span>{t}
            </motion.div>
          ))}
        </div>
        <motion.div {...fade(3.4)} className="col-span-2 card p-5 flex flex-col justify-center text-center">
          <div className="text-[14px]" style={{ color: 'var(--mute)' }}>Final settlement</div>
          <div className="text-[36px] font-extrabold grad-text">{money(country, country.settlement)}</div>
          <div className="mt-2"><Badge tone="ok">Cleared by all departments</Badge></div>
        </motion.div>
      </div>
    </Window>
  )
}

export function RecruitmentDemo() {
  const { country, industry, company } = useDeck()
  const cols = [['Applied', 14], ['Screening', 8], ['Interview', 5], ['Offer', 2]] as const
  return (
    <Window title={`${company} · Recruitment · ${industry.roles[2]}`}>
      <div className="grid grid-cols-4 gap-3">
        {cols.map(([c, n], k) => (
          <div key={c}>
            <div className="flex justify-between text-[14px] mb-2" style={{ color: 'var(--mute)' }}><span>{c}</span><b style={{ color: 'var(--ink)' }}>{n}</b></div>
            <div className="flex flex-col gap-2">
              {[0, 1, 2].slice(0, 3 - Math.floor(k / 2)).map(j => (
                <motion.div key={j} {...fade(0.15 * (k + j))} className="card p-3 flex items-center gap-2 text-[14px]">
                  <Avatar name={country.sampleNames[(k * 2 + j) % 8]} size={30} />{country.sampleNames[(k * 2 + j) % 8].split(' ')[0]}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <motion.div {...fade(1.6)} className="card p-4 mt-5 flex items-center justify-between">
        <span>🎉 Offer accepted — <b>{country.sampleNames[3]}</b></span><Badge tone="ok">Joining {company} · 9 onboarding tasks</Badge>
      </motion.div>
    </Window>
  )
}

/* ---------- WORKFORCE OPERATIONS ---------- */

export function AttendanceDemo() {
  const { country, industry, company } = useDeck()
  const dots = [[200, 170, 1], [260, 230, 1], [150, 240, 1], [310, 140, 1], [470, 120, 0]] as const
  return (
    <Window title={`${company} · Geofence · ${industry.site}`}>
      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-3 rounded-2xl overflow-hidden relative" style={{ background: 'color-mix(in srgb, var(--brand) 10%, var(--bg))', height: 380 }}>
          <svg viewBox="0 0 560 380" className="w-full h-full">
            {[...Array(8)].map((_, k) => <line key={k} x1={0} x2={560} y1={k * 54} y2={k * 54} stroke="var(--line)" />)}
            {[...Array(11)].map((_, k) => <line key={k} y1={0} y2={380} x1={k * 56} x2={k * 56} stroke="var(--line)" />)}
            <circle cx="240" cy="190" r="120" fill="var(--brand)" fillOpacity=".15" stroke="var(--brand2)" strokeWidth="2" strokeDasharray="8 6" className="flow-line" />
            <circle cx="240" cy="190" r="120" fill="none" stroke="var(--accent)" strokeWidth="2"><animate attributeName="r" values="30;130" dur="2.4s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.7;0" dur="2.4s" repeatCount="indefinite" /></circle>
            {dots.map(([x, y, inside], k) => (
              <g key={k}><circle cx={x} cy={y} r="9" fill={inside ? 'var(--ok)' : 'var(--bad)'} className="pulse-dot" /></g>
            ))}
            <text x="240" y="195" textAnchor="middle" fill="var(--ink)" fontSize="13" fontWeight="700">{industry.site.split(" – ")[0]}</text>
          </svg>
        </div>
        <div className="col-span-2 flex flex-col gap-2.5">
          {[0, 1, 2, 4].map((k, j) => (
            <motion.div key={k} {...fade(0.4 * j + 0.3)} className="card p-3 flex items-center gap-3 text-[15px]">
              <Avatar name={country.sampleNames[k]} size={34} />
              <div className="flex-1"><div className="font-semibold">{country.sampleNames[k]}</div><div className="text-[12px]" style={{ color: 'var(--mute)' }}>{j === 3 ? 'Outside zone · 1.2 km' : `Checked in 08:${10 + j * 4}`}</div></div>
              {j === 3 ? <Badge tone="warn">Send for approval</Badge> : <Badge tone="ok">In zone</Badge>}
            </motion.div>
          ))}
          <div className="text-[13px]" style={{ color: 'var(--mute)' }}>Also: biometric · time clock · manual entry (approved)</div>
        </div>
      </div>
    </Window>
  )
}

export function LeaveDemo() {
  const { country } = useDeck()
  const bal = country.leaveTypes
  return (
    <Window title="Leave · Request & approval">
      <div className="grid grid-cols-3 gap-4 mb-5">
        {bal.map(([n, a, t], k) => (
          <motion.div key={n as string} {...fade(0.1 * k)} className="card p-4">
            <div className="text-[14px]" style={{ color: 'var(--mute)' }}>{n}</div>
            <div className="text-[32px] font-extrabold"><Counter to={a as number} /><span className="text-[16px] font-medium" style={{ color: 'var(--mute)' }}> / {t} days</span></div>
            <Bar pct={((a as number) / (t as number)) * 100} delay={0.3} />
          </motion.div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        {[[country.sampleNames[2], `Applied · 3 days ${country.leaveTypes[0][0]}`], ['Line manager', 'Approved'], ['HR', 'Approved'], ['Payroll & calendar', 'Updated']].map(([a, b], k) => (
          <motion.div key={k} className="contents" {...fade(0.9 + 0.7 * k)}>
            <div className="card p-3 flex-1 text-center"><div className="text-[14px] font-bold">{a}</div><div className="text-[12px]" style={{ color: k ? 'var(--ok)' : 'var(--mute)' }}>{b}</div></div>
            {k < 3 && <span style={{ color: 'var(--brand2)' }}>➜</span>}
          </motion.div>
        ))}
      </div>
    </Window>
  )
}

export function PayrollDemo() {
  const { country, industry, company, logo } = useDeck()
  const gross = country.salary
  const allow = Math.round(gross * 0.15)
  const emp = country.statutory.filter(s => s.who === 'employee')
  const er = country.statutory.filter(s => s.who === 'employer')
  const ded = emp.map(s => ({ ...s, amt: Math.round((gross * s.rate) / 100) }))
  const tax = country.taxSample
  const net = gross - ded.reduce((a, b) => a + b.amt, 0) - tax
  const stages = ['Attendance imported', 'OT & allowances applied', 'Statutory & tax computed', 'Payslips generated']
  const [step, setStep] = useState(0)
  useEffect(() => { const t = setInterval(() => setStep(s => Math.min(s + 1, 4)), 700); return () => clearInterval(t) }, [])
  return (
    <Window title={`${company} · Payroll run · ${country.name}`}>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2.5">
          {stages.map((s, k) => (
            <div key={s} className="card px-4 py-3 flex items-center gap-3 text-[16px]" style={{ opacity: step > k ? 1 : 0.35 }}>
              <span className="w-6 h-6 rounded-full grid place-items-center text-[12px]" style={{ background: step > k ? 'var(--ok)' : 'var(--line)', color: '#06281c' }}>{step > k ? '✓' : ''}</span>{s}
            </div>
          ))}
          <Bar pct={(step / 4) * 100} color="var(--ok)" />
          <div className="text-[13px]" style={{ color: 'var(--mute)' }}>Employer: {er.map(e => `${e.label} ${e.rate}%`).join(' · ')}</div>
        </div>
        <motion.div animate={{ opacity: step >= 4 ? 1 : 0.3, scale: step >= 4 ? 1 : 0.97 }} className="card p-5 text-[16px]">
          <div className="flex justify-between items-center mb-3"><span className="flex items-center gap-2">{logo && <img src={logo} alt="" className="h-6 max-w-[80px] object-contain bg-white rounded px-1" />}<b>Payslip · Oct 2026</b></span><Badge tone="ok">Sent to app</Badge></div>
          <div className="flex justify-between py-1"><span>Basic pay</span><span>{money(country, gross - allow)}</span></div>
          <div className="flex justify-between py-1"><span>{industry.allowance}</span><span>{money(country, allow)}</span></div>
          <div className="flex justify-between py-1 border-t" style={{ borderColor: 'var(--line)' }}><span>Gross pay</span><span>{money(country, gross)}</span></div>
          {ded.map(d => <div key={d.label + d.who} className="flex justify-between py-1" style={{ color: 'var(--bad)' }}><span>{d.label} ({d.rate}%)</span><span>− {money(country, d.amt)}</span></div>)}
          {tax > 0 && <div className="flex justify-between py-1" style={{ color: 'var(--bad)' }}><span>{country.taxName}</span><span>− {money(country, tax)}</span></div>}
          <div className="flex justify-between pt-3 mt-2 border-t text-[22px] font-extrabold" style={{ borderColor: 'var(--line)' }}><span>Net pay</span><span className="grad-text">{money(country, net)}</span></div>
        </motion.div>
      </div>
    </Window>
  )
}

export function LoansDemo() {
  const { country, company } = useDeck()
  const inst = Math.round(country.loan / 6)
  const rows = [...Array(6)].map((_, k) => ({ m: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'][k], amt: inst, bal: country.loan - inst * (k + 1) }))
  return (
    <Window title={`${company} · Staff loan · ${country.sampleNames[5]}`}>
      <div className="flex items-center justify-between mb-4"><div><div className="text-[14px]" style={{ color: 'var(--mute)' }}>Principal</div><div className="text-[34px] font-extrabold">{money(country, country.loan)}</div></div><Badge tone="ok">Approved · deducted via payroll</Badge></div>
      <div className="flex flex-col gap-1.5">
        {rows.map((r, k) => (
          <motion.div key={r.m} {...fade(0.2 * k)} className="card px-4 py-2 grid grid-cols-4 items-center text-[15px]">
            <span>{r.m}</span><span>{money(country, r.amt)}</span><span style={{ color: 'var(--mute)' }}>Balance {money(country, r.bal)}</span><Bar pct={((country.loan - r.bal) / country.loan) * 100} delay={0.2 * k} />
          </motion.div>
        ))}
      </div>
    </Window>
  )
}

export function BenefitsDemo() {
  const { industry } = useDeck()
  const plans = industry.benefits
  return (
    <Window title="Benefits · My enrolment">
      <div className="grid grid-cols-2 gap-4">
        {plans.map(([i, n, d, on], k) => (
          <motion.div key={n} {...fade(0.15 * k)} className="card p-5">
            <div className="flex justify-between items-start"><span className="text-[34px]">{i}</span>
              <motion.span className="w-14 h-7 rounded-full p-1 flex" style={{ background: on ? 'var(--ok)' : 'var(--line)', justifyContent: on ? 'flex-end' : 'flex-start' }}><motion.span layout className="w-5 h-5 rounded-full bg-white" /></motion.span></div>
            <div className="font-bold text-[19px] mt-2">{n}</div><div className="text-[14px]" style={{ color: 'var(--mute)' }}>{d}</div>
            <div className="mt-2">{on ? <Badge tone="ok">Enrolled</Badge> : <Badge tone="warn">Open for enrolment</Badge>}</div>
          </motion.div>
        ))}
      </div>
    </Window>
  )
}

/* ---------- TALENT ---------- */

export function PerformanceDemo() {
  const { industry } = useDeck()
  const axes = ['Delivery', 'Teamwork', 'Leadership', 'Quality', 'Initiative', 'Comms']
  const self = [0.8, 0.7, 0.6, 0.85, 0.75, 0.7], peer = [0.7, 0.85, 0.7, 0.75, 0.6, 0.8]
  const pt = (v: number, k: number) => { const a = (Math.PI * 2 * k) / 6 - Math.PI / 2; return `${200 + Math.cos(a) * 140 * v},${180 + Math.sin(a) * 140 * v}` }
  return (
    <Window title="Performance · 360° review">
      <div className="grid grid-cols-2 gap-4 items-center">
        <svg viewBox="0 0 400 360" className="w-full">
          {[0.25, 0.5, 0.75, 1].map(r => <polygon key={r} points={axes.map((_, k) => pt(r, k)).join(' ')} fill="none" stroke="var(--line)" />)}
          {axes.map((a, k) => { const [x, y] = pt(1.18, k).split(',').map(Number); return <text key={a} x={x} y={y} textAnchor="middle" fill="var(--mute)" fontSize="13">{a}</text> })}
          <motion.polygon points={self.map((v, k) => pt(v, k)).join(' ')} fill="var(--brand)" fillOpacity=".35" stroke="var(--brand2)" strokeWidth="2" initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }} style={{ transformOrigin: '200px 180px' }} transition={{ duration: 1 }} />
          <motion.polygon points={peer.map((v, k) => pt(v, k)).join(' ')} fill="var(--accent)" fillOpacity=".25" stroke="var(--accent)" strokeWidth="2" initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }} style={{ transformOrigin: '200px 180px' }} transition={{ duration: 1, delay: 0.4 }} />
        </svg>
        <div className="flex flex-col gap-4">
          {industry.goals.map(([g, p], k) => (
            <div key={g as string}><div className="flex justify-between text-[15px] mb-1"><span>{g}</span><b>{p}%</b></div><Bar pct={p as number} delay={0.3 + 0.2 * k} /></div>
          ))}
          <div className="flex gap-2"><Badge>Self</Badge><Badge tone="ok">Peers</Badge><Badge tone="warn">Manager review due</Badge></div>
        </div>
      </div>
    </Window>
  )
}

export function TrainingDemo() {
  const { industry, company } = useDeck()
  const courses = industry.courses
  return (
    <Window title={`${company} · Training calendar`}>
      <div className="grid grid-cols-7 gap-1.5 mb-5">
        {[...Array(21)].map((_, k) => (
          <motion.div key={k} {...fade(0.015 * k)} className="card h-[46px] grid place-items-center text-[13px]" style={[4, 11, 16].includes(k) ? { background: 'var(--brand)', borderColor: 'var(--brand2)' } : { color: 'var(--mute)' }}>{k + 1}</motion.div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {courses.map(([c, p], k) => <div key={c as string}><div className="flex justify-between text-[15px] mb-1"><span>{c}</span><b style={{ color: p === 100 ? 'var(--ok)' : 'var(--ink)' }}>{p === 100 ? 'Certified ✓' : `${p}%`}</b></div><Bar pct={p as number} color={p === 100 ? 'var(--ok)' : 'var(--brand2)'} delay={0.2 * k} /></div>)}
      </div>
    </Window>
  )
}

export function SuccessionDemo() {
  const { country } = useDeck()
  const cells = [['Rough diamond', 0, 2], ['Future leader', 1, 2], ['Star', 2, 2], ['Inconsistent', 0, 1], ['Core player', 1, 1], ['High performer', 2, 1], ['Risk', 0, 0], ['Effective', 1, 0], ['Trusted pro', 2, 0]] as const
  return (
    <Window title="Succession · 9-box talent grid">
      <div className="grid grid-cols-3 gap-2">
        {[...cells].sort((a, b) => a[2] === b[2] ? a[1] - b[1] : b[2] - a[2]).map(([n, x, y], k) => (
          <div key={n} className="card p-3 h-[120px] relative" style={{ background: x + y >= 3 ? 'color-mix(in srgb, var(--ok) 18%, transparent)' : undefined }}>
            <div className="text-[12px]" style={{ color: 'var(--mute)' }}>{n}</div>
            {x === 2 && y === 2 && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8, type: 'spring' }} className="flex mt-2 -space-x-2"><Avatar name={country.sampleNames[2]} size={36} /><Avatar name={country.sampleNames[6]} size={36} /></motion.div>}
            {x === 1 && y === 2 && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2, type: 'spring' }} className="mt-2"><Avatar name={country.sampleNames[5]} size={36} /></motion.div>}
            {k === 4 && <Badge tone="mute">12</Badge>}
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2"><Badge tone="ok">Ready now: 2</Badge><Badge tone="warn">Ready in 1–2 yrs: 3</Badge></div>
    </Window>
  )
}

export function TasksDemo() {
  const { country, industry, company } = useDeck()
  const cols: [string, string[], string][] = [['To do', industry.tasks.todo, 'var(--mute)'], ['In progress', industry.tasks.doing, 'var(--warn)'], ['Done', industry.tasks.done, 'var(--ok)']]
  return (
    <Window title={`${company} · Onboarding ${country.sampleNames[3]}`}>
      <div className="grid grid-cols-3 gap-4">
        {cols.map(([c, items, col], ci) => (
          <div key={c}><div className="text-[14px] mb-2 font-bold" style={{ color: col }}>● {c}</div>
            <div className="flex flex-col gap-2">{items.map((t, k) => <motion.div key={t} {...fade(0.2 * (ci + k))} className="card p-3 text-[15px]">{t}<div className="flex justify-between mt-2"><Badge tone={ci === 1 ? 'warn' : 'mute'}>{ci === 2 ? 'Done' : 'Due Fri'}</Badge><Avatar name={country.sampleNames[(ci + k) % 8]} size={26} /></div></motion.div>)}</div></div>
        ))}
      </div>
    </Window>
  )
}
