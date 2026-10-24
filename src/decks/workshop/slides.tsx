import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { poss, useDeck, useNav, useSession } from '../../engine/context'
import { PainBanner } from '../../ui/PainBanner'
import { SkipBar } from './extra'
import { OIcon } from '../../ui/OutcomeIcons'
import { Avatar, Badge, Counter, fade } from '../../ui/primitives'
import { Section } from '../../slides/layouts'
import { modules, pillars } from '../../slides/modules'
import { FOUNDATION, OUTCOMES, PAIN_OUTCOME, ROLES, chapterSlideId, momentSlideId, outcomeById, packageFor, type Outcome } from './data'

const mix = (c: string, p: number) => `color-mix(in srgb, ${c} ${p}%, transparent)`

/* ───────── 2 · Who is in the room ───────── */
export function RolesSlide() {
  const { roles, toggleRole } = useSession()
  return (
    <Section eyebrow="Who is in the room?" title="Tap everyone who is here today." sub="We’ll tune what we show to what each of you cares about." zoom={1.3}>
      <div className="grid grid-cols-4 gap-5 mt-4">
        {ROLES.map((r, k) => {
          const on = roles.includes(r.id)
          return (
            <motion.button key={r.id} {...fade(0.1 * k)} onClick={() => toggleRole(r.id)} className="card p-6 text-left transition"
              style={{ outline: on ? '3px solid var(--brand2)' : 'none', background: on ? mix('var(--brand)', 22) : undefined }}>
              <div className="flex items-start justify-between"><span className="text-[54px] leading-none">{r.icon}</span>{on && <Badge tone="ok">✓ here</Badge>}</div>
              <div className="serif text-[30px] font-bold mt-3">{r.name}</div>
              <div className="text-[18px] mt-1 mb-4" style={{ color: 'var(--mute)' }}>{r.line}</div>
              <ul className="flex flex-col gap-2 text-[16px]">{r.bullets.map(b => <li key={b} className="flex gap-2"><span style={{ color: 'var(--brand2)' }}>▸</span>{b}</li>)}</ul>
              <div className="flex flex-wrap gap-1.5 mt-4">{r.outcomes.map(o => <span key={o} className="rounded-full px-2.5 py-1 text-[13px]" style={{ background: mix(outcomeById[o].color, 22), border: `1px solid ${mix(outcomeById[o].color, 50)}` }}><OIcon id={o} size={20} color={outcomeById[o].color} /> {outcomeById[o].short}</span>)}</div>
            </motion.button>
          )
        })}
      </div>
    </Section>
  )
}

