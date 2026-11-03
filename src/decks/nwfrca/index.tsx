import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import type { SlideDef } from '../../engine/context'
import { useNav } from '../../engine/context'
import { buildWorkshopSlides } from '../workshop'
import login from '../../assets/nwfrca/login.png'
import frcsLogo from '../../assets/nwfrca/frcs.png'
import nw from '../../assets/nwfrca/newworld.png'
import nwWide from '../../assets/nwfrca/newworld-wide.png'
import microsoft from '../../assets/nwfrca/microsoft.png'
import thakral from '../../assets/nwfrca/thakral.png'
import ninja from '../../assets/nwfrca/ninja.png'
import victory from '../../assets/nwfrca/victory.png'
import cLtl from '../../assets/nwfrca/c-ltl.png'
import cKdaw from '../../assets/nwfrca/c-kdaw.png'
import cAdvantis from '../../assets/nwfrca/c-advantis.png'
import cAvant from '../../assets/nwfrca/c-avant-garde.png'
import cSalaka from '../../assets/nwfrca/c-salaka.png'
import cRoccos from '../../assets/nwfrca/c-roccos.png'
import cNewworld from '../../assets/nwfrca/c-newworld.png'
import cAlan from '../../assets/nwfrca/c-alankulama.png'
import cCic from '../../assets/nwfrca/c-cic.jpeg'
import cLotus from '../../assets/nwfrca/c-lotus.jpeg'
import cJk from '../../assets/clients/john-keells-properties-1.webp'
import cState from '../../assets/clients/state-fertilizer.png'
import cEdna from '../../assets/clients/edna.png'
import cHci from '../../assets/clients/hci.jpg'
import cHemas from '../../assets/clients/hemas.png'
import cHnb from '../../assets/clients/hnb-assurance.jpg'
import cJay from '../../assets/clients/jayarathna.jpeg'
import cLyceum from '../../assets/clients/lyceum.png'
import cRoyal from '../../assets/clients/royal-institute-of-colombo-pvt-ltd.jpg'
import cSampath from '../../assets/clients/sampath-centre.jpeg'
import cRail from '../../assets/clients/sri-lanka-railway.webp'
import cSlt from '../../assets/clients/sri-lanka-telecom-services-ltd.webp'
import cSithara from '../../assets/clients/sithara.jpeg'
import cSltc from '../../assets/clients/sri-lanka-technological-campus-sltc.webp'

/* The Newworld HRIS pitch for FRCS (v4.0), rebuilt slide for slide with the original wording and animation added. */

const NAVY = '#0F2A52', TEAL = '#14A79D', ORANGE = '#F5A742', GRAY = '#5B6B7F', LIGHT = '#F3F7FA'
const OR = '#C55A11', BLUE = '#2E75B6', GOLD = '#FFC000', GREEN = '#19C37D'

const rise = (d = 0, y = 34) => ({ initial: { opacity: 0, y }, animate: { opacity: 1, y: 0 }, transition: { delay: d, duration: 0.55, ease: 'easeOut' as const } })
const slideIn = (d = 0, x = -70) => ({ initial: { opacity: 0, x }, animate: { opacity: 1, x: 0 }, transition: { delay: d, duration: 0.6, ease: 'easeOut' as const } })
const pop = (d = 0) => ({ initial: { opacity: 0, scale: 0.4 }, animate: { opacity: 1, scale: 1 }, transition: { delay: d, type: 'spring' as const, stiffness: 220, damping: 14 } })

function AnimNum({ to, suffix = '', plain = false, delay = 0.4, dur = 1.4 }: { to: number; suffix?: string; plain?: boolean; delay?: number; dur?: number }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let raf = 0
    const t0 = performance.now() + delay * 1000
    const tick = (t: number) => {
      const p = Math.min(1, Math.max(0, (t - t0) / (dur * 1000)))
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, delay, dur])
  return <>{plain ? v : v.toLocaleString('en-US')}{suffix}</>
}

const Page = ({ bg, children }: { bg: string; children: ReactNode }) => <div className="absolute inset-0 overflow-hidden" style={{ background: bg }}>{children}</div>

/** Light content slide frame: navy title, teal bar, Newworld logo top right. */
function Light({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Page bg={LIGHT}>
      <motion.img {...slideIn(0.1, 60)} src={nw} alt="Newworld IGA" className="absolute" style={{ right: 108, top: 34, height: 56 }} />
      <motion.h2 {...rise(0)} className="absolute font-extrabold" style={{ left: 96, top: 88, fontSize: 62, color: NAVY, lineHeight: 1.1 }}>{title}</motion.h2>
      <motion.div initial={{ width: 0 }} animate={{ width: 168 }} transition={{ delay: 0.3, duration: 0.6 }} className="absolute rounded-full" style={{ left: 96, top: 196, height: 9, background: TEAL }} />
      {children}
    </Page>
  )
}

