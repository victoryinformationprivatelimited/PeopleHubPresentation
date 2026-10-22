import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { NavContext, type DeckCtx, type SlideDef } from './context'
import { fmtTime, totalSecs } from './agenda'

const W = 1920
const H = 1080

interface Props {
  slides: SlideDef[]        // slides to present, in order (agenda applied)
  allSlides: SlideDef[]     // every slide (so hidden ones can still be opened ad hoc)
  ctx: DeckCtx
  theme?: 'dark' | 'light'
  showTimer?: boolean
  onConfigure?: () => void
  onExport?: () => void
}

type Pointer = 'off' | 'laser' | 'spot'

export function Deck({ slides, allSlides, ctx, theme: initialTheme = 'dark', showTimer: timerDefault = false, onConfigure, onExport }: Props) {
  const order = useMemo(() => slides.map(s => s.id), [slides])
  const byId = useMemo(() => new Map(allSlides.map(s => [s.id, s])), [allSlides])

  const [cur, setCur] = useState(() => {
    const h = parseInt(location.hash.replace('#', ''), 10)
    return order[Number.isFinite(h) ? Math.min(Math.max(h - 1, 0), order.length - 1) : 0]
  })
  const [returnTo, setReturnTo] = useState<string | null>(null)
  const [dir, setDir] = useState(1)
  const [grid, setGrid] = useState(false)
  const [notes, setNotes] = useState(false)
  const [help, setHelp] = useState(false)
  const [black, setBlack] = useState(false)
  const [scale, setScale] = useState(1)
  const [theme, setTheme] = useState<'dark' | 'light'>(initialTheme)
  const [pointer, setPointer] = useState<Pointer>('off')
  const [timer, setTimer] = useState(timerDefault)
  const [now, setNow] = useState(Date.now())
  const startRef = useRef(Date.now())
  const mouse = useRef({ x: -999, y: -999 })
  const [mouseTick, setMouseTick] = useState(0)

  const idx = order.indexOf(cur)
  const slide = byId.get(cur)!

  const go = useCallback((n: number) => {
    const t = Math.min(Math.max(n, 0), order.length - 1)
    setDir(t >= order.indexOf(cur) ? 1 : -1)
    setCur(order[t])
  }, [order, cur])

  const jump = useCallback((id: string) => {
    if (!byId.has(id) || id === cur) return
    setReturnTo(r => r ?? cur)
    setDir(1); setCur(id)
  }, [byId, cur])

  const back = useCallback(() => {
    if (!returnTo) return
    setDir(-1); setCur(returnTo); setReturnTo(null)
  }, [returnTo])

  const next = useCallback(() => { if (idx === -1) back(); else go(idx + 1) }, [idx, back, go])
  const prev = useCallback(() => { if (returnTo) back(); else go(idx - 1) }, [returnTo, back, go, idx])

  // landing on a scheduled slide ends a detour
  useEffect(() => { if (returnTo && cur === returnTo) setReturnTo(null) }, [cur, returnTo])
  useEffect(() => { if (idx >= 0) history.replaceState(null, '', `${location.search}#${idx + 1}`) }, [idx])
  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t) }, [])

  useEffect(() => {
    const fit = () => setScale(Math.min(innerWidth / W, innerHeight / H))
    fit(); addEventListener('resize', fit)
    return () => removeEventListener('resize', fit)
  }, [])

  // pointer tracking (laser / spotlight)
  useEffect(() => {
    if (pointer === 'off') return
    let raf = 0
    const move = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; cancelAnimationFrame(raf); raf = requestAnimationFrame(() => setMouseTick(t => t + 1)) }
    addEventListener('mousemove', move)
    return () => { removeEventListener('mousemove', move); cancelAnimationFrame(raf) }
  }, [pointer])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return
      const k = e.key
      if (black && k !== '.') { setBlack(false); return }
      if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(k) && !grid) { e.preventDefault(); next() }
      else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(k) && !grid) { e.preventDefault(); prev() }
      else if (k === 'Home') go(0)
      else if (k === 'End') go(order.length - 1)
      else if (k === 'g' || k === 'G') setGrid(g => !g)
      else if (k === 'Escape') { setGrid(false); setHelp(false); setPointer('off') }
      else if (k === 'n' || k === 'N') setNotes(v => !v)
      else if (k === 'c' || k === 'C') onConfigure?.()
      else if (k === 'e' || k === 'E') onExport?.()
      else if (k === 'd' || k === 'D') setTimer(v => !v)
      else if (k === 'l' || k === 'L') setPointer(p => (p === 'off' ? 'laser' : p === 'laser' ? 'spot' : 'off'))
      else if (k === '.') setBlack(v => !v)
      else if (k === '?') setHelp(v => !v)
      else if (k === 't' || k === 'T') setTheme(t => (t === 'dark' ? 'light' : 'dark'))
      else if (k === 'f' || k === 'F') { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen?.() }
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [go, next, prev, grid, order.length, onConfigure, onExport, black])

  const sections = useMemo(() => {
    const m = new Map<string, SlideDef[]>()
    slides.forEach(s => m.set(s.section, [...(m.get(s.section) ?? []), s]))
    return [...m.entries()]
  }, [slides])
  const hidden = useMemo(() => allSlides.filter(s => !order.includes(s.id)), [allSlides, order])

  // timer / pace
  const planned = totalSecs(slides)
  const elapsed = (now - startRef.current) / 1000
  const doneSecs = idx > 0 ? totalSecs(slides.slice(0, idx)) : 0
  const pace = idx >= 0 ? elapsed - doneSecs : 0
  const paceLabel = Math.abs(pace) < 20 ? 'on pace' : pace > 0 ? `${fmtTime(pace)} behind` : `${fmtTime(-pace)} ahead`
  const paceColor = Math.abs(pace) < 20 ? 'var(--ok)' : pace > 0 ? 'var(--bad)' : 'var(--accent)'

  const px = mouse.current.x, py = mouse.current.y
  void mouseTick

  return (
    <NavContext.Provider value={{ jump }}>
      <div className="fixed inset-0 flex items-center justify-center overflow-hidden" style={{ background: 'var(--bg)', cursor: pointer === 'off' ? undefined : 'none' }}>
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

          {returnTo && (
            <button onClick={back} className="absolute top-6 left-1/2 -translate-x-1/2 z-40 rounded-full px-6 py-3 text-[20px] font-bold text-white shadow-xl" style={{ background: 'linear-gradient(90deg, var(--brand), var(--accent))' }}>
              ↩ Back to {byId.get(returnTo)?.title ?? 'overview'}
            </button>
          )}

          {/* footer chrome */}
          <div className="absolute bottom-0 left-0 right-0 h-14 px-14 flex items-center justify-between text-[15px] pointer-events-none" style={{ color: 'var(--mute)' }}>
            <span className="tracking-[0.18em] uppercase text-[12px]">PeopleHub HRIS · {slide.section}</span>
            {timer && (
              <button onClick={() => { startRef.current = Date.now() }} title="Click to restart the timer" className="pointer-events-auto rounded-full px-4 py-1 text-[14px]" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
                ⏱ {fmtTime(elapsed)} / {fmtTime(planned)} · <b style={{ color: paceColor }}>{paceLabel}</b>
              </button>
            )}
            <span className="flex items-center gap-4">
              <span className="w-64 h-[3px] rounded-full overflow-hidden" style={{ background: 'var(--line)' }}>
                <motion.span className="block h-full" style={{ background: 'linear-gradient(90deg,var(--brand2),var(--accent))' }} animate={{ width: `${((Math.max(idx, 0) + 1) / order.length) * 100}%` }} />
              </span>
              {idx >= 0 ? `${idx + 1} / ${order.length}` : 'extra'}
            </span>
          </div>

          {/* click zones */}
          <button aria-label="Previous" className="absolute left-0 top-24 bottom-24 w-24 opacity-0" onClick={prev} />
          <button aria-label="Next" className="absolute right-0 top-24 bottom-24 w-24 opacity-0" onClick={next} />

          {notes && (
            <div className="absolute left-14 right-14 bottom-16 card p-6 text-[20px] leading-snug z-40" style={{ background: 'var(--bg2)' }}>
              <div className="text-[12px] tracking-widest uppercase mb-2" style={{ color: 'var(--brand2)' }}>Presenter notes · {slide.title} · ~{Math.round(slide.secs)}s</div>
              {slide.notes}
            </div>
          )}

          {grid && (
            <div className="absolute inset-0 z-50 p-14 overflow-auto" style={{ background: 'color-mix(in srgb, var(--bg) 96%, transparent)' }}>
              <div className="flex items-end justify-between mb-8">
                <h2 className="serif text-5xl">Jump to slide <span className="text-[22px]" style={{ color: 'var(--mute)' }}>{order.length} slides · ~{Math.round(planned / 60)} min</span></h2>
                <span style={{ color: 'var(--mute)' }}>G / Esc close · ? shortcuts</span>
              </div>
              {sections.map(([name, list]) => (
                <div key={name} className="mb-6">
                  <div className="text-[13px] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--brand2)' }}>{name}</div>
                  <div className="flex flex-wrap gap-2">
                    {list.map(s => (
                      <button key={s.id} onClick={() => { setGrid(false); go(order.indexOf(s.id)) }} className="card px-4 py-2 text-[17px] text-left hover:brightness-125" style={s.id === cur ? { outline: '2px solid var(--brand2)' } : {}}>
                        <span style={{ color: 'var(--mute)' }}>{order.indexOf(s.id) + 1}</span> {s.title}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {hidden.length > 0 && (
                <div className="mb-6">
                  <div className="text-[13px] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--mute)' }}>Not in this agenda — open anyway</div>
                  <div className="flex flex-wrap gap-2">
                    {hidden.map(s => <button key={s.id} onClick={() => { setGrid(false); jump(s.id) }} className="card px-4 py-2 text-[16px] opacity-70 hover:opacity-100">{s.title}</button>)}
                  </div>
                </div>
              )}
            </div>
          )}

          {help && (
            <div className="absolute inset-0 z-[60] grid place-items-center" style={{ background: 'color-mix(in srgb, var(--bg) 92%, transparent)' }} onClick={() => setHelp(false)}>
              <div className="card p-10 text-[22px] leading-loose" style={{ background: 'var(--bg2)' }}>
                <div className="serif text-[38px] mb-3">Shortcuts</div>
                {[['← / → / click edges / clicker', 'Previous / next'], ['G', 'Slide grid (and hidden slides)'], ['N', 'Presenter notes'], ['D', 'Timer & pace (click it to restart)'], ['L', 'Pointer: laser → spotlight → off'], ['.', 'Black screen'], ['Backspace', 'Return from a module jump'], ['T', 'Light / dark'], ['F', 'Fullscreen'], ['E', 'Export PDF leave-behind'], ['C', 'Back to settings']].map(([k, v]) => (
                  <div key={k} className="flex gap-8"><b className="w-[360px]" style={{ color: 'var(--brand2)' }}>{k}</b><span>{v}</span></div>
                ))}
              </div>
            </div>
          )}
        </div>

        {pointer === 'laser' && <div className="fixed z-[100] pointer-events-none rounded-full" style={{ left: px - 14, top: py - 14, width: 28, height: 28, background: 'radial-gradient(circle, #fff 0 18%, #ff2d2d 30%, rgba(255,45,45,.35) 60%, transparent 72%)', boxShadow: '0 0 24px 6px rgba(255,45,45,.55)' }} />}
        {pointer === 'spot' && <div className="fixed inset-0 z-[100] pointer-events-none" style={{ background: `radial-gradient(circle 170px at ${px}px ${py}px, transparent 0, transparent 150px, rgba(0,0,0,.72) 230px)` }} />}
        {pointer !== 'off' && <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-[101] rounded-full px-4 py-1 text-[13px] pointer-events-none" style={{ background: 'var(--card)', color: 'var(--mute)', border: '1px solid var(--line)' }}>{pointer === 'laser' ? 'Laser pointer' : 'Spotlight'} · L to change</div>}
        {black && <div className="fixed inset-0 z-[200] bg-black" onClick={() => setBlack(false)} />}
      </div>
    </NavContext.Provider>
  )
}
