import { lazy, Suspense } from 'react'

// three.js is large; load it after the first paint so the page appears immediately.
const Hero3DImpl = lazy(() => import('./Hero3D').then(m => ({ default: m.Hero3D })))

export function Hero3D({ className = '' }: { className?: string }) {
  return <Suspense fallback={null}><Hero3DImpl className={className} /></Suspense>
}
