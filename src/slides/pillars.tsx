import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNav } from '../engine/context'
import { fade } from '../ui/primitives'
import { MIcon } from '../ui/ModuleIcons'
import { LANDSCAPE, type Mod } from './landscape'

const mix = (c: string, p: number) => `color-mix(in srgb, ${c} ${p}%, transparent)`

export type Lens = 'ops' | 'strat' | 'comp'

/** The three lenses on the product. Every module in the landscape belongs to exactly one. */
export const LENSES: Record<Lens, { n: number; name: string; short: string; color: string; tagline: string; why: string; gains: string[]; ask: string; mods: string[]; notes: string }> = {
  ops: {
    n: 1, name: 'Operational HR', short: 'Operational', color: '#0ea5e9',
    tagline: 'Run every day without chasing paper.',
    why: 'The daily engine of HR: people records, time, leave and pay, run through self-service, approvals and notifications under role-based security — accurate, on time and audit-ready.',
    gains: ['One record per employee, one source of truth', 'Payroll from live attendance — nothing re-keyed', 'Employees self-serve; managers approve anywhere', 'Everyone told on time, every action audited'],
    ask: 'How many phone calls and chases does it take to get attendance and approvals ready for payroll?',
    mods: ['Organization', 'Employee master 360', 'Life cycle', 'Termination & exit', 'Time & attendance', 'Mobile app', 'Leave management', 'Meal management', 'Payroll', 'Staff loans & advances', 'Benefits & claims', 'Salary banking', 'Self-service portal', 'Approvals', 'Notifications', 'Security & audit'],
    notes: 'Lens 1 of 3 — the administrative engine, including self-service, approvals, notifications and security that keep it running safely. Lead with the pain: re-keying, late payroll, approvals chased by phone, disputes. Ask the question on the left and let the client answer before you open anything. The card that is highlighted tours on its own until you hover or tap; tap any card to open that module, then use Back to return here. Press "Done" when the client has seen enough and you want to move on. Keep it to the two or three modules that match what they said.',
  },
  strat: {
    n: 2, name: 'Strategic HR', short: 'Strategic', color: '#a78bfa',
    tagline: 'Turn people data into business growth.',
    why: 'Where HR moves from administering to advising: hire the right people, grow them, keep your best and show leadership the impact with live numbers.',
    gains: ['Hire faster and onboard in days, not weeks', 'Clear goals, fair reviews and a visible succession bench', 'Decisions backed by live dashboards and statutory confidence'],
    ask: 'If your best performer resigned tomorrow, who is ready to step up — and how do you know?',
    mods: ['Recruitment & onboarding', 'Performance', 'Learning & development', 'Succession planning', 'Engagement', 'Grievance reporting', 'Analytics & reports', 'Compliance & statutory'],
    notes: 'Lens 2 of 3 — the value conversation, best for owners and C-level. Talk outcomes rather than screens: hiring speed, retention, bench strength, risk. Ask the succession question; the silence is the sales moment. Open Analytics last to show that the board gets answers without asking HR to build a report. Tap any card to open that module, Back returns here.',
  },
  comp: {
    n: 3, name: 'Complementary', short: 'Complementary', color: '#34d399',
    tagline: 'The extras that save time every single day.',
    why: 'The helpers around the core: letters and tasks that run themselves, requests, assets and policies in one place, an assistant that answers first, and a connection to your ERP and devices.',
    gains: ['Letters and checklists that run themselves', 'Fewer HR queries — answers before the question is asked', 'Every request and asset tracked', 'Connects to your ERP and devices'],
    ask: 'How long does it take to issue an employment letter, or recover every asset at exit?',
    mods: ['Letter generator', 'Tasks & checklists', 'Service desk', 'Asset tracker', 'Knowledge base', 'Chat & AI assistant', 'News broadcasting', 'Integrations & ERP'],
    notes: 'Lens 3 of 3 — the time-savers around the core. Speak to the HR team (letters, tasks, fewer queries) and the IT Manager (integrations). Letters with AI drafting, the service desk and Integrations are the usual favourites. Tap any card to open that module, Back returns here. Finish with "Done" to move on to the next part of the session.',
  },
}
const ORDER: Lens[] = ['ops', 'strat', 'comp']

