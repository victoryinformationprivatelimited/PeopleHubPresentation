import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useDeck } from '../engine/context'

/**
 * Plays a demo screen by itself when its slide opens: a cursor glides over the screen and clicks / types like a presenter would,
 * then repeats a second scenario. Anything the audience or presenter does with the mouse stops it at once (so manual clicking
 * always works) and a pill lets the presenter replay it. The demos themselves know nothing about this — the player finds their
 * buttons, tabs, cards and inputs in the DOM and drives them with ordinary click events.
 */

interface Play {
  first?: string[]             // a written story: texts to click in order ("=12" exact text, "@btn" main button, "css:sel|n" nth match, "wait:ms", "type:text")
  steps?: number               // then this many clicks of a general tour of the screen (default 6)
}
interface Opts {
  cap?: number                 // most clicks inside one group of siblings, e.g. a row of tabs (default 2)
  type?: string                // text to type into the first text box on the general tour
  plays?: Play[]               // scenarios to play one after another, each on a fresh screen (default two general tours)
}

/** Per-screen stories, keyed by module id or workshop moment key. Everything not listed gets the general tour. */
const OPTS: Record<string, Opts> = {
  attendance: { cap: 3, plays: [{ first: ['Approve', 'Approve'], steps: 3 }, { first: ['Work pattern rules'], steps: 4 }] },
  payroll: { plays: [{ first: ['@btn', '@btn', '@btn', '@btn', 'css:button.grid|0', 'css:button.grid|2'], steps: 0 }] },
  leave: { plays: [{ first: ['Casual', '=28', '=30', 'Submit request', 'wait:7000'], steps: 0 }, { first: ['Entitlements & policy', 'Medical', 'Casual'], steps: 0 }] },
  recruitment: { plays: [{ first: ['css:[draggable="true"]|0', '@btn', '@btn', '@btn'], steps: 0 }, { first: ['css:[draggable="true"]|3', '@btn', '@btn'], steps: 0 }] },
  tasks: { type: 'Prepare onboarding pack' },
  termination: { cap: 5, plays: [{ steps: 8 }] },
  term: { cap: 5, plays: [{ steps: 8 }] },
  security: { cap: 6, plays: [{ steps: 8 }] },
  grievance: { cap: 5, plays: [{ steps: 6 }] },
  chat: { type: 'Holiday this month' },
  kb: { type: 'leave', plays: [{ first: ['Acknowledge'], steps: 3 }, { steps: 3 }] },
  training: { plays: [{ first: ['=5', 'Enrol me', '=12', 'Enrol me', '=17', 'Enrol me'], steps: 0 }] },
  succession: { plays: [{ first: ['css:button.card > div > span|0', 'High performer', 'css:button.card > div > span|1', 'Star'], steps: 0 }, { first: ['css:button.card > div > span|3', 'Future leader'], steps: 0 }] },
  assets: { cap: 3 },
  benefits: { cap: 3 },
  notifications: { cap: 3 },
}

const NEVER = /reset|restart|cancel|play again|new request|new claim|close|clear|remove|delete|logout|sign out|✕|×/i
const SIZE = 30

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

function visible(el: Element) {
  const r = el.getBoundingClientRect()
  if (r.width < 6 || r.height < 6) return false
  if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) return false
  const cs = getComputedStyle(el)
  return cs.visibility !== 'hidden' && cs.display !== 'none' && parseFloat(cs.opacity) > 0.2
}

/** Everything a person could click or type into inside the screen. */
function targets(root: HTMLElement) {
  const out: HTMLElement[] = []
  root.querySelectorAll<HTMLElement>('button, [role="button"], input[type="text"], input:not([type]), input[type="search"], svg, div, span, li, tr, td').forEach(el => {
    const tag = el.tagName
    if (tag === 'BUTTON' || el.getAttribute('role') === 'button') { if (!(el as HTMLButtonElement).disabled) out.push(el); return }
    if (tag === 'INPUT') { out.push(el); return }
    const c = getComputedStyle(el).cursor
    if ((c === 'pointer' || c === 'crosshair') && !el.closest('button, [role="button"]') && !(el.parentElement && getComputedStyle(el.parentElement).cursor === c)) out.push(el)
  })
  return out.filter(visible)
}

