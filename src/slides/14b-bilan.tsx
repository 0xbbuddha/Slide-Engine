import { SlideContext, SlideMeta } from '../engine/types'
import { motion } from 'framer-motion'
import { tokens } from '../design/tokens'
import { Eyebrow } from '../ui/Eyebrow'
import { Rule } from '../ui/Rule'
import { SectionLabel, Tag } from './_shared'

export const meta: SlideMeta = {
  title: 'Bilan',
  speaker: ['Killian'],
  notes: 'Slide de clôture. Difficultés honnêtes, apprentissages clés, perspectives réalistes. Terminez sur la conclusion et ouvrez les questions.',
}

const DIFFICULTIES = [
  { color: tokens.color.semantic.critical, label: 'Statique vs dynamique', text: 'Bypass statique ne résout pas la détection dynamique - injections mémoire restent bruyantes face à Elastic EDR.' },
  { color: tokens.color.semantic.warning, label: 'Montée en compétence', text: 'Partir de zéro sur C2/maldev a coûté du temps de recherche avant de pouvoir itérer rapidement.' },
  { color: tokens.color.accent.blue, label: 'Validation tardive EDR', text: 'Les tests sur EDR réel sont arrivés tard - l\'écart VT / Defender / Elastic s\'est révélé trop tard pour itérer.' },
]

const LEARNINGS = [
  'Séparer agent, loader et profil C2 simplifie les tests et les variantes.',
  'La boucle build → test → mesure change immédiatement les priorités.',
  'Commencer les tests EDR plus tôt aurait évité des itérations tardives.',
]

const PERSPECTIVES = [
  { color: tokens.color.accent.teal, label: 'Autres C2 & profils', text: 'Nouveaux profils web, support d\'autres frameworks C2' },
  { color: tokens.color.accent.blue, label: 'Furtivité', text: 'Meilleure OPSEC loaders, tests dynamiques automatisés' },
  { color: tokens.color.accent.violet, label: 'Plateforme', text: 'Historique builds, rapports de campagne' },
]

const CONCLUSION_TAGS = [
  { label: '4 agents Mythic', color: tokens.color.accent.blue },
  { label: '3 profils C2', color: tokens.color.accent.teal },
  { label: '2 loaders Windows', color: tokens.color.accent.violet },
  { label: 'Mesure VT par build', color: tokens.color.semantic.warning },
]

export function Component(_: SlideContext) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', alignItems: 'flex-start' }}>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Eyebrow>15 - Bilan</Eyebrow>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ fontSize: tokens.type.size['2xl'], fontWeight: tokens.type.weight.semibold, letterSpacing: tokens.type.tracking.tight, color: tokens.color.text.primary, margin: 0 }}
      >
        Difficultés, apprentissages & perspectives
      </motion.h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, width: '100%' }}>

        {/* Difficultés */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 10, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}
        >
          <SectionLabel color={tokens.color.semantic.critical}>Difficultés</SectionLabel>
          {DIFFICULTIES.map(({ color, label, text }) => (
            <div key={label} style={{ background: tokens.color.surface.base, border: `1px solid ${tokens.color.surface.line}`, borderLeft: `2px solid ${color}`, borderRadius: 6, padding: '8px 10px' }}>
              <div style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size.xs, fontWeight: 700, color, marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: tokens.type.size['2xs'], color: tokens.color.text.muted, lineHeight: 1.4 }}>{text}</div>
            </div>
          ))}
        </motion.div>

        {/* Apprentissages + Perspectives */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.3 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
        >
          <div style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 10, padding: '14px 16px', flex: 1 }}>
            <SectionLabel color={tokens.color.accent.blue}>Apprentissages clés</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 10 }}>
              {LEARNINGS.map((text, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, fontSize: tokens.type.size.xs, color: tokens.color.text.secondary, lineHeight: 1.4 }}>
                  <span style={{ color: tokens.color.accent.blue, flexShrink: 0, fontWeight: 700 }}>→</span>
                  {text}
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 10, padding: '14px 16px' }}>
            <SectionLabel color={tokens.color.accent.teal}>Perspectives</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
              {PERSPECTIVES.map(({ color, label, text }) => (
                <div key={label} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <div style={{ width: 3, height: 3, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 6 }} />
                  <div>
                    <span style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size['2xs'], fontWeight: 700, color }}>{label} </span>
                    <span style={{ fontSize: tokens.type.size['2xs'], color: tokens.color.text.muted }}>{text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Conclusion */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 10, padding: '18px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center' }}
        >
          <div style={{ fontSize: tokens.type.size['2xl'], fontWeight: tokens.type.weight.bold, letterSpacing: tokens.type.tracking.tighter, color: tokens.color.text.primary, lineHeight: 1 }}>
            SeemsLegit
          </div>

          <Rule width="60%" animate={false} />

          <p style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.secondary, lineHeight: tokens.type.leading.relaxed, margin: 0 }}>
            Une chaîne cohérente de build, d\'exécution et de mesure - prototype fonctionnel de bout en bout.
          </p>

          <p style={{ fontSize: tokens.type.size['2xs'], color: tokens.color.text.muted, lineHeight: tokens.type.leading.relaxed, margin: 0 }}>
            Reste un prototype de laboratoire, mais il relie build, exécution, C2 et tests AV/EDR dans une même plateforme.
          </p>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
            {CONCLUSION_TAGS.map(({ label, color }) => (
              <Tag key={label} color={color}>{label}</Tag>
            ))}
          </div>
        </motion.div>

      </div>

    </div>
  )
}
