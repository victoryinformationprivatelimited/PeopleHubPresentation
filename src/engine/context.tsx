import { createContext, useContext } from 'react'
import type { CountryProfile, IndustryProfile } from '../profiles/types'
import type { Pain } from '../profiles/pains'

/** Who is presenting (Victory Information by default, or a sales partner). */
export interface Presenter {
  company: string
  name?: string
  title?: string
  email?: string
  phone?: string
  web?: string
  logo?: string        // data URL or web address
  isPartner: boolean   // true when the presenter is not Victory Information
}

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
  presenter: Presenter
  qrUrl?: string       // link encoded in the QR code (client team page)
  print?: boolean      // rendering for PDF export (no WebGL, static)
}

export const DeckContext = createContext<DeckCtx>(null as unknown as DeckCtx)
export const useDeck = () => useContext(DeckContext)

/** Navigation helpers available to slides (e.g. the clickable module overview). */
export interface DeckNav { jump: (slideId: string) => void }
export const NavContext = createContext<DeckNav>({ jump: () => {} })
export const useNav = () => useContext(NavContext)

export interface SlideDef {
  id: string
  section: string
  title: string
  notes: string
  secs: number         // planned speaking time in seconds
  tier: number         // 3 = always keep, 2 = important, 1 = normal, 0 = optional
  render: (ctx: DeckCtx) => React.ReactNode
}

/** Possessive form: Acme Garments → Acme Garments’, Acme → Acme’s */
export function poss(name: string) {
  return /s$/i.test(name) ? `${name}’` : `${name}’s`
}

export function money(c: CountryProfile, n: number) {
  return `${c.currency} ${n.toLocaleString(c.locale)}`
}
