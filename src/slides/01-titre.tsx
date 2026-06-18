import { SlideContext, SlideMeta } from '../engine/types'
import { motion } from 'framer-motion'
import { tokens } from '../design/tokens'
import { Eyebrow } from '../ui/Eyebrow'
import { Rule } from '../ui/Rule'
import { ScrambleText } from './_shared'

export const meta: SlideMeta = {
  title: 'Titre',
  speaker: ['Harouna', 'Killian', 'Jeremy'],
  notes: 'Slide d\'ouverture. Présentez-vous chacun rapidement puis annoncez le sujet.',
}

const TEAM = [
  { name: 'Harouna Coulibaly', color: tokens.color.accent.teal },
  { name: 'Killian Prin-Abeil', color: tokens.color.accent.blue },
  { name: 'Jeremy Diaz', color: tokens.color.accent.violet },
]

export function Component(_: SlideContext) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32, width: '100%', position: 'relative' }}>

      {/* Hex ghost background - "SeemsLegit" en ascii hex, watermark très discret */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.055 }}
        transition={{ duration: 2.5, delay: 0.3 }}
        style={{
          position: 'absolute',
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: tokens.type.family.mono,
          fontSize: 64,
          fontWeight: 700,
          color: tokens.color.text.primary,
          letterSpacing: '0.1em',
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        53 65 65 6D 73 4C 65 67 69 74
      </motion.div>

      {/* Foreground content */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32, width: '100%' }}>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <Eyebrow>M1 Cybersécurité · Oteria · Juin 2026</Eyebrow>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.35 }}
            style={{
              fontSize: '112px',
              fontWeight: tokens.type.weight.bold,
              letterSpacing: tokens.type.tracking.tighter,
              lineHeight: tokens.type.leading.tight,
              color: tokens.color.accent.teal,
              margin: 0,
              fontFamily: tokens.type.family.mono,
            }}
          >
            <ScrambleText text="SeemsLegit" delay={450} />
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 1.2, ease: [0.4, 0, 0.2, 1] }}
            style={{ transformOrigin: 'center', width: '100%' }}
          >
            <Rule width="100%" animate={false} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.4 }}
            style={{ fontSize: '32px', fontWeight: tokens.type.weight.light, letterSpacing: tokens.type.tracking.tight, color: tokens.color.text.secondary, margin: 0 }}
          >
            Générateur d'agents Mythic C2 on-demand
          </motion.p>
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 1.6 } } }}
          style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          {TEAM.map(({ name, color }) => (
            <motion.div
              key={name}
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: tokens.color.surface.subtle,
                border: `1px solid ${tokens.color.surface.line}`,
                borderLeft: `2px solid ${color}`,
                borderRadius: 5,
                padding: '7px 16px',
                fontSize: tokens.type.size.base,
                color: tokens.color.text.secondary,
                fontFamily: tokens.type.family.mono,
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
              {name}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2.1 }}
          style={{ display: 'flex', gap: 24, alignItems: 'center' }}
        >
          {['Mythic C2', 'Nim · C · Go · Py', 'VirusTotal Loop', 'Docker Compose'].map((l, i, arr) => (
            <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <span style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size.xs, color: tokens.color.text.muted, letterSpacing: tokens.type.tracking.wide }}>
                {l}
              </span>
              {i < arr.length - 1 && <span style={{ width: 3, height: 3, borderRadius: '50%', background: tokens.color.surface.lineStrong, display: 'inline-block' }} />}
            </span>
          ))}
        </motion.div>

      </div>
    </div>
  )
}
