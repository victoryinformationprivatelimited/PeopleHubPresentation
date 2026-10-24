import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Pain } from '../profiles/pains'

/**
 * “This will solve your pain” — plays when a slide that answers one of the client's pain points appears:
 * the pain shows in red, gets struck through, then turns into a green “solved by …”.
 */
export function PainBanner({ pains, solver, delay = 0.7 }: { pains: Pain[]; solver: string; delay?: number }) {
  const key = pains.map(p => p.id).join()
  const [stage, setStage] = useState(0)
  useEffect(() => {
    setStage(0)
    const a = setTimeout(() => setStage(1), delay * 1000 + 700)
    const b = setTimeout(() => setStage(2), delay * 1000 + 1700)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, [key, delay])
  if (!pains.length) return null
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5 }} className="card px-5 py-4" style={{ borderColor: stage === 2 ? 'var(--ok)' : 'var(--bad)', transition: 'border-color .5s', background: stage === 2 ? 'color-mix(in srgb, var(--ok) 10%, var(--card))' : 'color-mix(in srgb, var(--bad) 8%, var(--card))' }}>
      <div className="text-[14px] tracking-[0.2em] uppercase font-bold mb-2" style={{ color: stage === 2 ? 'var(--ok)' : 'var(--bad)' }}>
        {stage === 2 ? '✓ Pain solved' : '💡 This will solve your pain'}
      </div>
      {pains.slice(0, 2).map(p => (
        <div key={p.id} className="mb-1.5">
          <div className="relative inline-block text-[22px] font-semibold leading-snug" style={{ opacity: stage === 2 ? 0.6 : 1, transition: 'opacity .5s' }}>
            {p.icon} {p.label}
            <motion.span className="absolute left-0 top-1/2 h-[3px] rounded-full" style={{ background: 'var(--bad)' }} initial={{ width: 0 }} animate={{ width: stage >= 1 ? '100%' : 0 }} transition={{ duration: 0.7, ease: 'easeInOut' }} />
          </div>
          {stage === 2 && <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[20px] font-bold mt-0.5" style={{ color: 'var(--ok)' }}>✓ Solved by {solver}</motion.div>}
        </div>
      ))}
    </motion.div>
  )
}
