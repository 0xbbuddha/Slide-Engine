import { SlideContext, SlideMeta } from '../engine/types'
import { motion } from 'framer-motion'
import { tokens } from '../design/tokens'
import { Eyebrow } from '../ui/Eyebrow'
import { SectionLabel } from './_shared'

export const meta: SlideMeta = {
  title: 'Difficultes',
  speaker: ['Jeremy'],
  notes: 'Soyez concrets et honnetes. Le jury valorise la capacite a identifier ce qui a bloque et comment vous avez pivote. Ne minimisez pas les problemes.',
}

const DIFFICULTIES = [
  {
    color: tokens.color.semantic.critical,
    label: 'API Mythic v2',
    problem: 'Documentation incomplete et comportements non documentes - certains endpoints renvoyaient des erreurs silencieuses selon la version deployee.',
    solution: 'Reverse-engineering de l\'interface Mythic + tests exhaustifs + contribution aux issues GitHub upstream.',
  },
  {
    color: tokens.color.accent.blue,
    label: 'Compatibilite modules evasion',
    problem: 'Certaines combinaisons de modules (ex. Sleep Obfuscation + Early Bird APC) produisent des binaires instables ou des crashes non deterministes.',
    solution: 'Matrice de compatibilite dans le CodeGenerator - certaines combinaisons desactivees automatiquement selon le profil selectionne.',
  },
  {
    color: tokens.color.semantic.warning,
    label: 'Cross-compilation Nim Windows',
    problem: 'La chaine mingw-w64 sur Linux genere des artefacts PE differents selon la version du compilateur - signatures detectees inconsistamment.',
    solution: 'Fixation de la version mingw dans Docker + tests systematiques de chaque build sur la cible.',
  },
  {
    color: tokens.color.accent.violet,
    label: 'Bypass EDR en conditions reelles',
    problem: 'Les techniques fonctionnent en lab mais les EDR cloud (CrowdStrike Falcon) ont des capteurs kernel qui ne sont pas contournables en userland uniquement.',
    solution: 'Recentrage sur les EDR userland pour cette version - les techniques kernel sont en roadmap.',
  },
]

export function Component(_: SlideContext) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, width: '100%', alignItems: 'flex-start' }}>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Eyebrow>14 - Difficultes rencontrees</Eyebrow>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ fontSize: tokens.type.size['2xl'], fontWeight: tokens.type.weight.semibold, letterSpacing: tokens.type.tracking.tight, color: tokens.color.text.primary, margin: 0 }}
      >
        Obstacles et solutions
      </motion.h2>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } }}
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, width: '100%' }}
      >
        {DIFFICULTIES.map(({ color, label, problem, solution }) => (
          <motion.div
            key={label}
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }}
            style={{
              background: tokens.color.surface.subtle,
              border: `1px solid ${tokens.color.surface.line}`,
              borderLeft: `3px solid ${color}`,
              borderRadius: 10,
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <SectionLabel color={color}>{label}</SectionLabel>

            <div style={{ display: 'flex', gap: 10 }}>
              <span style={{ fontFamily: tokens.type.family.mono, fontSize: '10px', color: tokens.color.semantic.critical, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>
                PROBLEME
              </span>
              <p style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.secondary, lineHeight: tokens.type.leading.relaxed, margin: 0 }}>
                {problem}
              </p>
            </div>

            <div style={{ height: 1, background: tokens.color.surface.line }} />

            <div style={{ display: 'flex', gap: 10 }}>
              <span style={{ fontFamily: tokens.type.family.mono, fontSize: '10px', color: tokens.color.semantic.success, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>
                SOLUTION
              </span>
              <p style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.secondary, lineHeight: tokens.type.leading.relaxed, margin: 0 }}>
                {solution}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

    </div>
  )
}
