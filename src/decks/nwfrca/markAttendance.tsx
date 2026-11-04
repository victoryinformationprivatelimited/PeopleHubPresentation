import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Phone } from '../../ui/primitives'

/**
 * The employee app’s “Mark attendance” screen in a phone: a map, the allowed zone (radius) around the office and the
 * employee’s live location. Inside the zone the punch is recorded; outside it goes for approval. Tap the map to move.
 */
const W = 284, H = 236, OFFICE = { x: 142, y: 116 }, R = 78, ZONE_M = 150
const toMetres = (x: number, y: number) => Math.round((Math.hypot(x - OFFICE.x, y - OFFICE.y) * ZONE_M) / R)
const hhmm = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`

interface Punch { kind: 'In' | 'Out'; at: string; ok: boolean; m: number }

export function MarkAttendancePhone() {
  const [pos, setPos] = useState({ x: 236, y: 196 })
  const [punches, setPunches] = useState<Punch[]>([])
  const [now, setNow] = useState(() => new Date())
  const svgRef = useRef<SVGSVGElement>(null)
  const m = toMetres(pos.x, pos.y), inside = m <= ZONE_M
  const next: 'In' | 'Out' = punches.length % 2 === 0 ? 'In' : 'Out'

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t) }, [])
  // the employee walks from outside into the allowed zone, like arriving at the office
  useEffect(() => { const t = setTimeout(() => setPos({ x: 196, y: 86 }), 1200); return () => clearTimeout(t) }, [])

  const place = (e: React.MouseEvent<SVGSVGElement>) => {
    const r = svgRef.current!.getBoundingClientRect()
    setPos({ x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H })
  }
  const mark = () => setPunches(p => [...p, { kind: next, at: hhmm(new Date()), ok: inside, m }])
  const last = punches[punches.length - 1]

  return (
    <div className="flex items-center justify-center gap-12">
      <div className="w-[230px] flex flex-col gap-3 text-right">
        <div className="card px-4 py-3 text-[16px] leading-snug"><span className="inline-block w-3 h-3 rounded-full mr-2 align-middle" style={{ background: '#3b82f6', boxShadow: '0 0 0 4px rgba(59,130,246,.3)' }} /><b>Live location</b><div style={{ color: 'var(--mute)' }}>GPS position of the employee’s phone</div></div>
        <div className="text-[13px]" style={{ color: 'var(--mute)' }}>Tap the map to move the location and try a punch outside the zone.</div>
      </div>

      <Phone>
        <div className="flex items-center justify-between">
          <div className="text-[14px] font-bold">Mark attendance</div>
          <div className="text-[11px] rounded-full px-2 py-0.5" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>Head Office</div>
        </div>
        <div className="text-center mt-1.5"><div className="text-[34px] leading-none font-extrabold tabular-nums">{hhmm(now)}<span className="text-[15px] font-semibold" style={{ color: 'var(--mute)' }}>:{String(now.getSeconds()).padStart(2, '0')}</span></div>
          <div className="text-[11px]" style={{ color: 'var(--mute)' }}>{now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</div></div>

        <div className="rounded-2xl overflow-hidden mt-2.5" style={{ border: '1px solid var(--line)' }}>
          <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full block cursor-crosshair" style={{ background: '#122238' }} onClick={place}>
            {[...Array(9)].map((_, i) => <line key={'v' + i} x1={i * 36} y1="0" x2={i * 36} y2={H} stroke="rgba(255,255,255,.06)" />)}
            {[...Array(7)].map((_, i) => <line key={'h' + i} x1="0" y1={i * 40} x2={W} y2={i * 40} stroke="rgba(255,255,255,.06)" />)}
            <path d="M0 190 C70 170 110 215 170 190 S250 150 284 160" stroke="rgba(255,255,255,.14)" strokeWidth="9" fill="none" strokeLinecap="round" />
            <path d="M210 0 C200 60 215 110 250 236" stroke="rgba(255,255,255,.1)" strokeWidth="7" fill="none" strokeLinecap="round" />
            {/* allowed zone */}
            <motion.circle cx={OFFICE.x} cy={OFFICE.y} r={R} fill={inside ? 'rgba(52,211,153,.16)' : 'rgba(245,158,11,.12)'} stroke={inside ? '#34d399' : '#f59e0b'} strokeWidth="2.5" strokeDasharray="7 6" animate={{ strokeDashoffset: [0, -26] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }} />
            <motion.circle cx={OFFICE.x} cy={OFFICE.y} r={R} fill="none" stroke={inside ? '#34d399' : '#f59e0b'} strokeWidth="2" initial={{ scale: 0.6, opacity: 0.6 }} animate={{ scale: 1.25, opacity: 0 }} transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut' }} style={{ transformOrigin: `${OFFICE.x}px ${OFFICE.y}px` }} />
            <line x1={OFFICE.x} y1={OFFICE.y} x2={OFFICE.x + R} y2={OFFICE.y} stroke="rgba(255,255,255,.55)" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x={OFFICE.x + R / 2} y={OFFICE.y - 6} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">{ZONE_M} m</text>
            {/* office */}
            <circle cx={OFFICE.x} cy={OFFICE.y} r="9" fill="#3b6be0" stroke="#fff" strokeWidth="2.5" />
            <text x={OFFICE.x} y={OFFICE.y + 26} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#cbd5e1">Head Office</text>
            {/* employee */}
            <motion.circle r="16" fill="rgba(59,130,246,.28)" animate={{ cx: pos.x, cy: pos.y }} transition={{ type: 'spring', stiffness: 50, damping: 14 }} />
            <motion.circle r="7" fill="#3b82f6" stroke="#fff" strokeWidth="2.5" animate={{ cx: pos.x, cy: pos.y }} transition={{ type: 'spring', stiffness: 50, damping: 14 }} />
          </svg>
        </div>

        <div className="mt-2 rounded-xl px-3 py-2 text-[12px] font-semibold flex items-center gap-2" style={{ background: inside ? 'rgba(52,211,153,.14)' : 'rgba(245,158,11,.14)', border: `1px solid ${inside ? 'rgba(52,211,153,.5)' : 'rgba(245,158,11,.5)'}`, color: inside ? 'var(--ok)' : 'var(--warn)' }}>
          {inside ? `✓ Inside the allowed zone · ${m} m from Head Office` : `⚠ Outside the allowed zone · ${m} m away`}
        </div>

        <button onClick={mark} className="w-full mt-2.5 rounded-2xl py-3 font-bold text-white text-[15px] transition active:scale-95" style={{ background: inside ? 'linear-gradient(90deg,var(--brand),var(--accent))' : 'linear-gradient(90deg,#d97706,#f59e0b)' }}>
          {inside ? `Mark attendance · Clock ${next}` : 'Mark attendance · send for approval'}
        </button>

        <div className="mt-2 flex flex-col gap-1.5">
          {punches.slice(-2).map((p, i) => (
            <motion.div key={p.at + p.kind + i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card px-3 py-1.5 flex items-center justify-between text-[12px]">
              <span className="font-bold">{p.kind} · {p.at}</span>
              <span style={{ color: p.ok ? 'var(--ok)' : 'var(--warn)' }}>{p.ok ? '✓ Recorded · in zone' : '⏳ Sent for approval'}</span>
            </motion.div>
          ))}
          {!last && <div className="text-[11px] text-center" style={{ color: 'var(--mute)' }}>Your punch is stamped with the time and your location.</div>}
        </div>
      </Phone>

      <div className="w-[230px] flex flex-col gap-3">
        <div className="card px-4 py-3 text-[16px] leading-snug"><svg width="22" height="22" viewBox="0 0 22 22" className="inline-block mr-2 align-middle"><circle cx="11" cy="11" r="9" fill="rgba(52,211,153,.2)" stroke="#34d399" strokeWidth="2" strokeDasharray="4 3" /></svg><b>Allowed zone</b><div style={{ color: 'var(--mute)' }}>{ZONE_M} m radius around the office; set per location</div></div>
        <div className="card px-4 py-3 text-[16px] leading-snug"><b style={{ color: 'var(--warn)' }}>Outside the zone</b><div style={{ color: 'var(--mute)' }}>The punch is not lost: it is sent to the manager for approval</div></div>
      </div>
    </div>
  )
}
