import { createContext, useContext } from 'react'
import type { CountryProfile, IndustryProfile } from '../profiles/types'

export interface DeckCtx {
  country: CountryProfile
  industry: IndustryProfile
  client: string
  company: string      // client name, or a neutral default
  logo?: string        // client logo (data URL)
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

export function money(c: CountryProfile, n: number) {
  return `${c.currency} ${n.toLocaleString(c.locale)}`
}
