import type { DeckCtx, SlideDef } from './context'

export interface Agenda {
  mode: 'full' | 'auto' | 'manual'
  minutes: number     // target length for auto mode
  ids: string[]       // ordered slide ids for manual mode
}

export const defaultAgenda: Agenda = { mode: 'full', minutes: 30, ids: [] }

export const totalSecs = (slides: { secs: number }[]) => slides.reduce((a, s) => a + s.secs, 0)

export function fmtTime(secs: number) {
  const s = Math.max(0, Math.round(secs))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/** Choose and order the slides to present, according to the agenda. */
export function pickSlides(slides: SlideDef[], agenda: Agenda, ctx: Pick<DeckCtx, 'industry' | 'pains'>): SlideDef[] {
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
  const score = (s: SlideDef) => s.tier + (painModules.has(s.id) ? 4 : 0) + (focus.has(s.id) ? 2 : 0)

  const chosen = new Set(slides.filter(s => s.tier >= 3).map(s => s.id))
  let used = totalSecs(slides.filter(s => chosen.has(s.id)))
  const rest = slides.filter(s => !chosen.has(s.id)).sort((a, b) => score(b) - score(a))
  for (const s of rest) {
    if (used + s.secs > budget) continue
    chosen.add(s.id); used += s.secs
  }
  return slides.filter(s => chosen.has(s.id))
}
