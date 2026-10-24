import { motion } from 'framer-motion'
import type { SlideDef } from '../../engine/context'
import { buildSlides } from '../../slides/slides'
import { Section } from '../../slides/layouts'
import { fade } from '../../ui/primitives'

/**
 * Outcome Workshop — work in progress.
 * Phase 1 only proves the multi-deck platform: it reuses a handful of Platform Tour slides plus a placeholder.
 * The full storyline (role lens, day at the client, discovery wall, ten outcome chapters, blueprint) comes in later phases.
 */
function InPreparation() {
  return (
    <Section eyebrow="Outcome Workshop" title="This presentation is being built." sub="The co-design storyline — who is in the room, a day at your company, the discovery wall and ten outcome chapters — is added in the next phases.">
      <motion.div {...fade(0.3)} className="card p-8 text-[22px] max-w-[900px]" style={{ color: 'var(--mute)' }}>
        For now this deck reuses a few Platform Tour slides so that the presentation chooser, per-deck agenda, timer, PDF and team link can be tested end to end.
      </motion.div>
    </Section>
  )
}

export function buildWorkshopSlides(): SlideDef[] {
  const base = buildSlides()
  const keep = ['open', 'challenge', 'packages', 'roi', 'next', 'contact']
  const picked = keep.map(id => base.find(s => s.id === id)!).filter(Boolean)
  const placeholder: SlideDef = {
    id: 'ws-preparing', section: 'Open', title: 'Coming together', secs: 30, tier: 2,
    notes: 'Placeholder while the Outcome Workshop deck is under construction.',
    render: () => <InPreparation />,
  }
  const at = picked.findIndex(s => s.id === 'challenge') + 1
  return [...picked.slice(0, at), placeholder, ...picked.slice(at)]
}
