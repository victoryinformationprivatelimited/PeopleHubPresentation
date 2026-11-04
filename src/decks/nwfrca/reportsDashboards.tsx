import { useState } from 'react'
import { AnalyticsDemo } from '../../slides/demosB'
import { ReportBuilderDemo } from '../workshop/demosP4'

/** Reports and dashboards: the live KPI dashboard and the report builder on one screen, switched by two tabs. */
export function ReportsDashboardsDemo() {
  const [tab, setTab] = useState(0)
  const tabs = ['Dashboard', 'Report builder']
  return (
    <div>
      <div className="flex gap-2 mb-3">
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} className="px-5 py-2 rounded-xl text-[16px] font-bold transition-colors" style={i === tab ? { background: 'var(--brand)', color: '#fff' } : { background: 'var(--card)', border: '1px solid var(--line)', color: 'var(--mute)' }}>{t}</button>
        ))}
      </div>
      {tab === 0 ? <AnalyticsDemo /> : <ReportBuilderDemo />}
    </div>
  )
}
