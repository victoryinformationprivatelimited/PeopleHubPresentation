import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useDeck, money } from '../engine/context'
import { Avatar, Badge, Bar, Window, fade } from '../ui/primitives'

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

export { EmployeeMasterDemo as EmployeeDemo } from './EmployeeMasterDemo'

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
  const items = ['Resignation accepted', 'Notice period computed', `Assets returned (${industry.assets[0][1]}, ${industry.assets[2][1]})`, 'Exit interview completed', 'Leave encashment calculated', 'Final settlement approved']
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


/* ---------- WORKFORCE OPERATIONS ---------- */




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


/* Clickable versions of these module screens live in demosPilot.tsx */
export { AttendanceDemo, LeaveDemo, PayrollDemo, PerformanceDemo, RecruitmentDemo, TasksDemo } from './demosPilot'
