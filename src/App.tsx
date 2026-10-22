import { useMemo, useState } from 'react'
import { Deck } from './engine/Deck'
import { DeckContext } from './engine/context'
import { Launcher, loadConfig, saveConfig, type Config } from './engine/Launcher'
import { countries } from './profiles/countries'
import { industries } from './profiles/industries'
import { buildSlides } from './slides/slides'
import { defaultPains, resolvePains } from './profiles/pains'

/** Launcher screen first. Query params (?country=lk&industry=apparel&client=Name) skip it. */
function initial(): { cfg: Config; started: boolean } {
  const q = new URLSearchParams(location.search)
  const saved = loadConfig()
  if (['country', 'industry', 'client', 'headcount', 'hrTeam', 'pains'].some(k => q.has(k))) {
    return { cfg: { ...saved, country: q.get('country') ?? saved.country, industry: q.get('industry') ?? saved.industry, client: q.get('client') ?? '', headcount: q.get('headcount') ? Number(q.get('headcount')) : saved.headcount, hrTeam: q.get('hrTeam') ? Number(q.get('hrTeam')) : saved.hrTeam, pains: q.has('pains') ? q.get('pains')!.split(',').filter(Boolean) : saved.pains, customPain: q.get('customPain') ?? saved.customPain }, started: true }
  }
  return { cfg: saved, started: false }
}

export default function App() {
  const init = useMemo(initial, [])
  const [cfg, setCfg] = useState(init.cfg)
  const [started, setStarted] = useState(init.started)
  const slides = useMemo(() => buildSlides(), [])

  const ctx = useMemo(() => {
    const industry = industries[cfg.industry] ?? industries.generic
    const pains = resolvePains(cfg.pains, cfg.customPain)
    return {
      country: countries[cfg.country] ?? countries.lk,
      industry,
      client: cfg.client,
      company: cfg.client.trim() || 'Your Company',
      logo: cfg.logo,
      headcount: cfg.headcount,
      hrTeam: cfg.hrTeam,
      pains,
      focusPains: pains.length ? pains : defaultPains(industry),
    }
  }, [cfg])

  if (!started) {
    document.documentElement.dataset.theme = cfg.theme
    return <Launcher initial={cfg} onStart={c => { saveConfig(c); setCfg(c); setStarted(true) }} />
  }
  return (
    <DeckContext.Provider value={ctx}>
      <Deck key={`${cfg.country}-${cfg.industry}-${cfg.client}-${cfg.logo?.length ?? 0}-${cfg.headcount}-${cfg.hrTeam}-${cfg.pains?.join()}-${cfg.customPain}`} slides={slides} ctx={ctx} theme={cfg.theme} onConfigure={() => { history.replaceState(null, '', location.pathname); setStarted(false) }} />
    </DeckContext.Provider>
  )
}
