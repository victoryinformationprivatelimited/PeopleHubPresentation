import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { DeckCtx, SlideDef } from './context'

const W = 1920
const H = 1080

export function Deck({ slides, ctx, theme: initialTheme = 'dark', onConfigure }: { slides: SlideDef[]; ctx: DeckCtx; theme?: 'dark' | 'light'; onConfigure?: () => void }) {
  const [i, setI] = useState(() => {
    const h = parseInt(location.hash.replace('#', ''), 10)
    return Number.isFinite(h) ? Math.min(Math.max(h - 1, 0), slides.length - 1) : 0
  })
  const [dir, setDir] = useState(1)
  const [grid, setGrid] = useState(false)
  const [notes, setNotes] = useState(false)
  const [scale, setScale] = useState(1)
  const [theme, setTheme] = useState<'dark' | 'light'>(initialTheme)

  const go = useCallback((n: number) => {
    setI(cur => {
      const t = Math.min(Math.max(n, 0), slides.length - 1)
      setDir(t >= cur ? 1 : -1)
      return t
    })
  }, [slides.length])

  useEffect(() => { history.replaceState(null, '', `#${i + 1}`) }, [i])
  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])

  useEffect(() => {
    const fit = () => setScale(Math.min(innerWidth / W, innerHeight / H))
    fit(); addEventListener('resize', fit)
    return () => removeEventListener('resize', fit)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return
      if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(e.key) && !grid) { e.preventDefault(); go(i + 1) }
      else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(e.key) && !grid) { e.preventDefault(); go(i - 1) }
      else if (e.key === 'Home') go(0)
      else if (e.key === 'End') go(slides.length - 1)
      else if (e.key === 'g' || e.key === 'G' || e.key === 'Escape') setGrid(g => (e.key === 'Escape' ? false : !g))
      else if (e.key === 'n' || e.key === 'N') setNotes(v => !v)
      else if ((e.key === 'c' || e.key === 'C') && onConfigure) onConfigure()
      else if (e.key === 't' || e.key === 'T') setTheme(t => (t === 'dark' ? 'light' : 'dark'))
      else if (e.key === 'f' || e.key === 'F') {
        if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen?.()
      }
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [go, i, grid, slides.length, onConfigure])

  const sections = useMemo(() => {
    const m = new Map<string, number[]>()
    slides.forEach((s, idx) => m.set(s.section, [...(m.get(s.section) ?? []), idx]))
    return [...m.entries()]
  }, [slides])

  const slide = slides[i]

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden" style={{ background: 'var(--bg)' }}>
      <div style={{ width: W, height: H, transform: `scale(${scale})`, flex: 'none' }} className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 20% 0%, color-mix(in srgb, var(--brand) 22%, transparent), transparent 55%), radial-gradient(ellipse at 90% 100%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 50%), var(--bg)' }} />
        <div className="absolute inset-0 grid-bg opacity-40" />
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={slide.id}
            custom={dir}
            initial={{ opacity: 0, x: 60 * dir, filter: 'blur(8px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -60 * dir, filter: 'blur(8px)' }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            {slide.render(ctx)}
          </motion.div>
        </AnimatePresence>

        {ctx.logo && slide.id !== 'open' && slide.id !== 'contact' && <img src={ctx.logo} alt={ctx.client} className="absolute top-6 right-10 z-30 h-14 max-w-[220px] object-contain rounded-xl bg-white px-3 py-1.5 shadow-lg" />}

        {/* footer chrome */}
        <div className="absolute bottom-0 left-0 right-0 h-14 px-14 flex items-center justify-between text-[15px] pointer-events-none" style={{ color: 'var(--mute)' }}>
          <span className="tracking-[0.18em] uppercase text-[12px]">PeopleHub HRIS · {slide.section}</span>
          <span className="flex items-center gap-4">
            <span className="w-64 h-[3px] rounded-full overflow-hidden" style={{ background: 'var(--line)' }}>
              <motion.span className="block h-full" style={{ background: 'linear-gradient(90deg,var(--brand2),var(--accent))' }} animate={{ width: `${((i + 1) / slides.length) * 100}%` }} />
            </span>
            {i + 1} / {slides.length}
          </span>
        </div>

        {/* click zones */}
        <button aria-label="Previous" className="absolute left-0 top-24 bottom-24 w-24 opacity-0" onClick={() => go(i - 1)} />
        <button aria-label="Next" className="absolute right-0 top-24 bottom-24 w-24 opacity-0" onClick={() => go(i + 1)} />

        {notes && (
          <div className="absolute left-14 right-14 bottom-16 card p-6 text-[20px] leading-snug z-40" style={{ background: 'var(--bg2)' }}>
            <div className="text-[12px] tracking-widest uppercase mb-2" style={{ color: 'var(--brand2)' }}>Presenter notes · {slide.title}</div>
            {slide.notes}
          </div>
        )}

        {grid && (
          <div className="absolute inset-0 z-50 p-14 overflow-auto" style={{ background: 'color-mix(in srgb, var(--bg) 96%, transparent)' }}>
            <div className="flex items-end justify-between mb-8">
              <h2 className="serif text-5xl">Jump to slide</h2>
              <span style={{ color: 'var(--mute)' }}>G / Esc to close · N notes · T theme · F fullscreen · C settings</span>
            </div>
            {sections.map(([name, idxs]) => (
              <div key={name} className="mb-6">
                <div className="text-[13px] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--brand2)' }}>{name}</div>
                <div className="flex flex-wrap gap-2">
                  {idxs.map(n => (
                    <button key={n} onClick={() => { go(n); setGrid(false) }} className="card px-4 py-2 text-[17px] text-left hover:brightness-125" style={n === i ? { outline: '2px solid var(--brand2)' } : {}}>
                      <span style={{ color: 'var(--mute)' }}>{n + 1}</span> {slides[n].title}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
