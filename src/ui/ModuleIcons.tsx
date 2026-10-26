import type { ReactNode } from 'react'

/**
 * Custom-drawn line icons for every module (48×48 grid, drawn in white). Used by the wheel and the module panel —
 * the same family as the ten outcome icons (OutcomeIcons.tsx), so nothing depends on the viewer's emoji font.
 */
const W = '#fff'
export const MODULE_ICONS: Record<string, ReactNode> = {
  // ── Core HR
  'Organization': <><rect x="17" y="6" width="14" height="10" rx="2.5" /><path d="M24 16v8M9 24h30M9 24v6M24 24v6M39 24v6" /><rect x="3.5" y="30" width="11" height="9" rx="2.5" /><rect x="18.5" y="30" width="11" height="9" rx="2.5" /><rect x="33.5" y="30" width="11" height="9" rx="2.5" /></>,
  'Employee master 360': <><rect x="5" y="10" width="38" height="28" rx="5" /><circle cx="17" cy="22" r="4.5" /><path d="M10.5 33c1-3.6 3.6-5.2 6.5-5.2s5.5 1.6 6.5 5.2M28 20h9M28 27h9" /></>,
  'Life cycle': <><path d="M37 19a14 14 0 0 0-24.5-4.5M12.5 7v8h8" /><path d="M11 29a14 14 0 0 0 24.5 4.5M35.5 41v-8h-8" /></>,
  'Recruitment & onboarding': <><circle cx="21" cy="21" r="14" /><path d="M31 31l11 11" /><circle cx="21" cy="17.5" r="3.5" /><path d="M14.5 28c1-3.2 3.2-4.6 6.5-4.6s5.5 1.4 6.5 4.6" /></>,
  'Letter generator': <><path d="M12 6h17l9 9v27H12z" /><path d="M29 6v9h9M18 25h14M18 31h14M18 37h8" /></>,
  'Tasks & checklists': <><rect x="10" y="9" width="28" height="34" rx="4" /><rect x="18" y="5" width="12" height="8" rx="2.5" /><path d="M17 26l4.5 4.5L31 21M17 38h14" /></>,
  'Termination & exit': <><path d="M20 8h-8a2 2 0 0 0-2 2v28a2 2 0 0 0 2 2h8" /><path d="M28 16l9 8-9 8M37 24H17" /></>,
  // ── Workforce operations
  'Time & attendance': <><circle cx="24" cy="24" r="16.5" /><path d="M24 13v11l7.5 4.5" /></>,
  'Mobile app': <><rect x="13" y="5" width="22" height="38" rx="5.5" /><path d="M20 11h8M21 37h6" /><circle cx="24" cy="24" r="4" /></>,
  'Leave management': <><path d="M6 26C6 15 14 8 24 8s18 7 18 18z" /><path d="M24 26v11a4.5 4.5 0 0 1-9 0" /></>,
  'Meal management': <><path d="M13 6v11a4.5 4.5 0 0 0 9 0V6M17.5 6v36" /><path d="M34 42V6c-5 3-7 9-7 16h7" /></>,
  'Payroll': <><rect x="5" y="12" width="38" height="24" rx="5" /><circle cx="24" cy="24" r="6" /><circle cx="12.5" cy="24" r="1.5" fill={W} stroke="none" /><circle cx="35.5" cy="24" r="1.5" fill={W} stroke="none" /></>,
  'Staff loans & advances': <><ellipse cx="24" cy="13" rx="14" ry="6" /><path d="M10 13v11c0 3.3 6.3 6 14 6s14-2.7 14-6V13M10 24v11c0 3.3 6.3 6 14 6s14-2.7 14-6V24" /></>,
  'Benefits & claims': <><rect x="8" y="19" width="32" height="22" rx="3.5" /><rect x="5" y="12" width="38" height="7" rx="2.5" /><path d="M24 12v29M24 12c-6 0-9-7-4-7 4 0 4 7 4 7zM24 12c6 0 9-7 4-7-4 0-4 7-4 7z" /></>,
  'Salary banking': <><path d="M24 6L5 16h38z" /><path d="M11 21v15M20 21v15M28 21v15M37 21v15M5 41h38" /></>,
  // ── Talent
  'Performance': <><circle cx="22" cy="26" r="15" /><circle cx="22" cy="26" r="8" /><circle cx="22" cy="26" r="2" fill={W} stroke="none" /><path d="M22 26L40 8M33 8h7v7" /></>,
  'Learning & development': <><path d="M24 9L4 19l20 10 20-10z" /><path d="M12 24v10c0 3 5.4 6 12 6s12-3 12-6V24M44 19v12" /></>,
  'Succession planning': <><path d="M5 41h10V31h10V21h10V11h8v30H5z" /><path d="M13 18l8-8M15 10h6v6" /></>,
  'Engagement': <path d="M24 41S6 30 6 18a9 9 0 0 1 18-3 9 9 0 0 1 18 3c0 12-18 23-18 23z" />,
  // ── Employee experience
  'Self-service portal': <><rect x="6" y="6" width="36" height="36" rx="10" /><circle cx="24" cy="19" r="5.5" /><path d="M13.5 36c1.2-5.4 5.2-8 10.5-8s9.3 2.6 10.5 8" /></>,
  'Grievance reporting': <><path d="M8 20v8h8l16 9V11L16 20z" /><path d="M37 17a9 9 0 0 1 0 14M14 28l3 11h5l-2-11" /></>,
  'Service desk': <><path d="M9 28v-4a15 15 0 0 1 30 0v4" /><rect x="5.5" y="26" width="8" height="13" rx="3.5" /><rect x="34.5" y="26" width="8" height="13" rx="3.5" /><path d="M38.5 39c0 4-5 5-11 5" /></>,
  'Asset tracker': <><rect x="10" y="9" width="28" height="21" rx="3.5" /><path d="M3 36h42v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z" /></>,
  'Knowledge base': <path d="M24 12c-5-3-11-4-18-3v28c7-1 13 0 18 3 5-3 11-4 18-3V9c-7-1-13 0-18 3zM24 12v28" />,
  'Chat & AI assistant': <><path d="M10 14h20a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H20l-7 6v-6h-3a4 4 0 0 1-4-4V18a4 4 0 0 1 4-4z" /><path d="M37 4l1.8 5.2L44 11l-5.2 1.8L37 18l-1.8-5.2L30 11l5.2-1.8z" fill={W} stroke="none" /></>,
  'News broadcasting': <><rect x="6" y="10" width="32" height="28" rx="3.5" /><path d="M38 18h4v17a3 3 0 0 1-3 3M12 17h14M12 24h20M12 31h20" /></>,
  'Approvals': <><path d="M12 6h17l9 9v27H12z" /><path d="M29 6v9h9M17 30l5 5 9.5-11" /></>,
  'Notifications': <><path d="M24 6a12 12 0 0 0-12 12v8l-4 6h32l-4-6v-8A12 12 0 0 0 24 6z" /><path d="M19 38a5 5 0 0 0 10 0" /></>,
  // ── Intelligence & control
  'Analytics & reports': <><path d="M8 7v34h34" /><path d="M16 34V24M25 34V16M34 34V27" /></>,
  'Compliance & statutory': <><path d="M24 7v33M12 14h24M16 40h16" /><path d="M12 14l-6 14a6 6 0 0 0 12 0zM36 14l-6 14a6 6 0 0 0 12 0z" /></>,
  'Security & audit': <><rect x="9" y="21" width="30" height="21" rx="5" /><path d="M15 21v-6a9 9 0 0 1 18 0v6" /><circle cx="24" cy="31" r="2.6" fill={W} stroke="none" /></>,
  'Integrations & ERP': <><circle cx="11" cy="24" r="5" /><circle cx="37" cy="10" r="5" /><circle cx="37" cy="38" r="5" /><path d="M15.6 21.6L32.4 12.4M15.6 26.4L32.4 35.6" /></>,
}

/** The strokes only — drop inside an <svg viewBox="0 0 48 48"> (or a scaled <g>). */
export function ModuleIconBody({ name, stroke = 3 }: { name: string; stroke?: number }) {
  return <g fill="none" stroke={W} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">{MODULE_ICONS[name] ?? MODULE_ICONS['Organization']}</g>
}

/** A standalone gradient badge with the icon, for panels and headings. */
export function MIcon({ name, size = 64, color = '#3b6be0' }: { name: string; size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className="flex-none inline-block align-middle" role="img" aria-label={name}>
      <defs><radialGradient id="mi-shine" cx="30%" cy="22%" r="85%"><stop offset="0" stopColor="#fff" stopOpacity=".42" /><stop offset=".55" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".28" /></radialGradient></defs>
      <circle cx="24" cy="24" r="23" fill={color} />
      <circle cx="24" cy="24" r="23" fill="url(#mi-shine)" />
      <circle cx="24" cy="24" r="22.2" fill="none" stroke="#fff" strokeOpacity=".28" strokeWidth="1.2" />
      <g transform="translate(9 9) scale(.625)"><ModuleIconBody name={name} stroke={3.2} /></g>
    </svg>
  )
}
