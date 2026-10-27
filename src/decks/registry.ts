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
  home?: string                  // slide the Home button returns to (when the deck has no navigation options)
}

/** A screen the client uses to explore the product and jump into modules. Only the chosen one is kept in the deck. */
export interface NavOption { id: string; name: string; desc: string; slideId: string; more?: string[] }   // `more` = extra slides of a multi-slide navigation screen

/** Fresh Harvest = the Outcome Workshop (every navigation screen shown) minus these slides, by their number in that full list. */
const FRESH_DROP_NUMBERS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 71, 75, 77, 78, 79, 81]

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
      { id: 'lenses', name: 'Three lenses: Operational · Strategic · Enablement', desc: 'Three slides that group the modules by what they do for the business, in a clear flow, with the sales story, a question to ask and every feature', slideId: 'ws-pillar-ops', more: ['ws-pillar-strat', 'ws-pillar-comp'] },
    ],
    defaultNav: 'wall',
  },
  {
    id: 'fresh',
    name: 'Fresh Harvest',
    tagline: 'The full Outcome Workshop without the navigation screens, blueprint, toolkit and a few closing slides — ready to be reorganised.',
    bestFor: 'The Fresh Harvest visit — set the client name and details in the control panel',
    build: () => buildWorkshopSlides().filter((_, i) => !FRESH_DROP_NUMBERS.includes(i + 1)),
    chapters: OUTCOMES.map(o => ({ id: o.id, name: `${o.icon} ${o.name}` })),
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
      { id: 'lenses', name: 'Three lenses: Operational · Strategic · Enablement', desc: 'Three slides that group the modules by what they do for the business, in a clear flow, with the sales story, a question to ask and every feature', slideId: 'pillar-ops', more: ['pillar-strat', 'pillar-comp'] },
      { id: 'constellation', name: 'One-platform constellation', desc: 'The original animated map of all modules', slideId: 'constellation' },
    ],
    defaultNav: 'lenses',
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
  const drop = new Set(d.navs.filter(n => n.id !== chosen).flatMap(n => [n.slideId, ...(n.more ?? [])]))
  return slides.filter(s => !drop.has(s.id))
}

export const arrangeFor = (id: string | undefined, slides: SlideDef[], outcomes: string[], nav?: string) => applyNav(id, getDeck(id).arrange?.(slides, outcomes) ?? slides, nav)

const cache = new Map<string, SlideDef[]>()
export function getDeckSlides(id?: string): SlideDef[] {
  const key = resolveDeckId(id)
  if (!cache.has(key)) cache.set(key, getDeck(key).build())
  return cache.get(key)!
}