const label = (el: HTMLElement) => (el.textContent ?? '').replace(/\s+/g, ' ').trim()
const keyOf = (el: HTMLElement) => `${label(el).slice(0, 28)}|${el.tagName}|${el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0}`
const groupOf = (el: HTMLElement) => (el.parentElement?.parentElement && el.parentElement.children.length === 1 ? el.parentElement.parentElement : el.parentElement) as HTMLElement

function setValue(el: HTMLInputElement, v: string) {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(el, v)
  el.dispatchEvent(new Event('input', { bubbles: true }))
}

const isTab = (el: HTMLElement) => el.tagName === 'BUTTON' && /\bpx-4\b/.test(el.className) && /\bpy-1\.5\b/.test(el.className) && /\brounded-lg\b/.test(el.className)
const isMain = (el: HTMLElement) => el.tagName === 'BUTTON' && /\brounded-xl\b/.test(el.className) && /\bfont-bold\b/.test(el.className) && !/back|◀|↺|again/i.test(label(el))

/** Finds the thing a written step points at: text, "=exact text", "@btn", "css:selector|n". */
function resolve(root: HTMLElement, spec: string): HTMLElement | null {
  if (spec.startsWith('css:')) {
    const [sel, n] = spec.slice(4).split('|')
    return [...root.querySelectorAll<HTMLElement>(sel)].filter(e => visible(e) && !(e as HTMLButtonElement).disabled)[Number(n ?? 0)] ?? null
  }
  const all = targets(root).filter(e => e.tagName !== 'INPUT')
  if (spec === '@btn') return all.find(isMain) ?? null
  if (spec.startsWith('=')) return all.find(e => label(e) === spec.slice(1)) ?? null
  return all.find(e => label(e).toLowerCase().includes(spec.toLowerCase())) ?? null
}

