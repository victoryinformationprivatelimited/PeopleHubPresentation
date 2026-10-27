import { useEffect, useMemo, useState } from 'react'
import { Deck } from './engine/Deck'
import { DeckContext, SessionContext, type Lead } from './engine/context'
import { Launcher, emptyConfig, loadConfig, saveConfig, type Config } from './engine/Launcher'
import { PrintView } from './engine/PrintView'
import { Guide } from './engine/Guide'
import { buildCtx } from './engine/buildCtx'
import { agendaFor, defaultAgenda, pickSlides } from './engine/agenda'
import { arrangeFor, getDeck, getDeckSlides, resolveDeckId } from './decks/registry'
import { PAIN_OUTCOME, defaultOutcomes } from './decks/workshop/data'

type Mode = 'launcher' | 'show' | 'print' | 'guide'

/** Launcher screen first. Query params (?country=lk&industry=apparel&client=Name&agenda=30&print=1) skip it. */
function initial(): { cfg: Config; mode: Mode; auto: boolean; clientView: boolean; outcomes?: string[]; roles?: string[] } {
  const q = new URLSearchParams(location.search)
  const clientView = q.get('view') === 'client'
  // The client view must never pick up the presenter's saved settings.
  const saved = clientView ? emptyConfig : loadConfig()
  if (q.has('guide')) return { cfg: saved, mode: 'guide', auto: true, clientView: false }
  const keys = ['country', 'industry', 'client', 'headcount', 'hrTeam', 'pains', 'agenda', 'slides', 'print', 'view', 'pco', 'deck', 'nav']
  if (!keys.some(k => q.has(k))) return { cfg: saved, mode: 'launcher', auto: true, clientView: false }
  const agendaParam = q.get('agenda')
  const deck = resolveDeckId(q.get('deck') ?? saved.deck)
  const urlAgenda = q.get('slides') ? { ...defaultAgenda, mode: 'manual' as const, ids: q.get('slides')!.split(',').filter(Boolean) } : agendaParam ? { ...defaultAgenda, mode: 'auto' as const, minutes: Number(agendaParam) || 30 } : undefined
  const cfg: Config = {
    ...saved,
    deck,
    nav: q.get('nav') ?? saved.nav,
    agendas: urlAgenda ? { ...(saved.agendas ?? {}), [deck]: urlAgenda } : saved.agendas,
    country: q.get('country') ?? saved.country,
    industry: q.get('industry') ?? saved.industry,
    client: q.get('client') ?? '',
    headcount: q.get('headcount') ? Number(q.get('headcount')) : saved.headcount,
    hrTeam: q.get('hrTeam') ? Number(q.get('hrTeam')) : saved.hrTeam,
    pains: q.has('pains') ? q.get('pains')!.split(',').filter(Boolean) : saved.pains,
    customPain: q.get('customPain') ?? saved.customPain,
    qrUrl: q.get('qr') ?? saved.qrUrl,
    logo: q.get('logo') ?? saved.logo,
    presenter: q.has('pco') || q.has('pname') ? { company: q.get('pco') ?? '', name: q.get('pname') ?? '', title: q.get('ptitle') ?? '', email: q.get('pemail') ?? '', phone: q.get('pphone') ?? '', web: q.get('pweb') ?? '' } : saved.presenter,
    theme: q.get('theme') === 'light' ? 'light' : q.get('theme') === 'dark' ? 'dark' : saved.theme,
  }
  const list = (k: string) => (q.has(k) ? q.get(k)!.split(',').filter(Boolean) : undefined)
  return { cfg, mode: q.has('print') ? 'print' : 'show', auto: q.get('auto') !== '0', clientView, outcomes: list('outcomes'), roles: list('roles') }
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
  const deckId = resolveDeckId(cfg.deck)
  const allSlides = useMemo(() => getDeckSlides(deckId), [deckId])
  // Live choices from the Outcome Workshop (discovery wall, roles in the room, details left). Kept in memory only.
  const signature = `${deckId}|${cfg.client}|${cfg.industry}|${(cfg.pains ?? []).join()}|${cfg.customPain ?? ''}`
  const [session, setSession] = useState(() => ({ sig: signature, outcomes: init.outcomes ?? defaultOutcomes(buildCtx(cfg)), roles: init.roles ?? [] as string[], pains: cfg.pains ?? [] as string[], customPain: cfg.customPain ?? '', lead: {} as Lead }))
  const sessionApi = useMemo(() => ({
    outcomes: session.outcomes,
    roles: session.roles,
    lead: session.lead,
    toggleOutcome: (id: string) => setSession(s => ({ ...s, outcomes: s.outcomes.includes(id) ? s.outcomes.filter(x => x !== id) : [...s.outcomes, id] })),
    toggleRole: (id: string) => setSession(s => {
      const roles = s.roles.includes(id) ? s.roles.filter(x => x !== id) : [...s.roles, id]
      return { ...s, roles }
    }),
    pains: session.pains,
    customPain: session.customPain,
    togglePain: (id: string) => setSession(s => {
      const on = s.pains.includes(id)
      const add = (PAIN_OUTCOME[id] ?? []).filter(o => !s.outcomes.includes(o))   // choosing a pain also puts its outcomes on the wall
      return { ...s, pains: on ? s.pains.filter(x => x !== id) : [...s.pains, id], outcomes: on ? s.outcomes : [...s.outcomes, ...add] }
    }),
    setCustomPain: (t: string) => setSession(s => ({ ...s, customPain: t })),
    setLead: (p: Partial<Lead>) => setSession(s => ({ ...s, lead: { ...s.lead, ...p } })),
  }), [session])
  const ctx = useMemo(() => buildCtx(cfg, mode === 'print', session), [cfg, mode, session])
  const agenda = agendaFor(cfg, deckId)
  const arranged = useMemo(() => arrangeFor(deckId, allSlides, session.outcomes, cfg.nav), [deckId, allSlides, session.outcomes, cfg.nav])
  const visible = useMemo(() => pickSlides(arranged, agenda, { ...ctx, outcomes: session.outcomes }), [arranged, agenda, ctx, session.outcomes])

  // starting a different client / deck / set of pains begins a fresh workshop; re-entering the same one keeps the wall
  const begin = (c: Config) => {
    const sig = `${resolveDeckId(c.deck)}|${c.client}|${c.industry}|${(c.pains ?? []).join()}|${c.customPain ?? ''}`
    if (sig !== session.sig) setSession({ sig, outcomes: defaultOutcomes(buildCtx(c)), roles: [], pains: c.pains ?? [], customPain: c.customPain ?? '', lead: {} })
  }

  if (mode === 'launcher') {
    document.documentElement.dataset.theme = cfg.theme
    return <Launcher initial={cfg} onStart={c => { begin(c); saveConfig(c); setCfg(c); setMode('show') }} onExport={c => { begin(c); saveConfig(c); setCfg(c); setMode('print') }} onGuide={() => setMode('guide')} />
  }
  if (mode === 'guide') return <Guide onClose={() => { history.replaceState(null, '', location.pathname); setMode('launcher') }} />
  if (mode === 'print') {
    document.documentElement.dataset.theme = cfg.theme
    return (
      <SessionContext.Provider value={sessionApi}><DeckContext.Provider value={ctx}>
        <PrintView slides={visible} ctx={ctx} auto={init.auto} onDone={() => setMode('show')} />
      </DeckContext.Provider></SessionContext.Provider>
    )
  }
  // “Home” = the navigation screen this presentation was set up with (falls back to the first slide)
  const navSlides = (getDeck(deckId).navs ?? []).filter(n => (cfg.nav ?? getDeck(deckId).defaultNav) === 'all' || n.id === (cfg.nav ?? getDeck(deckId).defaultNav)).map(n => n.slideId)
  const homeId = visible.find(sl => navSlides.includes(sl.id))?.id ?? visible.find(sl => sl.id === getDeck(deckId).home)?.id ?? visible[0]?.id
  return (
    <SessionContext.Provider value={sessionApi}><DeckContext.Provider value={ctx}>
      <Deck
        key={`${deckId}-${cfg.country}-${cfg.industry}-${cfg.client}-${cfg.logo?.length ?? 0}-${cfg.headcount}-${cfg.hrTeam}-${cfg.pains?.join()}-${cfg.customPain}-${agenda.mode}-${agenda.minutes}-${agenda.ids.join()}-${cfg.qrUrl}`}
        slides={visible} allSlides={arranged} home={homeId} ctx={ctx} theme={cfg.theme} showTimer={agenda.mode !== 'full' && !init.clientView} clientView={init.clientView}
        onConfigure={init.clientView ? undefined : () => { history.replaceState(null, '', location.pathname); setMode('launcher') }}
        onExport={init.clientView ? undefined : () => setMode('print')}
      />
    </DeckContext.Provider></SessionContext.Provider>
  )
}
