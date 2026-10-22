import { lazy, Suspense, type ComponentProps } from 'react'
import type ReactApexChart from 'react-apexcharts'

// ApexCharts is only needed on two slides; load it on demand.
const Impl = lazy(() => import('react-apexcharts'))

export default function Chart(props: ComponentProps<typeof ReactApexChart>) {
  return <Suspense fallback={<div style={{ height: props.height }} />}><Impl {...props} /></Suspense>
}
