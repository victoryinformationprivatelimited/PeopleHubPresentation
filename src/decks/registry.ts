import type { SlideDef } from '../engine/context'
import { buildSlides } from '../slides/slides'
import { buildWorkshopSlides, arrangeWorkshop } from './workshop'
import { OUTCOMES } from './workshop/data'

/** A presentation the presenter can pick on the settings screen. Add a new entry here to add a deck. */
export interface DeckDef {
  id: string
  name: string
  tagline: string
  bestFor: string
  badge?: string                 // small label on the card, e.g. "Preview" while a deck is still being built
  build: () => SlideDef[]
  chapters?: { id: string; name: string }[]                                  // outcome chapters (for the “Pick chapters” agenda)
  arrange?: (slides: SlideDef[], outcomes: string[]) => SlideDef[]           // reorder using live choices (e.g. discovery wall)
  navs?: NavOption[]                                                          // interchangeable “navigation screens” — the presenter keeps one
  defaultNav?: string
}

/** A screen the client uses to explore the product and jump into modules. Only the chosen one is kept in the deck. */
export interface NavOption { id: string; name: string; desc: string; slideId: string }

export const decks: DeckDef[] = [
  {
    id: 'workshop',
    name: 'Outcome Workshop',
    tagline: 'Co-design session: the client picks the outcomes that matter, then sees their own PeopleHub built live.',
    bestFor: 'Owners, HR, finance & payroll and IT together — discovery and first meetings',
    build: buildWorkshopSlides,
    chapters: OUTCOMES.map(o => ({ id: o.id, name: `${o.icon} ${o.name}` })),
    arrange: arrangeWorkshop,
    navs: [
      { id: 'wall', name: 'Discovery wall', desc: 'The client taps the outcomes that matter most — best for co-design sessions', slideId: 'ws-wall' },
      { id: 'wheel', name: 'Module wheel', desc: 'An animated wheel of the platform; tap a segment, open any module', slideId: 'ws-wheel' },
      { id: 'landscape', name: 'Module & feature landscape', desc: 'Every module and its features on one screen; tap a card to open it', slideId: 'ws-landscape' },
    ],
    defaultNav: 'wall',
  },
  {
    id: 'tour',
    name: 'Platform Tour',
    tagline: 'A guided walk through every PeopleHub module, with animated screens, IT deep-dive, packages and value.',
    bestFor: 'Follow-up demos and clients who want to see the full product',
    build: buildSlides,
    navs: [
      { id: 'landscape', name: 'Module & feature landscape', desc: 'Every module and its features on one screen; tap a card to open it', slideId: 'landscape' },
      { id: 'wheel', name: 'Module wheel', desc: 'An animated wheel of the platform; tap a segment, open any module', slideId: 'wheel' },
      { id: 'constellation', name: 'One-platform constellation', desc: 'The original animated map of all modules', slideId: 'constellation' },
    ],
    defaultNav: 'landscape',
  },
]

/** Deck opened when nothing has been chosen. */
export const DEFAULT_DECK = 'workshop'

export const resolveDeckId = (id?: string) => (decks.some(d => d.id === id) ? id! : DEFAULT_DECK)
export const getDeck = (id?: string) => decks.find(d => d.id === resolveDeckId(id))!

/** Keep only the chosen navigation screen ('all' keeps every one). */
export function applyNav(id: string | undefined, slides: SlideDef[], nav?: string): SlideDef[] {
  const d = getDeck(id)
  if (!d.navs?.length) return slides
  const chosen = nav ?? d.defaultNav
  if (chosen === 'all') return slides
  const drop = new Set(d.navs.filter(n => n.id !== chosen).map(n => n.slideId))
  return slides.filter(s => !drop.has(s.id))
}

export const arrangeFor = (id: string | undefined, slides: SlideDef[], outcomes: string[], nav?: string) => applyNav(id, getDeck(id).arrange?.(slides, outcomes) ?? slides, nav)

const cache = new Map<string, SlideDef[]>()
export function getDeckSlides(id?: string): SlideDef[] {
  const key = resolveDeckId(id)
  if (!cache.has(key)) cache.set(key, getDeck(key).build())
  return cache.get(key)!
}