/** One line per module: why a buyer cares. Shown under the card on the big lenses and in the spotlight strip. */
const SELL: Record<string, string> = {
  'Organization': 'Model any group — and see every reporting line at a glance.',
  'Employee master 360': 'One trusted record for every person, from hire to exit.',
  'Life cycle': 'Probation, confirmation, promotion — nothing slips through.',
  'Letter generator': 'Offer and confirmation letters in seconds, not days.',
  'Tasks & checklists': 'Every handover assigned, dated and tracked.',
  'Termination & exit': 'Clean exits: assets back, settlement right, no loose ends.',
  'Time & attendance': 'Every punch captured — biometric, mobile or geofenced.',
  'Mobile app': 'Clock in, apply and approve from the phone in your pocket.',
  'Leave management': 'Policies that enforce themselves, approvals that do not wait.',
  'Meal management': 'Meal counts that match who is actually on shift.',
  'Payroll': 'Accurate pay, on time, straight from live attendance.',
  'Staff loans & advances': 'Lend with control; recover automatically through payroll.',
  'Benefits & claims': 'Claims submitted with a receipt, approved with a trail.',
  'Salary banking': 'One click from approved payroll to the bank file.',
  'Recruitment & onboarding': 'Hire faster and make day one count.',
  'Performance': 'Clear goals, fair reviews, feedback all year round.',
  'Learning & development': 'Close skill gaps with training you can measure.',
  'Succession planning': 'Know who steps up before someone steps out.',
  'Engagement': 'Hear your people early; recognise them often.',
  'Grievance reporting': 'A safe voice for staff and a tracked answer for HR.',
  'Analytics & reports': 'Live dashboards that answer the board’s questions.',
  'Compliance & statutory': 'Statutory returns ready before the deadline.',
  'Self-service portal': 'Employees help themselves — HR gets its time back.',
  'Service desk': 'Every HR, IT and facility request tracked to resolution.',
  'Asset tracker': 'Know who holds what — and get it back at exit.',
  'Knowledge base': 'One source of truth for every policy, with proof of reading.',
  'Chat & AI assistant': 'Answers from your own policies, before anyone queues.',
  'News broadcasting': 'Announce once, reach the right people, see who read it.',
  'Approvals': 'Build any approval flow yourself — no developer needed.',
  'Notifications': 'The right people told, on the right channel, at the right time.',
  'Security & audit': 'Role-based access and a full audit trail.',
  'Integrations & ERP': 'Connects to your ERP and devices instead of replacing them.',
}

/** Slide ids for each lens, per deck. */
export const lensIds = (prefix: string): Record<Lens, string> => ({ ops: `${prefix}pillar-ops`, strat: `${prefix}pillar-strat`, comp: `${prefix}pillar-comp` })

const byName = (n: string) => LANDSCAPE.find(m => m.name === n) as Mod

/**
 * One lens of the three-part navigation screen: why it matters, what the client gets, a question to ask, and every module in
 * it with its features. A highlight tours the cards until someone touches the screen; tap a card to open the module (Back
 * returns here); "Done" skips to the first slide after the module pages.
 */