/* 1 · Welcome / login screen ------------------------------------------------------------------------------------ */
function S1() {
  return (
    <Page bg="#fff">
      <motion.div initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, ease: 'easeOut' }} className="absolute left-0 right-0 top-0 overflow-hidden" style={{ height: 900 }}>
        <img src={login} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'blur(24px)', transform: 'scale(1.15)' }} />
        <motion.img src={login} alt="PeopleHub sign-in" className="absolute top-0 h-full object-contain" style={{ left: '50%', translateX: '-50%' }} animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} />
      </motion.div>
      <div className="absolute left-0 right-0 flex items-start justify-between" style={{ top: 900, bottom: 0, padding: '22px 150px 0', background: '#fff' }}>
        <motion.img {...slideIn(0.8, -120)} src={frcsLogo} alt="Fiji Revenue and Customs Service" style={{ height: 80 }} />
        <motion.img {...slideIn(1.0, 120)} src={nw} alt="Newworld IGA" style={{ height: 62 }} />
      </div>
    </Page>
  )
}

/* 2 · Blueprint title ----------------------------------------------------------------------------------------- */
function S2() {
  const stats: [ReactNode, string, boolean?][] = [[<AnimNum to={1933} plain />, 'Fiji heritage & enterprise scale'], [<AnimNum to={1300} suffix="+" />, 'Employees on PeopleHub in Fiji'], ['24/7 SLA', 'Dedicated local Fiji helpdesk', true], [<><AnimNum to={32} /> Modules</>, 'Complete hire-to-retire platform']]
  return (
    <Page bg="#0B1017">
      <motion.div {...slideIn(0.1)} className="absolute flex items-center gap-6" style={{ left: 100, top: 52 }}>
        <img src={nw} alt="Newworld IGA" className="rounded-xl bg-white" style={{ height: 112, padding: '14px 26px' }} />
        <div className="h-14 w-px" style={{ background: '#2B3646' }} />
        <div className="text-[26px] font-bold tracking-[0.2em]" style={{ color: '#9AA7B8' }}>TECHNOLOGIES</div>
      </motion.div>
      <motion.div {...rise(0.3)} className="absolute text-[22px] font-extrabold tracking-[0.18em]" style={{ left: 100, top: 328, color: GREEN }}>ENTERPRISE HRIS TRANSFORMATION BLUEPRINT</motion.div>
      <div className="absolute" style={{ left: 100, top: 392, width: 1300 }}>
        {['Modern Human Capital', 'Management for FRCS'].map((l, i) => <motion.div key={l} {...rise(0.5 + i * 0.2, 50)} className="font-extrabold text-white" style={{ fontSize: 100, lineHeight: 1.08 }}>{l}</motion.div>)}
      </div>
      <motion.p {...rise(1.0)} className="absolute" style={{ left: 100, top: 640, width: 1250, fontSize: 28, lineHeight: 1.55, color: '#9AA7B8' }}>
        Empowering FRCS with a Future-Ready Workforce Platform — powered by PeopleHub and backed by Newworld’s Proven On-Shore Delivery Capability
      </motion.p>
      <div className="absolute grid grid-cols-4 gap-6" style={{ left: 100, right: 100, top: 830 }}>
        {stats.map(([v, l, g], k) => (
          <motion.div key={l} {...rise(1.3 + k * 0.15, 40)} className="rounded-2xl px-8 py-6" style={{ background: '#131A24', border: '1px solid #1E2A3A' }}>
            <div className="font-extrabold" style={{ fontSize: 50, color: g ? GREEN : '#fff' }}>{v}</div>
            <div className="text-[19px] mt-1" style={{ color: '#7C8AA0' }}>{l}</div>
          </motion.div>
        ))}
      </div>
    </Page>
  )
}

/* 3 · Agenda -------------------------------------------------------------------------------------------------- */
function S3() {
  const rows: [string, string, boolean?][] = [['2 min', 'Welcome and introduction'], ['7 min', 'Why Newworld: our technology journey, team and partners'], ['12 min', 'The solution: landscape, employee journey and key features'], ['5 min', 'Proof: reference customers'], ['4 min', 'Delivery approach, support and next steps'], ['15 min', 'Questions and answers', true]]
  return (
    <Light title="What we will cover in 30 minutes">
      {rows.map(([m, t, o], k) => (
        <motion.div key={t} {...slideIn(0.5 + k * 0.22, -90)} className="absolute flex items-center gap-10" style={{ left: 96, top: 300 + k * 117 }}>
          <motion.div {...pop(0.55 + k * 0.22)} className="rounded-2xl grid place-items-center text-white font-bold" style={{ width: 236, height: 92, fontSize: 30, background: o ? ORANGE : TEAL }}>{m}</motion.div>
          <div style={{ fontSize: 38, color: NAVY }}>{t}</div>
        </motion.div>
      ))}
    </Light>
  )
}

