import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useDeck } from '../engine/context'
import { Badge, Window, fade } from '../ui/primitives'

/** Interactive “Configure notification” screen — recipients, then channels & timing per recipient. */

const RECIPIENTS: { id: string; name: string; desc: string }[] = [
  { id: 'self', name: 'Self', desc: 'The employee the event is about' },
  { id: 'approvers', name: 'Workflow Approvers', desc: 'Approvers in the workflow assigned to this trigger point' },
  { id: 'head', name: 'Head of Entity', desc: 'Head of the employee’s entity (resolved when the event happens)' },
  { id: 'hr', name: 'HR', desc: 'HR team members' },
  { id: 'all', name: 'All Employees', desc: 'Every employee in the company' },
  { id: 'role', name: 'Same Role', desc: 'Everyone who shares the employee’s role' },
  { id: 'unit', name: 'Same Unit', desc: 'Everyone in the employee’s unit / department' },
  { id: 'specific', name: 'Specific Employees', desc: 'Pick particular employees from the employee list' },
]

const CHANNELS = ['Email', 'SMS', 'WhatsApp', 'Push', 'In-App'] as const
const CH_ICON: Record<string, string> = { Email: '✉️', SMS: '💬', WhatsApp: '🟢', Push: '📳', 'In-App': '🔔' }
const TIMINGS = ['Immediately', 'After 15 min', 'Daily digest · 08:00'] as const

interface EventDef { name: string; workflow: boolean; recipients: string[] }
const EVENTS: EventDef[] = [
  { name: 'Late Attendance', workflow: false, recipients: ['self', 'head', 'hr'] },
  { name: 'Leave Request Submitted', workflow: true, recipients: ['self', 'approvers', 'hr'] },
  { name: 'Payslip Published', workflow: false, recipients: ['self'] },
  { name: 'Policy Update Published', workflow: false, recipients: ['all', 'hr'] },
]

type Rule = { channels: string[]; timing: number }
const defaultRule = (rid: string): Rule => (
  rid === 'self' ? { channels: ['Push', 'In-App'], timing: 0 }
    : rid === 'hr' ? { channels: ['Email'], timing: 2 }
      : rid === 'all' ? { channels: ['Email', 'In-App'], timing: 0 }
        : { channels: ['Email', 'In-App'], timing: 0 }
)

