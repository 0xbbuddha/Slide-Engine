import { SlideContext, SlideMeta } from '../engine/types'
import { motion } from 'framer-motion'
import { tokens } from '../design/tokens'
import { Eyebrow } from '../ui/Eyebrow'
import { SectionLabel, StaggerList, StaggerItem } from './_shared'

export const meta: SlideMeta = {
  title: 'Solution',
  speaker: ['Harouna'],
  notes: 'Présentez l\'approche globale. Insistez sur les 3 tracks parallèles et la rigueur de la méthode.',
}

const OBJECTIVES = [
  {
    color: tokens.color.accent.teal,
    label: 'Objectif principal',
    text: 'Une plateforme web générant des agents Mythic où chaque build est unique. Les agents check-in dans Mythic et exécutent des commandes.',
  },
  {
    color: tokens.color.accent.violet,
    label: 'Canaux C2 couverts',
    text: 'Exploiter des services tiers légitimes (Notion, Chess.com) comme vecteurs C2 — trafic indiscernable d\'activité normale.',
  },
]

const METHOD = [
  { label: 'Organisation', text: 'Kanban sur plateforme hébergée — 3 tracks parallèles' },
  { label: 'Infra', text: 'Docker Compose pour isolation et portabilité' },
  { label: 'Recherche', text: 'Sektor7 · MalDev Academy · ired.team' },
  { label: 'Mesure', text: 'VirusTotal — taux de détection par build' },
  { label: 'Mentoring', text: 'Alexandre Tornier' },
]

export function Component(_: SlideContext) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: '100%', alignItems: 'flex-start' }}>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Eyebrow>04 — Solution</Eyebrow>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ fontSize: tokens.type.size['2xl'], fontWeight: tokens.type.weight.semibold, letterSpacing: tokens.type.tracking.tight, color: tokens.color.text.primary, margin: 0 }}
      >
        SeemsLegit — Notre réponse
      </motion.h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, width: '100%' }}>

        {/* Left — Objectives */}
        <StaggerList gap={14} delay={0.1}>
          {OBJECTIVES.map(({ color, label, text }) => (
            <StaggerItem key={label} variant="left">
              <div style={{
                background: tokens.color.surface.subtle,
                border: `1px solid ${tokens.color.surface.line}`,
                borderLeft: `3px solid ${color}`,
                borderRadius: 12,
                padding: '20px 24px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}>
                <SectionLabel color={color}>{label}</SectionLabel>
                <p style={{ fontSize: tokens.type.size.sm, color: tokens.color.text.secondary, lineHeight: tokens.type.leading.relaxed, margin: '10px 0 0' }}>
                  {text}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerList>

        {/* Right — Method */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            background: tokens.color.surface.subtle,
            border: `1px solid ${tokens.color.surface.line}`,
            borderRadius: 12,
            padding: '20px 24px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <SectionLabel>Méthodologie</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, marginTop: 14 }}>
            {METHOD.map(({ label, text }, i) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 12,
                  padding: '9px 0',
                  borderBottom: i < METHOD.length - 1 ? `1px solid ${tokens.color.surface.line}` : 'none',
                }}
              >
                <span style={{
                  fontFamily: tokens.type.family.mono,
                  fontSize: tokens.type.size.xs,
                  fontWeight: tokens.type.weight.semibold,
                  color: tokens.color.accent.teal,
                  minWidth: 80,
                  flexShrink: 0,
                }}>
                  {label}
                </span>
                <span style={{ fontSize: tokens.type.size.sm, color: tokens.color.text.secondary }}>
                  {text}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  )
}
