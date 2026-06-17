import { SlideContext, SlideMeta } from '../engine/types'
import { motion } from 'framer-motion'
import { tokens } from '../design/tokens'
import { Eyebrow } from '../ui/Eyebrow'
import { Tag, SectionLabel } from './_shared'

export const meta: SlideMeta = {
  title: 'Gestion de projet',
  speaker: ['Harouna', 'Killian', 'Jeremy'],
  notes: 'Kanban sur plateforme hébergée, 3 tracks parallèles. L\'organisation rigoureuse a permis de mener plateforme + 4 agents en parallèle.',
}

const TRACKS = [
  { label: 'Plateforme', color: tokens.color.accent.teal, detail: 'Backend FastAPI · Frontend React · Docker Compose' },
  { label: 'Agents', color: tokens.color.accent.blue, detail: 'Kratos · Morpheus · Hermes · Aphrodite · Hephaestus' },
  { label: 'Évasion', color: tokens.color.semantic.critical, detail: 'Recherche techniques · Code Generator · VirusTotal' },
]

const TEAM = [
  { name: 'Harouna Coulibaly', color: tokens.color.accent.teal, role: 'Plateforme SeemsLegit — architecture, backend FastAPI, Docker' },
  { name: 'Killian Prin-Abeil', color: tokens.color.accent.blue, role: 'Agents Mythic — Aphrodite (Nim), Hephaestus, Chess.com C2' },
  { name: 'Jeremy Diaz', color: tokens.color.accent.violet, role: 'Agents Mythic — Kratos (C), Morpheus (Go), Hermes (Python), intégration' },
]

const KANBAN = [
  { col: 'Backlog', color: tokens.color.text.muted, items: ['Domain fronting', 'Sliver support'] },
  { col: 'In Progress', color: tokens.color.accent.blue, items: ['Code Generator v2', 'Notion C2'] },
  { col: 'Review', color: tokens.color.semantic.warning, items: ['VT Integration', 'Hephaestus opsec'] },
  { col: 'Done', color: tokens.color.semantic.success, items: ['4 agents Mythic', 'Chess.com C2', 'CLI seemslegit'] },
]

export function Component(_: SlideContext) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', alignItems: 'flex-start' }}>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Eyebrow>12 — Gestion de Projet</Eyebrow>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ fontSize: tokens.type.size['2xl'], fontWeight: tokens.type.weight.semibold, letterSpacing: tokens.type.tracking.tight, color: tokens.color.text.primary, margin: 0 }}
      >
        Organisation &amp; Kanban
      </motion.h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, width: '100%' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Tracks */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderLeft: `3px solid ${tokens.color.accent.teal}`, borderRadius: 12, padding: '18px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
          >
            <SectionLabel color={tokens.color.accent.teal}>3 Tracks parallèles</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
              {TRACKS.map(({ label, color, detail }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, background: tokens.color.surface.base, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 7, padding: '7px 12px' }}>
                  <Tag color={color}>{label}</Tag>
                  <span style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.muted }}>{detail}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.32 }}
            style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 12, padding: '18px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
          >
            <SectionLabel>Équipe</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 12 }}>
              {TEAM.map(({ name, color, role }) => (
                <div key={name} style={{ background: tokens.color.surface.base, border: `1px solid ${tokens.color.surface.line}`, borderLeft: `2px solid ${color}`, borderRadius: 7, padding: '9px 14px' }}>
                  <div style={{ fontSize: tokens.type.size.sm, fontWeight: tokens.type.weight.semibold, color: tokens.color.text.primary, marginBottom: 2 }}>{name}</div>
                  <div style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.muted, lineHeight: tokens.type.leading.normal }}>{role}</div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Kanban */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 12, padding: '18px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
        >
          <SectionLabel>Tableau Kanban</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginTop: 14 }}>
            {KANBAN.map(({ col, color, items }) => (
              <div key={col} style={{ background: tokens.color.surface.base, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 8, padding: '12px 14px' }}>
                <div style={{
                  fontFamily: tokens.type.family.mono,
                  fontSize: tokens.type.size.xs,
                  fontWeight: tokens.type.weight.semibold,
                  color,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 10,
                  paddingBottom: 8,
                  borderBottom: `1px solid ${tokens.color.surface.line}`,
                }}>
                  {col}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {items.map((item) => (
                    <div key={item} style={{
                      background: tokens.color.surface.subtle,
                      border: `1px solid ${tokens.color.surface.line}`,
                      borderRadius: 4,
                      padding: '4px 8px',
                      fontSize: tokens.type.size.xs,
                      color: tokens.color.text.tertiary,
                    }}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  )
}
