import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import type { SlideDef } from '../../engine/context'
import { useNav } from '../../engine/context'
import { buildWorkshopSlides } from '../workshop'
import login from '../../assets/nwfrca/login.png'
import frcsLogo from '../../assets/nwfrca/frcs.png'
import nw from '../../assets/nwfrca/newworld-logo.png'
import orbit from '../../assets/nwfrca/orbit-network.png'
import microsoft from '../../assets/nwfrca/microsoft.png'
import thakral from '../../assets/nwfrca/thakral.png'
import ninja from '../../assets/nwfrca/ninja.png'
import victory from '../../assets/nwfrca/victory.png'
import huawei from '../../assets/nwfrca/huawei.png'
import cLtl from '../../assets/nwfrca/c-ltl.png'
import cKdaw from '../../assets/nwfrca/c-kdaw.png'
import cAdvantis from '../../assets/nwfrca/c-advantis.png'
import cAvant from '../../assets/nwfrca/c-avant-garde.png'
import cSalaka from '../../assets/nwfrca/c-salaka.png'
import cRoccos from '../../assets/nwfrca/c-roccos.png'
import cAlan from '../../assets/nwfrca/c-alankulama.png'
import cCic from '../../assets/nwfrca/c-cic.jpeg'
import cLotus from '../../assets/nwfrca/c-lotus.jpeg'
import cJk from '../../assets/clients/john-keells-properties-1.webp'
import cState from '../../assets/clients/state-fertilizer.png'
import cEdna from '../../assets/clients/edna.png'
import cHci from '../../assets/clients/hci.jpg'
import cHemas from '../../assets/clients/hemas.png'
import cHnb from '../../assets/clients/hnb-assurance.jpg'
import cHnbGen from '../../assets/clients/hnb-general-insurance.jpg'
import cJay from '../../assets/clients/jayarathna.jpeg'
import cLyceum from '../../assets/clients/lyceum.png'
import cRoyal from '../../assets/clients/royal-institute-of-colombo-pvt-ltd.jpg'
import cSampath from '../../assets/clients/sampath-centre.jpeg'
import cSc from '../../assets/clients/sc-securities.jpeg'
import cRail from '../../assets/clients/sri-lanka-railway.webp'
import cSlt from '../../assets/clients/sri-lanka-telecom-services-ltd.webp'
import cSithara from '../../assets/clients/sithara.jpeg'
import cSltc from '../../assets/clients/sri-lanka-technological-campus-sltc.webp'
import cLand from '../../assets/clients/land-reform-commission.png'
import cAitken from '../../assets/clients/aitken-spence-travels-pvt-ltd.jpeg'
import cDeLaRue from '../../assets/clients/de-la-rue-lanka-currency-and-security-print-private-limited.jpg'

/* The Newworld HRIS presentation for FRCS (v4.0), rebuilt slide for slide with animation, then revised from the review notes. */

/** Scheduled meeting shown on the sign-in screen. Leave `text` empty to show the live date and clock instead. */
const MEETING = { date: 'Thursday, November 5, 2026', time: '10:00 AM' }

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

/** Newworld logo (transparent PNG) — the same height on every slide that carries it. */
const NwLogo = ({ h = 58, style }: { h?: number; style?: CSSProperties }) => <img src={nw} alt="Newworld IGA" style={{ height: h, width: 'auto', ...style }} />

/** Light content slide frame: navy title, teal bar, Newworld logo top right. */
function Light({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Page bg={LIGHT}>
      <motion.div {...slideIn(0.1, 60)} className="absolute" style={{ right: 108, top: 36 }}><NwLogo h={58} /></motion.div>
      <motion.h2 {...rise(0)} className="absolute font-extrabold" style={{ left: 96, top: 92, fontSize: 60, color: NAVY, lineHeight: 1.1 }}>{title}</motion.h2>
      <motion.div initial={{ width: 0 }} animate={{ width: 168 }} transition={{ delay: 0.3, duration: 0.6 }} className="absolute rounded-full" style={{ left: 96, top: 196, height: 9, background: TEAL }} />
      {children}
    </Page>
  )
}

