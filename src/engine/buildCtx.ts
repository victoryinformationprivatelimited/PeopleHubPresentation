import { countries } from '../profiles/countries'
import { industries } from '../profiles/industries'
import { defaultPains, resolvePains } from '../profiles/pains'
import type { DeckCtx } from './context'
import type { Config } from './Launcher'

/** Link encoded in the QR code; optionally carries the personalisation so the client's team sees the same deck. */
function qrLink(cfg: Config): string | undefined {
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
      if (cfg.pains?.length) p.set('pains', cfg.pains.join(','))
      if (cfg.customPain?.trim()) p.set('customPain', cfg.customPain.trim())
      if (cfg.theme === 'light') p.set('theme', 'light')
      const a = cfg.agenda
      if (a?.mode === 'auto') p.set('agenda', String(a.minutes))
      else if (a?.mode === 'manual' && a.ids.length) p.set('slides', a.ids.join(','))
    }
    if (cfg.qrClientView !== false) p.set('view', 'client')
    if (cfg.qrLogoUrl?.trim()) p.set('logo', cfg.qrLogoUrl.trim())
    return u.toString()
  } catch { return raw }
}

export function buildCtx(cfg: Config, print = false): DeckCtx {
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
    qrUrl: qrLink(cfg),
    print,
  }
}
