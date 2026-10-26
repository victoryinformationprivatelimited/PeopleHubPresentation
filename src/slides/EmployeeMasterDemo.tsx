import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useDeck } from '../engine/context'
import { Avatar, Badge, Window } from '../ui/primitives'
import { fieldsFor, type Field } from './employeeMasterFields'

/** The tabs of the real Employee Master screen, in the same order as the product's profile sidebar. */
export const MASTER_TABS: { id: string; label: string }[] = [
  { id: 'basic', label: 'Basic Information' },
  { id: 'employment', label: 'Employment Details' },
  { id: 'supervisors', label: 'Supervisors & Reporting' },
  { id: 'contact', label: 'Contact Information' },
  { id: 'user-account', label: 'User Account' },
  { id: 'documents', label: 'Documents' },
  { id: 'attendance', label: 'Attendance Information' },
  { id: 'work-history', label: 'Employment History' },
  { id: 'qualifications', label: 'Qualifications' },
  { id: 'certifications', label: 'Certifications & Licenses' },
  { id: 'skills', label: 'Special Skills' },
  { id: 'languages', label: 'Languages' },
  { id: 'visa', label: 'Work Visa & Permits' },
  { id: 'background', label: 'Background Checks' },
  { id: 'agreements', label: 'Agreements & Contracts' },
  { id: 'disciplinary', label: 'Disciplinary Actions' },
  { id: 'policy', label: 'Policy Acknowledgements' },
  { id: 'privacy', label: 'Data Privacy Preferences' },
  { id: 'hobbies', label: 'Hobbies & Interests' },
  { id: 'engagements', label: 'Engagements' },
  { id: 'recognition', label: 'Recognition & Awards' },
  { id: 'medical', label: 'Medical & Insurance Details' },
  { id: 'additional', label: 'Additional Details' },
  { id: 'attendance-locations', label: 'Attendance Locations' },
  { id: 'exit', label: 'Exit Information' },
  { id: 'payroll', label: 'Employee Accounts & Payroll' },
]

const boxStyle = { background: 'var(--bg)', border: '1.5px solid var(--line)' }

function Input({ f, adding }: { f: Field; adding: boolean }) {
  const [label, type, value] = f
  const ph = type === 's' ? 'Select…' : type === 'd' ? 'dd / mm / yyyy' : type === 'f' ? 'Choose file' : `Enter ${label.toLowerCase().replace(/^\d\.\s*/, '')}`
  const v = adding ? '' : value
  const muted = { color: 'var(--mute)', opacity: 0.7 }
  if (type === 'a') return <div className="rounded-lg px-3 py-2 text-[14px] leading-snug h-[58px] overflow-hidden" style={boxStyle}>{v || <span style={muted}>Add remarks…</span>}</div>
  if (type === 'f') return <div className="rounded-lg px-3 h-[38px] flex items-center gap-2 text-[14px]" style={{ ...boxStyle, borderStyle: 'dashed' }}><span style={{ color: 'var(--brand2)' }}>⬆</span>{v ? <span className="truncate">{v}</span> : <span style={muted}>{ph}</span>}</div>
  if (type === 'y') return <div className="h-[38px] flex items-center gap-2 text-[14px]"><span className="w-10 h-[22px] rounded-full relative flex-none" style={{ background: v === 'Yes' ? 'var(--ok)' : 'var(--line)' }}><i className="absolute top-[3px] w-4 h-4 rounded-full bg-white" style={{ left: v === 'Yes' ? 21 : 3 }} /></span>{v || 'No'}</div>
  if (type === 'c') return <div className="h-[38px] flex items-center gap-2 text-[14px]"><span className="w-5 h-5 rounded grid place-items-center text-[13px] font-bold flex-none" style={{ background: v === 'Yes' ? 'var(--brand)' : 'transparent', border: '1.5px solid var(--line)', color: '#fff' }}>{v === 'Yes' ? '✓' : ''}</span>{v || 'No'}</div>
  return (
    <div className="rounded-lg px-3 h-[38px] flex items-center justify-between gap-2 text-[14.5px]" style={boxStyle}>
      <span className="truncate">{v || <span style={muted}>{ph}</span>}</span>
      {type === 's' && <span style={muted}>▾</span>}{type === 'd' && <span className="text-[13px]">📅</span>}
    </div>
  )
}