export function PillarSlide({ lens, mode, ids, doneTo }: { lens: Lens; mode: 'workshop' | 'tour'; ids: Record<Lens, string>; doneTo: string }) {
  const L = LENSES[lens]
  const { jump, goTo, has } = useNav()
  const mods = L.mods.map(byName)
  const dense = mods.length > 12
  const cols = 4
  const compact = dense
  const [focus, setFocus] = useState(0)
  const [touched, setTouched] = useState(false)
  const target = (m: Mod) => (mode === 'workshop' ? m.w : m.t)
  const next = ORDER[ORDER.indexOf(lens) + 1]

  useEffect(() => {
    if (touched) return
    const t = setTimeout(() => setFocus(f => (f + 1) % mods.length), 3600)
    return () => clearTimeout(t)
  }, [focus, touched, mods.length])

  const fm = mods[focus], ftarget = target(fm)

  return (
    <div className="absolute inset-0" onMouseMove={() => !touched && setTouched(true)}>
      {/* header */}
      <div className="absolute left-14 right-14 top-[54px] flex items-start justify-between gap-8">
        <div>
          <motion.div {...fade(0)} className="flex items-center gap-3 mb-2">
            {ORDER.map(k => (
              <button key={k} onClick={() => k !== lens && has(ids[k]) && goTo(ids[k])} className="flex items-center gap-2 rounded-full px-4 py-1.5 text-[16px] font-bold transition"
                style={k === lens ? { background: LENSES[k].color, color: '#fff' } : { background: 'var(--card)', border: '1px solid var(--line)', color: 'var(--mute)' }}>
                <span className="w-6 h-6 rounded-full grid place-items-center text-[13px]" style={{ background: k === lens ? 'rgba(255,255,255,.25)' : mix(LENSES[k].color, 25), color: k === lens ? '#fff' : LENSES[k].color }}>{LENSES[k].n}</span>{LENSES[k].short}
              </button>
            ))}
          </motion.div>
          <motion.h2 {...fade(0.06)} className="serif text-[60px] leading-none font-bold">{L.name}</motion.h2>
          <motion.div {...fade(0.12)} className="text-[30px] font-semibold mt-2" style={{ color: L.color }}>{L.tagline}</motion.div>
        </div>
        <div className="flex items-center gap-3 flex-none pt-8">
          {next && <motion.button {...fade(0.3)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => goTo(ids[next])} className="rounded-xl px-5 py-2.5 text-[19px] font-bold" style={{ background: 'var(--card)', border: `2px solid ${LENSES[next].color}` }}>Next: {LENSES[next].short} ▶</motion.button>}
          <motion.button {...fade(0.4)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => goTo(doneTo)} className="glow rounded-xl px-6 py-2.5 text-[19px] font-bold text-white" style={{ background: 'linear-gradient(90deg,var(--brand),var(--accent))' }}>✔ Done inspecting modules ➜</motion.button>
        </div>
      </div>

      {/* left: the sales story */}
      <div className="absolute left-14 top-[236px] w-[470px] flex flex-col gap-4">
        <motion.div {...fade(0.2)} className="card px-5 py-4" style={{ borderLeft: `5px solid ${L.color}` }}>
          <div className="text-[14px] tracking-[0.2em] uppercase font-bold mb-1.5" style={{ color: L.color }}>Why it matters · {mods.length} modules</div>
          <div className="text-[22px] leading-snug">{L.why}</div>
        </motion.div>
        <motion.div {...fade(0.3)}>
          <div className="text-[14px] tracking-[0.2em] uppercase font-bold mb-2" style={{ color: 'var(--ok)' }}>What you get</div>
          <ul className="flex flex-col gap-2">{L.gains.map(r => <li key={r} className="flex gap-3 text-[21px] leading-snug"><span style={{ color: 'var(--ok)' }}>✓</span>{r}</li>)}</ul>
        </motion.div>
        <motion.div {...fade(0.4)} className="rounded-2xl px-5 py-4" style={{ background: mix(L.color, 14), border: `1px dashed ${L.color}` }}>
          <div className="text-[14px] tracking-[0.2em] uppercase font-bold mb-1.5" style={{ color: L.color }}>Ask the room</div>
          <div className="serif text-[25px] leading-snug font-semibold">“{L.ask}”</div>
        </motion.div>
      </div>

      {/* right: every module with its features */}
      <div className="absolute left-[560px] right-14 top-[236px] grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridAutoRows: dense ? '150px' : '308px' }}>
        {mods.map((m, k) => {
          const on = focus === k, ok = has(target(m))
          return (
            <motion.button key={m.name} initial={{ opacity: 0, y: 24, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: on ? 1.04 : 1 }} transition={{ delay: 0.04 * k + 0.15, type: 'spring', stiffness: 260, damping: 22 }}
              onMouseEnter={() => { setTouched(true); setFocus(k) }} onClick={() => ok && jump(target(m))} disabled={!ok}
              className="relative rounded-2xl text-left flex flex-col overflow-hidden min-h-0"
              style={{ background: 'var(--card)', border: `${on ? 2 : 1}px solid ${on ? L.color : 'var(--line)'}`, boxShadow: on ? `0 18px 48px -14px ${L.color}` : 'none', zIndex: on ? 5 : 1 }}>
              <div className="px-3 py-2.5 flex items-center gap-2.5" style={{ background: `linear-gradient(135deg, ${mix(L.color, 38)}, ${mix(L.color, 10)})` }}>
                <MIcon name={m.name} size={compact ? 38 : 46} color={L.color} />
                <span className={`${compact ? 'text-[18.5px]' : 'text-[21px]'} font-bold leading-tight`}>{m.name}</span>
              </div>
              <div className="px-3.5 py-2.5 flex flex-col gap-1.5 flex-1 min-h-0">
                {!dense && <div className="text-[19px] italic leading-snug" style={{ color: 'var(--mute)' }}>{SELL[m.name]}</div>}
                <ul className={`flex flex-col gap-1 ${compact ? 'text-[16px]' : 'text-[20px]'} leading-snug`}>
                  {m.feats.map(f => <li key={f} className="flex gap-1.5"><span style={{ color: L.color }}>•</span><span>{f}</span></li>)}
                </ul>
              </div>
              {on && ok && <div className="absolute right-2.5 bottom-1.5 text-[14px] font-bold" style={{ color: L.color }}>Open ▶</div>}
            </motion.button>
          )
        })}
      </div>

      {/* spotlight strip: the sales line for the module in focus */}
      <motion.div key={fm.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="absolute left-14 right-14 bottom-[74px] rounded-2xl px-6 py-3.5 flex items-center gap-5" style={{ background: mix(L.color, 16), border: `1.5px solid ${L.color}` }}>
        <MIcon name={fm.name} size={52} color={L.color} />
        <div className="flex-1 min-w-0">
          <div className="text-[15px] tracking-[0.2em] uppercase font-bold" style={{ color: L.color }}>{fm.name}</div>
          <div className="text-[27px] font-semibold leading-snug truncate">{SELL[fm.name]}</div>
        </div>
        <button onClick={() => has(ftarget) && jump(ftarget)} className="rounded-xl px-6 py-2.5 text-[20px] font-bold text-white flex-none" style={{ background: L.color }}>Open module ▶</button>
      </motion.div>
    </div>
  )
}
