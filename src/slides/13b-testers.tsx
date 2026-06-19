import { SlideContext, SlideMeta } from '../engine/types'
import { motion } from 'framer-motion'
import { tokens } from '../design/tokens'
import { Eyebrow } from '../ui/Eyebrow'
import { Tag } from './_shared'

export const meta: SlideMeta = {
  title: 'Retours externes',
  speaker: ['Killian'],
  notes: 'Mentionner les ~50 stars et l\'engouement autour des profils C2 exotiques a l\'oral.',
}

export function Component(_: SlideContext) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Eyebrow>Validation externe</Eyebrow>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        style={{ fontSize: tokens.type.size['2xl'], fontWeight: 600, letterSpacing: tokens.type.tracking.tight, color: tokens.color.text.primary, margin: 0 }}
      >
        Retours externes
      </motion.h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, width: '100%' }}>

        {/* Alexandre Tornier */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderTop: `2px solid ${tokens.color.accent.teal}`, borderRadius: 10, padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: `${tokens.color.accent.teal}20`, border: `1.5px solid ${tokens.color.accent.teal}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size.xs, fontWeight: 800, color: tokens.color.accent.teal }}>AT</span>
            </div>
            <div>
              <div style={{ fontSize: tokens.type.size.sm, fontWeight: 700, color: tokens.color.text.primary, lineHeight: 1.2 }}>Alexandre Tornier</div>
              <div style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.muted, marginTop: 2 }}>Expert cybersécurité · Accompagnateur projet Oteria</div>
            </div>
          </div>

          <div style={{ background: tokens.color.surface.base, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 6, padding: '7px 10px', fontSize: tokens.type.size.xs, color: tokens.color.text.tertiary, lineHeight: 1.4 }}>
            <span style={{ fontFamily: tokens.type.family.mono, color: tokens.color.accent.teal, marginRight: 5 }}>▸</span>
            Revue technique globale - architecture, agents, profils C2, pertinence marché
          </div>

          <div style={{ flex: 1, fontSize: tokens.type.size.sm, color: tokens.color.text.secondary, lineHeight: tokens.type.leading.relaxed, fontStyle: 'italic' }}>
            "L'architecture est bien pensée et ambitieuse. L'interface web est clairement le différenciateur principal - aucun concurrent (ScareCrow, Nimcrypt2, Donut) n'a de dashboard avec gestion de campagnes. La pertinence est vraiment forte : l'évasion EDR est le problème numéro un des Red Teams aujourd'hui. Ce projet a un vrai potentiel de tremplin professionnel."
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', borderTop: `1px solid ${tokens.color.surface.line}`, paddingTop: 10 }}>
            <Tag color={tokens.color.text.muted}>Architecture</Tag>
            <Tag color={tokens.color.text.muted}>Marché Red Team</Tag>
            <div style={{ marginLeft: 'auto' }}>
              <Tag color={tokens.color.semantic.success}>Projet pertinent</Tag>
            </div>
          </div>
        </motion.div>

        {/* Communauté Mythic */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderTop: `2px solid ${tokens.color.accent.violet}`, borderRadius: 10, padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: `${tokens.color.accent.violet}20`, border: `1.5px solid ${tokens.color.accent.violet}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size.xs, fontWeight: 800, color: tokens.color.accent.violet }}>M</span>
            </div>
            <div>
              <div style={{ fontSize: tokens.type.size.sm, fontWeight: 700, color: tokens.color.text.primary, lineHeight: 1.2 }}>Communauté Mythic</div>
              <div style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.muted, marginTop: 2 }}>Discord · GitHub · Partage des profils C2</div>
            </div>
          </div>

          {/* Stars stat */}
          <div style={{ background: `${tokens.color.accent.violet}0a`, border: `1px solid ${tokens.color.accent.violet}30`, borderRadius: 8, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: tokens.type.family.mono, fontSize: '32px', fontWeight: 800, color: tokens.color.accent.violet, lineHeight: 1 }}>~50</div>
              <div style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.muted, marginTop: 4, fontFamily: tokens.type.family.mono }}>★ stars</div>
            </div>
            <div style={{ width: 1, height: 40, background: tokens.color.surface.line }} />
            <div style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.secondary, lineHeight: 1.5 }}>
              Engouement notable autour des profils C2 exotiques - Notion a particulièrement retenu l'attention de la communauté.
            </div>
          </div>

          <div style={{ flex: 1, fontSize: tokens.type.size.sm, color: tokens.color.text.secondary, lineHeight: tokens.type.leading.relaxed, fontStyle: 'italic' }}>
            "Profil Notion particulièrement discuté - l'idée d'utiliser une API officielle et documentée comme canal de tasking a généré beaucoup d'échanges. Plusieurs membres ont demandé à tester le profil directement."
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', borderTop: `1px solid ${tokens.color.surface.line}`, paddingTop: 10 }}>
            <Tag color={tokens.color.text.muted}>Profils C2</Tag>
            <Tag color={tokens.color.text.muted}>Covert channel</Tag>
            <div style={{ marginLeft: 'auto' }}>
              <Tag color={tokens.color.accent.violet}>Communauté active</Tag>
            </div>
          </div>
        </motion.div>

        {/* Lavender */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderTop: `2px solid ${tokens.color.semantic.warning}`, borderRadius: 10, padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: `${tokens.color.semantic.warning}20`, border: `1.5px solid ${tokens.color.semantic.warning}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size.xs, fontWeight: 800, color: tokens.color.semantic.warning }}>LV</span>
            </div>
            <div>
              <div style={{ fontSize: tokens.type.size.sm, fontWeight: 700, color: tokens.color.text.primary, lineHeight: 1.2 }}>Lavender</div>
              <div style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.muted, marginTop: 2 }}>Maldev Community · Loader & Evasion</div>
            </div>
          </div>

          <div style={{ background: tokens.color.surface.base, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 6, padding: '7px 10px', fontSize: tokens.type.size.xs, color: tokens.color.text.tertiary, lineHeight: 1.4 }}>
            <span style={{ fontFamily: tokens.type.family.mono, color: tokens.color.semantic.warning, marginRight: 5 }}>▸</span>
            Review des loaders - techniques d'évasion comportementale et pistes d'amélioration
          </div>

          <div style={{ flex: 1, fontSize: tokens.type.size.sm, color: tokens.color.text.secondary, lineHeight: tokens.type.leading.relaxed, fontStyle: 'italic' }}>
            "Pour aller plus loin face à la détection comportementale, le DLL sideloading et les XLL sont des pistes concrètes à explorer. Crystal Palace Loader est aussi une bonne référence pour étendre les capacités d'injection sans repartir de zéro."
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', borderTop: `1px solid ${tokens.color.surface.line}`, paddingTop: 10 }}>
            <Tag color={tokens.color.text.muted}>Loaders</Tag>
            <Tag color={tokens.color.text.muted}>EDR evasion</Tag>
            <div style={{ marginLeft: 'auto' }}>
              <Tag color={tokens.color.semantic.warning}>Pistes identifiées</Tag>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
