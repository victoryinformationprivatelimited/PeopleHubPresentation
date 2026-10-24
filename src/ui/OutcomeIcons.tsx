import type { ReactNode } from 'react'

/**
 * A consistent, custom-drawn icon set for the ten outcomes (replaces the emoji, which render differently on every device).
 * Drawn on a 48×48 grid: white line icons on a coloured badge.
 */
const W = '#fff'
const ICONS: Record<string, ReactNode> = {
  // Know every person — an employee profile card
  know: <>
    <rect x="10" y="8" width="28" height="32" rx="5" />
    <circle cx="24" cy="21" r="5.5" />
    <path d="M15.5 34c1.2-4.6 4.6-6.8 8.5-6.8s7.3 2.2 8.5 6.8" />
  </>,
  // Hire & onboard — a person joining (+)
  hire: <>
    <circle cx="20" cy="16.5" r="6.5" />
    <path d="M8 39c0-8 5-12.5 12-12.5 3 0 5.5.8 7.6 2.3" />
    <path d="M35 25v13M28.5 31.5h13" />
  </>,
  // Time you can trust — a clock
  time: <>
    <circle cx="24" cy="24" r="15.5" />
    <path d="M24 14.5V24l6.5 4.5" />
    <path d="M24 5.5v3M24 39.5v3M5.5 24h3M39.5 24h3" />
  </>,
  // Leave without the chase — a calendar with a tick
  leave: <>
    <rect x="8" y="11" width="32" height="29" rx="5" />
    <path d="M8 20h32M16 7v7M32 7v7" />
    <path d="M17 30.5l5 5 9.5-10.5" />
  </>,
  // Pay people right — a banknote
  pay: <>
    <rect x="6" y="13" width="36" height="22" rx="5" />
    <circle cx="24" cy="24" r="5.5" />
    <circle cx="12.5" cy="24" r="1.4" fill={W} stroke="none" />
    <circle cx="35.5" cy="24" r="1.4" fill={W} stroke="none" />
  </>,
  // Approve faster — an approval tick
  approve: <>
    <circle cx="24" cy="24" r="16" />
    <path d="M16 24.5l6.3 6.3 10.2-12.3" />
  </>,
  // Grow and keep your people — growth bars with a rising arrow
  grow: <>
    <rect x="9.5" y="28" width="7" height="11" rx="1.6" />
    <rect x="20.5" y="21" width="7" height="18" rx="1.6" />
    <rect x="31.5" y="13" width="7" height="26" rx="1.6" />
    <path d="M9 18l9-7 6 4 12-9M30 6h6.5v6.5" />
  </>,
  // Serve every employee — a conversation
  serve: <>
    <path d="M12 9h24a5 5 0 015 5v13a5 5 0 01-5 5H23l-8 7v-7h-3a5 5 0 01-5-5V14a5 5 0 015-5z" />
    <circle cx="17.5" cy="20.5" r="1.5" fill={W} stroke="none" />
    <circle cx="24" cy="20.5" r="1.5" fill={W} stroke="none" />
    <circle cx="30.5" cy="20.5" r="1.5" fill={W} stroke="none" />
  </>,
  // Decide with data — a trend over axes
  data: <>
    <path d="M9 8v31h31" />
    <path d="M14.5 30l7-8.5 6 5 10.5-13" />
    <circle cx="38" cy="13.5" r="1.8" fill={W} stroke="none" />
    <path d="M16 38v-3.5M25 38v-6M34 38v-9" />
  </>,
  // Secure, scalable, yours — a shield with a tick
  secure: <>
    <path d="M24 6l14 5v12.5c0 8.5-5.8 14.6-14 18.5-8.2-3.900-14-10-14-18.500V11z" />
    <path d="M17.500 24l5 5 9-10" />
  </>,
}

/** The 48-grid artwork (badge + icon). Use inside an <svg viewBox="0 0 48 48">. */
export function OIconBody({ id, color }: { id: string; color: string }) {
  return (
    <>
      <circle cx="24" cy="24" r="23" fill={color} />
      <circle cx="24" cy="24" r="23" fill="url(#oi-shine)" />
      <circle cx="24" cy="24" r="22.2" fill="none" stroke="#fff" strokeOpacity=".28" strokeWidth="1.2" />
      <g transform="translate(9 9) scale(.625)" fill="none" stroke={W} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">{ICONS[id] ?? ICONS.know}</g>
    </>
  )
}

/** Gradient used by every icon badge — render once per svg that uses OIconBody. */
export const OIconDefs = () => (
  <defs>
    <radialGradient id="oi-shine" cx="30%" cy="22%" r="85%"><stop offset="0" stopColor="#fff" stopOpacity=".42" /><stop offset=".55" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".28" /></radialGradient>
  </defs>
)

export function OIcon({ id, size = 40, color = '#3b6be0' }: { id: string; size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className="flex-none inline-block align-middle" role="img" aria-label={id}>
      <OIconDefs />
      <OIconBody id={id} color={color} />
    </svg>
  )
}
