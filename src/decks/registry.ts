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

/** Fresh Harvest: the system screens (Workshop scenario slides) grouped by module — Operational, Strategic, Enablement, then platform screens. */
export const FRESH_ORDER: [string, string[]][] = [
  ['Organization', ['know-org']], ['Employee master 360', ['know-emp', 'know-live', 'know-bulk']], ['Life cycle', ['know-life']],
  ['Time & attendance', ['time-capture', 'time-manual', 'time-roster', 'time-policy', 'time-process']], ['Mobile app', ['serve-mobile']],
  ['Leave management', ['leave-types', 'leave-apply', 'leave-calendar']], ['Meal management', ['time-meal']], ['Staff loans & advances', ['pay-advance']],
  ['Benefits & claims', ['pay-claims', 'pay-benefits']], ['Payroll', ['pay-engine', 'pay-payslips']], ['Salary banking', ['pay-finance']],
  ['Self-service portal', ['serve-ess']], ['Approvals', ['approve-builder', 'approve-higher', 'approve-inbox']], ['Notifications', ['approve-rules']],
  ['Security & audit', ['secure-sec', 'data-audit']], ['Termination & exit', ['grow-exit']],
  ['Recruitment & onboarding', ['hire-recruit']], ['Performance', ['grow-perf']], ['Learning & development', ['grow-learn']], ['Succession planning', ['grow-succ']],
  ['Engagement', ['grow-engage', 'grow-recog']], ['Grievance reporting', ['serve-grievance']], ['Analytics & reports', ['data-dash']], ['Compliance & statutory', ['data-compliance']],
  ['Letter generator', ['hire-letters']], ['Tasks & checklists', ['hire-onboard']], ['Service desk', ['serve-tickets']], ['Asset tracker', ['serve-assets']],
  ['Knowledge base', ['serve-kb']], ['Chat & AI assistant', ['serve-chat']], ['News broadcasting', ['serve-news']], ['Integrations & ERP', ['secure-integ']],
  ['Platform', ['secure-tenancy', 'secure-billing', 'secure-arch']],
]

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
    name: 'Fresh Harvest · System screens',
    tagline: 'Only the live system screens, grouped by module in the order Operational, Strategic, then Enablement — ready to be reorganised.',
    bestFor: 'The Fresh Harvest visit — set the client name and details in the control panel',
    build: () => {
      const all = buildWorkshopSlides()
      const ids = FRESH_ORDER.flatMap(([, list]) => list)
      return ids.map(id => all.find(s => s.id === id)!)
    },
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
