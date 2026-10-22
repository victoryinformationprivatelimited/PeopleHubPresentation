import { createContext, useContext } from 'react'
import type { CountryProfile, IndustryProfile } from '../profiles/types'
import type { Pain } from '../profiles/pains'

export interface DeckCtx {
  country: CountryProfile
  industry: IndustryProfile
  client: string
  company: string      // client name, or a neutral default
  logo?: string        // client logo (data URL)
  headcount?: number   // client numbers (optional)
  hrTeam?: number
  pains: Pain[]        // pain points chosen for this client (may be empty)
  focusPains: Pain[]   // chosen pains, or industry defaults when none chosen
}

export const DeckContext = createContext<DeckCtx>(null as unknown as DeckCtx)
export const useDeck = () => useContext(DeckContext)

export interface SlideDef {
  id: string
  section: string
  title: string
  notes: string
  render: (ctx: DeckCtx) => React.ReactNode
}

/** Possessive form: Acme Garments → Acme Garments’, Acme → Acme’s */
export function poss(name: string) {
  return /s$/i.test(name) ? `${name}’` : `${name}’s`
}

export function money(c: CountryProfile, n: number) {
  return `${c.currency} ${n.toLocaleString(c.locale)}`
}