/* 4 · Household name ------------------------------------------------------------------------------------------ */
function S4() {
  const cards: [string, string][] = [['Microsoft Dynamics ERP', 'Finance, supply chain and operations'], ['eCommerce Solution', 'Online retail on the same backbone'], ['HRIS', 'Managing our own large, multi-site workforce'], ['Infrastructure Solutions', 'Cyber Security, Network & Wireless Solutions, EndPoint & Patch Management Solutions']]
  return (
    <Light title="Newworld: a household name, powered by technology">
      <div className="absolute" style={{ left: 96, top: 330, width: 700 }}>
        {['Known for retail.', 'Built on technology.'].map((l, i) => <motion.div key={l} {...rise(0.5 + i * 0.25, 40)} className="font-extrabold" style={{ fontSize: 68, color: NAVY, lineHeight: 1.16 }}>{l}</motion.div>)}
        <motion.p {...rise(1.1)} style={{ fontSize: 29, lineHeight: 1.6, color: GRAY, marginTop: 54 }}>The largest supermarket in Fiji, with 19 outlets across the country, runs its entire operation on modern, integrated systems.</motion.p>
      </div>
      {cards.map(([t, d], k) => (
        <motion.div key={t} {...slideIn(0.6 + k * 0.25, 120)} className="absolute rounded-xl bg-white" style={{ left: 864, width: 960, top: 268 + k * 190, height: 166, borderLeft: `12px solid ${TEAL}`, boxShadow: '0 6px 24px -10px rgba(15,42,82,.35)', padding: '30px 36px' }}>
          <div className="font-bold" style={{ fontSize: 35, color: NAVY }}>{t}</div>
          <div style={{ fontSize: 25, color: GRAY, marginTop: 14, lineHeight: 1.4 }}>{d}</div>
        </motion.div>
      ))}
    </Light>
  )
}

/* 5 · Skilled team ------------------------------------------------------------------------------------------- */
function S5() {
  const big = (n: ReactNode, label: ReactNode, d: number, top: number) => (
    <motion.div {...rise(d, 40)} className="absolute" style={{ left: 96, top }}>
      <div className="font-extrabold" style={{ fontSize: 150, lineHeight: 1, color: TEAL }}>{n}</div>
      <div style={{ fontSize: 29, color: NAVY, lineHeight: 1.35, width: 520 }}>{label}</div>
    </motion.div>
  )
  return (
    <Light title="A skilled team, backed by global partnerships">
      {big(<AnimNum to={1933} plain />, <><b>Fiji Heritage</b> & Enterprise Scale</>, 0.5, 262)}
      {big(<AnimNum to={1300} suffix="+" delay={0.7} />, <>Employees on <b>PeopleHub</b> in Fiji</>, 0.8, 506)}
      {big(<AnimNum to={20} suffix="+" delay={1.0} />, <>highly skilled in-house <b>technical professionals</b>, recruited and trained by Newworld</>, 1.1, 750)}
      <motion.div {...slideIn(0.7, 120)} className="absolute rounded-xl bg-white" style={{ left: 708, width: 1116, top: 262, height: 330, borderLeft: `12px solid ${TEAL}`, boxShadow: '0 6px 24px -10px rgba(15,42,82,.35)', padding: '26px 40px' }}>
        <div className="font-bold" style={{ fontSize: 33, color: NAVY }}>Strategic global partnerships</div>
        <div className="flex items-center justify-between" style={{ height: 150, marginTop: 6 }}>
          {[[microsoft, 118], [thakral, 76], [victory, 120], [ninja, 62]].map(([src, h], k) => (
            <motion.img key={k} {...pop(1.1 + k * 0.18)} src={src as string} alt="" style={{ height: h as number, maxWidth: 300, objectFit: 'contain' }} />
          ))}
        </div>
        <div style={{ fontSize: 25, color: GRAY }}>Collaboration to skill up local teams and access best-practice delivery.</div>
      </motion.div>
      <motion.div {...slideIn(1.0, 120)} className="absolute rounded-xl bg-white" style={{ left: 708, width: 1116, top: 630, height: 290, borderLeft: `12px solid ${ORANGE}`, boxShadow: '0 6px 24px -10px rgba(15,42,82,.35)', padding: '30px 40px' }}>
        <div className="font-bold" style={{ fontSize: 33, color: NAVY }}>Serving beyond our own walls</div>
        <div style={{ fontSize: 25, color: GRAY, marginTop: 18, lineHeight: 1.5 }}>The same team supports other organisations in Fiji and the region, not only internal IT.</div>
      </motion.div>
    </Light>
  )
}

