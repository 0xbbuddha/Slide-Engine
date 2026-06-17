import { SlideContext, SlideMeta } from '../engine/types'
import { motion } from 'framer-motion'
import { tokens } from '../design/tokens'
import { Eyebrow } from '../ui/Eyebrow'
import { Rule } from '../ui/Rule'

export const meta: SlideMeta = {
  title: 'Questions',
  annexe: true,
  speaker: ['Harouna', 'Killian', 'Jeremy'],
  notes: 'Slide de réserve. Points souvent demandés : polymorphisme mesuré par VT, Chess.com FEN encoding, intégration API Mythic, bypass EDR démontré comment.',
}

const TEAM = [
  { name: 'Harouna Coulibaly', color: tokens.color.accent.teal },
  { name: 'Killian Prin-Abeil', color: tokens.color.accent.blue },
  { name: 'Jeremy Diaz', color: tokens.color.accent.violet },
]

export function Component(_: SlideContext) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32, width: '100%' }}>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Eyebrow>Annexe — Q&amp;A</Eyebrow>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1 }}
        style={{
          fontSize: tokens.type.size['5xl'],
          fontWeight: tokens.type.weight.bold,
          letterSpacing: tokens.type.tracking.tighter,
          color: tokens.color.text.primary,
          margin: 0,
        }}
      >
        Questions ?
      </motion.h1>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        style={{ transformOrigin: 'center', width: '40%' }}
      >
        <Rule width="100%" animate={false} />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        style={{ fontSize: tokens.type.size.lg, fontWeight: tokens.type.weight.light, color: tokens.color.text.muted, margin: 0 }}
      >
        Merci pour votre attention.
      </motion.p>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.75 } } }}
        style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}
      >
        {TEAM.map(({ name, color }) => (
          <motion.div
            key={name}
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: tokens.color.surface.subtle,
              border: `1px solid ${tokens.color.surface.line}`,
              borderRadius: 999,
              padding: '6px 16px',
              fontSize: tokens.type.size.sm,
              color: tokens.color.text.tertiary,
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
            {name}
          </motion.div>
        ))}
      </motion.div>

    </div>
  )
}