export function EmployeeMasterDemo({ auto = true }: { auto?: boolean }) {
  const { country, industry, company } = useDeck()
  const [active, setActive] = useState(0)
  const [touched, setTouched] = useState(false)
  const [adding, setAdding] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const name = country.sampleNames[1]
  const [first, last] = name.toLowerCase().split(' ')
  const co = company.toLowerCase().replace(/[^a-z0-9]/g, '') || 'company'
  const role = industry.roles[1]

  const tab = MASTER_TABS[active]
  const groups = fieldsFor(tab.id, { country, industry, company, name, first, last, mail: `${first}.${last}@${co}.com`, boss: country.sampleNames[0], mgr: country.sampleNames[2] })
  const count = groups.reduce((n, g) => n + g.fields.length, 0)
  const rows = Math.ceil(count / 2)

  // walk through the sections one by one, lingering longer on the long forms
  useEffect(() => {
    if (!auto || touched) return
    const t = setTimeout(() => setActive(a => (a + 1) % MASTER_TABS.length), 3200 + rows * 380)
    return () => clearTimeout(t)
  }, [auto, touched, active, rows])

  // keep the active tab visible in the sidebar
  useEffect(() => {
    const el = listRef.current?.children[active] as HTMLElement | undefined
    const box = listRef.current
    if (el && box) box.scrollTo({ top: Math.max(0, el.offsetTop - box.clientHeight / 2 + el.clientHeight / 2), behavior: 'smooth' })
  }, [active])

  // long forms scroll themselves so every field gets seen
  useEffect(() => {
    const box = bodyRef.current
    if (!box) return
    box.scrollTop = 0
    if (!auto || touched) return
    const max = box.scrollHeight - box.clientHeight
    if (max < 8) return
    const dur = 2000 + rows * 380, t0 = performance.now() + 900
    let raf = 0
    const step = (now: number) => { const p = Math.min(1, Math.max(0, (now - t0) / dur)); box.scrollTop = max * p; if (p < 1) raf = requestAnimationFrame(step) }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [active, auto, touched, rows, adding])

  return (
    <Window title={`${company} · Employee Master · ${adding ? 'New employee' : name}`}>
      <div className="flex gap-5" style={{ height: 600 }}>
        <div className="w-[270px] flex-none flex flex-col card p-3" style={{ background: 'var(--bg)' }}>
          <div className="flex flex-col items-center text-center pb-3">
            {adding ? <span className="w-14 h-14 rounded-full grid place-items-center text-[26px] font-bold" style={{ background: 'var(--line)', color: 'var(--mute)' }}>＋</span> : <Avatar name={name} size={56} />}
            <div className="font-bold mt-2 text-[17px] leading-tight">{adding ? 'New employee' : name}</div>
            <div className="text-[12.5px]" style={{ color: 'var(--mute)' }}>{adding ? 'Fill any section — save as you go' : role}</div>
            <div className="text-[12px]" style={{ color: 'var(--mute)' }}>{adding ? 'ID assigned on save' : 'EMP-00421'}</div>
            <div className="mt-1.5"><Badge tone={adding ? 'warn' : 'ok'}>{adding ? 'Draft' : 'Active'}</Badge></div>
          </div>
          <div ref={listRef} className="relative flex-1 min-h-0 overflow-y-auto -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
            {MASTER_TABS.map((t, k) => (
              <button key={t.id} onClick={() => { setTouched(true); setActive(k) }}
                className="w-full flex items-center gap-2.5 text-left px-2.5 py-[7px] rounded-lg text-[13.5px] transition-colors"
                style={k === active ? { background: 'var(--brand)', color: '#fff', fontWeight: 700 } : { color: 'var(--text)', opacity: 0.82 }}>
                <span className="w-[22px] h-[22px] rounded-md grid place-items-center text-[10.5px] font-bold flex-none"
                  style={{ background: k === active ? 'rgba(255,255,255,.22)' : 'var(--line)' }}>{k + 1}</span>
                <span className="truncate">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="mb-3">
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <div className="text-[12px] tracking-widest uppercase" style={{ color: 'var(--mute)' }}>Section {active + 1} of {MASTER_TABS.length} · {count} field{count === 1 ? '' : 's'}</div>
              <div className="flex rounded-full p-1 flex-none" style={{ background: 'var(--bg)', border: '1.5px solid var(--line)' }}>
                {([['View record', false], ['＋ Add new employee', true]] as [string, boolean][]).map(([l, v]) => (
                  <button key={l} onClick={() => { setTouched(true); setAdding(v) }} className="px-3.5 py-1 rounded-full text-[13.5px] font-bold transition-colors"
                    style={adding === v ? { background: 'var(--brand)', color: '#fff' } : { color: 'var(--mute)' }}>{l}</button>
                ))}
              </div>
            </div>
            <div className="text-[26px] font-bold leading-tight">{tab.label}</div>
          </div>
          <div ref={bodyRef} className="flex-1 min-h-0 overflow-y-auto pr-1" style={{ scrollbarWidth: 'none' }}>
            <AnimatePresence mode="wait">
              <motion.div key={tab.id + adding} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                {groups.map((g, gi) => (
                  <div key={gi} className="mb-3">
                    {g.title && <div className="text-[13px] tracking-widest uppercase font-bold mb-2" style={{ color: 'var(--brand2)' }}>{g.title}</div>}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                      {g.fields.map((f, i) => (
                        <motion.div key={f[0] + i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(0.5, 0.03 * i) }} className={f[1] === 'a' ? 'col-span-2' : ''}>
                          <div className="text-[12.5px] font-semibold mb-1" style={{ color: 'var(--mute)' }}>{f[0]}</div>
                          <Input f={f} adding={adding} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="text-[12.5px] mt-2" style={{ color: 'var(--mute)' }}>
            Fields shown are the product’s real forms · sensitive data encrypted · every edit audited · {touched ? 'pick any section on the left' : 'touring all sections — or pick one'}
          </div>
        </div>
      </div>
    </Window>
  )
}
