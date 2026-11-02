import { motion } from 'framer-motion'
import type { SlideDef } from '../../engine/context'
import { useDeck } from '../../engine/context'
import { fade, Counter } from '../../ui/primitives'
import { PHLogo } from '../../ui/PHLogo'
import newworldLogo from '../../assets/newworld-logo.png'

const mix = (c: string, p: number) => `color-mix(in srgb, ${c} ${p}%, transparent)`
const GREEN = '#0b9b4a', RED = '#e8212b'

/** The Newworld logo has a transparent background, so it always sits on a white pill. */
function NewworldMark({ h = 64, className = '' }: { h?: number; className?: string }) {
  return <img src={newworldLogo} alt="Newworld IGA" className={`object-contain rounded-2xl bg-white px-5 py-2 shadow-lg ${className}`} style={{ height: h }} />
}

const Tick = ({ children, size = 21 }: { children: React.ReactNode; size?: number }) => (
  <li className="flex gap-3 leading-snug" style={{ fontSize: size }}><span className="font-bold" style={{ color: 'var(--ok)' }}>✓</span><span>{children}</span></li>
)

/* ───────── Why Newworld Technologies for FRCS HRIS? ───────── */
function WhyNewworld() {
  const { client } = useDeck()
  const who = client || 'FRCS'
  return (
    <div className="absolute inset-0">
      <div className="absolute left-14 right-14 top-[52px] flex items-start justify-between gap-8">
        <div>
          <motion.div {...fade(0)} className="text-[18px] tracking-[0.26em] uppercase font-bold mb-2" style={{ color: GREEN }}>Your delivery partner in Fiji</motion.div>
          <motion.h2 {...fade(0.06)} className="serif text-[50px] leading-[1.04] font-bold whitespace-nowrap">Why Newworld Technologies for {who} HRIS?</motion.h2>
          <motion.div {...fade(0.12)} className="text-[27px] font-semibold mt-2 grad-text">Your local digital transformation partner.</motion.div>
        </div>
        <motion.div {...fade(0.2)} className="flex-none pt-3"><NewworldMark h={74} /></motion.div>
      </div>

      <motion.div {...fade(0.2)} className="absolute left-14 right-14 top-[246px] grid grid-cols-4 gap-4">
        {[[1933, '', 'roots dating back to', true], [19, '', 'supermarkets across Fiji', false], [3, '', 'wholesale operations', false], ['1,300+', '', 'employees already on PeopleHub', true]].map(([v, suf, label, plain]) => (
          <div key={label as string} className="card px-5 py-3 flex items-baseline gap-3">
            <span className="serif text-[50px] font-bold leading-none" style={{ color: GREEN }}>{plain ? v : <Counter to={v as number} suffix={suf as string} />}</span>
            <span className="text-[20px] leading-tight" style={{ color: 'var(--mute)' }}>{label}</span>
          </div>
        ))}
      </motion.div>

      <div className="absolute left-14 right-14 top-[352px] grid grid-cols-3 gap-5">
        <motion.div {...fade(0.3)} className="card p-6" style={{ borderTop: `5px solid ${GREEN}` }}>
          <div className="text-[27px] font-bold mb-3">Proven Fijian enterprise capability</div>
          <ul className="flex flex-col gap-3">
            <Tick>A trusted Fiji organisation with roots dating back to 1933, operating nationwide through the IGA retail network.</Tick>
            <Tick>Supports business operations across 19 supermarkets and 3 wholesale operations throughout Fiji.</Tick>
            <Tick>Runs mission-critical systems: ERP, HRIS, cybersecurity, cloud platforms, business intelligence and enterprise infrastructure.</Tick>
          </ul>
        </motion.div>
        <motion.div {...fade(0.4)} className="card p-6" style={{ borderTop: `5px solid ${RED}` }}>
          <div className="text-[27px] font-bold mb-3">HRIS experience backed by real operations</div>
          <p className="text-[21px] leading-snug mb-4">PeopleHub HRIS is already implemented and operating within Newworld’s own workforce of approximately 1,300+ employees.</p>
          <div className="text-[15px] tracking-[0.18em] uppercase font-bold mb-2" style={{ color: 'var(--mute)' }}>Practical understanding of</div>
          <div className="flex flex-wrap gap-2">
            {['Employee lifecycle management', 'Payroll operations', 'Attendance management', 'Performance management', 'Employee Self Service (ESS)', 'Manager Self Service (MSS)'].map(c => (
              <span key={c} className="rounded-full px-3.5 py-1.5 text-[18px] font-semibold" style={{ background: mix(RED, 12), border: `1px solid ${mix(RED, 45)}` }}>{c}</span>
            ))}
          </div>
        </motion.div>
        <motion.div {...fade(0.5)} className="card p-6" style={{ borderTop: `5px solid ${GREEN}` }}>
          <div className="text-[27px] font-bold mb-3">Strong local support presence</div>
          <ul className="flex flex-col gap-3">
            <Tick>Fiji-based project management and implementation team.</Tick>
            <Tick>Local training and change management resources.</Tick>
            <Tick>Tier 1 support delivered directly from Fiji.</Tick>
            <Tick>A single local point of accountability for {who}.</Tick>
          </ul>
        </motion.div>
      </div>

      <motion.div {...fade(0.7)} className="absolute left-14 right-14 bottom-[74px] rounded-2xl px-6 py-4" style={{ background: mix(GREEN, 14), border: `1.5px solid ${mix(GREEN, 55)}` }}>
        <div className="text-[15px] tracking-[0.22em] uppercase font-bold mb-2" style={{ color: GREEN }}>Why this matters to {who}</div>
        <ul className="grid grid-cols-4 gap-5">
          <Tick size={20}>Local ownership and accountability</Tick>
          <Tick size={20}>Rapid response and onsite support</Tick>
          <Tick size={20}>Proven enterprise-scale operational experience</Tick>
          <Tick size={20}>Deep understanding of Fiji regulatory and workforce requirements</Tick>
        </ul>
      </motion.div>
    </div>
  )
}

