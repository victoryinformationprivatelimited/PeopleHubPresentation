/** Tiny illustrations for the presentation chooser cards. */
export function DeckThumb({ id }: { id: string }) {
  if (id === 'workshop') {
    // ten outcome tiles, some lit — "the client picks what matters"
    const lit = [0, 3, 4, 7]
    return (
      <svg viewBox="0 0 120 84" className="w-full h-full">
        {[...Array(10)].map((_, k) => {
          const x = 8 + (k % 5) * 21, y = 12 + Math.floor(k / 5) * 26, on = lit.includes(k)
          return <rect key={k} x={x} y={y} width="17" height="20" rx="4" fill={on ? 'var(--brand2)' : 'var(--line)'} fillOpacity={on ? 0.95 : 0.7} />
        })}
        <path d="M30 68 l5 -9 l5 9 l7 -12 l7 12 l8 -6" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="96" cy="64" r="7" fill="var(--ok)" /><path d="M92.5 64 l2.5 2.8 l5 -5.6" fill="none" stroke="#06281c" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
  // tour: a grid of module tiles
  return (
    <svg viewBox="0 0 120 84" className="w-full h-full">
      {[...Array(15)].map((_, k) => {
        const x = 8 + (k % 5) * 21, y = 10 + Math.floor(k / 5) * 22
        return <rect key={k} x={x} y={y} width="17" height="17" rx="4" fill={['var(--brand)', 'var(--accent)', '#a78bfa', 'var(--ok)', 'var(--warn)'][k % 5]} fillOpacity=".75" />
      })}
      <rect x="8" y="74" width="104" height="3" rx="1.5" fill="var(--line)" /><rect x="8" y="74" width="48" height="3" rx="1.5" fill="var(--brand2)" />
    </svg>
  )
}