/* Small line icons ------------------------------------------------------------------------------------------- */
const Ico = ({ d, c = NAVY, size = 40 }: { d: ReactNode; c?: string; size?: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
const ICONS = {
  shield: <><path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z" /><path d="M9 12l2 2 4-4" /></>,
  headset: <><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="3" y="14" width="4" height="6" rx="1.5" /><rect x="17" y="14" width="4" height="6" rx="1.5" /><path d="M19 20c0 1-2 2-5 2" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  monitor: <><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 21h8M12 16v5" /></>,
  pin: <><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /><circle cx="17.5" cy="9" r="2.5" /><path d="M17 14c2.7 0 4.5 1.8 4.5 4.5" /></>,
  chart: <><path d="M4 20V10M10 20V4M16 20v-8M22 20H2" /></>,
  cart: <><circle cx="9" cy="20" r="1.6" /><circle cx="18" cy="20" r="1.6" /><path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.5L21 8H6" /></>,
  server: <><rect x="3" y="4" width="18" height="6" rx="1.5" /><rect x="3" y="14" width="18" height="6" rx="1.5" /><path d="M7 7h.01M7 17h.01" /></>,
  userPlus: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M19 8v6M16 11h6" /></>,
  clipboard: <><rect x="6" y="4" width="12" height="17" rx="2" /><path d="M9 4h6v3H9zM9 12h6M9 16h4" /></>,
  book: <><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 19V5" /></>,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.2" /></>,
  wallet: <><rect x="3" y="6" width="18" height="14" rx="2.5" /><path d="M3 10h18M16 15h2" /></>,
  phone: <><rect x="7" y="2" width="10" height="20" rx="2.5" /><path d="M11 18h2" /></>,
  fileCheck: <><path d="M6 2h8l5 5v15H6z" /><path d="M14 2v5h5M9 14l2 2 4-4" /></>,
}

/* 1 · Welcome / sign-in screen ------------------------------------------------------------------------------- */
function MeetingBadge() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => { if (MEETING.date || MEETING.time) return; const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t) }, [])
  const date = MEETING.date || now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  const time = MEETING.time || now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
  const ic = '#1E96E8'
  return (
    <div className="absolute flex items-center justify-between" style={{ left: '6.9%', top: '83.6%', width: '42%', height: '12.2%', padding: '0 2.6%', borderRadius: 14, whiteSpace: 'nowrap', background: 'linear-gradient(180deg,#FAFCFF,#F1F6FE)', boxShadow: '0 10px 22px -12px rgba(30,60,120,.45)' }}>
      <span className="flex items-center gap-3" style={{ fontSize: 19, fontWeight: 700, color: '#334155' }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={ic} strokeWidth="2" strokeLinecap="round"><rect x="3" y="5" width="18" height="16" rx="2.5" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>{date}
      </span>
      <span className="flex items-center gap-3" style={{ fontSize: 21, fontWeight: 800, color: ic, fontFamily: 'ui-monospace, Consolas, monospace' }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={ic} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>{time}
      </span>
    </div>
  )
}

function S1() {
  return (
    <Page bg="#fff">
      <motion.div initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, ease: 'easeOut' }} className="absolute left-0 right-0 top-0 overflow-hidden" style={{ height: 900 }}>
        <img src={login} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'blur(24px)', transform: 'scale(1.15)' }} />
        <motion.div className="absolute top-0" style={{ left: '50%', translateX: '-50%', height: '100%', aspectRatio: '1325 / 681' }} animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}>
          <img src={login} alt="PeopleHub sign-in" className="w-full h-full" />
          <MeetingBadge />
        </motion.div>
      </motion.div>
      <div className="absolute left-0 right-0 flex items-center justify-between" style={{ top: 900, height: 108, padding: '0 150px', background: '#fff' }}>
        <motion.img {...slideIn(0.8, -120)} src={frcsLogo} alt="Fiji Revenue and Customs Service" style={{ height: 76, width: 'auto' }} />
        <motion.div {...slideIn(1.0, 120)}><NwLogo h={64} /></motion.div>
      </div>
    </Page>
  )
}