/* ───────── Strategic partnership: Newworld & Victory Information ───────── */
const NW_ROLES = ['Account management', 'Project governance', 'Business analysis', 'User training', 'Data migration coordination', 'Local support services', 'Change management', 'First-line helpdesk support']
const VI_ROLES = ['PeopleHub HRIS product developer', 'Solution architecture', 'HR process consultancy', 'Product engineering', 'Advanced configuration', 'Integrations & APIs', 'Tier 2 & Tier 3 support', 'Proven HR technology expertise']
const SECTORS = ['Government', 'Enterprise businesses', 'Financial services', 'Education', 'Manufacturing', 'Retail', 'Security services']
const STORIES = ['Colombo Lotus Tower (Government)', 'State Fertilizer Company Limited (Government)', 'John Keells Properties', 'WatchGuard Security & Investigations', 'Newworld Fiji HRIS deployment']
const VALUE = ['International HRIS expertise', 'Proven government sector experience', 'Dedicated local Fiji support', 'Direct access to the product developers', 'Faster issue resolution through a 3-tier support structure', 'A long-term technology partnership for continuous innovation']

function Partnership() {
  const { client } = useDeck()
  const who = client || 'FRCS'
  const card = (title: string, sub: string, color: string, items: string[], k: number) => (
    <motion.div {...fade(0.25 + k * 0.12)} className="card p-5 flex-1" style={{ borderTop: `5px solid ${color}` }}>
      <div className="text-[28px] font-bold leading-tight">{title}</div>
      <div className="text-[16px] tracking-[0.16em] uppercase font-bold mb-3" style={{ color }}>{sub}</div>
      <ul className="grid grid-cols-2 gap-x-5 gap-y-2.5">{items.map(i => <li key={i} className="flex gap-2 text-[20px] leading-snug"><span style={{ color }}>•</span><span>{i}</span></li>)}</ul>
    </motion.div>
  )
  return (
    <div className="absolute inset-0">
      <div className="absolute left-14 right-14 top-[52px] flex items-start justify-between gap-8">
        <div>
          <motion.div {...fade(0)} className="text-[18px] tracking-[0.26em] uppercase font-bold mb-2" style={{ color: 'var(--brand2)' }}>Strategic partnership</motion.div>
          <motion.h2 {...fade(0.06)} className="serif text-[54px] leading-[1.04] font-bold">Newworld & Victory Information</motion.h2>
          <motion.div {...fade(0.12)} className="text-[27px] font-semibold mt-2 grad-text">Global HRIS expertise combined with local delivery excellence.</motion.div>
        </div>
        <motion.div {...fade(0.2)} className="flex-none pt-3"><NewworldMark h={64} /></motion.div>
      </div>

      <div className="absolute left-14 right-14 top-[238px] flex items-stretch gap-4">
        {card('Newworld Technologies', 'Fiji · local delivery', GREEN, NW_ROLES, 0)}
        <motion.div {...fade(0.4)} className="flex-none self-center text-[52px] font-bold" style={{ color: 'var(--brand2)' }}>⬌</motion.div>
        {card('Victory Information', 'Sri Lanka · product & engineering', 'var(--brand2)', VI_ROLES, 1)}
      </div>

      <div className="absolute left-14 right-14 top-[590px] grid grid-cols-3 gap-4">
        <motion.div {...fade(0.6)} className="card p-5" style={{ borderTop: '5px solid var(--brand2)' }}>
          <div className="text-[24px] font-bold mb-1">Proven HR technology expertise</div>
          <p className="text-[19px] leading-snug mb-3">More than 10 years of dedicated HR technology experience, in:</p>
          <div className="flex flex-wrap gap-2">{SECTORS.map(s => <span key={s} className="rounded-full px-3 py-1 text-[17px] font-semibold" style={{ background: mix('#3b6be0', 16), border: `1px solid ${mix('#3b6be0', 45)}` }}>{s}</span>)}</div>
        </motion.div>
        <motion.div {...fade(0.7)} className="card p-5" style={{ borderTop: '5px solid var(--brand2)' }}>
          <div className="text-[24px] font-bold mb-2">Regional HRIS success stories</div>
          <ul className="flex flex-col gap-2">{STORIES.map(s => <li key={s} className="flex gap-2 text-[19px] leading-snug"><span style={{ color: 'var(--brand2)' }}>•</span><span>{s}</span></li>)}</ul>
        </motion.div>
        <motion.div {...fade(0.8)} className="card p-5" style={{ borderTop: `5px solid ${GREEN}`, background: mix(GREEN, 8) }}>
          <div className="text-[24px] font-bold mb-2" style={{ color: GREEN }}>Value delivered to {who}</div>
          <ul className="flex flex-col gap-2">{VALUE.map(v => <Tick key={v} size={19}>{v}</Tick>)}</ul>
        </motion.div>
      </div>
    </div>
  )
}