export function AutoPlay({ id, children }: { id: string; children: ReactNode }) {
  const { print } = useDeck()
  const opts: Opts = OPTS[id] ?? {}
  const plays: Play[] = opts.plays ?? [{}, {}]
  const cap = opts.cap ?? 2
  const rootRef = useRef<HTMLDivElement>(null)
  const [run, setRun] = useState(0)                                  // changing it remounts the screen (fresh state)
  const [sc, setSc] = useState(0)                                    // which scenario is playing
  const [mode, setMode] = useState<'play' | 'stopped' | 'done'>(print ? 'stopped' : 'play')
  const [cur, setCur] = useState<{ x: number; y: number; down: boolean; show: boolean }>({ x: 0, y: 0, down: false, show: false })
  const token = useRef(0)

  const stop = useCallback(() => { token.current++; setMode(m => (m === 'play' ? 'stopped' : m)); setCur(c => ({ ...c, show: false })) }, [])
  const replay = () => { token.current++; setSc(0); setRun(r => r + 1); setMode('play') }

  useEffect(() => {
    if (mode !== 'play' || print) return
    const my = ++token.current
    const live = () => token.current === my
    const play = plays[sc] ?? {}
    const clicked = new Set<string>()
    const perGroup = new Map<HTMLElement, number>()
    let typed = false

    const moveTo = async (el: HTMLElement) => {
      const r = el.getBoundingClientRect()
      setCur(() => ({ x: r.left + Math.min(r.width * 0.6, r.width - 8), y: r.top + r.height * 0.55, down: false, show: true }))
      await sleep(850)
    }
    const press = async (el: HTMLElement) => {
      setCur(c => ({ ...c, down: true })); await sleep(160)
      if (!live()) return
      const r = el.getBoundingClientRect()
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, clientX: r.left + r.width * 0.6, clientY: r.top + r.height * 0.55 }))
      setCur(c => ({ ...c, down: false }))
    }
    const typeInto = async (el: HTMLElement, text: string) => {
      const input = el as HTMLInputElement
      input.focus({ preventScroll: true })
      for (let i = 1; i <= text.length; i++) { if (!live()) return; setValue(input, text.slice(0, i)); await sleep(55) }
      await sleep(250)
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    }

    // the next fresh item in reading order: ordinary controls first, then main buttons (submit / run), tabs last
    const pick = (reverse: boolean): HTMLElement | null => {
      const root = rootRef.current; if (!root) return null
      const fresh = targets(root).filter(e => {
        if (clicked.has(keyOf(e))) return false
        if (e.tagName === 'INPUT') return !typed && !!opts.type && !(e as HTMLInputElement).value
        if (NEVER.test(label(e))) return false
        return (perGroup.get(groupOf(e)) ?? 0) < cap
      })
      const rank = (e: HTMLElement) => (isTab(e) ? 2 : isMain(e) ? 1 : 0)
      const best = Math.min(...fresh.map(rank))
      const pool = fresh.filter(e => rank(e) === best)
      if (!pool.length) return null
      if (!reverse) return pool[0]
      const g = groupOf(pool[0]); const same = pool.filter(e => groupOf(e) === g)
      return same[same.length - 1]
    }
    const act = async (el: HTMLElement) => {
      clicked.add(keyOf(el)); perGroup.set(groupOf(el), (perGroup.get(groupOf(el)) ?? 0) + 1)
      await moveTo(el); if (!live()) return
      if (el.tagName === 'INPUT') { typed = true; await typeInto(el, opts.type!) } else await press(el)
      await sleep(1500)
    }

    ;(async () => {
      await sleep(sc === 0 ? 1800 : 900)
      for (const spec of play.first ?? []) {
        if (!live()) return
        if (spec.startsWith('wait:')) { await sleep(Number(spec.slice(5))); continue }
        let el: HTMLElement | null = null
        for (let t = 0; t < 8 && !el && live(); t++) { el = rootRef.current && resolve(rootRef.current, spec); if (!el) await sleep(450) }
        if (el && live()) await act(el)
      }
      const steps = play.steps ?? 6
      for (let n = 0; n < steps && live(); n++) {
        let el: HTMLElement | null = null
        for (let t = 0; t < 4 && !el && live(); t++) { el = pick(sc % 2 === 1); if (!el) await sleep(500) }
        if (!el || !live()) break
        await act(el)
      }
      if (!live()) return
      setCur(c => ({ ...c, show: false }))
      if (sc + 1 < plays.length) { await sleep(2200); if (!live()) return; setSc(s => s + 1); setRun(r => r + 1) } else setMode('done')
    })()
    return () => { token.current++ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, run, sc, id, print])

  if (print) return <>{children}</>
  return (
    <div ref={rootRef} className="relative" onPointerDownCapture={e => { if (e.isTrusted) stop() }} onKeyDownCapture={e => { if (e.isTrusted) stop() }}>
      <div key={run}>{children}</div>
      <button onClick={mode === 'play' ? stop : replay} className="absolute right-0 flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-bold tracking-wide z-20"
        style={{ top: -30, background: 'var(--bg2)', border: '1px solid var(--line)', color: mode === 'play' ? 'var(--brand2)' : 'var(--mute)' }}>
        {mode === 'play' ? <><span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--bad)' }} />Live demo · click to take over</> : <>▶ Replay demo</>}
      </button>
      {cur.show && createPortal(
        <div style={{ position: 'fixed', left: 0, top: 0, zIndex: 9999, pointerEvents: 'none', transform: `translate(${cur.x}px, ${cur.y}px)`, transition: 'transform 800ms cubic-bezier(.45,.05,.2,1)' }}>
          <div style={{ position: 'absolute', left: -SIZE, top: -SIZE, width: SIZE * 2, height: SIZE * 2, borderRadius: '50%', border: '3px solid var(--brand2, #3b6be0)', opacity: cur.down ? 0.9 : 0, transform: `scale(${cur.down ? 1 : 0.2})`, transition: 'all 260ms ease-out' }} />
          <svg width="34" height="34" viewBox="0 0 24 24" style={{ position: 'absolute', left: -4, top: -3, transform: `scale(${cur.down ? 0.85 : 1})`, transition: 'transform 120ms', filter: 'drop-shadow(0 3px 5px rgba(0,0,0,.45))' }}>
            <path d="M5 3l14 8-6 2-3 6z" fill="#fff" stroke="#0b1220" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        </div>, document.body)}
    </div>
  )
}
