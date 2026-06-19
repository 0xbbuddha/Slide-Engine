import { SlideContext, SlideMeta } from '../engine/types'
import { motion } from 'framer-motion'
import { tokens } from '../design/tokens'
import { Eyebrow } from '../ui/Eyebrow'
import { Reveal } from '../ui/Reveal'
import { Highlight } from './_shared'

export const meta: SlideMeta = {
  title: 'Contexte & Trilemme',
  speaker: ['Harouna'],
  steps: 3,
  notes: 'Une phrase d\'accroche, puis révélez les 3 problèmes un par un avec →. Insistez : aucune des 3 approches ne fonctionne seule. La conclusion amène naturellement SeemsLegit.',
}

const PROBLEMS = [
  {
    n: '01',
    title: 'Agents open-source',
    color: tokens.color.semantic.critical,
    lines: [
      'Signatures Mythic, Havoc, Cobalt Strike connues de tous les EDR.',
      'Détection en quelques secondes dès le check-in.',
    ],
  },
  {
    n: '02',
    title: 'Implants custom manuels',
    color: tokens.color.semantic.warning,
    lines: [
      'Développement bas niveau très spécialisé.',
      'Plusieurs jours par engagement - non reproductible.',
    ],
  },
  {
    n: '03',
    title: 'Packers / Crypters génériques',
    color: tokens.color.semantic.critical,
    lines: [
      'Les outils de packing sont eux-mêmes signés et connus.',
      'Les nouvelles signatures se propagent en quelques heures.',
    ],
  },
]

export function Component({ step }: SlideContext) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, width: '100%', alignItems: 'flex-start' }}>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Eyebrow>03 - Contexte Red Team</Eyebrow>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ fontSize: tokens.type.size['2xl'], fontWeight: tokens.type.weight.semibold, letterSpacing: tokens.type.tracking.tight, color: tokens.color.text.primary, margin: 0 }}
      >
        Le trilemme Red Team
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.18 }}
        style={{ fontSize: tokens.type.size.md, color: tokens.color.text.secondary, lineHeight: tokens.type.leading.relaxed, margin: 0 }}
      >
        Les EDR modernes hookent ntdll.dll sur chaque process. Toutes les approches classiques échouent.
      </motion.p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, width: '100%' }}>
        {PROBLEMS.map(({ n, title, color, lines }, i) => (
          <Reveal key={n} show={step >= i + 1}>
            <motion.div
              style={{
                background: tokens.color.surface.subtle,
                border: `1px solid ${tokens.color.surface.line}`,
                borderTop: `3px solid ${color}`,
                borderRadius: 12,
                padding: '24px 22px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size.xs, fontWeight: 700, color: `${color}70` }}>{n}</span>
                <span style={{ fontSize: tokens.type.size.md, fontWeight: tokens.type.weight.semibold, color }}>{title}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {lines.map((l) => (
                  <div key={l} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: tokens.type.size.sm, color: tokens.color.text.secondary, lineHeight: tokens.type.leading.relaxed }}>
                    <span style={{ color, flexShrink: 0, marginTop: 2 }}>→</span>
                    {l}
                  </div>
                ))}
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>

      <Reveal show={step >= 3}>
        <Highlight color={tokens.color.accent.teal}>
          <strong style={{ color: tokens.color.accent.teal }}>Besoin :</strong> générer automatiquement des agents uniques, sans expertise bas niveau à chaque engagement.
        </Highlight>
      </Reveal>

    </div>
  )
}
