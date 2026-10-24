import type { DeckCtx, SlideDef } from './context'

export interface Agenda {
  mode: 'full' | 'auto' | 'manual' | 'chapters'
  minutes: number     // target length for auto mode
  ids: string[]       // ordered slide ids for manual mode
  chapters?: string[] // ordered chapter ids for chapters mode (Outcome Workshop)
}

export const defaultAgenda: Agenda = { mode: 'full', minutes: 30, ids: [] }

/** Each presentation keeps its own agenda. The old single `agenda` setting belongs to the Platform Tour. */
export function agendaFor(cfg: { agenda?: Agenda; agendas?: Record<string, Agenda> }, deckId: string): Agenda {
  return cfg.agendas?.[deckId] ?? (deckId === 'tour' ? cfg.agenda : undefined) ?? defaultAgenda
}

export const totalSecs = (slides: { secs: number }[]) => slides.reduce((a, s) => a + s.secs, 0)

export function fmtTime(secs: number) {
  const s = Math.max(0, Math.round(secs))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/** Choose and order the slides to present, according to the agenda. */
/** Keep the opener/close slides where they are and lay the chosen chapters out in the chosen order. */
export function byChapters(slides: SlideDef[], chosen: string[]): SlideDef[] {
  const inChapter = (s: SlideDef) => !!s.chapter
  const first = slides.findIndex(inChapter)
  if (first < 0) return slides
  const head = slides.slice(0, first).filter(s => !inChapter(s))
  const tail = slides.slice(first).filter(s => !inChapter(s))
  const body = chosen.flatMap(c => slides.filter(s => s.chapter === c))
  return [...head, ...body, ...tail]
}

export function pickSlides(slides: SlideDef[], agenda: Agenda, ctx: Pick<DeckCtx, 'industry' | 'pains'> & { outcomes?: string[] }): SlideDef[] {
  if (agenda.mode === 'chapters' && agenda.chapters?.length) return byChapters(slides, agenda.chapters)
  if (agenda.mode === 'manual' && agenda.ids.length) {
    const byId = new Map(slides.map(s => [s.id, s]))
    const picked = agenda.ids.map(id => byId.get(id)).filter((s): s is SlideDef => !!s)
    if (picked.length) return picked
  }
  if (agenda.mode !== 'auto') return slides

  // Auto: keep the must-have slides, then add the most relevant ones until the time budget is used.
  const budget = agenda.minutes * 60
  const painModules = new Set(ctx.pains.flatMap(p => p.modules))
  const focus = new Set(ctx.industry.focusModules)
  const picked = new Set(ctx.outcomes ?? [])
  const score = (s: SlideDef) => s.tier + (painModules.has(s.id) ? 4 : 0) + (focus.has(s.id) ? 2 : 0) + (s.chapter && picked.has(s.chapter) ? 5 : 0)

  const chosen = new Set(slides.filter(s => s.tier >= 3).map(s => s.id))
  let used = totalSecs(slides.filter(s => chosen.has(s.id)))
  const rest = slides.filter(s => !chosen.has(s.id)).sort((a, b) => score(b) - score(a))
  for (const s of rest) {
    if (used + s.secs > budget) continue
    chosen.add(s.id); used += s.secs
  }
  return slides.filter(s => chosen.has(s.id))
}
