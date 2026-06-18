import { SlideContext, SlideMeta } from '../engine/types'
import { motion } from 'framer-motion'
import { tokens } from '../design/tokens'
import { Eyebrow } from '../ui/Eyebrow'

export const meta: SlideMeta = {
  title: 'Sommaire',
  speaker: ['Killian'],
  notes: 'Donnez une vue d\'ensemble rapide du plan. 4 grandes parties. Environ 20 minutes de soutenance.',
}

const SECTIONS = [
  {
    color: tokens.color.accent.blue,
    label: 'Introduction',
    items: [
      { n: '01', title: 'Aperçu du projet' },
      { n: '02', title: 'Contexte - La trilemme Red Team' },
      { n: '03', title: 'Problème & Besoin' },
      { n: '04', title: 'Solution SeemsLegit' },
    ],
  },
  {
    color: tokens.color.accent.teal,
    label: 'Architecture & Agents',
    items: [
      { n: '05', title: 'Architecture plateforme' },
      { n: '06', title: '4 Agents from scratch' },
      { n: '07', title: 'Aphrodite - Focus Nim' },
      { n: '08', title: 'Hephaestus - Loader' },
    ],
  },
  {
    color: tokens.color.accent.violet,
    label: 'Évasion & Démo',
    items: [
      { n: '09', title: 'Profils C2 couverts' },
      { n: '10', title: 'Code Generator' },
      { n: '11', title: 'VirusTotal - Bypass' },
    ],
  },
  {
    color: tokens.color.semantic.warning,
    label: 'Bilan',
    items: [
      { n: '12', title: 'Gestion de projet' },
      { n: '13', title: 'Résultats & Métriques' },
      { n: '14', title: 'Difficultés rencontrées' },
      { n: '15', title: 'Apprentissages' },
      { n: '16', title: 'Roadmap & Perspectives' },
    ],
  },
]

export function Component(_: SlideContext) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', alignItems: 'flex-start' }}>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Eyebrow>Plan de la soutenance</Eyebrow>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08 }}
        style={{ fontSize: tokens.type.size['2xl'], fontWeight: tokens.type.weight.semibold, letterSpacing: tokens.type.tracking.tight, color: tokens.color.text.primary, margin: 0 }}
      >
        Sommaire
      </motion.h2>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, width: '100%' }}
      >
        {SECTIONS.map(({ color, label, items }) => (
          <motion.div
            key={label}
            variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }}
            style={{
              background: tokens.color.surface.subtle,
              border: `1px solid ${tokens.color.surface.line}`,
              borderTop: `2px solid ${color}`,
              borderRadius: 10,
              overflow: 'hidden',
            }}
          >
            {/* Section header */}
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${tokens.color.surface.line}`, background: `${color}07` }}>
              <div style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size.xs, fontWeight: 700, color, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {label}
              </div>
            </div>

            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', padding: '10px 0' }}>
              {items.map(({ n, title }, i) => (
                <motion.div
                  key={n}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.3 }}
                  style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '5px 16px' }}
                >
                  <span style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size['2xs'], color: `${color}90`, fontWeight: 700, flexShrink: 0, minWidth: 20 }}>
                    {n}
                  </span>
                  <span style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.secondary, lineHeight: 1.4 }}>
                    {title}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

    </div>
  )
}
