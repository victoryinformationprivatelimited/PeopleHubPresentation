import type { SlideDef } from '../../engine/context'
import { byChapters } from '../../engine/agenda'
import { buildSlides } from '../../slides/slides'
import { OUTCOMES, chapterSlideId } from './data'
import { MOMENTS_P3, momentSlide } from './moments'
import { MOMENTS_P4 } from './moments4'
import { BlueprintSlide, ChapterCard, DaySlide, DetailsSlide, FabricSlide, RecapSlide, RolesSlide, WallSlide, WavesSlide } from './slides'

/**
 * Outcome Workshop — a co-design session: who is in the room → a day at the client → the client picks outcomes on the
 * discovery wall → their blueprint → ten outcome chapters → close.
 * Phase 2: opening, wall, blueprint, system map, ten chapter cards and the close.
 * Phase 3: scenario "moment" slides for chapters 1–5 (ids follow `${outcome}-${key}`, see data.ts and moments.tsx).
 * Phase 4: chapters 6–10 (moments4.tsx).
 */
export function buildWorkshopSlides(): SlideDef[] {
  const tour = buildSlides()
  const reuse = (id: string, over: Partial<SlideDef> = {}): SlideDef => ({ ...tour.find(s => s.id === id)!, ...over })
  const mk = (id: string, section: string, title: string, secs: number, tier: number, notes: string, render: () => React.ReactNode, chapter?: string): SlideDef =>
    ({ id, section, title, secs, tier, notes, render, chapter })

  const moments = [...MOMENTS_P3, ...MOMENTS_P4].map(momentSlide)
  const chapters: SlideDef[] = OUTCOMES.flatMap(o => [mk(chapterSlideId(o.id), o.name, o.name, 25, 1,
    `Outcome chapter: ${o.name}. Say the promise, then open the capabilities the client cares about. The KPI is illustrative — present it as typical, not guaranteed. Tap "Add to your blueprint" if they want it and have not picked it yet.`,
    () => <ChapterCard o={o} />, o.id), ...moments.filter(m => m.chapter === o.id)])

  return [
    reuse('open', { section: 'Open' }),
    mk('ws-roles', 'Open', 'Who is in the room', 45, 3, 'Ask who is here and tap their roles. Each role gets a one-line promise. The picks tint the discovery wall and the order we suggest. Keep it light: 30 seconds.', () => <RolesSlide />),
    mk('ws-day', 'Open', 'A day at your company', 75, 2, 'Walk the day from 07:55 to 17:30. Names and roles come from the client’s industry and country. Tap a tag to jump into that outcome, Backspace to return. Do not linger — this is the unifying story.', () => <DaySlide />),
    reuse('challenge', { section: 'Open', title: 'What we heard', tier: 3, secs: 60 }),
    mk('ws-wall', 'Co-design', 'Discovery wall', 120, 3, 'This is the heart of the session. Hand over: "Tap what matters most." Pre-ticked from their pain points and industry. Order matters — number 1 is what we start with. Ask why for each choice and capture the answers.', () => <WallSlide />),
    mk('ws-blueprint', 'Co-design', 'Your blueprint, live', 60, 3, 'Their choices become a blueprint. Read it back: "So we start with… then…". Lit modules show what is in scope. Tap an outcome to open its chapter.', () => <BlueprintSlide />),
    mk('ws-fabric', 'Co-design', 'The PeopleHub fabric', 45, 2, 'The whole system on one page: experiences on top, outcomes in the middle, the shared foundation underneath. Use it to answer "what else is there?".', () => <FabricSlide />),
    ...chapters,
    reuse('why', { section: 'Close' }),
    reuse('versus', { section: 'Close' }),
    reuse('pains', { section: 'Close' }),
    mk('ws-recap', 'Close', 'Your blueprint recap', 45, 2, 'Read back their blueprint and the package that fits. Packages are cumulative; any module can be added à la carte. No prices on screen.', () => <RecapSlide />),
    mk('ws-waves', 'Close', 'Rollout waves', 45, 2, 'Three waves, their priorities first. Do not give dates here — dates come after the discovery workshop and scoping.', () => <WavesSlide />),
    reuse('packages', { section: 'Close' }),
    reuse('roi', { section: 'Close' }),
    mk('ws-details', 'Close', 'Leave your details', 30, 1, 'Let the client type their details. They stay in this browser session and print into the PDF if you export it; nothing is sent anywhere.', () => <DetailsSlide />),
    reuse('next', { section: 'Close' }),
    reuse('contact', { section: 'Close' }),
  ]
}

/** Chosen chapters first (in the order the client picked them), then the rest in the standard order. */
export function arrangeWorkshop(slides: SlideDef[], outcomes: string[]): SlideDef[] {
  const rest = OUTCOMES.map(o => o.id).filter(id => !outcomes.includes(id))
  return byChapters(slides, [...outcomes.filter(id => OUTCOMES.some(o => o.id === id)), ...rest])
}
