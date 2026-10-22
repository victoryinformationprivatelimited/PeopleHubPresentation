import { useEffect, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import type { DeckCtx, SlideDef } from './context'

const W = 1920
const H = 1080
const SETTLE_MS = 6500   // let the slide animations and counters finish before printing

/** One 16:9 page per slide, for “Save as PDF”. Opened with the E key or the launcher’s Export button. */
export function PrintView({ slides, ctx, auto = true, onDone }: { slides: SlideDef[]; ctx: DeckCtx; auto?: boolean; onDone: () => void }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), SETTLE_MS)
    return () => clearTimeout(t)
  }, [])
  useEffect(() => {
    if (!ready || !auto) return
    const after = () => onDone()
    addEventListener('afterprint', after)
    window.print()
    return () => removeEventListener('afterprint', after)
  }, [ready, auto, onDone])

  return (
    <MotionConfig reducedMotion="always">
      <div id="print-root">
        <div className="no-print fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-full px-6 py-3 text-[16px] font-bold text-white shadow-xl" style={{ background: 'linear-gradient(90deg, var(--brand), var(--accent))' }}>
          {ready ? 'Choose “Save as PDF” (Layout: Landscape, Margins: None, Background graphics: on)' : 'Preparing leave-behind PDF…'}
          <button onClick={onDone} className="ml-4 underline font-semibold">Close</button>
          {ready && <button onClick={() => window.print()} className="ml-4 underline font-semibold">Print again</button>}
        </div>
        {slides.map((s, k) => (
          <section key={s.id} className="print-page relative overflow-hidden" style={{ width: W, height: H, background: 'var(--bg)' }}>
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 20% 0%, color-mix(in srgb, var(--brand) 22%, transparent), transparent 55%), radial-gradient(ellipse at 90% 100%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 50%), var(--bg)' }} />
            <div className="absolute inset-0 grid-bg opacity-40" />
            <div className="absolute inset-0">{s.render(ctx)}</div>
            {ctx.logo && s.id !== 'open' && s.id !== 'contact' && <img src={ctx.logo} alt="" className="absolute top-6 right-10 z-30 h-14 max-w-[220px] object-contain rounded-xl bg-white px-3 py-1.5" />}
            <div className="absolute bottom-0 left-0 right-0 h-14 px-14 flex items-center justify-between text-[15px]" style={{ color: 'var(--mute)' }}>
              <span className="tracking-[0.18em] uppercase text-[12px]">PeopleHub HRIS{ctx.client ? ` · Prepared for ${ctx.client}` : ''} · {s.section}</span>
              <span>{k + 1} / {slides.length}</span>
            </div>
          </section>
        ))}
      </div>
    </MotionConfig>
  )
}