/* ───────── Thank you (Newworld as presenter, no Victory contact details) ───────── */
function Thanks() {
  const { client, presenter: p } = useDeck()
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
      <div className="relative">
        <motion.div {...fade(0)} className="flex items-center justify-center gap-6 mb-8"><PHLogo className="h-28 w-28" /><span className="text-[44px]" style={{ color: 'var(--mute)' }}>×</span><NewworldMark h={96} /></motion.div>
        <motion.h1 {...fade(0.1)} className="serif text-[96px] font-bold leading-tight">Thank you{client ? `, ${client}` : ''}.</motion.h1>
        <motion.div {...fade(0.25)} className="text-[30px] mt-4 grad-text font-semibold">Newworld Technologies and PeopleHub — your local partner for a modern HRIS.</motion.div>
        {(p.name || p.email || p.phone || p.web) && (
          <motion.div {...fade(0.4)} className="card px-12 py-7 text-[24px] leading-loose flex flex-col items-center mt-10 mx-auto w-fit">
            <b>{p.company}</b>
            {p.name && <span className="font-semibold">{p.name}{p.title ? <span style={{ color: 'var(--mute)' }}> · {p.title}</span> : null}</span>}
            {p.email && <span>✉ {p.email}</span>}{p.phone && <span>☎ {p.phone}</span>}{p.web && <span>🌐 {p.web}</span>}
          </motion.div>
        )}
      </div>
    </div>
  )
}

/** The two Newworld slides that replace the Victory “Who we are” slide, plus the closing slide. */
export function frcsOpeningSlides(): SlideDef[] {
  return [
    { id: 'frcs-why-newworld', section: 'Open', title: 'Why Newworld Technologies', secs: 90, tier: 3, render: () => <WhyNewworld />,
      notes: 'Open with local credibility: Newworld Technologies, roots to 1933, nationwide through the IGA network (19 supermarkets, 3 wholesale operations), running ERP, HRIS, cybersecurity, cloud, BI and infrastructure. Land the proof point: PeopleHub is already live for Newworld’s own ~1,300+ employees, covering lifecycle, payroll, attendance, performance, ESS and MSS. Then the local support model and the four reasons it matters to FRCS. Confirm the figures (19 / 3 / 1,300+) with Newworld before the meeting.' },
    { id: 'frcs-partnership', section: 'Open', title: 'Strategic partnership: Newworld & Victory Information', secs: 90, tier: 3, render: () => <Partnership />,
      notes: 'Explain the split: Newworld delivers locally (account management, governance, analysis, training, migration coordination, change management, first-line help desk); Victory Information in Sri Lanka builds and supports PeopleHub (architecture, HR consultancy, engineering, configuration, integrations, tier 2 and 3 support). Point at the regional success stories and the six values for FRCS. Claim used: more than 10 years of HR technology experience. Confirm the reference list may be named.' },
  ]
}
export const frcsClosingSlide = (): SlideDef => ({
  id: 'frcs-thanks', section: 'Close', title: 'Thank you', secs: 20, tier: 3, render: () => <Thanks />,
  notes: 'Thank them; leave this slide up during Q&A. Presenter contact details come from the control panel (Presenter section).',
})
