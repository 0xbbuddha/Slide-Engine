import { SlideContext, SlideMeta } from '../engine/types'
import { motion } from 'framer-motion'
import { tokens } from '../design/tokens'
import { Eyebrow } from '../ui/Eyebrow'
import { Rule } from '../ui/Rule'
import { CountUp, StaggerList, StaggerItem, Highlight } from './_shared'

export const meta: SlideMeta = {
  title: 'Aperçu',
  speaker: ['Harouna'],
  notes: 'Vue d\'ensemble rapide : 4 agents from scratch, 3 profils C2 couverts, polymorphisme par build, une seule plateforme intégrée.',
}

const KPIs = [
  { raw: '4', to: 4, label: 'Agents Mythic\nfrom scratch', color: tokens.color.accent.blue },
  { raw: '3', to: 3, label: 'Profils C2\ncouverts', color: tokens.color.accent.teal },
  { raw: '∞', to: null, label: 'Binaires uniques\npar build', color: tokens.color.accent.violet },
  { raw: '1', to: 1, label: 'Plateforme web\nunifiée + CLI', color: tokens.color.semantic.warning },
]

const POINTS = [
  'Plateforme containerisée : FastAPI · React · PostgreSQL · Docker',
  'Moteur CodeGenerator : renommage symboles, chiffrement strings, junk injection',
  'Boucle VirusTotal : mesure du taux de détection à chaque build',
]

export function Component(_: SlideContext) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36, width: '100%', alignItems: 'flex-start' }}>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Eyebrow>01 — Aperçu</Eyebrow>
      </motion.div>

      {/* KPI grid */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, width: '100%' }}
      >
        {KPIs.map(({ raw, to, label, color }) => (
          <motion.div
            key={label}
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } } }}
            style={{
              background: tokens.color.surface.subtle,
              border: `1px solid ${tokens.color.surface.line}`,
              borderTop: `3px solid ${color}`,
              borderRadius: 12,
              padding: '28px 20px',
              textAlign: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{
              fontSize: tokens.type.size['4xl'],
              fontWeight: tokens.type.weight.semibold,
              letterSpacing: tokens.type.tracking.tighter,
              color,
              lineHeight: 1,
              marginBottom: 10,
              fontVariantNumeric: 'tabular-nums',
            }}>
              {to !== null ? <CountUp to={to} color={color} size={tokens.type.size['4xl']} /> : raw}
            </div>
            <div style={{
              fontSize: tokens.type.size.xs,
              color: tokens.color.text.tertiary,
              lineHeight: tokens.type.leading.normal,
              whiteSpace: 'pre-line',
            }}>
              {label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <Rule width="50%" animate />

      {/* Summary points */}
      <StaggerList delay={0.08}>
        {POINTS.map((p) => (
          <StaggerItem key={p} variant="left">
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              fontSize: tokens.type.size.sm,
              color: tokens.color.text.secondary,
              lineHeight: tokens.type.leading.normal,
            }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: tokens.color.accent.teal, flexShrink: 0, marginTop: 6 }} />
              {p}
            </div>
          </StaggerItem>
        ))}
      </StaggerList>

    </div>
  )
}
