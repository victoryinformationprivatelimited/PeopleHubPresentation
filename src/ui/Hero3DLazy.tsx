import { lazy, Suspense } from 'react'

// three.js is large; load it after the first paint so the page appears immediately.
const Hero3DImpl = lazy(() => import('./Hero3D').then(m => ({ default: m.Hero3D })))

export function Hero3D({ className = '' }: { className?: string }) {
  if (typeof window !== 'undefined' && (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 900)) return null   // saves battery and load time on phones
  return <Suspense fallback={null}><Hero3DImpl className={className} /></Suspense>
}
