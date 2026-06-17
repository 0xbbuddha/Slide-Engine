import { SlideContext, SlideMeta } from '../engine/types'
import { motion } from 'framer-motion'
import { tokens } from '../design/tokens'
import { Eyebrow } from '../ui/Eyebrow'
import { SectionLabel, Highlight } from './_shared'

export const meta: SlideMeta = {
  title: 'Perspectives',
  speaker: ['Harouna'],
  notes: 'Montrez que le projet a une vision claire à long terme. Le jury apprécie une roadmap réaliste.',
}

const ROADMAP = [
  {
    color: tokens.color.accent.teal,
    title: 'Frameworks C2',
    items: ['Support Sliver', 'Support Havoc complet', 'API Mythic v3 complète'],
  },
  {
    color: tokens.color.accent.blue,
    title: 'Opsec & Évasion',
    items: ['TLS certificate pinning', 'Domain fronting profiles', 'Direct syscalls kernel-level', 'OPSEC hardening production'],
  },
  {
    color: tokens.color.accent.violet,
    title: 'Plateforme',
    items: ['Chiffrement clés API', 'Export rapports PDF', 'Webhooks VirusTotal', 'Campagnes liées aux agents'],
  },
]

export function Component(_: SlideContext) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: '100%', alignItems: 'flex-start' }}>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Eyebrow>14 — Roadmap</Eyebrow>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ fontSize: tokens.type.size['2xl'], fontWeight: tokens.type.weight.semibold, letterSpacing: tokens.type.tracking.tight, color: tokens.color.text.primary, margin: 0 }}
      >
        Perspectives &amp; améliorations
      </motion.h2>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, width: '100%' }}
      >
        {ROADMAP.map(({ color, title, items }) => (
          <motion.div
            key={title}
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
            style={{
              background: tokens.color.surface.subtle,
              border: `1px solid ${tokens.color.surface.line}`,
              borderLeft: `3px solid ${color}`,
              borderRadius: 12,
              padding: '22px 24px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}
          >
            <SectionLabel color={color}>{title}</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 14 }}>
              {items.map((item) => (
                <div key={item} style={{ display: 'flex', gap: 8, fontSize: tokens.type.size.sm, color: tokens.color.text.secondary, lineHeight: tokens.type.leading.normal }}>
                  <span style={{ color, flexShrink: 0 }}>→</span>
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.55 }}
        style={{ width: '100%' }}
      >
        <Highlight color={tokens.color.accent.teal}>
          <strong style={{ color: tokens.color.accent.teal }}>Vision à terme :</strong>{' '}
          un toolkit intégré pour les red teams — de la génération polymorphique à la gestion de campagne, avec feedback opérationnel continu. Support multi-framework (Sliver, Havoc, Mythic).
        </Highlight>
      </motion.div>

    </div>
  )
}
