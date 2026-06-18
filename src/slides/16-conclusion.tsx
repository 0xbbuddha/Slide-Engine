import { SlideContext, SlideMeta } from '../engine/types'
import { motion } from 'framer-motion'
import { tokens } from '../design/tokens'
import { Rule } from '../ui/Rule'
import { Tag } from './_shared'

export const meta: SlideMeta = {
  title: 'Conclusion',
  speaker: ['Harouna', 'Killian', 'Jeremy'],
  notes: 'Phrase clé : SeemsLegit démontre que l\'écart entre agents détectés et implants custom peut être comblé par l\'automatisation. Ouvrez les questions.',
}

const TAGS = [
  { label: '4 agents Mythic', color: tokens.color.accent.blue },
  { label: '3 profils C2 couverts', color: tokens.color.accent.teal },
  { label: 'Polymorphisme par build', color: tokens.color.accent.violet },
  { label: 'VirusTotal feedback loop', color: tokens.color.semantic.warning },
]

export function Component(_: SlideContext) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36, width: '100%' }}>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          fontSize: tokens.type.size['5xl'],
          fontWeight: tokens.type.weight.bold,
          letterSpacing: tokens.type.tracking.tighter,
          lineHeight: tokens.type.leading.tight,
          color: tokens.color.text.primary,
          margin: 0,
          textAlign: 'center',
        }}
      >
        SeemsLegit
      </motion.h1>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformOrigin: 'center', width: '60%' }}
      >
        <Rule width="100%" animate={false} />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.55 }}
        style={{
          fontSize: tokens.type.size.lg,
          fontWeight: tokens.type.weight.light,
          color: tokens.color.text.secondary,
          lineHeight: tokens.type.leading.relaxed,
          maxWidth: 740,
          textAlign: 'center',
          margin: 0,
          letterSpacing: tokens.type.tracking.tight,
        }}
      >
        SeemsLegit démontre que l'écart entre les agents détectés immédiatement
        et les implants custom manuels peut être{' '}
        <strong style={{ fontWeight: tokens.type.weight.semibold, color: tokens.color.text.primary }}>
          comblé par l'automatisation
        </strong>.
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        style={{
          fontSize: tokens.type.size.base,
          color: tokens.color.text.muted,
          lineHeight: tokens.type.leading.relaxed,
          maxWidth: 680,
          textAlign: 'center',
          margin: 0,
        }}
      >
        Le moteur CodeGenerator livre du polymorphisme via des variantes aléatoires, renommage de symboles,
        chiffrement de strings et injection de leurres - combiné à{' '}
        <strong style={{ color: tokens.color.text.tertiary }}>4 agents dans 4 langages</strong>{' '}
        et{' '}
        <strong style={{ color: tokens.color.text.tertiary }}>3 canaux C2 couverts</strong>.
      </motion.p>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 1.0 } } }}
        style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}
      >
        {TAGS.map(({ label, color }) => (
          <motion.div
            key={label}
            variants={{ hidden: { opacity: 0, scale: 0.85 }, show: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: [0.34, 1.2, 0.64, 1] } } }}
          >
            <Tag color={color}>{label}</Tag>
          </motion.div>
        ))}
      </motion.div>

    </div>
  )
}
