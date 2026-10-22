import { countries } from '../profiles/countries'
import { industries } from '../profiles/industries'
import { defaultPains, resolvePains } from '../profiles/pains'
import type { DeckCtx } from './context'
import type { Config } from './Launcher'

/** Link encoded in the QR code; optionally carries the personalisation so the client's team sees the same deck. */
function qrLink(cfg: Config): string | undefined {
  const raw = cfg.qrUrl?.trim()
  if (!raw) return undefined
  if (cfg.qrPersonalise === false) return raw
  try {
    const u = new URL(raw)
    u.searchParams.set('country', cfg.country)
    u.searchParams.set('industry', cfg.industry)
    if (cfg.client) u.searchParams.set('client', cfg.client)
    if (cfg.headcount) u.searchParams.set('headcount', String(cfg.headcount))
    if (cfg.hrTeam) u.searchParams.set('hrTeam', String(cfg.hrTeam))
    if (cfg.pains?.length) u.searchParams.set('pains', cfg.pains.join(','))
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
