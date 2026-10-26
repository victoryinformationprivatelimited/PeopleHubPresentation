import { useState } from 'react'
import { motion } from 'framer-motion'
import { poss, useDeck } from '../../engine/context'
import Chart from '../../ui/LazyChart'
import { Avatar, Badge, Phone, Window, fade } from '../../ui/primitives'

const mix = (c: string, p: number) => `color-mix(in srgb, ${c} ${p}%, transparent)`
const chartBase = { chart: { toolbar: { show: false }, background: 'transparent', foreColor: '#94a3c0', animations: { enabled: true, speed: 800 } }, grid: { borderColor: 'rgba(148,163,192,.18)' }, theme: { mode: 'dark' as const }, tooltip: { theme: 'dark' as const } }

/* ───────── Workflow Builder ───────── */
export function WorkflowBuilderDemo() {
  const { company } = useDeck()
  const [steps, setSteps] = useState([['Line manager', 'Role', '1 approval'], ['HR', 'Role', '1 approval'], ['Head of entity', 'Entity', 'only if > 5 days']])
  const [esc, setEsc] = useState(true)
  const extra = ['Finance', 'Operations lead']
  return (
    <Window title={`${company} · Workflow Builder · Apply leave`}>
      <div className="flex flex-wrap gap-2 mb-3">{['Apply leave', 'Attendance regularisation', 'Shift change', 'Salary advance', 'Profile update'].map((t, k) => <span key={t} className="rounded-full px-3 py-1 text-[13px] font-semibold" style={k === 0 ? { background: 'var(--brand)', color: '#fff' } : { background: 'var(--card)', color: 'var(--mute)', border: '1px solid var(--line)' }}>{t}</span>)}</div>
      <div className="flex flex-col gap-2">
        {steps.map(([n, t, m], k) => (
          <motion.div key={n + k} {...fade(0.08 * k)} className="card px-3 py-2.5 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full grid place-items-center font-extrabold text-white flex-none" style={{ background: 'var(--brand)' }}>{k + 1}</span>
            <div className="flex-1"><b className="text-[15px]">{n}</b><div className="text-[12px]" style={{ color: 'var(--mute)' }}>Assignee: {t} · {m}</div></div>
            <Badge tone="mute">🛡 covering: auto after 24 h</Badge>
          </motion.div>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-3">
        <button onClick={() => setSteps(s => (s.length < 5 ? [...s, [extra[s.length - 3] ?? 'Finance', 'Role', '1 approval']] : s))} className="rounded-lg px-3 py-1.5 text-[13px] font-bold" style={{ border: '1px dashed var(--brand2)', color: 'var(--brand2)' }}>＋ Add step</button>
        <button onClick={() => setEsc(e => !e)} className="rounded-lg px-3 py-1.5 text-[13px] font-semibold flex items-center gap-2" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
          <span className="w-9 h-5 rounded-full p-0.5 flex" style={{ background: esc ? 'var(--ok)' : 'var(--line)', justifyContent: esc ? 'flex-end' : 'flex-start' }}><span className="w-4 h-4 rounded-full bg-white" /></span>Auto-escalate after 24 h
        </button>
        {esc && <Badge tone="warn">⏫ escalates to the next level</Badge>}
      </div>
    </Window>
  )
}

/* ───────── Higher Authorization ───────── */
export function HigherAuthDemo() {
  const { country } = useDeck()
  const [rows, setRows] = useState([{ who: country.sampleNames[4], what: 'Change salary band — Grade 4', st: 'pending' }, { who: country.sampleNames[3], what: 'Delete employee record', st: 'pending' }, { who: country.sampleNames[5], what: 'Edit payroll bank account', st: 'pending' }])
  const set = (i: number, st: string) => setRows(r => r.map((x, k) => (k === i ? { ...x, st } : x)))
  return (
    <Window title="Higher Authorization">
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4 flex flex-col gap-2" style={{ borderColor: 'var(--warn)' }}>
          <div className="text-[34px]">🔒</div>
          <b className="text-[17px]">Higher Authorization approval required</b>
          <div className="text-[13.5px]" style={{ color: 'var(--mute)' }}>“Change salary band” is a sensitive action. A request has been sent to a higher authority; nothing changes until it is approved.</div>
          <Badge tone="ok">✓ Request raised · ref HA-0192</Badge>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-[12px] tracking-widest uppercase" style={{ color: 'var(--mute)' }}>Approver’s page</div>
          {rows.map((r, k) => (
            <div key={r.what} className="card px-3 py-2 text-[13px]">
              <div className="flex justify-between"><b>{r.what}</b>{r.st !== 'pending' && <Badge tone={r.st === 'approved' ? 'ok' : 'bad'}>{r.st === 'approved' ? '✓ approved' : '✕ rejected'}</Badge>}</div>
              <div style={{ color: 'var(--mute)' }}>requested by {r.who}</div>
              {r.st === 'pending' && <div className="flex gap-2 mt-1.5"><button onClick={() => set(k, 'approved')} className="rounded-md px-3 py-1 text-[12px] font-bold" style={{ background: 'var(--ok)', color: '#06281c' }}>Approve</button><button onClick={() => set(k, 'rejected')} className="rounded-md px-3 py-1 text-[12px] font-bold" style={{ background: 'var(--bad)', color: '#fff' }}>Reject</button></div>}
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2 mt-3 flex-wrap">{['MFA to confirm', 'Remarks required', 'Bulk approve', 'Full approval log'].map(x => <Badge key={x} tone="mute">{x}</Badge>)}</div>
    </Window>
  )
}

/* ───────── Manager approvals inbox ───────── */
export function InboxDemo() {
  const { country, company } = useDeck()
  const n = country.sampleNames
  const [items, setItems] = useState([
    { k: 'Leave', who: n[1], what: `${country.leaveTypes[0][0]} leave · 3 days`, st: '' },
    { k: 'Attendance', who: n[3], what: 'Missed punch · Tue 08:05', st: '' },
    { k: 'Roster', who: n[5], what: 'Swap Friday shift with ' + n[4].split(' ')[0], st: '' },
  ])
  const act = (i: number, st: string) => setItems(a => a.map((x, k) => (k === i ? { ...x, st } : x)))
  const left = items.filter(i => !i.st).length
  return (
    <Window title={`${company} · Manager workspace · Approvals`}>
      <div className="grid grid-cols-3 gap-2 mb-3">{[['In today', '9 of 12'], ['On leave', '2'], ['Waiting for you', String(left)]].map(([a, b]) => <div key={a} className="card p-3 text-center"><div className="text-[26px] font-extrabold grad-text">{b}</div><div className="text-[12px]" style={{ color: 'var(--mute)' }}>{a}</div></div>)}</div>
      <div className="flex flex-col gap-2">
        {items.map((it, k) => (
          <div key={it.what} className="card px-3 py-2.5 flex items-center gap-3">
            <Avatar name={it.who} size={34} />
            <div className="flex-1 text-[14px]"><b>{it.who}</b> <Badge tone="mute">{it.k}</Badge><div style={{ color: 'var(--mute)' }}>{it.what}</div></div>
            {it.st ? <Badge tone={it.st === 'Approved' ? 'ok' : it.st === 'Rejected' ? 'bad' : 'warn'}>{it.st}</Badge> : (
              <span className="flex gap-1.5">
                <button onClick={() => act(k, 'Approved')} className="rounded-md px-2.5 py-1 text-[12px] font-bold" style={{ background: 'var(--ok)', color: '#06281c' }}>Approve</button>
                <button onClick={() => act(k, 'Rejected')} className="rounded-md px-2.5 py-1 text-[12px] font-bold" style={{ background: 'var(--bad)', color: '#fff' }}>Reject</button>
                <button onClick={() => act(k, 'Escalated')} className="rounded-md px-2.5 py-1 text-[12px] font-bold" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>Escalate</button>
              </span>
            )}
          </div>
        ))}
      </div>
    </Window>
  )
}

/* ───────── Android app ───────── */
export function AndroidDemo() {
  const { country, company, industry } = useDeck()
  const [inn, setIn] = useState(false)
  const [plat, setPlat] = useState<'Android' | 'iPhone'>('Android')
  return (
    <div className="flex items-center justify-center gap-10">
      <Phone>
        <div className="text-[12px] font-bold truncate" style={{ color: 'var(--mute)' }}>{company} · {plat}</div>
        <div className="text-[17px] font-bold mb-2">Good morning, {country.sampleNames[1].split(' ')[0]} 👋</div>
        <div className="card p-3 mb-2">
          <div className="flex justify-between text-[12px]"><span>📍 {industry.site.split(' – ')[0]}</span><Badge tone="ok">inside zone · 40 m</Badge></div>
          <button onClick={() => setIn(true)} className="w-full mt-2 rounded-xl py-2.5 font-bold text-white" style={{ background: inn ? 'var(--ok)' : 'linear-gradient(90deg,var(--brand),var(--accent))', color: inn ? '#06281c' : '#fff' }}>{inn ? '✓ Checked in 08:02' : '📷 Check in'}</button>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[12px]">{[['Leave', `${country.leaveTypes[0][1]} days`], ['Payslip', 'Oct ready'], ['Approvals', '2 waiting'], ['Roster', 'Shift A']].map(([a, b]) => <div key={a} className="card p-2.5"><div style={{ color: 'var(--mute)' }}>{a}</div><b className="text-[14px]">{b}</b></div>)}</div>
      </Phone>
      <div className="flex flex-col gap-2.5 w-[260px]">
        <div className="serif text-[26px] font-bold">Mobile apps</div>
        <div className="flex gap-2">{(['Android', 'iPhone'] as const).map(x => <button key={x} onClick={() => setPlat(x)} className="rounded-full px-4 py-1.5 text-[14px] font-bold" style={plat === x ? { background: 'var(--brand)', color: '#fff' } : { background: 'var(--card)', border: '1px solid var(--line)' }}>{x === 'Android' ? '🤖 Android' : ' iPhone'}</button>)}</div>
        {['Camera + GPS check-in', 'Leave, payslips, roster', 'Approvals for managers', 'Same login on both platforms', 'Same login as the web portal'].map((x, k) => <motion.div key={x} {...fade(0.12 * k)} className="card px-3 py-2 text-[14px]">✓ {x}</motion.div>)}
      </div>
    </div>
  )
}

/* ───────── News & announcements ───────── */
export function NewsDemo() {
  const { country, company } = useDeck()
  const posts = [['📌 Pinned', 'New leave policy from 1 November', 'HR', 'Read by 78%', 'warn'], ['Company', `Welcome to ${poss(company)} new ${country.mapCenter} office`, 'Admin', 'Read by 64%', 'brand'], ['Event', 'Friday quiz & team lunch', 'People team', '41 going', 'ok']] as const
  return (
    <Window title={`${company} · News & announcements`}>
      <div className="flex justify-between items-center mb-3"><div className="flex gap-1.5">{['All', 'Policy', 'Events', 'Recognition'].map((t, k) => <span key={t} className="rounded-full px-3 py-1 text-[13px] font-semibold" style={k === 0 ? { background: 'var(--brand)', color: '#fff' } : { background: 'var(--card)', color: 'var(--mute)' }}>{t}</span>)}</div><button className="rounded-lg px-3 py-1.5 text-[13px] font-bold text-white" style={{ background: 'linear-gradient(90deg,var(--brand),var(--accent))' }}>＋ Post</button></div>
      <div className="flex flex-col gap-2 mb-3">{posts.map(([c, t, by, r, tone], k) => <motion.div key={t} {...fade(0.12 * k)} className="card px-3 py-2.5"><div className="flex justify-between items-center"><Badge tone={tone}>{c}</Badge><span className="text-[12px]" style={{ color: 'var(--mute)' }}>{r}</span></div><div className="font-bold text-[16px] mt-1">{t}</div><div className="text-[12px]" style={{ color: 'var(--mute)' }}>Posted by {by}</div></motion.div>)}</div>
      <div className="grid grid-cols-2 gap-3"><div className="card p-3 text-[13.5px]">🎂 <b>{country.sampleNames[5].split(' ')[0]}</b> and 2 others have birthdays this week</div><div className="card p-3 text-[13.5px]">🏖 Next holiday: <b>{country.holidaysLabel.split(' ')[0]}</b> · Friday</div></div>
    </Window>
  )
}

/* ───────── Report & dashboard builder ───────── */
export function ReportBuilderDemo() {
  const { industry, company } = useDeck()
  const [type, setType] = useState<'bar' | 'donut' | 'line'>('bar')
  const [by, setBy] = useState<'Department' | 'Contract type'>('Department')
  const [pinned, setPinned] = useState<string[]>([])
  const d = industry.dash
  const labels = by === 'Department' ? industry.departments.map(x => x.split(' ')[0]) : ['Permanent', 'Contract', 'Intern']
  const values = by === 'Department' ? d.deptCounts : d.mix.map(m => Math.round(d.headcount * m / 100))
  const opts = { ...chartBase, labels, colors: ['#3b6be0', '#22d3ee', '#a78bfa', '#34d399', '#fbbf24', '#fb7185'], dataLabels: { enabled: false }, stroke: { curve: 'smooth' as const, width: 3 }, xaxis: { categories: labels, labels: { style: { colors: '#94a3c0' } } }, yaxis: { show: false }, plotOptions: { bar: { borderRadius: 6, columnWidth: '55%', distributed: true } }, legend: { show: type === 'donut', position: 'bottom' as const, labels: { colors: '#94a3c0' } } }
  return (
    <Window title={`${company} · Report builder`}>
      <div className="flex flex-wrap items-center gap-2 mb-2 text-[13px]">
        <Badge tone="mute">Module: Employee Master</Badge>
        {(['bar', 'donut', 'line'] as const).map(t => <button key={t} onClick={() => setType(t)} className="rounded-lg px-3 py-1 font-semibold" style={type === t ? { background: 'var(--brand)', color: '#fff' } : { background: 'var(--card)', color: 'var(--mute)' }}>{t === 'bar' ? '▮ Bar' : t === 'donut' ? '◔ Donut' : '⟋ Line'}</button>)}
        <span className="ml-2" style={{ color: 'var(--mute)' }}>Group by</span>
        {(['Department', 'Contract type'] as const).map(g => <button key={g} onClick={() => setBy(g)} className="rounded-lg px-3 py-1 font-semibold" style={by === g ? { background: mix('var(--accent)', 40), border: '1px solid var(--accent)' } : { background: 'var(--card)', color: 'var(--mute)' }}>{g}</button>)}
      </div>
      <Chart key={type + by} type={type} height={220} series={type === 'donut' ? values : [{ name: 'Employees', data: values }]} options={opts} />
      <div className="flex items-center gap-3 mt-1">
        <button onClick={() => setPinned(p => (p.includes(`${type} · ${by}`) ? p : [...p, `${type} · ${by}`]))} className="rounded-lg px-4 py-1.5 text-[13px] font-bold text-white" style={{ background: 'linear-gradient(90deg,var(--brand),var(--accent))' }}>📌 Pin to dashboard</button>
        <div className="flex gap-1.5 flex-wrap">{pinned.length ? pinned.map(p => <Badge key={p} tone="ok">{p}</Badge>) : <span className="text-[12.5px]" style={{ color: 'var(--mute)' }}>Saved reports, widgets and dashboards appear here</span>}</div>
      </div>
    </Window>
  )
}

/* ───────── Audit & system logs ───────── */
export function AuditDemo() {
  const { country, company } = useDeck()
  const tabs = ['Audit', 'Login', 'Sessions', 'User history']
  const [t, setT] = useState(0)
  const n = country.sampleNames
  const data: string[][][] = [
    [['12 Oct 09:12', n[3], 'Changed salary · ' + n[1].split(' ')[0], 'Update'], ['12 Oct 09:03', n[4], 'Viewed payroll run Oct', 'View'], ['11 Oct 17:40', n[3], 'Added leave policy', 'Add']],
    [['12 Oct 08:58', n[3], 'Signed in · MFA passed', '203.94.x.x'], ['12 Oct 08:41', n[2], 'Signed in · Microsoft SSO', '203.94.x.x'], ['11 Oct 22:15', 'unknown', 'Failed sign-in ×3 → locked', '45.22.x.x']],
    [['Active', n[3], 'Chrome · Windows', '2 h 10 m'], ['Active', n[2], 'Android app', '34 m'], ['Ended', n[4], 'Edge · Windows', 'yesterday']],
    [['09:12', n[3], 'Employee · Compensation', 'Updated'], ['09:03', n[4], 'Payroll · Pay run', 'Viewed'], ['08:50', n[2], 'Leave · Approvals', 'Approved']],
  ]
  return (
    <Window title={`${company} · System logs`}>
      <div className="flex gap-1.5 mb-3">{tabs.map((x, k) => <button key={x} onClick={() => setT(k)} className="rounded-lg px-3 py-1.5 text-[13px] font-semibold" style={k === t ? { background: 'var(--brand)', color: '#fff' } : { background: 'var(--card)', color: 'var(--mute)' }}>{x}</button>)}</div>
      <div className="flex flex-col gap-1.5">{data[t].map((r, k) => <motion.div key={t + k} {...fade(0.08 * k)} className="card px-3 py-2.5 grid grid-cols-[110px_130px_1fr_90px] gap-2 text-[13.5px] items-center"><span style={{ color: 'var(--mute)' }}>{r[0]}</span><b>{r[1]}</b><span>{r[2]}</span><Badge tone="mute">{r[3]}</Badge></motion.div>)}</div>
      <div className="flex gap-2 mt-3 flex-wrap">{['Who changed what, and when', 'Login & lock history', 'Per-record change history', 'Application logs'].map(x => <Badge key={x} tone="mute">{x}</Badge>)}</div>
    </Window>
  )
}

/* ───────── Multi-tenancy & module gating ───────── */
export function TenancyDemo() {
  const { company } = useDeck()
  const all = ['Employee Master', 'Attendance', 'Leave', 'Payroll', 'Letters', 'Knowledge Base', 'Recruitment', 'Performance']
  const [on, setOn] = useState<string[]>(['Employee Master', 'Attendance', 'Leave', 'Payroll'])
  return (
    <Window title="Module subscription & tenants">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-[12px] tracking-widest uppercase mb-1.5" style={{ color: 'var(--mute)' }}>{company} · menu</div>
          <div className="flex flex-col gap-1.5">{all.map(m => { const a = on.includes(m); return <button key={m} onClick={() => setOn(o => (a ? o.filter(x => x !== m) : [...o, m]))} className="card px-3 py-2 flex justify-between items-center text-[14px] text-left" style={{ opacity: a ? 1 : 0.6 }}><span>{m}</span>{a ? <Badge tone="ok">✓ included</Badge> : <span className="text-[12px]" style={{ color: 'var(--mute)' }}>🔒 Not in your subscription</span>}</button> })}</div>
          <div className="text-[12px] mt-2" style={{ color: 'var(--mute)' }}>Click to subscribe or lock a module.</div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-[12px] tracking-widest uppercase" style={{ color: 'var(--mute)' }}>One platform, isolated companies</div>
          {[company, 'Group company B', 'Group company C'].map((t, k) => <motion.div key={t} {...fade(0.12 * k)} className="card p-3"><b className="text-[15px]">{t}</b><div className="text-[12.5px]" style={{ color: 'var(--mute)' }}>own schema · own users · own configuration · encrypted connection</div></motion.div>)}
          <div className="card p-3 text-[13px]" style={{ borderStyle: 'dashed' }}>Platform layer: tenants, roles, permissions and subscriptions</div>
        </div>
      </div>
    </Window>
  )
}

/* ───────── Billing & tenant lock ───────── */
export function BillingDemo() {
  const { headcount, company } = useDeck()
  const [overdue, setOverdue] = useState(false)
  const emp = headcount ?? 850
  return (
    <Window title={`${company} · Billing & account`}>
      <div className="flex gap-1.5 mb-3 flex-wrap">{['Overview', 'Invoices', 'Billing details', 'Contacts', 'Employees', 'Live estimate'].map((t, k) => <span key={t} className="rounded-lg px-3 py-1.5 text-[13px] font-semibold" style={k === 1 ? { background: 'var(--brand)', color: '#fff' } : { background: 'var(--card)', color: 'var(--mute)' }}>{t}</span>)}</div>
      <div className="grid grid-cols-3 gap-2 mb-3">{[['Active employees', String(emp)], ['Archived', '37'], ['Billing cycle', 'Monthly']].map(([a, b]) => <div key={a} className="card p-3"><div className="text-[12px]" style={{ color: 'var(--mute)' }}>{a}</div><div className="text-[24px] font-extrabold">{b}</div></div>)}</div>
      <div className="flex flex-col gap-1.5 mb-3">
        {[['INV-2026-10', 'Oct 2026', overdue ? 'Overdue' : 'Due 15 Nov'], ['INV-2026-09', 'Sep 2026', 'Paid'], ['INV-2026-08', 'Aug 2026', 'Paid']].map(([i, m, s]) => <div key={i} className="card px-3 py-2 grid grid-cols-[110px_90px_1fr_90px] items-center text-[13.5px]"><b>{i}</b><span style={{ color: 'var(--mute)' }}>{m}</span><span style={{ color: 'var(--mute)' }}>{emp} employees · PDF</span><Badge tone={s === 'Paid' ? 'ok' : s === 'Overdue' ? 'bad' : 'warn'}>{s}</Badge></div>)}
      </div>
      <button onClick={() => setOverdue(o => !o)} className="rounded-lg px-3 py-1.5 text-[13px] font-bold" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>{overdue ? '↺ Mark as paid' : 'Simulate overdue invoice'}</button>
      {overdue && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-3 mt-3 text-[13.5px]" style={{ borderColor: 'var(--bad)' }}>🔒 <b>Account locked.</b> Only billing administrators can open the system until the invoice is paid; everyone else sees a notice.</motion.div>}
    </Window>
  )
}

/* ───────── Architecture ───────── */
export function ArchitectureDemo() {
  const Box = ({ x, y, w, t, s, c }: { x: number; y: number; w: number; t: string; s?: string; c: string }) => (
    <g><rect x={x} y={y} width={w} height="58" rx="12" fill={mix(c, 22)} stroke={c} strokeWidth="1.5" /><text x={x + w / 2} y={y + (s ? 26 : 35)} textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--ink)">{t}</text>{s && <text x={x + w / 2} y={y + 44} textAnchor="middle" fontSize="11.5" fill="var(--mute)">{s}</text>}</g>
  )
  return (
    <Window title="Architecture">
      <svg viewBox="0 0 760 470" className="w-full">
        <defs><marker id="arr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="var(--brand2)" /></marker></defs>
        {[[190, 78, 190, 100], [190, 158, 190, 180], [190, 238, 190, 260], [190, 318, 190, 340], [380, 209, 460, 209]].map(([x1, y1, x2, y2], k) => <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--brand2)" strokeWidth="2" className="flow-line" markerEnd="url(#arr)" />)}
        <Box x={20} y={20} w={340} t="Web · Manager workspace · Android" s="React single-page apps" c="#22d3ee" />
        <Box x={20} y={100} w={340} t="API layer" s=".NET 8 · JWT · MFA · SSO · rate limiting" c="#3b6be0" />
        <Box x={20} y={180} w={340} t="Business services" s="approvals · payroll · letters · attendance · billing" c="#a78bfa" />
        <Box x={20} y={260} w={340} t="Tenant resolution + RBAC" s="schema per company · module gating · audit" c="#34d399" />
        <Box x={20} y={340} w={160} t="PostgreSQL" s="platform + tenant schemas" c="#fbbf24" />
        <Box x={200} y={340} w={160} t="Azure Storage" s="documents & files" c="#fbbf24" />
        <Box x={460} y={180} w={280} t="Azure Functions" s="notifications · billing jobs" c="#fb7185" />
        <line x1="600" y1="238" x2="600" y2="290" stroke="var(--brand2)" strokeWidth="2" className="flow-line" markerEnd="url(#arr)" />
        <Box x={460} y={290} w={280} t="Email · SMS · WhatsApp · In-app" s="Twilio and mail providers" c="#fb7185" />
        <Box x={460} y={20} w={280} t="Biometric devices" s="ZKBio WDMS sync" c="#22d3ee" />
        <line x1="600" y1="78" x2="380" y2="125" stroke="var(--brand2)" strokeWidth="2" className="flow-line" markerEnd="url(#arr)" />
        <Box x={460} y={380} w={280} t="BI tools · ERP · accounting" s="via secure APIs" c="#a78bfa" />
      </svg>
    </Window>
  )
}

/* ───────── Meal management ───────── */
export function MealDemo() {
  const { country, industry, company } = useDeck()
  const [meal, setMeal] = useState(1)
  const meals = ['Breakfast', 'Lunch', 'Dinner']
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const plan = [[120, 310, 90], [118, 322, 88], [125, 318, 95], [121, 305, 84], [130, 330, 99], [60, 180, 40]]
  const max = 340
  const people = country.sampleNames.slice(0, 5)
  return (
    <Window title={`${company} · Meal management`}>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <div className="flex gap-2 mb-3">
            {meals.map((m, k) => <button key={m} onClick={() => setMeal(k)} className="px-4 py-1.5 rounded-full text-[15px] font-bold" style={meal === k ? { background: 'var(--brand)', color: '#fff' } : { background: 'var(--card)', border: '1px solid var(--line)' }}>{m}</button>)}
          </div>
          <div className="text-[13px] tracking-widest uppercase mb-2" style={{ color: 'var(--mute)' }}>Tokens generated today · {meals[meal]}</div>
          <div className="flex flex-col gap-2">
            {people.map((n, k) => (
              <motion.div key={n + meal} {...fade(0.08 * k)} className="card px-4 py-2.5 flex items-center gap-3">
                <Avatar name={n} size={34} />
                <div className="flex-1 min-w-0"><div className="font-semibold text-[16px] truncate">{n}</div><div className="text-[12.5px]" style={{ color: 'var(--mute)' }}>{industry.departments[k % industry.departments.length]} · checked in {7 + (k % 3)}:{10 + k * 7}</div></div>
                <span className="font-mono font-bold text-[15px] px-2.5 py-1 rounded-lg" style={{ background: 'var(--line)' }}>#{meal + 1}{String(412 + k * 17).padStart(3, '0')}</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-3"><Badge tone="ok">✓ Token only for employees who punched in today</Badge></div>
        </div>
        <div>
          <div className="text-[13px] tracking-widest uppercase mb-2" style={{ color: 'var(--mute)' }}>Meal plan · this week · headcount</div>
          <div className="flex items-end gap-3 h-[250px]">
            {days.map((d, i) => (
              <div key={d} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex items-end gap-1 h-[210px]">
                  {plan[i].map((v, j) => <motion.div key={j} className="flex-1 rounded-t" style={{ background: ['#f59e0b', '#3b6be0', '#a78bfa'][j] }} initial={{ height: 0 }} animate={{ height: `${(v / max) * 100}%` }} transition={{ delay: 0.1 * i + 0.05 * j, duration: 0.7 }} />)}
                </div>
                <div className="text-[13px]" style={{ color: 'var(--mute)' }}>{d}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 text-[13px] mt-3" style={{ color: 'var(--mute)' }}>{meals.map((m, j) => <span key={m} className="flex items-center gap-1.5"><i className="w-3 h-3 rounded" style={{ background: ['#f59e0b', '#3b6be0', '#a78bfa'][j] }} />{m}</span>)}</div>
          <div className="text-[14px] mt-3" style={{ color: 'var(--mute)' }}>Canteen sees tomorrow’s numbers from attendance and leave — {country.name === 'Sri Lanka' ? 'no more guessing the rice' : 'no more over-cooking'}.</div>
        </div>
      </div>
    </Window>
  )
}
