import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import type { Mod } from './modules'
import { pillarById } from './modules'
import { fade } from '../ui/primitives'
import { useDeck } from '../engine/context'

export function ModuleSlide({ mod, demo }: { mod: Mod; demo: ReactNode }) {
  const p = pillarById[mod.pillar]
  const { industry, company } = useDeck()
  const useCase = industry.id !== 'generic' ? industry.useCases[mod.id] : undefined
  return (
    <div className="absolute inset-0 px-20 pt-16 pb-20 grid grid-cols-12 gap-14 items-center">
      <div className="col-span-5">
        <motion.div {...fade(0)} className="inline-flex items-center gap-2 text-[15px] tracking-[0.2em] uppercase font-bold mb-5" style={{ color: p.color }}>
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />{p.name}
        </motion.div>
        <motion.h2 {...fade(0.08)} className="serif text-[62px] leading-[1.05] font-bold mb-3">{mod.name}</motion.h2>
        <motion.div {...fade(0.16)} className="text-[28px] font-semibold grad-text mb-5">{mod.headline}</motion.div>
        <motion.p {...fade(0.24)} className="text-[22px] leading-relaxed mb-7" style={{ color: 'var(--mute)' }}>{mod.blurb}</motion.p>
        <ul className="flex flex-col gap-3">
          {mod.bullets.map((b, k) => (
            <motion.li key={b} {...fade(0.34 + 0.1 * k)} className="flex items-start gap-3 text-[21px]">
              <span className="mt-2 w-2.5 h-2.5 rounded-full flex-none" style={{ background: p.color }} />{b}
            </motion.li>
          ))}
        </ul>
        {useCase && (
          <motion.div {...fade(0.8)} className="card mt-7 px-5 py-4 text-[19px] leading-snug" style={{ borderLeft: `4px solid ${p.color}` }}>
            <div className="text-[12px] tracking-[0.18em] uppercase font-bold mb-1" style={{ color: p.color }}>For {company} · {industry.name}</div>
            {useCase}
          </motion.div>
        )}
      </div>
      <div className="col-span-7" style={{ zoom: 1.22 }}>{demo}</div>
    </div>
  )
}

export function Section({ eyebrow, title, sub, children, zoom = 1 }: { eyebrow: string; title: string; sub?: string; children?: ReactNode; zoom?: number }) {
  return (
    <div className="absolute inset-0 px-20 pt-16 pb-20 flex flex-col">
      <motion.div {...fade(0)} className="text-[15px] tracking-[0.22em] uppercase font-bold mb-3" style={{ color: 'var(--brand2)' }}>{eyebrow}</motion.div>
      <motion.h2 {...fade(0.08)} className="serif text-[64px] leading-[1.05] font-bold max-w-[1500px]">{title}</motion.h2>
      {sub && <motion.p {...fade(0.16)} className="text-[24px] mt-3 max-w-[1300px]" style={{ color: 'var(--mute)' }}>{sub}</motion.p>}
      <div className="flex-1 mt-8 min-h-0" style={{ zoom }}>{children}</div>
    </div>
  )
}
