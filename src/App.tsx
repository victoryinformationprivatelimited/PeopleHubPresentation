import { useMemo, useState } from 'react'
import { Deck } from './engine/Deck'
import { DeckContext } from './engine/context'
import { Launcher, loadConfig, saveConfig, type Config } from './engine/Launcher'
import { countries } from './profiles/countries'
import { industries } from './profiles/industries'
import { buildSlides } from './slides/slides'

/** Launcher screen first. Query params (?country=lk&industry=apparel&client=Name) skip it. */
function initial(): { cfg: Config; started: boolean } {
  const q = new URLSearchParams(location.search)
  const saved = loadConfig()
  if (q.has('country') || q.has('industry') || q.has('client')) {
    return { cfg: { ...saved, country: q.get('country') ?? saved.country, industry: q.get('industry') ?? saved.industry, client: q.get('client') ?? '' }, started: true }
  }
  return { cfg: saved, started: false }
}

export default function App() {
  const init = useMemo(initial, [])
  const [cfg, setCfg] = useState(init.cfg)
  const [started, setStarted] = useState(init.started)
  const slides = useMemo(() => buildSlides(), [])

  const ctx = useMemo(() => ({
    country: countries[cfg.country] ?? countries.lk,
    industry: industries[cfg.industry] ?? industries.generic,
    client: cfg.client,
    company: cfg.client.trim() || 'Your Company',
    logo: cfg.logo,
  }), [cfg])

  if (!started) {
    document.documentElement.dataset.theme = cfg.theme
    return <Launcher initial={cfg} onStart={c => { saveConfig(c); setCfg(c); setStarted(true) }} />
  }
  return (
    <DeckContext.Provider value={ctx}>
      <Deck key={`${cfg.country}-${cfg.industry}-${cfg.client}-${cfg.logo?.length ?? 0}`} slides={slides} ctx={ctx} theme={cfg.theme} onConfigure={() => { history.replaceState(null, '', location.pathname); setStarted(false) }} />
    </DeckContext.Provider>
  )
}