/* 2 · Blueprint title ----------------------------------------------------------------------------------------- */
function S2() {
  const stats: [ReactNode, string, boolean?][] = [[<AnimNum to={1933} plain />, 'Fiji Heritage & Enterprise Scale'], [<AnimNum to={1300} suffix="+" />, 'Employees on PeopleHub in Fiji'], ['24/7 SLA', 'Dedicated Local Fiji Helpdesk', true], [<><AnimNum to={32} /> Modules</>, 'Complete Hire-to-Retire Platform']]
  return (
    <Page bg="#0B1017">
      <motion.div {...slideIn(0.1)} className="absolute flex items-center gap-7" style={{ left: 100, top: 60 }}>
        <div className="rounded-2xl bg-white" style={{ padding: '14px 28px' }}><NwLogo h={52} /></div>
        <div className="w-px" style={{ height: 56, background: '#2B3646' }} />
        <div className="text-[26px] font-bold tracking-[0.2em]" style={{ color: '#9AA7B8' }}>TECHNOLOGIES</div>
      </motion.div>
      <motion.div {...rise(0.3)} className="absolute text-[22px] font-extrabold tracking-[0.18em]" style={{ left: 100, top: 328, color: GREEN }}>ENTERPRISE HRIS TRANSFORMATION BLUEPRINT</motion.div>
      <div className="absolute" style={{ left: 100, top: 392, width: 1300 }}>
        {['Modern Human Capital', 'Management for FRCS'].map((l, i) => <motion.div key={l} {...rise(0.5 + i * 0.2, 50)} className="font-extrabold text-white" style={{ fontSize: 100, lineHeight: 1.08 }}>{l}</motion.div>)}
      </div>
      <motion.p {...rise(1.0)} className="absolute" style={{ left: 100, top: 640, width: 1250, fontSize: 28, lineHeight: 1.55, color: '#9AA7B8' }}>
        Empowering FRCS with a future-ready workforce platform — powered by PeopleHub and backed by Newworld’s proven on-shore delivery capability.
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
    <Light title="What We Will Cover in 30 Minutes">
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
  const cards: [keyof typeof ICONS, string, string][] = [['server', 'Microsoft Dynamics ERP', 'Finance, supply chain and operations'], ['cart', 'eCommerce Solution', 'Online retail on the same backbone'], ['users', 'HRIS', 'Managing our own large, multi-site workforce'], ['shield', 'Infrastructure Solutions', 'Cyber Security, Network & Wireless Solutions, Endpoint & Patch Management Solutions']]
  return (
    <Light title="Newworld: A Household Name, Powered by Technology">
      <div className="absolute" style={{ left: 96, top: 330, width: 700 }}>
        {['Known for retail.', 'Built on technology.'].map((l, i) => <motion.div key={l} {...rise(0.5 + i * 0.25, 40)} className="font-extrabold" style={{ fontSize: 68, color: NAVY, lineHeight: 1.16 }}>{l}</motion.div>)}
        <motion.p {...rise(1.1)} style={{ fontSize: 29, lineHeight: 1.6, color: GRAY, marginTop: 54 }}>The largest supermarket in Fiji, with 19 outlets across the country, runs its entire operation on modern, integrated systems.</motion.p>
      </div>
      {cards.map(([ic, t, d], k) => (
        <motion.div key={t} {...slideIn(0.6 + k * 0.25, 120)} className="absolute rounded-xl bg-white flex items-center gap-7" style={{ left: 864, width: 960, top: 250 + k * 186, height: 170, borderLeft: `12px solid ${TEAL}`, boxShadow: '0 6px 24px -10px rgba(15,42,82,.35)', padding: '0 36px' }}>
          <div className="grid place-items-center rounded-2xl flex-none" style={{ width: 72, height: 72, background: 'rgba(20,167,157,.12)' }}><Ico d={ICONS[ic]} c={TEAL} size={38} /></div>
          <div><div className="font-bold" style={{ fontSize: 35, color: NAVY }}>{t}</div><div style={{ fontSize: 25, color: GRAY, marginTop: 10, lineHeight: 1.35 }}>{d}</div></div>
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
  const logos: [string, number][] = [[microsoft, 112], [thakral, 72], [victory, 112], [ninja, 58], [huawei, 112]]
  return (
    <Light title="A Skilled Team, Backed by Global Partnerships">
      {big(<AnimNum to={1933} plain />, <><b>Fiji Heritage</b> & Enterprise Scale</>, 0.5, 262)}
      {big(<AnimNum to={1300} suffix="+" delay={0.7} />, <>Employees on <b>PeopleHub</b> in Fiji</>, 0.8, 506)}
      {big(<AnimNum to={20} suffix="+" delay={1.0} />, <>Highly skilled in-house <b>technical professionals</b>, recruited and trained by Newworld</>, 1.1, 750)}
      <motion.div {...slideIn(0.7, 120)} className="absolute rounded-xl bg-white" style={{ left: 708, width: 1116, top: 262, height: 330, borderLeft: `12px solid ${TEAL}`, boxShadow: '0 6px 24px -10px rgba(15,42,82,.35)', padding: '26px 40px' }}>
        <div className="font-bold" style={{ fontSize: 33, color: NAVY }}>Strategic Global Partnerships</div>
        <div className="flex items-center justify-between" style={{ height: 150, marginTop: 6 }}>
          {logos.map(([src, h], k) => <motion.img key={k} {...pop(1.1 + k * 0.18)} src={src} alt="" style={{ height: h, maxWidth: 240, objectFit: 'contain' }} />)}
        </div>
        <div style={{ fontSize: 25, color: GRAY }}>Collaboration to skill up local teams and access best-practice delivery.</div>
      </motion.div>
      <motion.div {...slideIn(1.0, 120)} className="absolute rounded-xl bg-white" style={{ left: 708, width: 1116, top: 630, height: 290, borderLeft: `12px solid ${ORANGE}`, boxShadow: '0 6px 24px -10px rgba(15,42,82,.35)', padding: '30px 40px' }}>
        <div className="font-bold" style={{ fontSize: 33, color: NAVY }}>Serving Beyond Our Own Walls</div>
        <div style={{ fontSize: 29, color: NAVY, marginTop: 22, lineHeight: 1.5, fontWeight: 600 }}>Helping organisations across Fiji innovate, transform, and grow with confidence.</div>
      </motion.div>
    </Light>
  )
}

/* 6 · Local technology partner ------------------------------------------------------------------------------ */
function S6() {
  const rows: [string, string][] = [['Internal Production Proof', '1,300+ Staff Active'], ['Fiji Regulatory Alignment', 'FNPF • PAYE/PDR • ERA 2007 • SRT • ECAL'], ['National ICT Footprint', '20 Technical Specialists']]
  const minis: [keyof typeof ICONS, string, string, string][] = [['clock', '24×7 Coverage', 'Agreement-based SLA response', '#16A34A'], ['monitor', 'Dedicated Helpdesk', 'Direct phone, portal & email', '#2563EB'], ['pin', 'On-Site Presence', 'Rapid Fiji-wide intervention', '#EA7A12'], ['users', 'Local Governance', 'Single point of accountability', '#7C3AED']]
  const card: CSSProperties = { background: '#fff', borderRadius: 20, boxShadow: '0 10px 34px -14px rgba(15,42,82,.35)', border: '1px solid #E5EAF1' }
  return (
    <Page bg="#F8FAFC">
      <motion.div {...slideIn(0.1, 60)} className="absolute" style={{ right: 108, top: 36 }}><NwLogo h={58} /></motion.div>
      <motion.div {...rise(0)} className="absolute text-[20px] font-extrabold tracking-[0.12em]" style={{ left: 96, top: 70, color: '#0B8F4F' }}>PROVEN FIJI ENTERPRISE & TECHNOLOGY LEADERSHIP</motion.div>
      <motion.h2 {...rise(0.1)} className="absolute font-extrabold" style={{ left: 96, top: 114, fontSize: 56, color: '#0F172A' }}>Your Local Technology Partner in Fiji</motion.h2>
      <motion.div {...slideIn(0.4, -110)} className="absolute" style={{ ...card, left: 96, top: 270, width: 840, height: 640, padding: '34px 40px' }}>
        <div className="flex items-center gap-5"><div className="rounded-xl grid place-items-center" style={{ width: 64, height: 64, background: '#E8F7EF' }}><Ico d={ICONS.shield} c="#0B8F4F" size={38} /></div><div className="font-extrabold" style={{ fontSize: 36, color: '#0F172A' }}>Enterprise Strength & Scale</div></div>
        <p style={{ fontSize: 25, lineHeight: 1.55, color: '#334155', marginTop: 22 }}>Serving Fiji since 1933 with 19 supermarkets and 3 wholesale operations nationwide. Newworld runs mission-critical retail ERP, cloud infrastructure, business intelligence, and cyber operations.</p>
        <div className="flex flex-col gap-3" style={{ marginTop: 26 }}>
          {rows.map(([l, v], k) => (
            <motion.div key={l} {...rise(1.0 + k * 0.2, 24)} className="flex items-center justify-between gap-6 rounded-xl px-6 py-4" style={{ background: '#F1F5F9' }}>
              <span className="flex-none" style={{ fontSize: 22, color: '#334155', fontWeight: 600 }}>{l}</span><span className="font-extrabold text-right" style={{ fontSize: 22, color: '#0B8F4F', lineHeight: 1.3 }}>{v}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <motion.div {...slideIn(0.6, 110)} className="absolute" style={{ ...card, left: 984, top: 270, width: 840, height: 640, padding: '34px 40px' }}>
        <div className="flex items-center gap-5"><div className="rounded-xl grid place-items-center" style={{ width: 64, height: 64, background: '#E7F0FE' }}><Ico d={ICONS.headset} c="#2563EB" size={38} /></div><div className="font-extrabold" style={{ fontSize: 36, color: '#0F172A' }}>Dedicated Local Support Levels</div></div>
        <p style={{ fontSize: 25, lineHeight: 1.55, color: '#334155', marginTop: 22 }}>Direct, on-the-ground accountability for FRCS. Our Suva and Ba IT service centres provide immediate on-site response and formal SLA-backed coverage.</p>
        <div className="grid grid-cols-2 gap-4" style={{ marginTop: 24 }}>
          {minis.map(([ic, t, d, c], k) => (
            <motion.div key={t} {...pop(1.1 + k * 0.18)} className="rounded-xl p-4" style={{ border: '1px solid #E5EAF1', background: '#fff' }}>
              <Ico d={ICONS[ic]} c={c} size={28} /><div className="font-extrabold" style={{ fontSize: 22, color: '#0F172A', marginTop: 4 }}>{t}</div><div style={{ fontSize: 19, color: '#64748B', lineHeight: 1.3 }}>{d}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Page>
  )
}

/* 7 · Employee journey --------------------------------------------------------------------------------------- */
function S7() {
  const steps: [string, string, keyof typeof ICONS][] = [['Recruit', 'Recruitment', 'userPlus'], ['Onboard', 'Onboarding & Records', 'clipboard'], ['Develop', 'Training & Skills', 'book'], ['Perform', 'Appraisals', 'target'], ['Reward', 'Payroll & Benefits', 'wallet'], ['Engage', 'Self-Service & Leave', 'phone'], ['Full & Final', 'Offboarding', 'fileCheck']]
  const W = 262, step = 224, x0 = 78
  return (
    <Light title="The Employee Journey and Where Our HRIS Fits">
      {steps.map(([a, b, ic], k) => (
        <div key={a}>
          <motion.div {...slideIn(0.5 + k * 0.2, -120)} className="absolute grid place-items-center text-white font-bold text-center" style={{ left: x0 + k * step, top: 290, width: W, height: 170, fontSize: a.length > 9 ? 25 : 30, paddingLeft: 24, background: k % 2 ? TEAL : NAVY, clipPath: 'polygon(0 0, 82% 0, 100% 50%, 82% 100%, 0 100%, 16% 50%)', filter: 'drop-shadow(0 8px 10px rgba(0,0,0,.25))' }}>{a}</motion.div>
          <motion.div {...rise(0.9 + k * 0.2, 50)} className="absolute flex flex-col items-center justify-center gap-3 text-center bg-white" style={{ left: x0 + 14 + k * step, top: 535, width: 210, height: 176, fontSize: 25, color: NAVY, boxShadow: '0 8px 22px -10px rgba(15,42,82,.45)', padding: '0 14px' }}>
            <Ico d={ICONS[ic]} c={k % 2 ? TEAL : NAVY} size={34} />{b}
          </motion.div>
        </div>
      ))}
      <motion.div {...rise(2.5, 40)} className="absolute text-center" style={{ left: 96, width: 1728, top: 810, height: 190, border: `3px solid ${TEAL}`, background: 'rgba(20,167,157,.08)', display: 'grid', placeItems: 'center', padding: '0 60px' }}>
        <div><div className="font-bold" style={{ fontSize: 40, color: NAVY, lineHeight: 1.3 }}>One Platform for Your Entire Workforce Journey</div><div style={{ fontSize: 28, color: NAVY, marginTop: 12, lineHeight: 1.4 }}>Streamlining HR operations while empowering employees and managers with real-time insights.</div></div>
      </motion.div>
    </Light>
  )
}

/* 8–10 · System landscape diagrams ------------------------------------------------------------------------ */
const GAP = 96, COLW = 374, X0 = (1920 - (4 * COLW + 3 * GAP)) / 2
const colX = (i: number) => X0 + i * (COLW + GAP)

const ArrowDown = ({ d }: { d: number }) => (
  <motion.svg {...rise(d, -10)} width="44" height="64" viewBox="0 0 44 70" className="mx-auto block"><path d="M16 0h12v40h14L22 68 2 40h14z" fill={OR} /></motion.svg>
)
const Conn = ({ d }: { d: number }) => (
  <motion.svg {...pop(d)} width="64" height="40" viewBox="0 0 64 40"><path d="M2 20l16-14v9h28V6l16 14-16 14v-9H18v9z" fill="#F4B183" stroke={OR} strokeWidth="2" /></motion.svg>
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

const Lines = ({ items }: { items: string[] }) => <div>{items.map(i => <div key={i}>{i}</div>)}</div>
const Bul = ({ items, head }: { items: string[]; head?: string }) => (
  <div className="w-full">{head && <div className="text-center">{head}</div>}<ul className="text-left list-disc" style={{ paddingLeft: 36, width: 'fit-content', margin: '0 auto' }}>{items.map(i => <li key={i}>{i}</li>)}</ul></div>
)

function Landscape({ title, heads, cols, foot, gold, minH = 104, headH = 124, top = 188 }: { title: ReactNode; heads: string[]; cols: Cell[][]; foot: ReactNode; gold?: boolean; minH?: number; headH?: number; top?: number }) {
  return (
    <Page bg="#fff">
      <motion.h2 {...rise(0)} className="serif absolute left-0 right-0 text-center font-extrabold" style={{ top: 38, fontSize: 68, color: '#0B2559' }}>{title}</motion.h2>
      {heads.map((h, i) => (
        <div key={h} className="absolute" style={{ left: colX(i), top, width: COLW }}>
          <motion.div {...pop(0.4 + i * 0.25)} className="grid place-items-center text-center font-bold text-white" style={{ height: headH, fontSize: 31, background: OR, lineHeight: 1.25, padding: '0 20px', boxShadow: '0 12px 18px -8px rgba(0,0,0,.4)' }}>{h}</motion.div>
          {i < heads.length - 1 && <div className="absolute" style={{ left: COLW + (GAP - 64) / 2, top: headH / 2 - 20 }}><Conn d={0.7 + i * 0.25} /></div>}
          <div style={{ marginTop: 8 }}><ArrowDown d={0.8 + i * 0.25} /></div>
          <div className="flex flex-col gap-[14px]" style={{ marginTop: 4 }}>
            {cols[i].map((b, k) => <Box key={k} c={b} d={1.1 + i * 0.25 + k * 0.2} gold={gold} minH={minH} />)}
          </div>
        </div>
      ))}
      <motion.div {...rise(2.4, 20)} className="absolute left-0 right-0 text-center" style={{ top: 960, fontSize: 30, color: '#111' }}>{foot}</motion.div>
    </Page>
  )
}

function S8() {
  return (
    <Landscape title="PeopleHub HRIS System Landscape" foot={<><b>Non-Strategic</b> HR Functional Modules</>} minH={84}
      heads={['Time and Attendance', 'PeopleHub Mobile App', 'Employee Self-Service Portal', 'Payroll Management']}
      cols={[
        [{ t: 'Real-Time Data Capturing', to: 'time-capture' }, { t: 'Create Multiple Shifts Roster Configuration', to: 'time-roster' }, 'Late & Leave Policy'],
        [{ t: 'Mobile Clock In/Out & Geo Tracking', to: 'leave-apply' }, <Bul key="l" head="Leave Management" items={['Leave Application Online', 'Leave Approval', 'OT Approval']} />],
        ['Personal Data & Dashboard', 'Leave Management – Entitlements & Leave Balance', 'View Payslip & Attendance Patterns'],
        [<Bul key="p" head="Periodic Payroll Processing" items={['Monthly', 'Weekly']} />, { t: 'Staff Loan Management', to: 'pay-advance' }, 'Integration to Government Portal for Reporting', { t: 'GL Integration', to: 'pay-finance' }, 'Third-Party Integrations'],
      ]} />
  )
}
function S9() {
  const left: Cell[] = ['Employee Document Management System', 'News Broadcasting', { t: 'Asset Tracker', to: 'serve-assets' }, 'Integration to ERP System']
  const right: Cell[] = ['Salary Banking Automation', 'Letter Generator', 'Grievance Reporting', { t: 'AI Assistance', to: 'serve-chat' }]
  const col = (items: Cell[], x: number, d: number) => (
    <div className="absolute flex flex-col gap-[22px]" style={{ left: x, top: 424, width: 384 }}>
      {items.map((b, k) => <Box key={k} c={b} d={d + k * 0.25} minH={104} fs={25} />)}
    </div>
  )
  const cxL = 960 - 330, cxR = 960 + 330   // the two arrows and the two columns share these centres
  return (
    <Page bg="#fff">
      <motion.h2 {...rise(0)} className="serif absolute left-0 right-0 text-center font-extrabold" style={{ top: 38, fontSize: 68, color: '#0B2559' }}>PeopleHub HRIS System Landscape…<span style={{ fontSize: 54 }}>Cont’d</span></motion.h2>
      <motion.div {...pop(0.4)} className="absolute grid place-items-center text-center font-bold text-white" style={{ left: 432, top: 156, width: 1056, height: 156, fontSize: 46, background: OR, boxShadow: '0 12px 18px -8px rgba(0,0,0,.4)' }}>Complementary HR Functions</motion.div>
      <div className="absolute" style={{ left: cxL - 22, top: 318 }}><ArrowDown d={0.9} /></div><div className="absolute" style={{ left: cxR - 22, top: 318 }}><ArrowDown d={1.0} /></div>
      {col(left, cxL - 192, 1.2)}{col(right, cxR - 192, 1.3)}
      <motion.div {...rise(2.6, 20)} className="absolute left-0 right-0 text-center" style={{ top: 962, fontSize: 30, color: '#111' }}><b>Non-Strategic</b> HR Functional Modules</motion.div>
    </Page>
  )
}
function S10() {
  return (
    <Landscape gold title="PeopleHub HRIS Solution Landscape" foot={<><b>Strategic</b> HR Functional Modules</>} minH={118} headH={140} top={190}
      heads={['Performance Management System', 'Recruitment & Onboarding', 'Workforce & Succession Planning', 'Learning & Development']}
      cols={[
        [<Lines key="a" items={['Goal & Objective Setting', 'Feedback & 360-Degree Reviews']} />, 'Competency & Skill Assessment', 'Performance Reviews & Appraisals'],
        [<Lines key="b" items={['Automated Recruitment', 'Candidate Experience']} />, 'AI-Based CV Sorting to AI-Based Interview Process', <Lines key="c" items={['Automated Onboarding Journey', 'Onboarding Effectiveness']} />],
        ['Critical Role Identification', 'Talent Development & Progress Tracking'],
        ['Orientation, Training Needs of Staff & Assessment', 'Role-Based Video Training', 'Training Gap Analysis'],
      ]} />
  )
}

/* 11 · Trusted by -------------------------------------------------------------------------------------------- */
const LOCAL = [cLand, cState, cRail, cLotus, cHnb, cHnbGen, cSc, cJk, cHemas, cSlt, cCic, cAitken, cDeLaRue, cLtl, cKdaw, cAvant, cSalaka, cRoccos, cAlan, cEdna, cHci, cJay, cLyceum, cRoyal, cSampath, cSithara, cSltc]
function Tile({ src, dark, d }: { src?: string; dark?: boolean; d: number }) {
  return (
    <motion.div initial={{ opacity: 0, rotateY: 90, scale: 0.8 }} animate={{ opacity: 1, rotateY: 0, scale: 1 }} transition={{ delay: d, duration: 0.5, ease: 'easeOut' }}
      className="grid place-items-center rounded-xl overflow-hidden min-h-0" style={{ height: 100, border: src ? '1px solid #E2E8F0' : '2px dashed #9FB0C7', background: dark ? '#0F2A52' : '#fff', boxShadow: src ? '0 6px 16px -10px rgba(15,42,82,.4)' : 'none', padding: 8 }}>
      {src ? <img src={src} alt="" className="object-contain" style={{ maxHeight: 84, maxWidth: '100%' }} /> : <span className="text-center" style={{ fontSize: 15, fontWeight: 600, color: '#7C8AA0', lineHeight: 1.2 }}>Logo to<br />be added</span>}
    </motion.div>
  )
}
const GroupLabel = ({ children, d }: { children: ReactNode; d: number }) => (
  <motion.div {...rise(d, 14)} className="flex items-center gap-4" style={{ marginBottom: 10 }}>
    <span className="font-extrabold" style={{ fontSize: 26, color: NAVY }}>{children}</span><span className="flex-1" style={{ height: 3, background: 'linear-gradient(90deg,#E8912D,transparent)' }} />
  </motion.div>
)
function S11() {
  return (
    <Page bg="#fff">
      <motion.div {...slideIn(0.1, 60)} className="absolute" style={{ right: 108, top: 36 }}><NwLogo h={58} /></motion.div>
      <motion.div {...rise(0)} className="absolute text-[18px] font-extrabold tracking-[0.3em]" style={{ left: 86, top: 64, color: '#E8912D' }}>TRUSTED BY</motion.div>
      <motion.h2 {...rise(0.1)} className="absolute font-extrabold" style={{ left: 86, top: 104, fontSize: 56, color: NAVY }}>600+ Organisations Rely on PeopleHub</motion.h2>
      <motion.div {...slideIn(0.3, -100)} className="absolute rounded-2xl" style={{ left: 86, top: 236, width: 519, height: 720, background: '#0B2A6B', padding: '44px 40px', boxShadow: '0 18px 40px -18px rgba(11,42,107,.6)' }}>
        <div className="font-extrabold" style={{ fontSize: 112, color: '#F5B829', lineHeight: 1 }}><AnimNum to={600} suffix="+" /></div>
        <div style={{ fontSize: 26, color: '#fff', marginTop: 10 }}>Clients across every industry</div>
        <div className="font-extrabold" style={{ fontSize: 112, color: '#F5B829', lineHeight: 1, marginTop: 44 }}><AnimNum to={12} suffix="+" delay={0.8} /></div>
        <div style={{ fontSize: 26, color: '#fff', marginTop: 10, lineHeight: 1.4 }}>Years of building HR software people trust</div>
        <motion.div {...rise(1.4, 24)} className="font-extrabold" style={{ fontSize: 66, color: '#F5B829', lineHeight: 1, marginTop: 44 }}>Government</motion.div>
        <motion.div {...rise(1.6, 24)} style={{ fontSize: 24, color: '#fff', marginTop: 10, lineHeight: 1.4 }}>Public sector experience with many departments, including the iconic Lotus Tower as a client</motion.div>
      </motion.div>
      <div className="absolute" style={{ left: 636, top: 236, width: 1198 }}>
        <GroupLabel d={0.4}>Local (Sri Lanka)</GroupLabel>
        <div className="grid grid-cols-8 gap-[10px]">{LOCAL.map((c, k) => <Tile key={k} src={c} d={0.5 + k * 0.04} />)}</div>
        <div style={{ height: 22 }} />
        <GroupLabel d={1.8}>International</GroupLabel>
        <div className="grid grid-cols-8 gap-[10px]">
          <Tile src={cAdvantis} d={1.9} /><Tile src={orbit} dark d={2.0} /><Tile src={nw} d={2.1} />
          <Tile d={2.2} /><Tile d={2.3} />
        </div>
      </div>
    </Page>
  )
}

/* 12 · Delivery approach -------------------------------------------------------------------------------------- */
function S12() {
  const steps: [string, string, string][] = [['1', 'Discover', 'Confirm requirements, process mapping'], ['2', 'Configure', 'Set up, data migration, integrations'], ['3', 'Test & Train', 'UAT, user and admin training'], ['4', 'Go Live', 'Cut-over, hypercare'], ['5', 'Support', 'Local helpdesk, upgrades, SLAs']]
  return (
    <Light title="How We Will Deliver and Support FRCS">
      {steps.map(([n, t, d], k) => (
        <div key={n} className="absolute text-center" style={{ left: 252 + k * 350 - 170, width: 340, top: 290 }}>
          <motion.div {...pop(0.5 + k * 0.3)} className="mx-auto grid place-items-center text-white font-extrabold rounded-full" style={{ width: 116, height: 116, fontSize: 44, background: k === 4 ? ORANGE : TEAL }}>{n}</motion.div>
          <motion.div {...rise(0.8 + k * 0.3, 30)}><div className="font-bold" style={{ fontSize: 36, color: NAVY, marginTop: 34 }}>{t}</div><div style={{ fontSize: 26, color: GRAY, marginTop: 14, lineHeight: 1.4 }}>{d}</div></motion.div>
        </div>
      ))}
      <motion.div {...rise(2.6, 30)} className="absolute" style={{ left: 96, top: 850, fontSize: 29, color: NAVY }}>Governance: dedicated project manager, joint steering committee, regular reporting to FRCS.</motion.div>
    </Light>
  )
}

/* 13 · Next steps --------------------------------------------------------------------------------------------- */
function S13() {
  const steps: [string, string][] = [['01. Discovery', 'Workforce mapping & policy rules'], ['02. Tailored Demo', 'FRCS-specific modules & workflows'], ['03. Scope & SOW', 'Milestone agreement & SLAs'], ['04. Phased Pilot', 'Rapid UAT to full organisation']]
  const contact: [string, string][] = [['✉', 'isuru.dahanayake@newworld.com.fj'], ['☎', '+679 999 2289'], ['⚲', 'Newworld Pte Ltd, Kings Road, Ba, Fiji']]
  return (
    <Page bg="#0B1017">
      <motion.div {...pop(0.1)} className="absolute rounded-2xl bg-white" style={{ left: 710, top: 160, width: 500, padding: '20px 34px', display: 'grid', placeItems: 'center' }}><NwLogo h={62} /></motion.div>
      <motion.div {...rise(0.4)} className="absolute left-0 right-0 text-center text-[21px] font-extrabold tracking-[0.12em]" style={{ top: 322, color: GREEN }}>NEXT STEPS • FRCS HRIS MODERNISATION</motion.div>
      <motion.h2 {...rise(0.55, 50)} className="absolute left-0 right-0 text-center font-extrabold text-white" style={{ top: 372, fontSize: 82, lineHeight: 1.18, padding: '0 220px' }}>Ready to Power FRCS’s Workforce Transformation</motion.h2>
      <motion.p {...rise(0.9)} className="absolute left-0 right-0 text-center" style={{ top: 620, fontSize: 26, lineHeight: 1.6, color: '#9AA7B8', padding: '0 330px' }}>Local accountability from Newworld Technologies, backed by PeopleHub’s proven HR engineering and 24/7 SLA-governed support.</motion.p>
      <div className="absolute grid grid-cols-4 gap-5" style={{ left: 240, right: 240, top: 740 }}>
        {steps.map(([t, d], k) => (
          <motion.div key={t} {...rise(1.2 + k * 0.2, 44)} className="rounded-xl text-center" style={{ background: '#131A24', border: '1px solid #1E2A3A', padding: '24px 14px' }}>
            <div className="font-extrabold" style={{ fontSize: 28, color: GREEN }}>{t}</div><div style={{ fontSize: 19, color: '#9AA7B8', marginTop: 8 }}>{d}</div>
          </motion.div>
        ))}
      </div>
      <motion.div {...rise(2.2, 20)} className="absolute left-0 right-0 flex items-center justify-center gap-14" style={{ top: 930, fontSize: 21, color: '#9AA7B8' }}>
        {contact.map(([ic, t]) => <span key={t} className="flex items-center gap-3"><span style={{ color: GREEN }}>{ic}</span>{t}</span>)}
      </motion.div>
    </Page>
  )
}

/** One footer for every slide: “PEOPLEHUB HRIS · NEWWORLD”. */
const SECTION = 'Newworld'
const mk = (id: string, title: string, secs: number, render: () => ReactNode, notes = ''): SlideDef => ({ id, section: SECTION, title, secs, tier: 3, notes, render })

const SIDE = ['time-capture', 'time-roster', 'leave-apply', 'pay-advance', 'pay-finance', 'serve-assets', 'serve-chat']

export function buildNwFrcaSlides(): SlideDef[] {
  const ws = buildWorkshopSlides()
  const pick = (id: string): SlideDef => ({ ...ws.find(x => x.id === id)!, section: SECTION })
  const main: SlideDef[] = [
    mk('nw-welcome', 'Welcome to PeopleHub', 60, () => <S1 />, 'Welcome and introduction (2 min). The date and time on the sign-in screen come from the MEETING setting in the deck source; empty means the live date and clock.'),
    mk('nw-blueprint', 'Modern Human Capital Management for FRCS', 60, () => <S2 />),
    mk('nw-agenda', 'What We Will Cover in 30 Minutes', 60, () => <S3 />, 'Agenda: 2 / 7 / 12 / 5 / 4 minutes, then 15 minutes of questions.'),
    pick('ws-roles'),
    mk('nw-household', 'Newworld: A Household Name, Powered by Technology', 90, () => <S4 />),
    mk('nw-team', 'A Skilled Team, Backed by Global Partnerships', 90, () => <S5 />),
    mk('nw-local-partner', 'Your Local Technology Partner in Fiji', 90, () => <S6 />),
    mk('nw-journey', 'The Employee Journey and Where Our HRIS Fits', 90, () => <S7 />),
    mk('nw-landscape-1', 'PeopleHub HRIS System Landscape', 120, () => <S8 />, 'Tap a box with ↗ to open its system screen; Back returns here. Third-Party Integrations can be explained verbally.'),
    mk('nw-landscape-2', 'System Landscape (Cont’d)', 90, () => <S9 />),
    mk('nw-landscape-3', 'PeopleHub HRIS Solution Landscape', 120, () => <S10 />),
    mk('nw-trusted', 'Trusted by 600+ Organisations', 120, () => <S11 />),
    mk('nw-delivery', 'How We Will Deliver and Support FRCS', 90, () => <S12 />),
    mk('nw-next', 'Next Steps', 60, () => <S13 />),
  ]
  // system screens reached from the landscape boxes: opened by link, then Back (not part of the running order)
  return [...main, ...SIDE.map(id => ({ ...pick(id), sideTrip: true }))]
}
