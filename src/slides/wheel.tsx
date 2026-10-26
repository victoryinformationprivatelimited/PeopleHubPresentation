import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNav, useSession } from '../engine/context'
import { OUTCOMES } from '../decks/workshop/data'
import { OIcon, OIconBody, OIconDefs } from '../ui/OutcomeIcons'
import { Counter, fade } from '../ui/primitives'
import { LANDSCAPE } from './landscape'

const mix = (c: string, p: number) => `color-mix(in srgb, ${c} ${p}%, transparent)`
const C = 500, RO = 470, RI = 292, GAP = 1.6

const pt = (r: number, deg: number) => { const a = ((deg - 90) * Math.PI) / 180; return [C + r * Math.cos(a), C + r * Math.sin(a)] as const }
const segPath = (a0: number, a1: number) => {
  const [x0, y0] = pt(RO, a0), [x1, y1] = pt(RO, a1), [x2, y2] = pt(RI, a1), [x3, y3] = pt(RI, a0)
  return `M${x0} ${y0} A${RO} ${RO} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${RI} ${RI} 0 0 0 ${x3} ${y3} Z`
}

/** The whole platform as a wheel: tap a segment, see its modules, tap a module to open it (Back returns here). */
export function WheelSlide({ mode, doneTo }: { mode: 'workshop' | 'tour'; doneTo?: string }) {
  const { jump, goTo, has } = useNav()
  const { outcomes } = useSession()
  const [sel, setSel] = useState(0)
  const [touched, setTouched] = useState(false)
  const [tick, setTick] = useState(0)
  const N = OUTCOMES.length, STEP = 5200

  useEffect(() => {
    if (touched) return
    const t = setTimeout(() => { setSel(s => (s + 1) % N); setTick(k => k + 1) }, STEP)
    return () => clearTimeout(t)
  }, [sel, touched, tick, N])

  const pick = (k: number) => { setTouched(true); setSel(k) }
  const o = OUTCOMES[sel]
  const mods = LANDSCAPE.filter(m => m.w.split('-')[0] === o.id)
  const seg = 360 / N

  return (
    <div className="absolute inset-0">
      <div className="absolute left-14 top-[64px]">
        <motion.div {...fade(0)} className="text-[19px] tracking-[0.24em] uppercase font-bold mb-1" style={{ color: 'var(--brand2)' }}>The PeopleHub wheel</motion.div>
        <motion.h2 {...fade(0.06)} className="serif text-[48px] leading-none font-bold">Tap a segment. Open any module.</motion.h2>
      </div>
      {doneTo && <motion.button {...fade(0.3)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => goTo(doneTo)} className="glow absolute right-14 top-[76px] rounded-xl px-6 py-3 text-[21px] font-bold text-white" style={{ background: 'linear-gradient(90deg,var(--brand),var(--accent))' }}>✔ Done — next step ➜</motion.button>}

      {/* the wheel */}
      <motion.svg viewBox="0 0 1000 1000" className="absolute left-10 top-[150px]" style={{ width: 830, height: 830 }} initial={{ opacity: 0, scale: 0.8, rotate: -25 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.9, ease: 'easeOut' }}>
        <OIconDefs />
        <motion.circle cx={C} cy={C} r={RI - 14} fill="none" stroke="var(--line)" strokeWidth="2" strokeDasharray="4 12" animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: `${C}px ${C}px` }} />
        {OUTCOMES.map((x, k) => {
          const a0 = k * seg + GAP / 2, a1 = (k + 1) * seg - GAP / 2, mid = (a0 + a1) / 2, on = k === sel
          const [dx, dy] = [Math.cos(((mid - 90) * Math.PI) / 180) * 24, Math.sin(((mid - 90) * Math.PI) / 180) * 24]
          const [ix, iy] = pt(382, mid)
          return (
            <motion.g key={x.id} animate={{ x: on ? dx : 0, y: on ? dy : 0 }} transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              onClick={() => pick(k)} onMouseEnter={() => pick(k)} style={{ cursor: 'pointer' }}>
              <motion.path d={segPath(a0, a1)} fill={x.color} initial={{ opacity: 0 }} animate={{ opacity: on ? 1 : 0.72 }} transition={{ delay: on ? 0 : 0.08 * k, duration: 0.5 }}
                stroke={on ? '#fff' : 'none'} strokeWidth="3" style={{ filter: on ? `drop-shadow(0 0 26px ${x.color})` : 'none' }} />
              <g transform={`translate(${ix} ${iy - 26}) scale(1.5) translate(-24 -24)`}><OIconBody id={x.id} color="rgba(255,255,255,.16)" /></g>
              <text x={ix} y={iy + 48} textAnchor="middle" fontSize="26" fontWeight="800" fill="#fff" style={{ pointerEvents: 'none' }}>{x.short}</text>
              {outcomes.includes(x.id) && mode === 'workshop' && <circle cx={pt(RO - 20, mid)[0]} cy={pt(RO - 20, mid)[1]} r="9" fill="#fff" />}
            </motion.g>
          )
        })}
        {/* hub */}
        <circle cx={C} cy={C} r="262" fill="var(--bg2)" stroke="var(--line)" strokeWidth="2" />
        <motion.circle cx={C} cy={C} r="262" fill="none" stroke={o.color} strokeWidth="6" strokeDasharray="120 1527" key={o.id} initial={{ strokeDashoffset: 0 }} animate={{ strokeDashoffset: -1527 }} transition={{ duration: touched ? 1.2 : STEP / 1000, ease: 'linear' }} style={{ transformOrigin: `${C}px ${C}px`, transform: 'rotate(-90deg)' }} />
        <circle cx={C} cy={C - 70} r="128" fill="#fff" />
        <image href="./logo-black.png" x={C - 118} y={C - 188} width="236" height="236" />
        <text x={C} y={C + 105} textAnchor="middle" fontSize="40" fontWeight="800" fill="var(--ink)" fontFamily="Fraunces, serif">HRIS</text>
        <text x={C} y={C + 148} textAnchor="middle" fontSize="22" fill="var(--mute)">{LANDSCAPE.length} modules · {N} outcomes</text>
      </motion.svg>

      {/* the selected segment's modules */}
      <div className="absolute right-14 top-[150px] bottom-[84px]" style={{ left: 900 }}>
        <AnimatePresence mode="wait">
          <motion.div key={o.id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} className="h-full rounded-3xl p-7 flex flex-col relative overflow-hidden" style={{ background: mix(o.color, 11), border: `2px solid ${mix(o.color, 55)}` }}>
            <motion.div className="absolute -right-24 -top-24 w-[380px] h-[380px] rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${mix(o.color, 36)}, transparent 68%)` }} animate={{ scale: [1, 1.18, 1] }} transition={{ duration: 5, repeat: Infinity }} />
            <div className="relative flex items-center gap-5 mb-5">
              <motion.div initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }}><OIcon id={o.id} size={84} color={o.color} /></motion.div>
              <div className="min-w-0">
                <div className="serif text-[44px] leading-[1.05] font-bold">{o.name}</div>
                <div className="text-[22px] leading-snug mt-1" style={{ color: 'var(--mute)' }}>{o.promise}</div>
              </div>
            </div>
            <div className={`relative grid ${mods.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-3 content-start`}>
              {mods.map((m, k) => {
                const target = mode === 'workshop' ? m.w : m.t, ok = has(target)
                return (
                  <motion.button key={m.name} initial={{ opacity: 0, y: 24, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.1 + 0.07 * k, type: 'spring', stiffness: 240, damping: 20 }}
                    whileHover={{ scale: 1.03, y: -3 }} whileTap={{ scale: 0.97 }} onClick={() => ok && jump(target)} disabled={!ok}
                    className="rounded-2xl px-5 py-3 text-left flex flex-col min-h-0" style={{ background: 'var(--card)', border: '1px solid var(--line)', opacity: ok ? 1 : 0.45 }}>
                    <div className="flex items-center gap-3"><span className="text-[26px] font-bold leading-tight flex-1">{m.name}</span><span className="text-[22px]" style={{ color: o.color }}>▶</span></div>
                    <ul className="mt-1.5 flex flex-col gap-0.5 text-[20px] leading-snug" style={{ color: 'var(--mute)' }}>{m.feats.map(f => <li key={f} className="flex gap-2"><span style={{ color: o.color }}>•</span>{f}</li>)}</ul>
                  </motion.button>
                )
              })}
            </div>
            <div className="relative mt-auto mb-3 flex items-center gap-5 rounded-2xl px-6 py-4" style={{ background: mix(o.color, 18), border: `1.5px solid ${mix(o.color, 50)}` }}>
              <div className="serif text-[64px] leading-none font-bold" style={{ color: o.color }}><Counter key={o.id} to={o.kpi.value} suffix={o.kpi.suffix} duration={1.2} /></div>
              <div className="text-[24px] leading-snug font-semibold">{o.kpi.label}<div className="text-[15px] font-normal" style={{ color: 'var(--mute)' }}>typical result — illustrative, not guaranteed</div></div>
            </div>
            <div className="relative text-[17px]" style={{ color: 'var(--mute)' }}>Tap a module to open it, then use <b>Back</b> to return to the wheel{touched ? '' : ' · touring automatically — tap a segment to take over'}</div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
