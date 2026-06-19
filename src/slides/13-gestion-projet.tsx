import { SlideContext, SlideMeta } from '../engine/types'
import { motion } from 'framer-motion'
import { tokens } from '../design/tokens'
import { Eyebrow } from '../ui/Eyebrow'
import { Tag } from './_shared'

export const meta: SlideMeta = {
  title: 'Gestion de projet',
  speaker: ['Jeremy'],
  notes: '',
}

const PILOTING = [
  { label: 'Kanban heberge', color: tokens.color.accent.teal, detail: 'backlog, responsable, priorite, etat' },
  { label: 'Points reguliers', color: tokens.color.accent.blue, detail: 'sync plateforme, agents et tests' },
  { label: 'Lab partage', color: tokens.color.semantic.warning, detail: 'meme environnement pour les builds' },
  { label: 'Mesure continue', color: tokens.color.accent.violet, detail: 'VT, Defender et Elastic EDR' },
]

export function Component(_: SlideContext) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Eyebrow>05 - Gestion de projet</Eyebrow>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        style={{ fontSize: tokens.type.size['2xl'], fontWeight: 600, letterSpacing: tokens.type.tracking.tight, color: tokens.color.text.primary, margin: 0 }}
      >
        Pilotage du projet
      </motion.h2>

      {/* 4 items horizontal compact */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, width: '100%' }}
      >
        {PILOTING.map(({ label, color, detail }) => (
          <motion.div
            key={label}
            variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } }}
            style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderTop: `2px solid ${color}`, borderRadius: 8, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 5 }}
          >
            <Tag color={color}>{label}</Tag>
            <span style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.muted, lineHeight: 1.4 }}>{detail}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Kanban - taille fixe raisonnable */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        style={{ width: '100%', height: 300, borderRadius: 10, overflow: 'hidden', border: `1px solid ${tokens.color.surface.line}` }}
      >
        <img
          src="/kanban.png"
          alt="Tableau Kanban"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'left top', display: 'block' }}
        />
      </motion.div>

    </div>
  )
}
