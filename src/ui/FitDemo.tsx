import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Scales a demo screen (designed ~860px wide) up to fill the space it is given — as large as fits, so the
 * text stays readable from the back of the room — and re-fits when the demo's content changes height.
 */
export function FitDemo({ children, natural = 860, maxScale = 1.6, maxHeight = 900 }: { children: ReactNode; natural?: number; maxScale?: number; maxHeight?: number }) {
  const outer = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState({ s: 1.2, h: 0 })
  useLayoutEffect(() => {
    const calc = () => {
      if (!outer.current || !inner.current) return
      const w = outer.current.clientWidth, h = inner.current.offsetHeight
      if (!w || !h) return
      setFit({ s: Math.max(0.8, Math.min(maxScale, w / natural, maxHeight / h)), h })
    }
    calc()
    const ro = new ResizeObserver(calc)
    if (outer.current) ro.observe(outer.current)
    if (inner.current) ro.observe(inner.current)
    return () => ro.disconnect()
  }, [natural, maxScale, maxHeight])
  return (
    <div ref={outer} className="w-full flex justify-center">
      <div style={{ width: natural * fit.s, height: fit.h ? fit.h * fit.s : undefined }}>
        <div ref={inner} style={{ width: natural, transform: `scale(${fit.s})`, transformOrigin: 'top left' }}>{children}</div>
      </div>
    </div>
  )
}
