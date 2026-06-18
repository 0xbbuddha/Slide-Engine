import { SlideContext, SlideMeta } from '../engine/types'
import { motion } from 'framer-motion'
import { tokens } from '../design/tokens'
import { Eyebrow } from '../ui/Eyebrow'
import { Reveal } from '../ui/Reveal'
import { Highlight } from './_shared'

export const meta: SlideMeta = {
  title: 'La trilemme',
  speaker: ['Killian'],
  steps: 3,
  notes: 'Révélez chaque problème avec →. Insistez : aucune solution existante ne résout les 3 en même temps.',
}

const PROBLEMS = [
  {
    n: '01',
    title: 'Agents par défaut',
    color: tokens.color.semantic.critical,
    lines: [
      'Signatures Mythic / Havoc / Cobalt Strike',
      'référencées dans toutes les bases EDR.',
      'Détection : quelques secondes.',
    ],
  },
  {
    n: '02',
    title: 'Implants custom manuels',
    color: tokens.color.semantic.warning,
    lines: [
      'Développement bas niveau spécialisé.',
      'Plusieurs jours par engagement.',
      'Expertise rare, non reproductible.',
    ],
  },
  {
    n: '03',
    title: 'Packers / Crypters génériques',
    color: tokens.color.semantic.critical,
    lines: [
      'Signatures des outils eux-mêmes connues.',
      'UPX, Themida... référencés dans les AV.',
      'Propagation rapide des nouvelles sigs.',
    ],
  },
]

export function Component({ step }: SlideContext) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: '100%', alignItems: 'flex-start' }}>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Eyebrow>03 - Problématique</Eyebrow>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ fontSize: tokens.type.size['2xl'], fontWeight: tokens.type.weight.semibold, letterSpacing: tokens.type.tracking.tight, color: tokens.color.text.primary, margin: 0 }}
      >
        La trilemme des Red Teams
      </motion.h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, width: '100%' }}>
        {PROBLEMS.map(({ n, title, color, lines }, i) => (
          <Reveal key={n} show={step >= i + 1}>
            <div style={{
              background: tokens.color.surface.subtle,
              border: `1px solid ${tokens.color.surface.line}`,
              borderTop: `3px solid ${color}`,
              borderRadius: 12,
              padding: '24px 22px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              height: '100%',
            }}>
              {/* Large ghost number */}
              <div style={{
                fontFamily: tokens.type.family.mono,
                fontSize: 64,
                fontWeight: tokens.type.weight.bold,
                color,
                opacity: 0.1,
                lineHeight: 1,
                letterSpacing: '-0.04em',
                marginBottom: 10,
                userSelect: 'none',
              }}>
                {n}
              </div>
              <div style={{ fontSize: tokens.type.size.md, fontWeight: tokens.type.weight.semibold, color, marginBottom: 12 }}>
                {title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {lines.map((l) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ color, flexShrink: 0, marginTop: 1, fontSize: 11 }}>-</span>
                    <span style={{ fontSize: tokens.type.size.sm, color: tokens.color.text.tertiary, lineHeight: tokens.type.leading.normal }}>
                      {l}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div style={{ width: '100%' }}>
        <Reveal show={step >= 3}>
          <div style={{ background: `${tokens.color.accent.blue}0a`, border: `1px solid ${tokens.color.accent.blue}22`, borderRadius: 8, padding: '18px 24px', textAlign: 'center' }}>
            <span style={{ fontSize: tokens.type.size.md, color: tokens.color.text.secondary, lineHeight: tokens.type.leading.relaxed }}>
              <strong style={{ color: tokens.color.accent.blue }}>SeemsLegit :</strong>{' '}
              automatiser la production d'implants uniques et fonctionnels, sans intervention manuelle par build.
            </span>
          </div>
        </Reveal>
      </div>

    </div>
  )
}