export function NotifRulesDemo() {
  const { company } = useDeck()
  const [ev, setEv] = useState(0)
  const event = EVENTS[ev]
  const [picked, setPicked] = useState<Record<string, string[]>>(() => Object.fromEntries(EVENTS.map(e => [e.name, e.recipients])))
  const [rules, setRules] = useState<Record<string, Rule>>({})
  const [saved, setSaved] = useState(false)

  const sel = picked[event.name]
  const ruleFor = (rid: string): Rule => rules[`${event.name}|${rid}`] ?? defaultRule(rid)
  const setRule = (rid: string, r: Rule) => { setRules(x => ({ ...x, [`${event.name}|${rid}`]: r })); setSaved(false) }
  const toggleRecipient = (rid: string) => {
    if (rid === 'approvers' && !event.workflow) return
    setPicked(p => ({ ...p, [event.name]: p[event.name].includes(rid) ? p[event.name].filter(x => x !== rid) : [...p[event.name], rid] }))
    setSaved(false)
  }
  const selected = useMemo(() => RECIPIENTS.filter(r => sel.includes(r.id)), [sel])

  return (
    <Window title={`${company} · Notification rules`}>
      <div className="flex flex-wrap gap-2 mb-4">
        {EVENTS.map((e, k) => (
          <button key={e.name} onClick={() => { setEv(k); setSaved(false) }} className="rounded-full px-3.5 py-1.5 text-[14px] font-semibold transition"
            style={k === ev ? { background: 'var(--brand)', color: '#fff' } : { background: 'var(--card)', border: '1px solid var(--line)', color: 'var(--mute)' }}>{e.name}</button>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-1"><span className="text-[18px]">⚙️</span><b className="text-[20px]">Configure: {event.name}</b></div>
      <div className="text-[13px] mb-4" style={{ color: 'var(--mute)' }}>Choose who gets notified, then how and when for each recipient. <Badge tone="warn">Click to try</Badge></div>

      <div className="flex items-center gap-2 mb-2"><span className="w-6 h-6 rounded-full grid place-items-center text-[13px] font-bold text-white" style={{ background: 'var(--brand)' }}>1</span><b>Recipients</b></div>
      <div className="grid grid-cols-2 gap-2 mb-5">
        {RECIPIENTS.map((r, k) => {
          const disabled = r.id === 'approvers' && !event.workflow
          const on = sel.includes(r.id)
          return (
            <motion.button key={r.id} {...fade(0.03 * k)} onClick={() => toggleRecipient(r.id)} disabled={disabled}
              className="text-left rounded-xl px-3 py-2 flex gap-2.5 items-start transition"
              style={{ background: on ? 'color-mix(in srgb, var(--brand) 16%, var(--card))' : 'var(--card)', border: `1px ${disabled ? 'dashed' : 'solid'} ${on ? 'var(--brand2)' : 'var(--line)'}`, opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}>
              <span className="mt-0.5 w-4 h-4 rounded flex-none grid place-items-center text-[11px] font-bold" style={{ background: on ? 'var(--brand)' : 'transparent', border: `1.5px solid ${on ? 'var(--brand)' : 'var(--mute)'}`, color: '#fff' }}>{on ? '✓' : ''}</span>
              <span><span className="block text-[14px] font-bold leading-tight">{r.name}</span><span className="block text-[11.5px] leading-snug" style={{ color: 'var(--mute)' }}>{disabled ? 'No workflow assigned to this trigger point' : r.desc}</span></span>
            </motion.button>
          )
        })}
      </div>

      <div className="flex items-center gap-2 mb-2"><span className="w-6 h-6 rounded-full grid place-items-center text-[13px] font-bold text-white" style={{ background: 'var(--brand)' }}>2</span><b>Channels &amp; timing for each recipient</b></div>
      <div className="flex flex-col gap-2 mb-4 max-h-[190px] overflow-auto pr-1">
        {selected.length === 0 && <div className="rounded-xl p-4 text-center text-[13px]" style={{ border: '1px dashed var(--line)', color: 'var(--mute)' }}>Select at least one recipient above.</div>}
        {selected.map(r => {
          const rule = ruleFor(r.id)
          return (
            <div key={r.id} className="rounded-xl px-3 py-2 flex flex-wrap items-center gap-x-3 gap-y-1.5" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
              <b className="text-[13.5px] w-[120px]">{r.name}</b>
              <div className="flex flex-wrap gap-1.5 flex-1">
                {CHANNELS.map(c => {
                  const on = rule.channels.includes(c)
                  return <button key={c} onClick={() => setRule(r.id, { ...rule, channels: on ? rule.channels.filter(x => x !== c) : [...rule.channels, c] })}
                    className="rounded-full px-2.5 py-1 text-[12px] font-semibold transition"
                    style={on ? { background: 'color-mix(in srgb, var(--ok) 22%, transparent)', border: '1px solid var(--ok)', color: 'var(--ok)' } : { background: 'transparent', border: '1px solid var(--line)', color: 'var(--mute)' }}>{CH_ICON[c]} {c}</button>
                })}
              </div>
              <button onClick={() => setRule(r.id, { ...rule, timing: (rule.timing + 1) % TIMINGS.length })} className="rounded-lg px-2.5 py-1 text-[12px] font-semibold" style={{ background: 'var(--bg)', border: '1px solid var(--line)' }} title="Click to change timing">⏱ {TIMINGS[rule.timing]}</button>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[12.5px]" style={{ color: 'var(--mute)' }}>{saved ? <b style={{ color: 'var(--ok)' }}>✓ Saved — applies to “{event.name}” for {company}</b> : 'Changes apply to this event only.'}</span>
        <button onClick={() => setSaved(true)} className="rounded-xl px-5 py-2 text-[14px] font-bold text-white" style={{ background: 'linear-gradient(90deg, var(--brand), var(--accent))' }}>Save Configuration</button>
      </div>
    </Window>
  )
}
