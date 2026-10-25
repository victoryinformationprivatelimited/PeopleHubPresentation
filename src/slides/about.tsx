import { motion } from 'framer-motion'
import { useDeck } from '../engine/context'
import { Counter, fade } from '../ui/primitives'

/** Victory Information's client logos (src/assets/clients). Vite turns each file into a URL (inlined in the offline build). */
const files = import.meta.glob('../assets/clients/*.{png,jpg,jpeg,webp}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>
export const clientLogos = Object.entries(files)
  .map(([path, url]) => ({ url, name: path.split('/').pop()!.replace(/\.[a-z]+$/, '').replace(/-/g, ' ') }))
  .sort((a, b) => a.name.localeCompare(b.name))

const mix = (c: string, p: number) => `color-mix(in srgb, ${c} ${p}%, transparent)`

const VALUES = [
  { icon: '🔍', name: 'Transparency', line: 'You always know where your project stands.' },
  { icon: '🤝', name: 'Respect', line: 'For your people, your process and your time.' },
  { icon: '🏅', name: 'Superior quality', line: 'An exceptional SDLC behind every release.' },
  { icon: '⚡', name: 'Speed at fair cost', line: 'Outstanding software in the least possible time.' },
]

/* ───────── Who we are ───────── */
export function AboutSlide() {
  const { client, industry } = useDeck()
  return (
    <div className="absolute inset-0 px-20 pt-[84px] pb-24 grid grid-cols-12 gap-12 items-center">
      <div className="col-span-7 flex flex-col gap-6">
        <motion.div {...fade(0)} className="text-[22px] tracking-[0.24em] uppercase font-bold" style={{ color: 'var(--brand2)' }}>Victory Information (Pvt) Ltd · Sri Lanka</motion.div>
        <motion.h2 {...fade(0.08)} className="serif text-[84px] leading-[1.02] font-bold">Software people trust.<br /><span className="shimmer-text">HR is what we do best.</span></motion.h2>

        {/* the HR spotlight */}
        <motion.div {...fade(0.25)} className="relative overflow-hidden rounded-3xl px-8 py-6 flex items-center gap-6" style={{ background: mix('var(--ok)', 14), border: '2px solid var(--ok)', boxShadow: '0 0 60px -18px var(--ok)' }}>
          <motion.i className="absolute inset-y-0 w-40 -skew-x-12" style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent)' }} initial={{ left: '-20%' }} animate={{ left: '120%' }} transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 2.2, ease: 'easeInOut' }} />
          <motion.span className="text-[64px] leading-none" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2.4, repeat: Infinity }}>👥</motion.span>
          <div className="relative">
            <div className="text-[18px] tracking-[0.22em] uppercase font-bold" style={{ color: 'var(--ok)' }}>Our focus: the HR industry</div>
            <div className="text-[31px] font-semibold leading-snug mt-1">PeopleHub HRIS — built by a team that lives and breathes HR, payroll and workforce technology.</div>
          </div>
        </motion.div>

        <motion.p {...fade(0.4)} className="text-[28px] leading-snug" style={{ color: 'var(--mute)' }}>
          One of Sri Lanka’s fastest, highest-quality software companies — with an exceptional SDLC, a transparent way of working and a skilled team that
          delivers {client ? `${client}-sized` : 'enterprise-grade'} software in the least possible time.
        </motion.p>
      </div>

      <div className="col-span-5 flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          {[{ to: 14, suf: '+', lab: 'years of trust' }, { to: 600, suf: '+', lab: 'clients island-wide' }].map((k, i) => (
            <motion.div key={k.lab} {...fade(0.3 + 0.12 * i)} className="card px-6 py-5 text-center" style={{ borderColor: 'var(--brand2)' }}>
              <div className="serif text-[86px] leading-none font-bold grad-text"><Counter to={k.to} suffix={k.suf} duration={2.2} /></div>
              <div className="text-[24px] mt-1.5 font-semibold">{k.lab}</div>
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {VALUES.map((v, k) => (
            <motion.div key={v.name} initial={{ opacity: 0, y: 28, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.7 + 0.14 * k, type: 'spring', stiffness: 220, damping: 18 }} className="card px-5 py-4">
              <div className="text-[34px] leading-none">{v.icon}</div>
              <div className="text-[25px] font-bold mt-2 leading-tight">{v.name}</div>
              <div className="text-[19px] leading-snug mt-1" style={{ color: 'var(--mute)' }}>{v.line}</div>
            </motion.div>
          ))}
        </div>
        <motion.div {...fade(1.4)} className="text-[19px] leading-snug" style={{ color: 'var(--mute)' }}>Specialised services across every industry — today focused on {industry.name.toLowerCase()} and beyond.</motion.div>
      </div>
    </div>
  )
}

/* ───────── Trusted by (scrolling client wall) ───────── */
function Tile({ l }: { l: { url: string; name: string } }) {
  return (
    <div className="flex-none rounded-2xl grid place-items-center overflow-hidden" style={{ width: 310, height: 160, background: '#fff', boxShadow: '0 8px 30px -14px rgba(0,0,0,.6)' }} title={l.name}>
      <img src={l.url} alt={l.name} loading="eager" className="max-w-[260px] max-h-[124px] object-contain" />
    </div>
  )
}

export function ClientsSlide() {
  const { print } = useDeck()
  const rows = [0, 1, 2].map(r => clientLogos.filter((_, i) => i % 3 === r))
  return (
    <div className="absolute inset-0">
      <div className="absolute left-20 right-20 top-[84px] flex items-end justify-between gap-10">
        <div>
          <motion.div {...fade(0)} className="text-[22px] tracking-[0.24em] uppercase font-bold mb-2" style={{ color: 'var(--brand2)' }}>Trusted island-wide</motion.div>
          <motion.h2 {...fade(0.08)} className="serif text-[76px] leading-[1.02] font-bold">Join <span className="shimmer-text"><Counter to={600} suffix="+" duration={2} /></span> organisations<br />already powered by Victory.</motion.h2>
        </div>
        <motion.div {...fade(0.3)} className="card px-7 py-4 text-[24px] leading-snug max-w-[470px]" style={{ borderColor: 'var(--ok)' }}>
          From garments to banks, schools to ports — and <b>HR is where we go deepest.</b>
        </motion.div>
      </div>

      {print ? (
        <div className="absolute left-20 right-20 top-[330px] flex flex-wrap gap-3 justify-center">{clientLogos.map(l => <Tile key={l.url} l={l} />)}</div>
      ) : (
        <div className="absolute left-0 right-0 top-[336px] flex flex-col gap-7 overflow-hidden" style={{ maskImage: 'linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)', WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)' }}>
          {rows.map((row, r) => (
            <motion.div key={r} {...fade(0.3 + 0.15 * r)}>
              <div className="marquee-track flex gap-6 w-max" style={{ animation: `marquee ${70 + r * 14}s linear infinite ${r % 2 ? 'reverse' : 'normal'}` }}>
                {[...row, ...row].map((l, i) => <Tile key={i} l={l} />)}
              </div>
            </motion.div>
          ))}
        </div>
      )}
      <div className="absolute left-20 bottom-[84px] text-[21px]" style={{ color: 'var(--mute)' }}>Government bodies, banks &amp; insurers, manufacturers, education, hospitality, logistics, retail and more.</div>
    </div>
  )
}
