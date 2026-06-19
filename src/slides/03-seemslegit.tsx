import { SlideContext, SlideMeta } from '../engine/types'
import { motion } from 'framer-motion'
import { tokens } from '../design/tokens'
import { Eyebrow } from '../ui/Eyebrow'
import { CountUp, SectionLabel } from './_shared'

export const meta: SlideMeta = {
  title: 'SeemsLegit',
  speaker: ['Jeremy'],
  notes: 'Présentez la réponse : une plateforme qui automatise la génération d\'agents uniques. Chiffres clés en haut, objectifs et méthodologie en bas. Insistez sur le binaire unique à chaque build.',
}

const KPIs = [
  { raw: '4', to: 4, label: 'Agents Mythic\nfrom scratch', color: tokens.color.accent.blue },
  { raw: '2', to: 2, label: 'Loaders\nWindows', color: tokens.color.semantic.warning },
  { raw: '3', to: 3, label: 'Profils C2\ncouverts', color: tokens.color.accent.teal },
  { raw: '∞', to: null, label: 'Binaires uniques\npar build', color: tokens.color.accent.violet },
  { raw: '1', to: 1, label: 'Plateforme web\nunifiée + CLI', color: tokens.color.accent.blue },
]

const OBJECTIVES = [
  {
    color: tokens.color.accent.teal,
    label: 'Objectif principal',
    text: 'Une plateforme web générant des agents Mythic où chaque build est unique. Les agents check-in dans Mythic et exécutent des commandes.',
  },
  {
    color: tokens.color.accent.violet,
    label: 'Canaux C2 couverts',
    text: 'Exploiter des services tiers légitimes (Notion, Chess.com) comme vecteurs C2 - trafic indiscernable d\'activité normale.',
  },
]

const METHOD = [
  { label: 'Organisation', text: 'Kanban sur plateforme hébergée' },
  { label: 'Infrastructure', text: 'Docker Compose pour isolation et portabilité' },
  { label: 'Mesure', text: 'VirusTotal · Microsoft Defender · Elastic EDR (lab)' },
  { label: 'Mentoring', text: 'Alexandre Tornier' },
]

export function Component(_: SlideContext) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', alignItems: 'flex-start' }}>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Eyebrow>04 - SeemsLegit</Eyebrow>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ fontSize: tokens.type.size['2xl'], fontWeight: tokens.type.weight.semibold, letterSpacing: tokens.type.tracking.tight, color: tokens.color.text.primary, margin: 0 }}
      >
        SeemsLegit - Notre réponse
      </motion.h2>

      {/* KPI grid */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 12, width: '100%' }}
      >
        {KPIs.map(({ raw, to, label, color }) => (
          <motion.div
            key={label}
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } } }}
            style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderTop: `3px solid ${color}`, borderRadius: 10, padding: '20px 16px', textAlign: 'center' }}
          >
            <div style={{ fontSize: tokens.type.size['3xl'], fontWeight: tokens.type.weight.semibold, letterSpacing: tokens.type.tracking.tighter, color, lineHeight: 1, marginBottom: 8, fontVariantNumeric: 'tabular-nums' }}>
              {to !== null ? <CountUp to={to} color={color} size={tokens.type.size['3xl']} /> : raw}
            </div>
            <div style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.tertiary, lineHeight: tokens.type.leading.normal, whiteSpace: 'pre-line' }}>
              {label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Objectives + Method */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, width: '100%' }}>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
          style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
        >
          {OBJECTIVES.map(({ color, label, text }) => (
            <motion.div
              key={label}
              variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0, transition: { duration: 0.4 } } }}
              style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderLeft: `3px solid ${color}`, borderRadius: 10, padding: '16px 20px' }}
            >
              <SectionLabel color={color}>{label}</SectionLabel>
              <p style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.secondary, lineHeight: tokens.type.leading.relaxed, margin: '8px 0 0' }}>{text}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 10, padding: '16px 20px' }}
        >
          <SectionLabel>Méthodologie</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, marginTop: 12 }}>
            {METHOD.map(({ label, text }, i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'baseline', gap: 10, padding: '7px 0', borderBottom: i < METHOD.length - 1 ? `1px solid ${tokens.color.surface.line}` : 'none' }}>
                <span style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size.xs, fontWeight: tokens.type.weight.semibold, color: tokens.color.accent.teal, minWidth: 82, flexShrink: 0 }}>{label}</span>
                <span style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.secondary }}>{text}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  )
}
