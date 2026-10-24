import type { SlideDef } from '../engine/context'
import { buildSlides } from '../slides/slides'
import { buildWorkshopSlides } from './workshop'

/** A presentation the presenter can pick on the settings screen. Add a new entry here to add a deck. */
export interface DeckDef {
  id: string
  name: string
  tagline: string
  bestFor: string
  badge?: string                 // small label on the card, e.g. "Preview" while a deck is still being built
  build: () => SlideDef[]
}

export const decks: DeckDef[] = [
  {
    id: 'workshop',
    name: 'Outcome Workshop',
    tagline: 'Co-design session: the client picks the outcomes that matter, then sees their own PeopleHub built live.',
    bestFor: 'Owners, HR, finance & payroll and IT together — discovery and first meetings',
    badge: 'Preview',
    build: buildWorkshopSlides,
  },
  {
    id: 'tour',
    name: 'Platform Tour',
    tagline: 'A guided walk through every PeopleHub module, with animated screens, IT deep-dive, packages and value.',
    bestFor: 'Follow-up demos and clients who want to see the full product',
    build: buildSlides,
  },
]

/** Deck opened when nothing has been chosen. Switch to 'workshop' once that deck is complete. */
export const DEFAULT_DECK = 'tour'

export const resolveDeckId = (id?: string) => (decks.some(d => d.id === id) ? id! : DEFAULT_DECK)
export const getDeck = (id?: string) => decks.find(d => d.id === resolveDeckId(id))!

const cache = new Map<string, SlideDef[]>()
export function getDeckSlides(id?: string): SlideDef[] {
  const key = resolveDeckId(id)
  if (!cache.has(key)) cache.set(key, getDeck(key).build())
  return cache.get(key)!
}