/* 6 · Local technology partner ------------------------------------------------------------------------------ */
const Ico = ({ d, c, size = 40 }: { d: ReactNode; c: string; size?: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
const ICONS = {
  shield: <><path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z" /><path d="M9 12l2 2 4-4" /></>,
  headset: <><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="3" y="14" width="4" height="6" rx="1.5" /><rect x="17" y="14" width="4" height="6" rx="1.5" /><path d="M19 20c0 1-2 2-5 2" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  monitor: <><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 21h8M12 16v5" /></>,
  pin: <><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /><circle cx="17.5" cy="9" r="2.5" /><path d="M17 14c2.7 0 4.5 1.8 4.5 4.5" /></>,
}
function S6() {
  const rows: [string, string][] = [['Internal Production Proof', '1,300+ Staff Active'], ['Fiji Regulatory Alignment', 'FNPF • PAYE • ERA 2007'], ['National ICT Footprint', '20 Technical Specialists']]
  const minis: [keyof typeof ICONS, string, string, string][] = [['clock', '24×7 Coverage', 'Agreement-based SLA response', '#16A34A'], ['monitor', 'Dedicated Helpdesk', 'Direct phone, portal & email', '#2563EB'], ['pin', 'On-Site Presence', 'Rapid Fiji-wide intervention', '#EA7A12'], ['users', 'Local Governance', 'Single point of accountability', '#7C3AED']]
  const card: CSSProperties = { background: '#fff', borderRadius: 20, boxShadow: '0 10px 34px -14px rgba(15,42,82,.35)', border: '1px solid #E5EAF1' }
  return (
    <Page bg="#F8FAFC">
      <motion.img {...slideIn(0.1, 60)} src={nw} alt="Newworld IGA" className="absolute" style={{ right: 108, top: 34, height: 56 }} />
      <motion.div {...rise(0)} className="absolute text-[20px] font-extrabold tracking-[0.12em]" style={{ left: 96, top: 66, color: '#0B8F4F' }}>PROVEN FIJI ENTERPRISE & TECHNOLOGY LEADERSHIP</motion.div>
      <motion.h2 {...rise(0.1)} className="absolute font-extrabold" style={{ left: 96, top: 110, fontSize: 56, color: '#0F172A' }}>Your Local Technology Partner in Fiji</motion.h2>
      <motion.div {...slideIn(0.4, -110)} className="absolute" style={{ ...card, left: 96, top: 270, width: 840, height: 580, padding: '34px 40px' }}>
        <div className="flex items-center gap-5"><div className="rounded-xl grid place-items-center" style={{ width: 64, height: 64, background: '#E8F7EF' }}><Ico d={ICONS.shield} c="#0B8F4F" size={38} /></div><div className="font-extrabold" style={{ fontSize: 36, color: '#0F172A' }}>Enterprise Strength & Scale</div></div>
        <p style={{ fontSize: 25, lineHeight: 1.55, color: '#334155', marginTop: 22 }}>Serving Fiji since 1933 with 19 supermarkets and 3 wholesale operations nationwide. Newworld runs mission-critical retail ERP, cloud infrastructure, business intelligence, and cyber operations.</p>
        <div className="flex flex-col gap-3" style={{ marginTop: 26 }}>
          {rows.map(([l, v], k) => (
            <motion.div key={l} {...rise(1.0 + k * 0.2, 24)} className="flex items-center justify-between rounded-xl px-6 py-4" style={{ background: '#F1F5F9' }}>
              <span style={{ fontSize: 23, color: '#334155', fontWeight: 600 }}>{l}</span><span className="font-extrabold" style={{ fontSize: 23, color: '#0B8F4F' }}>{v}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <motion.div {...slideIn(0.6, 110)} className="absolute" style={{ ...card, left: 984, top: 270, width: 840, height: 640, padding: '34px 40px' }}>
        <div className="flex items-center gap-5"><div className="rounded-xl grid place-items-center" style={{ width: 64, height: 64, background: '#E7F0FE' }}><Ico d={ICONS.headset} c="#2563EB" size={38} /></div><div className="font-extrabold" style={{ fontSize: 36, color: '#0F172A' }}>Dedicated Local Support Levels</div></div>
        <p style={{ fontSize: 25, lineHeight: 1.55, color: '#334155', marginTop: 22 }}>Direct on the ground accountability for FRCS. Our Suva and Ba IT service centers provide immediate on-site response and formal SLA-backed coverage.</p>
        <div className="grid grid-cols-2 gap-4" style={{ marginTop: 24 }}>
          {minis.map(([ic, t, d, c], k) => (
            <motion.div key={t} {...pop(1.1 + k * 0.18)} className="rounded-xl p-4" style={{ border: '1px solid #E5EAF1', background: '#fff' }}>
              <Ico d={ICONS[ic]} c={c} size={28} /><div className="font-extrabold" style={{ fontSize: 22, color: '#0F172A', marginTop: 4 }}>{t}</div><div style={{ fontSize: 19, color: '#64748B', lineHeight: 1.3 }}>{d}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <div className="absolute flex items-center justify-between" style={{ left: 96, right: 96, top: 946, paddingTop: 14, borderTop: '1px solid #DCE3EC' }}>
        <span style={{ fontSize: 18, color: '#64748B' }}>EOI No. 32/2026 • Human Resources Information System for FRCS</span>
        <span className="font-extrabold" style={{ fontSize: 18, color: '#0B8F4F' }}>Newworld Technologies • Fiji Enterprise Partner</span>
      </div>
    </Page>
  )
}

/* 7 · Employee journey --------------------------------------------------------------------------------------- */
function S7() {
  const steps: [string, string][] = [['Recruit', 'Recruitment'], ['Onboard', 'Onboarding & records'], ['Develop', 'Training & skills'], ['Perform', 'Appraisals'], ['Reward', 'Payroll & benefits'], ['Engage', 'Self-service & leave'], ['Exit', 'Offboarding']]
  const W = 262, step = 224, x0 = 78
  return (
    <Light title="The employee journey, and where our HRIS fits">
      {steps.map(([a, b], k) => (
        <div key={a}>
          <motion.div {...slideIn(0.5 + k * 0.2, -120)} className="absolute grid place-items-center text-white font-bold" style={{ left: x0 + k * step, top: 290, width: W, height: 170, fontSize: 30, background: k % 2 ? TEAL : NAVY, clipPath: 'polygon(0 0, 82% 0, 100% 50%, 82% 100%, 0 100%, 16% 50%)', filter: 'drop-shadow(0 8px 10px rgba(0,0,0,.25))' }}>{a}</motion.div>
          <motion.div {...rise(0.9 + k * 0.2, 50)} className="absolute grid place-items-center text-center bg-white" style={{ left: x0 + 14 + k * step, top: 535, width: 210, height: 176, fontSize: 25, color: NAVY, boxShadow: '0 8px 22px -10px rgba(15,42,82,.45)', padding: '0 14px' }}>{b}</motion.div>
        </div>
      ))}
      <motion.div {...rise(2.5, 40)} className="absolute text-center font-bold" style={{ left: 96, width: 1728, top: 830, height: 168, border: `3px solid ${TEAL}`, background: 'rgba(20,167,157,.08)', fontSize: 33, color: NAVY, lineHeight: 1.5, display: 'grid', placeItems: 'center' }}>
        <div>One platform, One employee record, from First application to retirement:<br />Less rework, Better data, a Better Experience</div>
      </motion.div>
    </Light>
  )
}

/* 8–10 · System landscape diagrams ------------------------------------------------------------------------ */
const ArrowDown = ({ d }: { d: number }) => (
  <motion.svg {...rise(d, -10)} width="44" height="70" viewBox="0 0 44 70" className="mx-auto"><path d="M16 0h12v40h14L22 68 2 40h14z" fill={OR} /></motion.svg>
)
const Conn = ({ d }: { d: number }) => (
  <motion.svg {...pop(d)} width="64" height="40" viewBox="0 0 64 40" className="absolute" style={{ top: 58 }}><path d="M2 20l16-14v9h28V6l16 14-16 14v-9H18v9z" fill="#F4B183" stroke={OR} strokeWidth="2" /></motion.svg>
)

type Cell = ReactNode | { t: ReactNode; to: string }
const isLink = (c: Cell): c is { t: ReactNode; to: string } => typeof c === 'object' && c !== null && 'to' in (c as object) && 't' in (c as object)

/** A blue box; when it has a target slide it opens it as a side trip (Back returns here). */
function Box({ c, d, gold, minH = 104, fs = 24 }: { c: Cell; d: number; gold?: boolean; minH?: number; fs?: number }) {
  const { jump, has } = useNav()
  const to = isLink(c) ? c.to : undefined, live = !!to && has(to)
  const base: CSSProperties = { minHeight: minH, fontSize: fs, lineHeight: 1.25, padding: '10px 16px', background: BLUE, color: gold ? GOLD : '#fff', boxShadow: '0 10px 14px -8px rgba(0,0,0,.45)', position: 'relative', width: '100%' }
  return (
    <motion.button {...rise(d, 36)} disabled={!live} onClick={() => live && jump(to!)} whileHover={live ? { scale: 1.04, backgroundColor: '#3C8DD3' } : undefined} whileTap={live ? { scale: 0.98 } : undefined}
      className="grid place-items-center text-center font-bold" style={{ ...base, cursor: live ? 'pointer' : 'default' }}>
      {isLink(c) ? c.t : c}
      {live && <span style={{ position: 'absolute', right: 8, top: 4, fontSize: 16, opacity: 0.85 }}>↗</span>}
    </motion.button>
  )
}

function Landscape({ title, heads, cols, foot, gold, cx = [60, 523, 996, 1469], w = 374, minH = 104 }: { title: ReactNode; heads: string[]; cols: Cell[][]; foot: ReactNode; gold?: boolean; cx?: number[]; w?: number; minH?: number }) {
  return (
    <Page bg="#fff">
      <motion.h2 {...rise(0)} className="serif absolute left-0 right-0 text-center font-extrabold" style={{ top: 38, fontSize: 70, color: '#0B2559' }}>{title}</motion.h2>
      {heads.map((h, i) => (
        <div key={h} className="absolute" style={{ left: cx[i], top: 200, width: w }}>
          <motion.div {...pop(0.4 + i * 0.25)} className="grid place-items-center text-center font-bold text-white" style={{ height: 150, fontSize: 31, background: OR, lineHeight: 1.25, padding: '0 20px', boxShadow: '0 12px 18px -8px rgba(0,0,0,.4)' }}>{h}</motion.div>
          {i < heads.length - 1 && <div className="absolute" style={{ left: w - 16, top: 0 }}><Conn d={0.7 + i * 0.25} /></div>}
          <div style={{ marginTop: 10 }}><ArrowDown d={0.8 + i * 0.25} /></div>
          <div className="flex flex-col gap-[18px]" style={{ marginTop: 4 }}>
            {cols[i].map((b, k) => <Box key={k} c={b} d={1.1 + i * 0.25 + k * 0.2} gold={gold} minH={minH} />)}
          </div>
        </div>
      ))}
      <motion.div {...rise(2.4, 20)} className="absolute left-0 right-0 text-center" style={{ top: 962, fontSize: 30, color: '#111' }}>{foot}</motion.div>
    </Page>
  )
}
const Bul = ({ items }: { items: string[] }) => <ul className="text-left list-disc pl-8" style={{ width: '100%' }}>{items.map(i => <li key={i}>{i}</li>)}</ul>

function S8() {
  return (
    <Landscape title="PeopleHub HRIS System Landscape" foot={<><b>Non-Strategic</b> HR Functional Modules</>}
      minH={96}
      heads={['Time And Attendance', 'PeopleHub- Mobile App', 'Employee Self-Services Portal', 'Payroll Management']}
      cols={[
        [{ t: 'Real Time Data Capturing', to: 'time-capture' }, { t: 'Create Multiple Shifts Roster Configuration', to: 'time-roster' }, 'Late & Leave Policy'],
        [{ t: 'Mobile Clock In/Out & Geo Tracking', to: 'leave-apply' }, <div key="l" className="w-full"><div className="text-center">Leave Management</div><Bul items={['Leave Application Online', 'Leave Approval', 'OT Approval']} /></div>],
        ['Personal Data & Dashboard', 'Leave Management - Entitlements & Balance Leave', 'View Pay Slip & Attendance Patterns'],
        [<div key="p" className="w-full"><Bul items={['Monthly', 'Periodical Payroll Processing', 'Weekly']} /></div>, { t: 'Staff Loan Management', to: 'pay-advance' }, 'Integration to Government Portal for Reporting', { t: 'GL Integration', to: 'pay-finance' }],
      ]} />
  )
}
function S9() {
  const left: Cell[] = ['Employees Document Management  System', 'News Broadcasting', { t: 'Asset Tracker', to: 'serve-assets' }, 'Integration to ERP System']
  const right: Cell[] = ['Salary Banking Automation', 'Letter Generator', 'Grievance Reporting', { t: 'AI Assistance', to: 'serve-chat' }]
  const col = (items: Cell[], x: number, d: number) => (
    <div className="absolute flex flex-col gap-[24px]" style={{ left: x, top: 424, width: 384 }}>
      {items.map((b, k) => <Box key={k} c={b} d={d + k * 0.25} minH={112} fs={25} />)}
    </div>
  )
  return (
    <Page bg="#fff">
      <motion.h2 {...rise(0)} className="serif absolute left-0 right-0 text-center font-extrabold" style={{ top: 38, fontSize: 70, color: '#0B2559' }}>PeopleHub HRIS System Landscape…<span style={{ fontSize: 56 }}>Cont’d</span></motion.h2>
      <motion.div {...pop(0.4)} className="absolute grid place-items-center text-center font-bold text-white" style={{ left: 432, top: 156, width: 1056, height: 156, fontSize: 46, background: OR, boxShadow: '0 12px 18px -8px rgba(0,0,0,.4)' }}>Complementary HR Functions</motion.div>
      <div className="absolute" style={{ left: 650, top: 318 }}><ArrowDown d={0.9} /></div><div className="absolute" style={{ left: 1262, top: 318 }}><ArrowDown d={1.0} /></div>
      {col(left, 444, 1.2)}{col(right, 1100, 1.3)}
      <motion.div {...rise(2.6, 20)} className="absolute left-0 right-0 text-center" style={{ top: 962, fontSize: 30, color: '#111' }}><b>Non-Strategic</b> HR Functional Modules</motion.div>
    </Page>
  )
}
function S10() {
  return (
    <Landscape gold title="PeopleHub HRIS Solution Landscape" foot={<><b>Strategic</b> HR Functional Modules</>}
      heads={['Performance Management System', 'Recruitment & On-boarding', 'Workforce & Succession Planning', 'Learning & Development']}
      cols={[
        ['Goal & Objective Setting Feedback & 360-Degree Reviews', 'Competency & Skill Assessment', 'Performance Reviews & Appraisals'],
        ['Automated Recruitment Candidate Experience', 'AI Based CV Sorting to AI Based Interview Process', 'Automated Onboarding Journey Onboarding Effectiveness'],
        ['Critical Role Identification', 'Talent Development & Progress Tracking'],
        ['Orientation, Training Needs of Staff & Assessment', 'Role Based Video Training', 'Training Gap Analysis'],
      ]} />
  )
}

/* 11 · Trusted by -------------------------------------------------------------------------------------------- */
const CLIENTS = [cJk, cState, cLtl, cKdaw, cAdvantis, cAvant, cSalaka, cRoccos, cNewworld, cAlan, cCic, cLotus, cEdna, cHci, cHemas, cHnb, cJay, cLyceum, cRoyal, cSampath, cRail, cSlt, cSithara, cSltc]
function S11() {
  return (
    <Page bg="#fff">
      <motion.img {...slideIn(0.1, 60)} src={nw} alt="Newworld IGA" className="absolute" style={{ right: 108, top: 34, height: 56 }} />
      <motion.div {...rise(0)} className="absolute text-[18px] font-extrabold tracking-[0.3em]" style={{ left: 86, top: 52, color: '#E8912D' }}>TRUSTED BY</motion.div>
      <motion.h2 {...rise(0.1)} className="absolute font-extrabold" style={{ left: 86, top: 92, fontSize: 56, color: NAVY }}>600+ organisations rely on PeopleHub</motion.h2>
      <motion.div {...slideIn(0.3, -100)} className="absolute rounded-2xl" style={{ left: 86, top: 236, width: 519, height: 690, background: '#0B2A6B', padding: '44px 40px', boxShadow: '0 18px 40px -18px rgba(11,42,107,.6)' }}>
        <div className="font-extrabold" style={{ fontSize: 112, color: '#F5B829', lineHeight: 1 }}><AnimNum to={600} suffix="+" /></div>
        <div style={{ fontSize: 26, color: '#fff', marginTop: 10 }}>clients across every industry</div>
        <div className="font-extrabold" style={{ fontSize: 112, color: '#F5B829', lineHeight: 1, marginTop: 44 }}><AnimNum to={12} suffix="+" delay={0.8} /></div>
        <div style={{ fontSize: 26, color: '#fff', marginTop: 10, lineHeight: 1.4 }}>years of building HR software people trust</div>
        <motion.div {...rise(1.4, 24)} className="font-extrabold" style={{ fontSize: 66, color: '#F5B829', lineHeight: 1, marginTop: 44 }}>Government</motion.div>
        <motion.div {...rise(1.6, 24)} style={{ fontSize: 24, color: '#fff', marginTop: 10, lineHeight: 1.4 }}>Public sector experience with many departments including iconic Lotus Tower as a client</motion.div>
      </motion.div>
      <div className="absolute grid grid-cols-6 gap-[14px]" style={{ left: 636, top: 236, width: 1198, gridAutoRows: '158px' }}>
        {CLIENTS.map((c, k) => (
          <motion.div key={k} initial={{ opacity: 0, rotateY: 90, scale: 0.8 }} animate={{ opacity: 1, rotateY: 0, scale: 1 }} transition={{ delay: 0.5 + k * 0.06, duration: 0.55, ease: 'easeOut' }}
            className="grid place-items-center rounded-xl bg-white overflow-hidden min-h-0" style={{ height: 158, border: '1px solid #E2E8F0', boxShadow: '0 6px 16px -10px rgba(15,42,82,.4)', padding: 10 }}>
            <img src={c} alt="" className="object-contain" style={{ maxHeight: 130, maxWidth: '100%' }} />
          </motion.div>
        ))}
      </div>
      <div className="absolute flex items-center justify-between" style={{ left: 86, right: 86, top: 996 }} />
      <motion.img {...rise(1.8, 10)} src={victory} alt="Victory Information" className="absolute" style={{ right: 96, bottom: 52, height: 76 }} />
      <div className="absolute" style={{ left: 86, bottom: 84, fontSize: 18, color: '#64748B' }}>PeopleHub HRIS | Product demonstration</div>
    </Page>
  )
}

/* 12 · Delivery approach -------------------------------------------------------------------------------------- */
function S12() {
  const steps: [string, string, string][] = [['1', 'Discover', 'Confirm requirements, process mapping'], ['2', 'Configure', 'Set up, data migration, integrations'], ['3', 'Test & train', 'UAT, user and admin training'], ['4', 'Go live', 'Cut-over, hypercare'], ['5', 'Support', 'Local helpdesk, upgrades, SLAs']]
  return (
    <Light title="How we will deliver and support FRCA">
      {steps.map(([n, t, d], k) => (
        <div key={n} className="absolute text-center" style={{ left: 252 + k * 350 - 170, width: 340, top: 290 }}>
          <motion.div {...pop(0.5 + k * 0.3)} className="mx-auto grid place-items-center text-white font-extrabold rounded-full" style={{ width: 116, height: 116, fontSize: 44, background: k === 4 ? ORANGE : TEAL, boxShadow: `0 0 0 0 ${k === 4 ? ORANGE : TEAL}` }}>{n}</motion.div>
          <motion.div {...rise(0.8 + k * 0.3, 30)}><div className="font-bold" style={{ fontSize: 36, color: NAVY, marginTop: 34 }}>{t}</div><div style={{ fontSize: 26, color: GRAY, marginTop: 14, lineHeight: 1.4 }}>{d}</div></motion.div>
        </div>
      ))}
      <motion.div {...rise(2.6, 30)} className="absolute" style={{ left: 96, top: 850, fontSize: 29, color: NAVY }}>Governance: dedicated project manager, joint steering committee, regular reporting to FRCA.</motion.div>
    </Light>
  )
}

/* 13 · Next steps --------------------------------------------------------------------------------------------- */
function S13() {
  const steps: [string, string][] = [['01. Discovery', 'Workforce mapping & policy rules'], ['02. Tailored Demo', 'FRCS-specific modules & workflows'], ['03. Scope & SOW', 'Milestone agreement & SLAs'], ['04. Phased Pilot', 'Rapid UAT to full organization']]
  const contact: [keyof typeof ICONS | 'mail', string][] = [['mail', 'isuru.dahanayake@newworld.com.fj'], ['clock', '+679 999 2289'], ['pin', 'Newworld Pte Ltd, Kings Road, Ba, Fiji']]
  return (
    <Page bg="#0B1017">
      <motion.img {...pop(0.1)} src={nwWide} alt="Newworld IGA" className="absolute rounded-2xl bg-white" style={{ left: 688, top: 160, width: 544, padding: '20px 32px' }} />
      <motion.div {...rise(0.4)} className="absolute left-0 right-0 text-center text-[21px] font-extrabold tracking-[0.12em]" style={{ top: 322, color: GREEN }}>NEXT STEPS • FRCS HRIS MODERNIZATION</motion.div>
      <motion.h2 {...rise(0.55, 50)} className="absolute left-0 right-0 text-center font-extrabold text-white" style={{ top: 372, fontSize: 82, lineHeight: 1.18, padding: '0 220px' }}>Ready to Power FRCS's Workforce Transformation</motion.h2>
      <motion.p {...rise(0.9)} className="absolute left-0 right-0 text-center" style={{ top: 620, fontSize: 26, lineHeight: 1.6, color: '#9AA7B8', padding: '0 330px' }}>Local accountability from Newworld Technologies, backed by PeopleHub’s proven HR engineering and 24/7 SLA-governed support.</motion.p>
      <div className="absolute grid grid-cols-4 gap-5" style={{ left: 240, right: 240, top: 740 }}>
        {steps.map(([t, d], k) => (
          <motion.div key={t} {...rise(1.2 + k * 0.2, 44)} className="rounded-xl text-center" style={{ background: '#131A24', border: '1px solid #1E2A3A', padding: '24px 14px' }}>
            <div className="font-extrabold" style={{ fontSize: 28, color: GREEN }}>{t}</div><div style={{ fontSize: 19, color: '#9AA7B8', marginTop: 8 }}>{d}</div>
          </motion.div>
        ))}
      </div>
      <motion.div {...rise(2.2, 20)} className="absolute left-0 right-0 flex items-center justify-center gap-14" style={{ top: 930, fontSize: 21, color: '#9AA7B8' }}>
        {contact.map(([ic, t]) => <span key={t} className="flex items-center gap-3"><span style={{ color: GREEN }}>{ic === 'mail' ? '✉' : ic === 'clock' ? '☎' : '⚲'}</span>{t}</span>)}
      </motion.div>
    </Page>
  )
}

const mk = (id: string, title: string, secs: number, render: () => ReactNode, notes = ''): SlideDef => ({ id, section: 'Newworld pitch', title, secs, tier: 3, notes, render })

const SIDE = ['time-capture', 'time-roster', 'leave-apply', 'pay-advance', 'pay-finance', 'serve-assets', 'serve-chat']

export function buildNwFrcaSlides(): SlideDef[] {
  const ws = buildWorkshopSlides()
  const pick = (id: string) => ws.find(x => x.id === id)!
  const main: SlideDef[] = [
    mk('nw-welcome', 'Welcome to PeopleHub', 60, () => <S1 />, 'Welcome and introduction (2 min).'),
    mk('nw-blueprint', 'Modern Human Capital Management for FRCS', 60, () => <S2 />),
    mk('nw-agenda', 'What we will cover in 30 minutes', 60, () => <S3 />, 'Agenda: 2 / 7 / 12 / 5 / 4 minutes, then 15 minutes of questions.'),
    pick('ws-roles'),
    mk('nw-household', 'Newworld: a household name', 90, () => <S4 />),
    mk('nw-team', 'A skilled team, backed by global partnerships', 90, () => <S5 />),
    mk('nw-local-partner', 'Your Local Technology Partner in Fiji', 90, () => <S6 />),
    mk('nw-journey', 'The employee journey', 90, () => <S7 />),
    mk('nw-landscape-1', 'PeopleHub HRIS System Landscape', 120, () => <S8 />),
    mk('nw-landscape-2', 'System Landscape (cont’d)', 90, () => <S9 />),
    mk('nw-landscape-3', 'PeopleHub HRIS Solution Landscape', 120, () => <S10 />),
    mk('nw-trusted', 'Trusted by 600+ organisations', 120, () => <S11 />),
    mk('nw-delivery', 'How we will deliver and support', 90, () => <S12 />),
    mk('nw-next', 'Next steps', 60, () => <S13 />),
  ]
  // system screens reached from the landscape boxes: opened by link, then Back (not part of the running order)
  return [...main, ...SIDE.map(id => ({ ...pick(id), sideTrip: true }))]
}