/* ───────── 3 · A day at {client} ───────── */
export function DaySlide() {
  const { country, industry, company } = useDeck()
  const { jump } = useNav()
  const [now, setNow] = useState(0)
  useEffect(() => { const t = setInterval(() => setNow(x => (x + 1) % 12), 1500); return () => clearInterval(t) }, [])
  const n = country.sampleNames
  const P = { owner: [n[0], 'Owner'], emp: [n[1], industry.roles[1]], mgr: [n[2], 'Manager'], hr: [n[3], 'HR'], pay: [n[4], 'Payroll'] } as const
  const rows: [string, keyof typeof P, string, string, string][] = [
    ['07:55', 'emp', `checks in at ${industry.site} — GPS and camera, inside the geofence`, 'Attendance', 'time'],
    ['08:30', 'mgr', 'approves two leave requests from the phone', 'Leave & approvals', 'leave'],
    ['09:00', 'hr', 'publishes a new policy — everyone must confirm they’ve read it', 'Knowledge base', 'serve'],
    ['09:40', 'hr', 'generates a new joiner’s offer letter in seconds', 'Letters engine', 'hire'],
    ['10:30', 'pay', 'reviews attendance exceptions before the pay run', 'Attendance → payroll', 'pay'],
    ['11:15', 'emp', 'asks the HR assistant a question and raises a ticket', 'Service desk & chat', 'serve'],
    ['12:00', 'owner', 'opens Workforce Live on the phone between meetings', 'Dashboards', 'know'],
    ['13:30', 'pay', 'posts the salary journals to the general ledger', 'Finance & GL', 'pay'],
    ['14:00', 'mgr', 'a sensitive change waits for a higher-authority approval', 'Higher Authorization', 'approve'],
    ['15:00', 'mgr', 'sets team goals and runs a 360° review', 'Performance', 'grow'],
    ['16:00', 'hr', 'is alerted before a licence and a certificate expire', 'Training & compliance', 'grow'],
    ['17:30', 'owner', 'every alert reached the right person on the right channel', 'Notification rules', 'approve'],
  ]
  return (
    <Section eyebrow="A day at your company" title={`One working day at ${company} — all on PeopleHub.`} sub="Five people, twelve moments. Tap any tag to jump to that part of the story." zoom={1.3}>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-3">
        {rows.map(([t, p, text, chip, o], k) => (
          <motion.div key={t} {...fade(0.12 + 0.18 * k)} className="card px-4 py-3 flex items-center gap-4" style={{ outline: k === now ? `3px solid ${outcomeById[o].color}` : '3px solid transparent', transition: 'outline-color .35s', background: k === now ? mix(outcomeById[o].color, 14) : undefined }}>
            <div className="text-[20px] font-extrabold tabular-nums w-[64px]" style={{ color: 'var(--brand2)' }}>{t}</div>
            <Avatar name={P[p][0]} size={44} />
            <div className="flex-1 text-[17px] leading-snug"><b>{P[p][0].split(' ')[0]}</b> <span style={{ color: 'var(--mute)' }}>({P[p][1]})</span> {text}</div>
            <button onClick={() => jump(chapterSlideId(o))} className="rounded-full px-3 py-1.5 text-[13px] font-bold whitespace-nowrap" style={{ background: mix(outcomeById[o].color, 24), border: `1px solid ${outcomeById[o].color}` }}>{chip}</button>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

/* ───────── 5 · Discovery wall ───────── */
export function WallSlide() {
  const { outcomes, toggleOutcome, roles } = useSession()
  return (
    <Section eyebrow="Discovery wall" title="What matters most to you?" sub="Tap the outcomes you want PeopleHub to deliver. Start with what hurts most — we’ll build your blueprint from your choices." zoom={1.2}>
      <div className="grid grid-cols-5 gap-4 mt-3">
        {OUTCOMES.map((o, k) => {
          const rank = outcomes.indexOf(o.id)
          const on = rank >= 0
          const hint = ROLES.filter(r => roles.includes(r.id) && r.outcomes.includes(o.id))
          return (
            <motion.button key={o.id} {...fade(0.05 * k)} onClick={() => toggleOutcome(o.id)} className="card p-5 text-left relative transition"
              style={{ minHeight: 262, outline: on ? `3px solid ${o.color}` : 'none', background: on ? mix(o.color, 20) : undefined, boxShadow: on ? `0 0 40px -8px ${o.color}` : undefined }}>
              {on && <span className="absolute top-3 right-3 w-8 h-8 rounded-full grid place-items-center font-extrabold text-[16px] text-white" style={{ background: o.color }}>{rank + 1}</span>}
              <OIcon id={o.id} size={62} color={o.color} />
              <div className="serif text-[24px] font-bold leading-tight mt-3">{o.name}</div>
              <div className="text-[14.5px] mt-2 leading-snug" style={{ color: 'var(--mute)' }}>{o.promise}</div>
              <div className="mt-3 flex items-center justify-between text-[13px]" style={{ color: 'var(--mute)' }}>
                <span>{o.moments.length} capabilities</span>
                <span>{hint.map(r => r.icon).join(' ')}</span>
              </div>
            </motion.button>
          )
        })}
      </div>
      <div className="mt-5 flex items-center gap-4 text-[18px]">
        <Badge tone={outcomes.length ? 'ok' : 'mute'}>{outcomes.length} chosen</Badge>
        <span style={{ color: 'var(--mute)' }}>Numbers show the order you picked them. Next slide: your live blueprint →</span>
      </div>
    </Section>
  )
}

/* ───────── 6 · Your blueprint, live ───────── */
export function BlueprintSlide() {
  const { company } = useDeck()
  const { outcomes } = useSession()
  const { jump } = useNav()
  const chosen = outcomes.map(id => outcomeById[id]).filter(Boolean)
  const caps = chosen.reduce((a, o) => a + o.moments.length, 0)
  const lit = new Set(chosen.flatMap(o => o.modules))
  return (
    <Section eyebrow="Your blueprint" title={`${poss(company)} PeopleHub — built from your choices.`} sub={chosen.length ? 'Your outcomes, in the order we’ll walk through them. Everything lit on the map is part of your platform.' : 'Go back one slide and tap the outcomes that matter to you.'} zoom={1.12}>
      <div className="grid grid-cols-12 gap-8 mt-2">
        <div className="col-span-5 flex flex-col gap-2.5">
          {chosen.map((o, k) => (
            <motion.button key={o.id} {...fade(0.1 * k)} onClick={() => jump(chapterSlideId(o.id))} className="card px-4 py-3 flex items-center gap-4 text-left" style={{ borderLeft: `5px solid ${o.color}` }}>
              <span className="w-9 h-9 rounded-full grid place-items-center font-extrabold text-white flex-none" style={{ background: o.color }}>{k + 1}</span>
              <OIcon id={o.id} size={42} color={o.color} />
              <span className="flex-1"><b className="text-[19px]">{o.name}</b><span className="block text-[13.5px]" style={{ color: 'var(--mute)' }}>{o.moments.length} capabilities · tap to open this chapter</span></span>
            </motion.button>
          ))}
          {!chosen.length && <div className="card p-8 text-[20px]" style={{ color: 'var(--mute)' }}>Nothing chosen yet.</div>}
        </div>
        <div className="col-span-7">
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[['Outcomes', chosen.length], ['Capabilities', caps], ['Modules lit', lit.size]].map(([l, v]) => (
              <div key={l as string} className="card p-4 text-center"><div className="serif text-[52px] leading-none font-bold grad-text"><Counter to={v as number} /></div><div className="text-[16px]" style={{ color: 'var(--mute)' }}>{l}</div></div>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-2">
            {pillars.map(p => (
              <div key={p.id}>
                <div className="text-[12.5px] font-bold mb-1.5 leading-tight" style={{ color: p.color }}>{p.name}</div>
                <div className="flex flex-col gap-1.5">
                  {modules.filter(m => m.pillar === p.id).map((m, mi) => {
                    const on = lit.has(m.id)
                    return <motion.div key={m.id + on} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: on ? 1 : 0.5, scale: 1 }} transition={{ delay: 0.3 + mi * 0.07 + pillars.indexOf(p) * 0.1 }} className="rounded-md px-2 py-1.5 text-[13px] leading-tight" style={{ background: on ? mix(p.color, 38) : 'var(--card)', border: `1px solid ${on ? p.color : 'var(--line)'}`, boxShadow: on ? `0 0 14px -4px ${p.color}` : 'none' }}>{m.name}</motion.div>
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-4">{FOUNDATION.map(f => <span key={f} className="rounded-full px-3 py-1 text-[13px]" style={{ background: mix('var(--brand)', 18), border: '1px solid var(--line)' }}>⬢ {f}</span>)}</div>
        </div>
      </div>
    </Section>
  )
}

/* ───────── 7 · The PeopleHub fabric ───────── */
export function FabricSlide() {
  const { outcomes } = useSession()
  const { jump } = useNav()
  return (
    <Section eyebrow="The whole system" title="The PeopleHub fabric." sub="One foundation, ten outcomes, every way your people work. Tap an outcome to open it." zoom={1.2}>
      <div className="flex flex-col gap-4 mt-2">
        <div className="card p-4">
          <div className="text-[13px] tracking-[0.2em] uppercase font-bold mb-2" style={{ color: 'var(--brand2)' }}>Experience — where people work</div>
          <div className="flex flex-wrap gap-2">{['Admin web app', 'Manager workspace', 'Employee web portal', 'Android & iPhone apps', 'Team page & QR', 'PDF leave-behind'].map(x => <span key={x} className="rounded-xl px-4 py-2 text-[16px] font-semibold" style={{ background: mix('var(--accent)', 18), border: '1px solid var(--line)' }}>{x}</span>)}</div>
        </div>
        <div className="card p-4">
          <div className="text-[13px] tracking-[0.2em] uppercase font-bold mb-2" style={{ color: 'var(--brand2)' }}>Outcomes — what you achieve</div>
          <div className="grid grid-cols-5 gap-2.5">
            {OUTCOMES.map(o => {
              const on = outcomes.includes(o.id)
              return (
                <button key={o.id} onClick={() => jump(chapterSlideId(o.id))} className="rounded-xl p-3 text-left transition hover:brightness-125" style={{ background: mix(o.color, on ? 30 : 14), border: `${on ? 2 : 1}px solid ${on ? o.color : 'var(--line)'}` }}>
                  <OIcon id={o.id} size={40} color={o.color} />
                  <div className="font-bold text-[15px] leading-tight mt-1.5">{o.name}</div>
                  <div className="text-[12px] mt-1" style={{ color: 'var(--mute)' }}>{o.moments.length} capabilities</div>
                </button>
              )
            })}
          </div>
        </div>
        <div className="card p-4">
          <div className="text-[13px] tracking-[0.2em] uppercase font-bold mb-2" style={{ color: 'var(--brand2)' }}>Foundation — shared by everything</div>
          <div className="flex flex-wrap gap-2">{FOUNDATION.map(x => <span key={x} className="rounded-xl px-4 py-2 text-[16px] font-semibold" style={{ background: mix('var(--brand)', 22), border: '1px solid var(--line)' }}>⬢ {x}</span>)}</div>
        </div>
      </div>
    </Section>
  )
}

/* ───────── Chapter card ───────── */
export function ChapterCard({ o }: { o: Outcome }) {
  const { outcomes, toggleOutcome } = useSession()
  const { pains } = useDeck()
  const { jump, has } = useNav()
  const idx = OUTCOMES.findIndex(x => x.id === o.id)
  const on = outcomes.includes(o.id)
  const solved = pains.filter(p => PAIN_OUTCOME[p.id]?.includes(o.id))
  const circ = 2 * Math.PI * 54
  return (
    <div className="absolute inset-0 px-20 pt-16 pb-24 grid grid-cols-12 gap-14 items-center">
      <div className="col-span-5">
        <motion.div {...fade(0)} className="text-[18px] tracking-[0.22em] uppercase font-bold mb-3" style={{ color: o.color }}>Outcome {idx + 1} of {OUTCOMES.length}</motion.div>
        <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', delay: 0.1 }} className="mb-3"><OIcon id={o.id} size={104} color={o.color} /></motion.div>
        <motion.h2 {...fade(0.15)} className="serif text-[72px] leading-[1.03] font-bold mb-4">{o.name}</motion.h2>
        <motion.p {...fade(0.25)} className="text-[29px] leading-snug mb-6" style={{ color: 'var(--mute)' }}>{o.promise}</motion.p>
        <motion.div {...fade(0.35)} className="card p-5 mb-5 flex items-center gap-6" style={{ borderLeft: `5px solid ${o.color}` }}>
          <svg width="130" height="130" viewBox="0 0 130 130" className="flex-none">
            <circle cx="65" cy="65" r="54" fill="none" stroke="var(--line)" strokeWidth="11" />
            <motion.circle cx="65" cy="65" r="54" fill="none" stroke={o.color} strokeWidth="11" strokeLinecap="round" strokeDasharray={circ} initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ * (1 - Math.min(o.kpi.value, 100) / 100) }} transition={{ delay: 0.6, duration: 1.4, ease: 'easeOut' }} style={{ transform: 'rotate(-90deg)', transformOrigin: '65px 65px' }} />
            <text x="65" y="77" textAnchor="middle" fontSize="34" fontWeight="800" fill="var(--ink)" fontFamily="Fraunces, serif">{o.kpi.value}{o.kpi.suffix}</text>
          </svg>
          <div><div className="text-[26px] font-semibold leading-snug">{o.kpi.label}</div><div className="text-[14px] mt-1" style={{ color: 'var(--mute)' }}>Illustrative, based on typical customer outcomes</div></div>
        </motion.div>
        {solved.length > 0 && <div className="mb-4"><PainBanner pains={solved} solver={o.name} delay={0.9} /></div>}
        <motion.div {...fade(0.45)}>
          <button onClick={() => toggleOutcome(o.id)} className="rounded-full px-6 py-3 text-[20px] font-bold transition" style={on ? { background: o.color, color: '#fff' } : { background: 'var(--card)', border: `1.5px solid ${o.color}` }}>{on ? '✓ On your blueprint' : '+ Add to your blueprint'}</button>
        </motion.div>
      </div>
      <div className="col-span-7">
        <div className="text-[17px] tracking-[0.2em] uppercase font-bold mb-3" style={{ color: 'var(--mute)' }}>Inside this chapter · {o.moments.length} capabilities</div>
        <div className="grid grid-cols-2 gap-3.5">
          {o.moments.map((m, k) => {
            const id = momentSlideId(o.id, m.key), ready = has(id)
            return (
              <motion.button key={m.key} {...fade(0.2 + 0.08 * k)} whileHover={{ scale: ready ? 1.03 : 1 }} onClick={() => ready && jump(id)} className="card px-5 py-5 text-left flex items-center gap-4" style={{ cursor: ready ? 'pointer' : 'default', borderLeft: `5px solid ${o.color}` }}>
                <span className="serif text-[40px] font-bold" style={{ color: o.color }}>{String(k + 1).padStart(2, '0')}</span>
                <span className="text-[25px] font-semibold leading-snug">{m.name}</span>
              </motion.button>
            )
          })}
        </div>
      </div>
      <SkipBar />
    </div>
  )
}

/* ───────── Close: blueprint recap ───────── */
export function RecapSlide() {
  const { company, focusPains } = useDeck()
  const { outcomes } = useSession()
  const chosen = outcomes.map(id => outcomeById[id]).filter(Boolean)
  const pkg = packageFor(outcomes)
  const covers = { Starter: ['Core HR', 'Workforce Operations'], Professional: ['Core HR', 'Workforce Operations', 'Talent', 'Employee Experience'], Enterprise: ['Core HR', 'Workforce Operations', 'Talent', 'Employee Experience', 'Workforce Intelligence'] }[pkg]
  return (
    <Section eyebrow="Your blueprint" title={`What we’ll build for ${company}.`} sub="Your choices, the capabilities behind them, and the package that fits." zoom={1.1}>
      <div className="grid grid-cols-12 gap-8 mt-2">
        <div className="col-span-8 flex flex-col gap-3">
          {chosen.length === 0 && <div className="card p-6 text-[20px]" style={{ color: 'var(--mute)' }}>No outcomes chosen on the discovery wall.</div>}
          {chosen.map((o, k) => (
            <motion.div key={o.id} {...fade(0.08 * k)} className="card px-4 py-3" style={{ borderLeft: `5px solid ${o.color}` }}>
              <div className="flex items-center gap-3"><OIcon id={o.id} size={36} color={o.color} /><b className="text-[19px]">{k + 1}. {o.name}</b></div>
              <div className="flex flex-wrap gap-1.5 mt-2">{o.moments.map(m => <span key={m.key} className="rounded-full px-2.5 py-0.5 text-[12.5px]" style={{ background: mix(o.color, 20), border: `1px solid ${mix(o.color, 45)}` }}>{m.name}</span>)}</div>
            </motion.div>
          ))}
        </div>
        <div className="col-span-4 flex flex-col gap-4">
          <div className="card p-6 glow">
            <div className="text-[14px] tracking-[0.18em] uppercase font-bold" style={{ color: 'var(--brand2)' }}>Recommended package</div>
            <div className="serif text-[48px] font-bold grad-text leading-tight my-1">{pkg}</div>
            <ul className="text-[16px] flex flex-col gap-1">{covers.map(c => <li key={c}>✓ {c}</li>)}</ul>
            <div className="text-[13px] mt-3" style={{ color: 'var(--mute)' }}>Any module can also be added à la carte.</div>
          </div>
          <div className="card p-5">
            <div className="text-[14px] tracking-[0.18em] uppercase font-bold mb-2" style={{ color: 'var(--brand2)' }}>Challenges answered</div>
            {focusPains.slice(0, 4).map(p => <div key={p.id} className="text-[15px] mb-1">{p.icon} {p.label}</div>)}
          </div>
        </div>
      </div>
    </Section>
  )
}

/* ───────── Close: rollout waves (no dates) ───────── */
export function WavesSlide() {
  const { outcomes } = useSession()
  const order = [...outcomes, ...OUTCOMES.map(o => o.id).filter(id => !outcomes.includes(id))].map(id => outcomeById[id])
  const waves = [
    { name: 'Wave 1 · Foundation', sub: 'Structure, people, access and your top priorities', items: order.slice(0, 3), foundation: true },
    { name: 'Wave 2 · Run the business', sub: 'The next set of outcomes, live in your daily operations', items: order.slice(3, 7), foundation: false },
    { name: 'Wave 3 · Grow and decide', sub: 'Everything that remains, fully on one platform', items: order.slice(7), foundation: false },
  ]
  return (
    <Section eyebrow="Rollout" title="Live in waves — your priorities first." sub="Sequence agreed with you in the discovery workshop. No fixed dates until we have scoped it together." zoom={1.3}>
      <div className="grid grid-cols-3 gap-5 mt-3">
        {waves.map((w, k) => (
          <motion.div key={w.name} {...fade(0.15 * k)} className="card p-5 flex flex-col gap-3">
            <div><div className="serif text-[28px] font-bold">{w.name}</div><div className="text-[15px]" style={{ color: 'var(--mute)' }}>{w.sub}</div></div>
            {w.foundation && <div className="flex flex-wrap gap-1.5">{FOUNDATION.slice(0, 5).map(f => <span key={f} className="rounded-full px-2.5 py-1 text-[12.5px]" style={{ background: mix('var(--brand)', 22), border: '1px solid var(--line)' }}>⬢ {f}</span>)}</div>}
            {w.items.map(o => (
              <div key={o.id} className="rounded-xl px-3 py-2.5 flex items-center gap-3" style={{ background: mix(o.color, 18), border: `1px solid ${mix(o.color, 45)}` }}>
                <OIcon id={o.id} size={34} color={o.color} /><span className="flex-1 text-[16px] font-semibold leading-tight">{o.name}</span>
                {outcomes.includes(o.id) && <span title="Your priority" className="text-[16px]" style={{ color: 'var(--warn)' }}>★</span>}
              </div>
            ))}
          </motion.div>
        ))}
      </div>
      <div className="mt-4 text-[15px]" style={{ color: 'var(--mute)' }}>★ = outcomes you chose on the discovery wall.</div>
    </Section>
  )
}

/* ───────── Close: leave your details ───────── */
export function DetailsSlide() {
  const { client, presenter } = useDeck()
  const { lead, setLead, outcomes } = useSession()
  const field = (k: 'name' | 'email' | 'phone', label: string, type = 'text') => (
    <label className="text-[15px]">{label}
      <input type={type} value={lead[k] ?? ''} onChange={e => setLead({ [k]: e.target.value })} className="w-full mt-1 rounded-xl px-4 py-3 text-[20px] outline-none" style={{ background: 'var(--card)', border: '1.5px solid var(--line)', color: 'var(--ink)' }} />
    </label>
  )
  return (
    <Section eyebrow="Next step" title={`Let’s keep in touch${client ? `, ${client}` : ''}.`} sub={`Leave your details and ${presenter.name ?? presenter.company} will follow up with your blueprint and a date for the discovery workshop.`} zoom={1.2}>
      <div className="grid grid-cols-2 gap-8 mt-3">
        <div className="card p-6 flex flex-col gap-4">
          {field('name', 'Your name')}
          <label className="text-[15px]">Your role
            <select value={lead.role ?? ''} onChange={e => setLead({ role: e.target.value })} className="w-full mt-1 rounded-xl px-4 py-3 text-[20px] outline-none" style={{ background: 'var(--card)', border: '1.5px solid var(--line)', color: 'var(--ink)' }}>
              <option value="">Select…</option>{ROLES.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}<option value="Other">Other</option>
            </select>
          </label>
          {field('email', 'Email', 'email')}
          {field('phone', 'Phone / WhatsApp', 'tel')}
          <label className="text-[15px]">Anything we should know?
            <textarea value={lead.notes ?? ''} onChange={e => setLead({ notes: e.target.value })} rows={2} className="w-full mt-1 rounded-xl px-4 py-3 text-[18px] outline-none" style={{ background: 'var(--card)', border: '1.5px solid var(--line)', color: 'var(--ink)' }} />
          </label>
        </div>
        <div className="flex flex-col gap-4">
          <div className="card p-6">
            <div className="text-[14px] tracking-[0.18em] uppercase font-bold mb-2" style={{ color: 'var(--brand2)' }}>Your priorities</div>
            {outcomes.length ? outcomes.map(id => <div key={id} className="text-[19px] mb-1.5 flex items-center gap-2.5"><OIcon id={id} size={28} color={outcomeById[id].color} />{outcomeById[id].name}</div>) : <div style={{ color: 'var(--mute)' }}>—</div>}
          </div>
          <div className="text-[14px]" style={{ color: 'var(--mute)' }}>These details stay in this browser session and are included if you export the PDF. They are not sent anywhere.</div>
        </div>
      </div>
    </Section>
  )
}
