import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'

export function Counter({ to, suffix = '', prefix = '', duration = 1.6, className = '' }: { to: number; suffix?: string; prefix?: string; duration?: number; className?: string }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    const t0 = Date.now()
    const id = setInterval(() => {
      const p = Math.min((Date.now() - t0) / (duration * 1000), 1)
      setV(to * (1 - Math.pow(1 - p, 3)))
      if (p >= 1) clearInterval(id)
    }, 40)
    return () => clearInterval(id)
  }, [to, duration])
  return <span className={className}>{prefix}{Number.isInteger(to) ? Math.round(v) : v.toFixed(1)}{suffix}</span>
}

export function Badge({ children, tone = 'brand' }: { children: ReactNode; tone?: 'brand' | 'ok' | 'warn' | 'bad' | 'mute' }) {
  const c = { brand: 'var(--brand2)', ok: 'var(--ok)', warn: 'var(--warn)', bad: 'var(--bad)', mute: 'var(--mute)' }[tone]
  return <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[14px] font-semibold" style={{ color: c, background: `color-mix(in srgb, ${c} 16%, transparent)`, border: `1px solid color-mix(in srgb, ${c} 35%, transparent)` }}>{children}</span>
}

export function Window({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={`card overflow-hidden glow ${className}`} style={{ background: 'var(--bg2)' }}>
      <div className="flex items-center gap-2 px-5 h-11 border-b" style={{ borderColor: 'var(--line)' }}>
        <i className="w-3 h-3 rounded-full" style={{ background: '#fb7185' }} /><i className="w-3 h-3 rounded-full" style={{ background: '#fbbf24' }} /><i className="w-3 h-3 rounded-full" style={{ background: '#34d399' }} />
        <span className="ml-4 text-[14px]" style={{ color: 'var(--mute)' }}>{title}</span>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

export function Phone({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative rounded-[48px] p-3 glow ${className}`} style={{ width: 340, height: 680, background: '#05080f', border: '2px solid var(--line)' }}>
      <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full bg-black z-10" />
      <div className="w-full h-full rounded-[38px] overflow-hidden pt-12 px-4 pb-4" style={{ background: 'var(--bg2)' }}>{children}</div>
    </div>
  )
}

export const fade = (d = 0) => ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { delay: d, duration: 0.5, ease: 'easeOut' as const } })

export function Avatar({ name, size = 44, color }: { name: string; size?: number; color?: string }) {
  const ini = name.split(' ').map(p => p[0]).slice(0, 2).join('')
  const hues = [215, 190, 260, 160, 30, 330]
  const h = hues[(name.charCodeAt(0) + name.length) % hues.length]
  return <span className="inline-flex items-center justify-center rounded-full font-bold text-white flex-none" style={{ width: size, height: size, fontSize: size * 0.38, background: color ?? `hsl(${h} 60% 45%)` }}>{ini}</span>
}

export function Bar({ pct, color = 'var(--brand2)', delay = 0 }: { pct: number; color?: string; delay?: number }) {
  return <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--line)' }}><motion.div className="h-full rounded-full" style={{ background: color }} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay, duration: 1, ease: 'easeOut' }} /></div>
}

/** Connected-nodes flow: nodes laid left→right with animated dashed edges. */
export function Flow({ steps, active }: { steps: string[]; active?: number }) {
  return (
    <div className="flex items-center gap-3">
      {steps.map((s, k) => (
        <div key={s} className="flex items-center gap-3">
          <motion.div {...fade(0.15 * k)} className="card px-5 py-4 text-[18px] font-semibold text-center min-w-[120px]" style={k === active ? { outline: '2px solid var(--brand2)' } : {}}>
            <div className="text-[13px] mb-1" style={{ color: 'var(--brand2)' }}>0{k + 1}</div>{s}
          </motion.div>
          {k < steps.length - 1 && (
            <svg width="44" height="12"><line x1="0" y1="6" x2="44" y2="6" stroke="var(--brand2)" strokeWidth="2" className="flow-line" /></svg>
          )}
        </div>
      ))}
    </div>
  )
}
