import { useEffect, useMemo, useState } from 'react'
import { Deck } from './engine/Deck'
import { DeckContext } from './engine/context'
import { Launcher, loadConfig, saveConfig, type Config } from './engine/Launcher'
import { PrintView } from './engine/PrintView'
import { buildCtx } from './engine/buildCtx'
import { defaultAgenda, pickSlides } from './engine/agenda'
import { buildSlides } from './slides/slides'

type Mode = 'launcher' | 'show' | 'print'

/** Launcher screen first. Query params (?country=lk&industry=apparel&client=Name&agenda=30&print=1) skip it. */
function initial(): { cfg: Config; mode: Mode; auto: boolean } {
  const q = new URLSearchParams(location.search)
  const saved = loadConfig()
  const keys = ['country', 'industry', 'client', 'headcount', 'hrTeam', 'pains', 'agenda', 'print']
  if (!keys.some(k => q.has(k))) return { cfg: saved, mode: 'launcher', auto: true }
  const agendaParam = q.get('agenda')
  const cfg: Config = {
    ...saved,
    country: q.get('country') ?? saved.country,
    industry: q.get('industry') ?? saved.industry,
    client: q.get('client') ?? '',
    headcount: q.get('headcount') ? Number(q.get('headcount')) : saved.headcount,
    hrTeam: q.get('hrTeam') ? Number(q.get('hrTeam')) : saved.hrTeam,
    pains: q.has('pains') ? q.get('pains')!.split(',').filter(Boolean) : saved.pains,
    customPain: q.get('customPain') ?? saved.customPain,
    qrUrl: q.get('qr') ?? saved.qrUrl,
    agenda: agendaParam ? { ...defaultAgenda, mode: 'auto', minutes: Number(agendaParam) || 30 } : saved.agenda,
  }
  return { cfg, mode: q.has('print') ? 'print' : 'show', auto: q.get('auto') !== '0' }
}

export default function App() {
  const init = useMemo(initial, [])
  useEffect(() => {
    const warm = () => { void import('./ui/Hero3D'); void import('react-apexcharts'); void import('qrcode') }
    const t = setTimeout(warm, 1500)
    return () => clearTimeout(t)
  }, [])
  const [cfg, setCfg] = useState(init.cfg)
  const [mode, setMode] = useState<Mode>(init.mode)
  const allSlides = useMemo(() => buildSlides(), [])
  const ctx = useMemo(() => buildCtx(cfg, mode === 'print'), [cfg, mode])
  const visible = useMemo(() => pickSlides(allSlides, cfg.agenda ?? defaultAgenda, ctx), [allSlides, cfg.agenda, ctx])

  if (mode === 'launcher') {
    document.documentElement.dataset.theme = cfg.theme
    return <Launcher initial={cfg} slides={allSlides} onStart={c => { saveConfig(c); setCfg(c); setMode('show') }} onExport={c => { saveConfig(c); setCfg(c); setMode('print') }} />
  }
  if (mode === 'print') {
    document.documentElement.dataset.theme = cfg.theme
    return (
      <DeckContext.Provider value={ctx}>
        <PrintView slides={visible} ctx={ctx} auto={init.auto} onDone={() => setMode('show')} />
      </DeckContext.Provider>
    )
  }
  const agenda = cfg.agenda ?? defaultAgenda
  return (
    <DeckContext.Provider value={ctx}>
      <Deck
        key={`${cfg.country}-${cfg.industry}-${cfg.client}-${cfg.logo?.length ?? 0}-${cfg.headcount}-${cfg.hrTeam}-${cfg.pains?.join()}-${cfg.customPain}-${agenda.mode}-${agenda.minutes}-${agenda.ids.join()}-${cfg.qrUrl}`}
        slides={visible} allSlides={allSlides} ctx={ctx} theme={cfg.theme} showTimer={agenda.mode !== 'full'}
        onConfigure={() => { history.replaceState(null, '', location.pathname); setMode('launcher') }}
        onExport={() => setMode('print')}
      />
    </DeckContext.Provider>
  )
}
