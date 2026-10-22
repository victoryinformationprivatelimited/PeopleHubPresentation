import type { ReactNode } from 'react'

/* Flat, theme-aware scenes — one per industry — so each deck looks like the client's world. */
const B = 'var(--brand)', B2 = 'var(--brand2)', AC = 'var(--accent)', OK = 'var(--ok)', WN = 'var(--warn)', LN = 'var(--line)', BG = 'var(--bg2)'
const soft = (c: string, p = 25) => `color-mix(in srgb, ${c} ${p}%, transparent)`

const Ground = () => <ellipse cx="400" cy="560" rx="330" ry="34" fill={soft(B, 22)} />
const Win = ({ x, y, w = 26, h = 34, c = AC }: { x: number; y: number; w?: number; h?: number; c?: string }) => <rect x={x} y={y} width={w} height={h} rx="4" fill={soft(c, 55)} />

const scenes: Record<string, () => ReactNode> = {
  generic: () => (
    <g>
      <circle cx="400" cy="300" r="190" fill="none" stroke={LN} strokeWidth="3" strokeDasharray="8 10" />
      {[...Array(10)].map((_, k) => {
        const a = (Math.PI * 2 * k) / 10 - Math.PI / 2, x = 400 + Math.cos(a) * 190, y = 300 + Math.sin(a) * 190
        return <g key={k}><line x1="400" y1="300" x2={x} y2={y} stroke={soft(AC, 35)} strokeWidth="2" /><circle cx={x} cy={y} r="26" fill={[B, AC, OK, WN, B2][k % 5]} /><circle cx={x} cy={y - 6} r="8" fill="#fff" fillOpacity=".85" /><path d={`M${x - 13} ${y + 14} q13 -14 26 0`} fill="#fff" fillOpacity=".85" /></g>
      })}
      <rect x="330" y="230" width="140" height="140" rx="34" fill={B} /><text x="400" y="318" textAnchor="middle" fontSize="64" fontWeight="800" fill="#fff">HR</text>
    </g>
  ),
  apparel: () => (
    <g>
      <Ground />
      {[0, 1, 2, 3].map(k => <polygon key={k} points={`${130 + k * 135},300 ${130 + k * 135},230 ${265 + k * 135},300`} fill={soft(B, 70)} />)}
      <rect x="130" y="300" width="540" height="230" fill={soft(B, 35)} stroke={B2} strokeWidth="3" />
      <rect x="610" y="150" width="34" height="150" fill={soft(B, 60)} /><circle cx="628" cy="130" r="20" fill={soft(LN, 60)} /><circle cx="650" cy="98" r="26" fill={soft(LN, 40)} />
      {[0, 1, 2, 3, 4, 5, 6].map(k => <Win key={k} x={155 + k * 74} y={330} />)}
      <rect x="360" y="440" width="80" height="90" fill={soft(AC, 45)} stroke={AC} strokeWidth="3" />
      {/* sewing machine */}
      <g transform="translate(120 400)"><rect x="0" y="96" width="200" height="22" rx="6" fill={WN} /><path d="M10 96 V30 q0 -26 40 -26 H180 V50 H110 V96 Z" fill={B} /><rect x="150" y="50" width="12" height="46" fill={B2} /><circle cx="60" cy="40" r="16" fill={AC} /></g>
      {/* garment */}
      <path d="M520 360 l50 -20 q20 14 40 0 l50 20 -22 52 -22 -10 v118 h-76 v-118 l-22 10 Z" fill={OK} fillOpacity=".85" stroke="#fff" strokeOpacity=".5" strokeWidth="2" />
      <path d="M470 560 q40 -60 100 -20" fill="none" stroke={WN} strokeWidth="3" strokeDasharray="6 8" />
    </g>
  ),
  retail: () => (
    <g>
      <Ground />
      <rect x="120" y="260" width="460" height="270" fill={soft(B, 30)} stroke={B2} strokeWidth="3" />
      {[...Array(8)].map((_, k) => <path key={k} d={`M${120 + k * 57.5} 200 h57.5 l-8 60 h-41.5 Z`} fill={k % 2 ? '#fff' : WN} fillOpacity={k % 2 ? 0.85 : 0.95} />)}
      <rect x="120" y="190" width="460" height="14" fill={B2} />
      <rect x="150" y="300" width="230" height="150" rx="6" fill={soft(AC, 30)} stroke={AC} strokeWidth="3" />
      <rect x="410" y="330" width="130" height="200" rx="6" fill={soft(B, 60)} /><circle cx="425" cy="440" r="6" fill="#fff" />
      <g transform="translate(180 340)"><circle cx="30" cy="20" r="14" fill="#fff" fillOpacity=".8" /><rect x="10" y="38" width="40" height="70" rx="12" fill={OK} /></g>
      <g transform="translate(270 360)"><rect x="0" y="30" width="70" height="60" rx="6" fill={WN} /><path d="M18 30 q17 -34 34 0" fill="none" stroke="#fff" strokeWidth="5" /></g>
      <g transform="translate(600 360)"><rect x="0" y="40" width="120" height="150" rx="10" fill={B} /><path d="M30 40 q30 -60 60 0" fill="none" stroke={B2} strokeWidth="8" /><circle cx="60" cy="110" r="22" fill="#fff" fillOpacity=".9" /><text x="60" y="118" textAnchor="middle" fontSize="24" fontWeight="800" fill={B}>%</text></g>
    </g>
  ),
  bpo: () => (
    <g>
      <Ground />
      <rect x="170" y="130" width="460" height="300" rx="20" fill={BG} stroke={B2} strokeWidth="5" /><rect x="190" y="150" width="420" height="260" rx="10" fill={soft(B, 25)} />
      {[[210, 175, 170, AC], [230, 205, 220, B2], [230, 235, 130, WN], [250, 265, 190, OK], [210, 295, 150, AC], [230, 325, 240, B2], [210, 355, 110, WN]].map(([x, y, w, c], k) => <rect key={k} x={x as number} y={y as number} width={w as number} height="12" rx="6" fill={c as string} fillOpacity=".85" />)}
      <rect x="360" y="430" width="80" height="40" fill={B2} /><rect x="300" y="470" width="200" height="16" rx="8" fill={B} />
      <text x="525" y="260" fontSize="90" fontWeight="800" fill={AC} fillOpacity=".9">{'</>'}</text>
      <path d="M110 360 q0 -90 90 -90" fill="none" stroke={OK} strokeWidth="10" strokeLinecap="round" /><rect x="96" y="350" width="28" height="60" rx="12" fill={OK} />
      <g><rect x="620" y="110" width="150" height="56" rx="18" fill={B} /><path d="M650 166 l-10 22 28 -22" fill={B} /><circle cx="660" cy="138" r="6" fill="#fff" /><circle cx="690" cy="138" r="6" fill="#fff" /><circle cx="720" cy="138" r="6" fill="#fff" /></g>
      <g transform="translate(640 330)">{[0, 1, 2].map(k => <g key={k}><rect x="0" y={k * 46} width="120" height="38" rx="8" fill={soft(B2, 60)} /><circle cx="18" cy={k * 46 + 19} r="5" fill={OK} /></g>)}</g>
    </g>
  ),
  healthcare: () => (
    <g>
      <Ground />
      <rect x="170" y="170" width="460" height="360" rx="10" fill={soft(B, 30)} stroke={B2} strokeWidth="3" />
      <rect x="330" y="80" width="140" height="140" rx="22" fill="#fff" fillOpacity=".95" /><rect x="378" y="100" width="44" height="100" rx="6" fill="#e11d48" /><rect x="350" y="128" width="100" height="44" rx="6" fill="#e11d48" />
      {[0, 1, 2, 3].map(r => [0, 1, 2, 3, 4].map(c => <Win key={`${r}${c}`} x={200 + c * 84} y={250 + r * 62} w={44} h={36} />))}
      <rect x="360" y="440" width="80" height="90" fill={soft(OK, 50)} stroke={OK} strokeWidth="3" />
      <polyline points="60,590 200,590 230,560 260,620 300,520 340,610 370,590 740,590" fill="none" stroke={OK} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
      <g transform="translate(640 120)"><path d="M0 20 q40 -30 80 0 v50 q0 40 -40 60 q-40 -20 -40 -60 Z" fill={B} /><path d="M24 62 l12 14 24 -28" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" /></g>
    </g>
  ),
  education: () => (
    <g>
      <Ground />
      <polygon points="150,250 400,130 650,250" fill={soft(B, 60)} /><rect x="150" y="250" width="500" height="22" fill={B2} />
      {[0, 1, 2, 3, 4].map(k => <rect key={k} x={185 + k * 96} y={272} width="44" height="220" fill={soft('#fff', 70)} />)}
      <rect x="130" y="492" width="540" height="22" fill={B2} /><rect x="110" y="514" width="580" height="22" fill={B} />
      <circle cx="400" cy="210" r="26" fill={WN} />
      <g transform="translate(560 60)"><polygon points="0,40 90,0 180,40 90,80" fill="#111827" /><path d="M40 62 v40 q50 30 100 0 v-40" fill="#1f2937" /><line x1="170" y1="42" x2="170" y2="100" stroke={WN} strokeWidth="5" /><circle cx="170" cy="106" r="8" fill={WN} /></g>
      <g transform="translate(60 440)">{[[0, B2], [14, OK], [28, WN]].map(([y, c], k) => <rect key={k} x={k * 6} y={-(y as number) * 1} width={120 - k * 10} height="26" rx="4" fill={c as string} transform={`translate(0 ${60 - k * 28})`} />)}</g>
    </g>
  ),
  finance: () => (
    <g>
      <Ground />
      <polygon points="120,230 360,110 600,230" fill={soft(B, 60)} /><rect x="120" y="230" width="480" height="20" fill={B2} />
      {[0, 1, 2, 3, 4].map(k => <rect key={k} x={150 + k * 90} y={250} width="40" height="210" fill={soft('#fff', 70)} />)}
      <rect x="100" y="460" width="520" height="22" fill={B2} /><rect x="80" y="482" width="560" height="22" fill={B} /><rect x="60" y="504" width="600" height="26" fill={soft(B, 70)} />
      <circle cx="360" cy="190" r="22" fill={WN} /><text x="360" y="200" textAnchor="middle" fontSize="28" fontWeight="800" fill="#7c4a03">$</text>
      {[0, 1, 2, 3].map(k => <ellipse key={k} cx="690" cy={520 - k * 22} rx="60" ry="14" fill={WN} stroke="#b45309" strokeWidth="2" />)}
      <g transform="translate(640 120)">{[40, 70, 100, 140].map((h, k) => <rect key={k} x={k * 34} y={180 - h} width="24" height={h} rx="4" fill={[AC, B2, OK, OK][k]} />)}<polyline points="0,150 40,110 80,120 130,40" fill="none" stroke={WN} strokeWidth="5" strokeLinecap="round" /><polygon points="124,28 150,34 134,56" fill={WN} /></g>
    </g>
  ),
  construction: () => (
    <g>
      <Ground />
      <rect x="150" y="120" width="14" height="410" fill={WN} />{[...Array(10)].map((_, k) => <g key={k}><line x1="150" x2="164" y1={140 + k * 40} y2={120 + k * 40} stroke="#b45309" strokeWidth="3" /><line x1="164" x2="150" y1={140 + k * 40} y2={120 + k * 40} stroke="#b45309" strokeWidth="3" /></g>)}
      <rect x="60" y="120" width="430" height="16" fill={WN} /><polygon points="157,70 130,120 184,120" fill={WN} /><line x1="157" y1="70" x2="470" y2="120" stroke="#b45309" strokeWidth="3" /><rect x="90" y="136" width="60" height="40" fill={soft('#fff', 60)} />
      <line x1="450" y1="136" x2="450" y2="260" stroke="#fff" strokeOpacity=".7" strokeWidth="3" /><path d="M434 260 h32 l-8 22 h-16 Z" fill={AC} />
      {[0, 1, 2, 3].map(k => <g key={k}><rect x="360" y={230 + k * 75} width="300" height="8" fill={B2} /><rect x="360" y={238 + k * 75} width="8" height="67" fill={B2} /><rect x="652" y={238 + k * 75} width="8" height="67" fill={B2} />{k < 3 && <line x1="360" y1={238 + k * 75} x2="660" y2={313 + k * 75} stroke={soft(B2, 50)} strokeWidth="3" />}</g>)}
      <rect x="360" y="530" width="300" height="8" fill={B2} />
      <g transform="translate(640 80)"><path d="M0 60 q0 -50 50 -50 q50 0 50 50 Z" fill={WN} /><rect x="-8" y="60" width="116" height="14" rx="7" fill="#b45309" /><rect x="42" y="12" width="16" height="48" fill="#b45309" /></g>
    </g>
  ),
  logistics: () => (
    <g>
      <Ground />
      <path d="M60 470 q180 -230 360 -90 t300 -200" fill="none" stroke={AC} strokeWidth="4" strokeDasharray="4 12" strokeLinecap="round" />
      <g transform="translate(700 130)"><path d="M0 40 q0 -40 22 -40 q22 0 22 40 q0 26 -22 56 q-22 -30 -22 -56 Z" fill={B2} /><circle cx="22" cy="38" r="9" fill="#fff" /></g>
      <rect x="90" y="300" width="360" height="190" rx="10" fill={soft(B, 60)} stroke={B2} strokeWidth="3" /><text x="270" y="415" textAnchor="middle" fontSize="54" fontWeight="800" fill="#fff" fillOpacity=".9">PH</text>
      <path d="M450 350 h90 l60 70 v70 h-150 Z" fill={B} /><path d="M470 365 h60 l38 45 h-98 Z" fill={soft(AC, 70)} />
      {[170, 380, 540].map(x => <g key={x}><circle cx={x} cy="500" r="36" fill="#111827" /><circle cx={x} cy="500" r="15" fill={LN} /></g>)}
      {[[610, 450, 70, 70, WN], [680, 460, 60, 60, OK], [630, 380, 60, 70, AC]].map(([x, y, w, h, c], k) => <g key={k}><rect x={x as number} y={(y as number) + 30} width={w as number} height={h as number} fill={c as string} fillOpacity=".9" /><line x1={(x as number) + (w as number) / 2} x2={(x as number) + (w as number) / 2} y1={(y as number) + 30} y2={(y as number) + 30 + (h as number)} stroke="#fff" strokeOpacity=".5" strokeWidth="3" /></g>)}
    </g>
  ),
  hospitality: () => (
    <g>
      <circle cx="610" cy="150" r="70" fill={WN} fillOpacity=".9" />
      <path d="M0 470 q100 -40 200 0 t200 0 t200 0 t200 0 V600 H0 Z" fill={soft(AC, 45)} />
      <path d="M0 520 q100 -40 200 0 t200 0 t200 0 t200 0 V600 H0 Z" fill={soft(B, 45)} />
      <rect x="170" y="250" width="390" height="230" rx="8" fill={soft('#fff', 85)} />{[0, 1, 2].map(r => [0, 1, 2, 3].map(c => <g key={`${r}${c}`}><Win x={195 + c * 92} y={275 + r * 66} w={52} h={40} c={AC} /><rect x={190 + c * 92} y={318 + r * 66} width="62" height="6" fill={B2} /></g>))}
      <rect x="170" y="240" width="390" height="14" fill={B2} />
      <g transform="translate(600 210)"><path d="M40 290 q-10 -120 30 -200" fill="none" stroke="#8b5a2b" strokeWidth="14" strokeLinecap="round" />{[[-70, -10], [-50, -60], [20, -70], [60, -20], [70, 30]].map(([x, y], k) => <path key={k} d={`M70 90 q${(x as number) / 2 + 30} ${(y as number) - 40} ${(x as number) + 70} ${(y as number) + 90}`} fill="none" stroke={OK} strokeWidth="16" strokeLinecap="round" />)}</g>
      <g transform="translate(80 400)"><path d="M0 70 q60 -60 120 0 Z" fill={WN} /><rect x="-10" y="70" width="140" height="12" rx="6" fill="#b45309" /><circle cx="60" cy="8" r="8" fill="#b45309" /></g>
    </g>
  ),
  plantation: () => (
    <g>
      <circle cx="620" cy="120" r="60" fill={WN} fillOpacity=".9" />
      <path d="M0 400 q150 -170 330 -90 t470 -50 V600 H0 Z" fill={soft(OK, 40)} />
      <path d="M0 470 q200 -150 400 -40 t400 -40 V600 H0 Z" fill={soft(OK, 65)} />
      {[0, 1, 2, 3, 4, 5].map(k => <path key={k} d={`M${40 + k * 8} ${560 - k * 26} q330 -${140 + k * 6} 720 -${70 + k * 14}`} fill="none" stroke={OK} strokeWidth={14 - k} strokeLinecap="round" strokeOpacity=".9" strokeDasharray="1 14" />)}
      <g transform="translate(540 300) rotate(-18)"><path d="M0 120 q-70 -70 0 -130 q70 60 0 130 Z" fill={OK} /><line x1="0" y1="120" x2="0" y2="-5" stroke="#064e3b" strokeWidth="4" /><path d="M0 70 l30 -26 M0 40 l-30 -22 M0 95 l-26 -20" stroke="#064e3b" strokeWidth="3" /></g>
      <g transform="translate(150 230)"><path d="M0 120 q-70 -70 0 -130 q70 60 0 130 Z" fill={AC} fillOpacity=".8" /><line x1="0" y1="120" x2="0" y2="-5" stroke="#0e7490" strokeWidth="4" /></g>
    </g>
  ),
}

export function IndustryArt({ id, className = '' }: { id: string; className?: string }) {
  const Scene = scenes[id] ?? scenes.generic
  const fade = id === 'hospitality' || id === 'plantation'   // full-width landscapes: soften the side edges
  return (
    <svg viewBox="0 0 800 620" className={className} role="img" aria-label="Industry illustration">
      <defs>
        <linearGradient id="art-fade-g" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".14" stopColor="#fff" /><stop offset=".86" stopColor="#fff" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
        <mask id="art-fade"><rect width="800" height="620" fill="url(#art-fade-g)" /></mask>
      </defs>
      <g mask={fade ? 'url(#art-fade)' : undefined}><Scene /></g>
    </svg>
  )
}
