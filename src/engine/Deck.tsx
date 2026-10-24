import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { NavContext, type DeckCtx, type SlideDef } from './context'
import { fmtTime, totalSecs } from './agenda'

const W = 1920
const H = 1080
const BAR = 60            // height of the touch control bar on phones/tablets

interface Props {
  slides: SlideDef[]        // slides to present, in order (agenda applied)
  allSlides: SlideDef[]     // every slide (so hidden ones can still be opened ad hoc)
  ctx: DeckCtx
  theme?: 'dark' | 'light'
  showTimer?: boolean
  clientView?: boolean      // shared with the client's team: no presenter tools
  onConfigure?: () => void
  onExport?: () => void
}

type Pointer = 'off' | 'laser' | 'spot'
const ZOOM_LABELS = ['Fit', 'Read', 'Large']

export function Deck({ slides, allSlides, ctx, theme: initialTheme = 'dark', showTimer: timerDefault = false, clientView = false, onConfigure, onExport }: Props) {
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
  const [mobile, setMobile] = useState(false)       // touch device or narrow window
  const [zoomIdx, setZoomIdx] = useState(0)         // mobile only: 0 = fit, 1 = read, 2 = large
  const [theme, setTheme] = useState<'dark' | 'light'>(initialTheme)
  const [pointer, setPointer] = useState<Pointer>('off')
  const [timer, setTimer] = useState(timerDefault)
  const [now, setNow] = useState(Date.now())
  const startRef = useRef(Date.now())
  const mouse = useRef({ x: -999, y: -999 })
  const [mouseTick, setMouseTick] = useState(0)
  const scroller = useRef<HTMLDivElement>(null)
  const touch = useRef({ x: 0, y: 0, atLeft: true, atRight: true })
  const autoZoomed = useRef(false)
  const [hint, setHint] = useState(false)       // one-time “turn your phone” tip

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

  const goTo = useCallback((id: string) => {
    if (!byId.has(id)) return
    setReturnTo(null); setDir(1)
    if (order.includes(id)) { setCur(id); return }
    const ids = allSlides.map(s => s.id)
    const next = ids.slice(ids.indexOf(id)).find(x => order.includes(x))
    setCur(next ?? order[order.length - 1])
  }, [byId, order, allSlides])

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
    const fit = () => {
      const w = innerWidth, h = window.visualViewport?.height ?? innerHeight
      const m = matchMedia('(pointer: coarse)').matches || w < 900
      setMobile(m)
      setScale(Math.min(w / W, (m ? h - BAR : h) / H))
      // a phone held upright can't show a 16:9 slide legibly: start in "Read" zoom (once)
      if (m && h > w && !autoZoomed.current) { autoZoomed.current = true; setZoomIdx(1); setHint(true) }
    }
    fit()
    addEventListener('resize', fit); addEventListener('orientationchange', fit)
    window.visualViewport?.addEventListener('resize', fit)
    return () => { removeEventListener('resize', fit); removeEventListener('orientationchange', fit); window.visualViewport?.removeEventListener('resize', fit) }
  }, [])

  useEffect(() => { if (!hint) return; const t = setTimeout(() => setHint(false), 9000); return () => clearTimeout(t) }, [hint])

  // effective stage scale: on phones the zoom levels trade a little panning for readable text
  const s = !mobile || zoomIdx === 0 ? scale : zoomIdx === 1 ? Math.max(scale * 1.5, 0.5) : Math.max(scale * 2.4, 0.8)
  useEffect(() => { scroller.current?.scrollTo({ left: 0, top: 0 }) }, [cur, zoomIdx, mobile])

  // pointer tracking (laser / spotlight)
  useEffect(() => {
    if (pointer === 'off') return
    let raf = 0
    const move = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; cancelAnimationFrame(raf); raf = requestAnimationFrame(() => setMouseTick(t => t + 1)) }
    addEventListener('mousemove', move)
    return () => { removeEventListener('mousemove', move); cancelAnimationFrame(raf) }
  }, [pointer])

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen?.()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return
      const k = e.key
      if (clientView && ['n', 'c', 'e', 'd'].includes(k.toLowerCase())) return
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
      else if (k === 'f' || k === 'F') toggleFullscreen()
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [go, next, prev, grid, order.length, onConfigure, onExport, black, clientView, toggleFullscreen])

  const sections = useMemo(() => {
    const m = new Map<string, SlideDef[]>()
    slides.forEach(sl => m.set(sl.section, [...(m.get(sl.section) ?? []), sl]))
    return [...m.entries()]
  }, [slides])
  const hidden = useMemo(() => allSlides.filter(sl => !order.includes(sl.id)), [allSlides, order])

  // timer / pace
  const planned = totalSecs(slides)
  const elapsed = (now - startRef.current) / 1000
  const doneSecs = idx > 0 ? totalSecs(slides.slice(0, idx)) : 0
  const pace = idx >= 0 ? elapsed - doneSecs : 0
  const paceLabel = Math.abs(pace) < 20 ? 'on pace' : pace > 0 ? `${fmtTime(pace)} behind` : `${fmtTime(-pace)} ahead`
  const paceColor = Math.abs(pace) < 20 ? 'var(--ok)' : pace > 0 ? 'var(--bad)' : 'var(--accent)'

  const px = mouse.current.x, py = mouse.current.y
  void mouseTick

  // swipe to navigate: at "Fit" anywhere; when zoomed, from the edge of the slide
  const onTouchStart = (e: React.TouchEvent) => {
    const el = scroller.current, t = e.touches[0]
    touch.current = { x: t.clientX, y: t.clientY, atLeft: !el || el.scrollLeft <= 2, atRight: !el || el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const t = e.changedTouches[0], dx = t.clientX - touch.current.x, dy = t.clientY - touch.current.y
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return
    if (dx < 0 && touch.current.atRight) next()
    else if (dx > 0 && touch.current.atLeft) prev()
  }

  const gridPanel = grid && (
    <div className={mobile ? 'fixed inset-0 z-[70] p-4 overflow-auto' : 'absolute inset-0 z-50 p-14 overflow-auto'} style={{ background: 'color-mix(in srgb, var(--bg) 97%, transparent)' }}>
      <div className={`flex items-end justify-between ${mobile ? 'mb-4' : 'mb-8'}`}>
        <h2 className={`serif ${mobile ? 'text-2xl' : 'text-5xl'}`}>Jump to slide <span className={mobile ? 'text-[14px] block' : 'text-[22px]'} style={{ color: 'var(--mute)' }}>{order.length} slides · ~{Math.round(planned / 60)} min</span></h2>
        {mobile ? <button onClick={() => setGrid(false)} className="rounded-xl px-4 py-2 font-bold" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>Close</button> : <span style={{ color: 'var(--mute)' }}>G / Esc close · ? shortcuts</span>}
      </div>
      {sections.map(([name, list]) => (
        <div key={name} className={mobile ? 'mb-4' : 'mb-6'}>
          <div className="text-[13px] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--brand2)' }}>{name}</div>
          <div className="flex flex-wrap gap-2">
            {list.map(sl => (
              <button key={sl.id} onClick={() => { setGrid(false); go(order.indexOf(sl.id)) }} className={`card px-4 text-left hover:brightness-125 ${mobile ? 'py-2.5 text-[15px]' : 'py-2 text-[17px]'}`} style={sl.id === cur ? { outline: '2px solid var(--brand2)' } : {}}>
                <span style={{ color: 'var(--mute)' }}>{order.indexOf(sl.id) + 1}</span> {sl.title}
              </button>
            ))}
          </div>
        </div>
      ))}
      {hidden.length > 0 && (
        <div className="mb-6">
          <div className="text-[13px] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--mute)' }}>Not in this agenda — open anyway</div>
          <div className="flex flex-wrap gap-2">
            {hidden.map(sl => <button key={sl.id} onClick={() => { setGrid(false); jump(sl.id) }} className={`card px-4 opacity-70 hover:opacity-100 ${mobile ? 'py-2.5 text-[14px]' : 'py-2 text-[16px]'}`}>{sl.title}</button>)}
          </div>
        </div>
      )}
    </div>
  )

  const helpPanel = help && !mobile && (
    <div className="absolute inset-0 z-[60] grid place-items-center" style={{ background: 'color-mix(in srgb, var(--bg) 92%, transparent)' }} onClick={() => setHelp(false)}>
      <div className="card p-10 text-[22px] leading-loose" style={{ background: 'var(--bg2)' }}>
        <div className="serif text-[38px] mb-3">Shortcuts</div>
        {[['← / → / click edges / clicker', 'Previous / next'], ['G', 'Slide grid (and hidden slides)'], ['N', 'Presenter notes'], ['D', 'Timer & pace (click it to restart)'], ['L', 'Pointer: laser → spotlight → off'], ['.', 'Black screen'], ['Backspace', 'Return from a module jump'], ['T', 'Light / dark'], ['F', 'Fullscreen'], ['E', 'Export PDF leave-behind'], ['C', 'Back to settings']].filter(([k]) => !clientView || !['N', 'D', 'E', 'C'].includes(k)).map(([k, v]) => (
          <div key={k} className="flex gap-8"><b className="w-[360px]" style={{ color: 'var(--brand2)' }}>{k}</b><span>{v}</span></div>
        ))}
      </div>
    </div>
  )

  const stage = (
    <div style={{ width: W, height: H, transform: `scale(${s})`, transformOrigin: mobile ? 'top left' : undefined, flex: 'none' }} className="relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 20% 0%, color-mix(in srgb, var(--brand) 22%, transparent), transparent 55%), radial-gradient(ellipse at 90% 100%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 50%), var(--bg)' }} />
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="bg-blob b1" /><div className="bg-blob b2" />
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

      {returnTo && !mobile && (
        <button onClick={back} className="absolute top-6 left-1/2 -translate-x-1/2 z-40 rounded-full px-6 py-3 text-[20px] font-bold text-white shadow-xl" style={{ background: 'linear-gradient(90deg, var(--brand), var(--accent))' }}>
          ↩ Back to {byId.get(returnTo)?.title ?? 'overview'}
        </button>
      )}

      {/* footer chrome */}
      <div className="absolute bottom-0 left-0 right-0 h-14 px-14 flex items-center justify-between text-[15px] pointer-events-none" style={{ color: 'var(--mute)' }}>
        <span className="tracking-[0.18em] uppercase text-[12px]">PeopleHub HRIS · {slide.section}</span>
        {timer && !clientView && (
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

      {/* click zones (desktop) — phones use the control bar and swipe */}
      {!mobile && <button aria-label="Previous" className="absolute left-0 top-24 bottom-24 w-24 opacity-0" onClick={prev} />}
      {!mobile && <button aria-label="Next" className="absolute right-0 top-24 bottom-24 w-24 opacity-0" onClick={next} />}

      {clientView && slide.id !== 'open' && ctx.client && (
        <div className="absolute top-6 left-14 z-30 rounded-full px-4 py-1.5 text-[15px] font-semibold" style={{ background: 'var(--card)', border: '1px solid var(--line)', color: 'var(--mute)' }}>Prepared for {ctx.client}{ctx.presenter.isPartner ? ` by ${ctx.presenter.company}` : ''}</div>
      )}

      {notes && !clientView && (
        <div className="absolute left-14 right-14 bottom-16 card p-6 text-[20px] leading-snug z-40" style={{ background: 'var(--bg2)' }}>
          <div className="text-[12px] tracking-widest uppercase mb-2" style={{ color: 'var(--brand2)' }}>Presenter notes · {slide.title} · ~{Math.round(slide.secs)}s</div>
          {slide.notes}
        </div>
      )}

      {!mobile && gridPanel}
      {helpPanel}
    </div>
  )

  const barBtn = 'rounded-xl min-w-[48px] h-[44px] px-3 text-[18px] font-bold grid place-items-center active:brightness-125'
  const barStyle = { background: 'var(--card)', border: '1px solid var(--line)', color: 'var(--ink)' }

  return (
    <NavContext.Provider value={{ jump, goTo, has: (id: string) => byId.has(id) }}>
      <div className={mobile ? 'fixed inset-0 flex flex-col' : 'fixed inset-0 flex items-center justify-center overflow-hidden'} style={{ background: 'var(--bg)', cursor: pointer === 'off' ? undefined : 'none' }}>
        {mobile ? (
          <div ref={scroller} className="flex-1 min-h-0 overflow-auto" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <div className="min-h-full flex">
              <div style={{ width: W * s, height: H * s, margin: 'auto', flex: 'none' }}>{stage}</div>
            </div>
          </div>
        ) : stage}

        {mobile && (
          <div className="flex-none flex items-center justify-between gap-2 px-3" style={{ height: BAR + 0, paddingBottom: 'env(safe-area-inset-bottom)', background: 'var(--bg2)', borderTop: '1px solid var(--line)' }}>
            <button aria-label="Previous slide" onClick={prev} className={barBtn} style={barStyle}>◀</button>
            <button aria-label="All slides" onClick={() => setGrid(true)} className={barBtn} style={barStyle}>☰</button>
            {returnTo
              ? <button onClick={back} className={`${barBtn} text-[14px]`} style={{ background: 'linear-gradient(90deg, var(--brand), var(--accent))', color: '#fff', border: 'none' }}>↩ Back</button>
              : <span className="text-[14px] font-semibold tabular-nums" style={{ color: 'var(--mute)' }}>{idx >= 0 ? `${idx + 1} / ${order.length}` : 'extra'}</span>}
            <button aria-label="Zoom" onClick={() => setZoomIdx(z => (z + 1) % 3)} className={`${barBtn} text-[13px] whitespace-nowrap`} style={barStyle}>🔍 {ZOOM_LABELS[zoomIdx]}</button>
            {typeof document !== 'undefined' && document.fullscreenEnabled && <button aria-label="Fullscreen" onClick={toggleFullscreen} className={barBtn} style={barStyle}>⛶</button>}
            <button aria-label="Next slide" onClick={next} className={barBtn} style={barStyle}>▶</button>
          </div>
        )}

        {mobile && gridPanel}

        {mobile && hint && (
          <button onClick={() => setHint(false)} className="fixed left-3 right-3 z-[80] rounded-2xl px-4 py-3 text-left text-[14px] leading-snug shadow-xl" style={{ bottom: BAR + 10, background: 'var(--bg2)', border: '1px solid var(--brand2)', color: 'var(--ink)' }}>
            <b>Tip:</b> turn your phone sideways to see the whole slide. Swipe to pan, tap ◀ ▶ to change slides, 🔍 to zoom, ☰ for the slide list. <span style={{ color: 'var(--mute)' }}>(tap to dismiss)</span>
          </button>
        )}

        {pointer === 'laser' && <div className="fixed z-[100] pointer-events-none rounded-full" style={{ left: px - 14, top: py - 14, width: 28, height: 28, background: 'radial-gradient(circle, #fff 0 18%, #ff2d2d 30%, rgba(255,45,45,.35) 60%, transparent 72%)', boxShadow: '0 0 24px 6px rgba(255,45,45,.55)' }} />}
        {pointer === 'spot' && <div className="fixed inset-0 z-[100] pointer-events-none" style={{ background: `radial-gradient(circle 170px at ${px}px ${py}px, transparent 0, transparent 150px, rgba(0,0,0,.72) 230px)` }} />}
        {pointer !== 'off' && <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-[101] rounded-full px-4 py-1 text-[13px] pointer-events-none" style={{ background: 'var(--card)', color: 'var(--mute)', border: '1px solid var(--line)' }}>{pointer === 'laser' ? 'Laser pointer' : 'Spotlight'} · L to change</div>}
        {black && <div className="fixed inset-0 z-[200] bg-black" onClick={() => setBlack(false)} />}
      </div>
    </NavContext.Provider>
  )
}
