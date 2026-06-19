import { SlideContext, SlideMeta } from '../engine/types'
import { motion } from 'framer-motion'
import { tokens } from '../design/tokens'
import { Eyebrow } from '../ui/Eyebrow'

export const meta: SlideMeta = {
  title: 'Démo',
  speaker: ['Jeremy'],
  notes: 'Lancez la démo en direct ou passez la vidéo.',
}

export function Component(_: SlideContext) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', alignItems: 'flex-start' }}>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Eyebrow>12 - Démo</Eyebrow>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ fontSize: tokens.type.size['2xl'], fontWeight: 600, letterSpacing: tokens.type.tracking.tight, color: tokens.color.text.primary, margin: 0 }}
      >
        Démonstration
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ width: '75%', alignSelf: 'center', borderRadius: 10, overflow: 'hidden', border: `1px solid ${tokens.color.surface.line}`, background: '#000' }}
      >
        <video
          src="/demo.mp4"
          controls
          style={{ width: '100%', display: 'block', objectFit: 'contain', maxHeight: '55vh' }}
        />
      </motion.div>

    </div>
  )
}
