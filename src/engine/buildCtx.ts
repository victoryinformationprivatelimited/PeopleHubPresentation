import { countries } from '../profiles/countries'
import { industries } from '../profiles/industries'
import { defaultPains, resolvePains } from '../profiles/pains'
import type { DeckCtx, Presenter } from './context'
import type { Config } from './Launcher'
import { agendaFor } from './agenda'
import { resolveDeckId } from '../decks/registry'

/** Link encoded in the QR code; optionally carries the personalisation so the client's team sees the same deck. */
type Live = { outcomes: string[]; roles: string[]; pains?: string[]; customPain?: string }
function qrLink(cfg: Config, session?: Live): string | undefined {
  const raw = cfg.qrUrl?.trim()
  if (!raw) return undefined
  try {
    const u = new URL(raw)
    const p = u.searchParams
    if (cfg.qrPersonalise !== false) {
      p.set('country', cfg.country)
      p.set('industry', cfg.industry)
      if (cfg.client) p.set('client', cfg.client)
      if (cfg.headcount) p.set('headcount', String(cfg.headcount))
      if (cfg.hrTeam) p.set('hrTeam', String(cfg.hrTeam))
      const pn = session?.pains ?? cfg.pains
      const cp = session?.customPain ?? cfg.customPain
      if (pn?.length) p.set('pains', pn.join(','))
      if (cp?.trim()) p.set('customPain', cp.trim())
      if (cfg.theme === 'light') p.set('theme', 'light')
      p.set('deck', resolveDeckId(cfg.deck))
      if (cfg.nav) p.set('nav', cfg.nav)
      if (session?.outcomes.length) p.set('outcomes', session.outcomes.join(','))
      if (session?.roles.length) p.set('roles', session.roles.join(','))
      const a = agendaFor(cfg, resolveDeckId(cfg.deck))
      if (a?.mode === 'auto') p.set('agenda', String(a.minutes))
      else if (a?.mode === 'manual' && a.ids.length) p.set('slides', a.ids.join(','))
    }
    const pr = cfg.presenter
    if (pr) {
      const m: [string, string | undefined][] = [['pco', pr.company], ['pname', pr.name], ['ptitle', pr.title], ['pemail', pr.email], ['pphone', pr.phone], ['pweb', pr.web]]
      m.forEach(([k, v]) => { if (v?.trim()) p.set(k, v.trim()) })
    }
    if (cfg.qrClientView !== false) p.set('view', 'client')
    if (cfg.qrLogoUrl?.trim()) p.set('logo', cfg.qrLogoUrl.trim())
    return u.toString()
  } catch { return raw }
}

/** Blank company → Victory Information defaults. A partner company shows only the details it filled in. */
function resolvePresenter(cfg: Config): Presenter {
  const base = (countries[cfg.country] ?? countries.lk).contact
  const p = cfg.presenter ?? {}
  const clean = (v?: string) => v?.trim() || undefined
  if (!clean(p.company)) {
    return { company: base.company, name: clean(p.name), title: clean(p.title), email: base.email, phone: base.phone, web: base.web, logo: p.logo, isPartner: false }
  }
  return { company: p.company!.trim(), name: clean(p.name), title: clean(p.title), email: clean(p.email), phone: clean(p.phone), web: clean(p.web), logo: p.logo, isPartner: true }
}

export function buildCtx(cfg: Config, print = false, session?: Live): DeckCtx {
  const industry = industries[cfg.industry] ?? industries.generic
  const pains = resolvePains(session?.pains ?? cfg.pains, session?.customPain ?? cfg.customPain)
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
    presenter: resolvePresenter(cfg),
    qrUrl: qrLink(cfg, session),
    print,
  }
}
