import { SlideContext, SlideMeta } from '../engine/types'
import { motion } from 'framer-motion'
import { tokens } from '../design/tokens'
import { Eyebrow } from '../ui/Eyebrow'
import { SectionLabel, Highlight } from './_shared'

export const meta: SlideMeta = {
  title: 'Apprentissages',
  speaker: ['Jeremy'],
  notes: 'Ce slide montre la maturite de l\'equipe. Chaque apprentissage doit etre concret et relie a une experience vecue dans le projet.',
}

const LEARNINGS = [
  {
    color: tokens.color.accent.blue,
    domain: 'Technique',
    items: [
      { who: 'Killian', text: 'La profondeur de l\'evasion EDR : chaque couche (AMSI, ETW, ntdll) est independante et peut etre contournee separement - et chacune a ses propres contraintes.' },
      { who: 'Jeremy', text: 'Le gap entre un agent "qui tourne" et un agent "qui tourne en conditions operationnelles" est enorme - stabilite, gestion d\'erreurs, opsec par defaut.' },
      { who: 'Harouna', text: 'Containeriser une stack C2 demande une reflexion securite approfondie : isolation reseau, secrets, permissions - c\'est un produit a part entiere.' },
    ],
  },
  {
    color: tokens.color.accent.teal,
    domain: 'Organisation',
    items: [
      { who: 'Equipe', text: '3 tracks paralleles avec des dependances inter-tracks non documentees sont un risque majeur - les points de synchronisation hebdomadaires ont ete essentiels.' },
      { who: 'Equipe', text: 'La mesure objective (VT score) a ete un outil de pilotage puissant - elle a dicte les priorites de recherche sur les modules d\'evasion.' },
    ],
  },
]

const RETROSPHERE = [
  { label: 'On referait pareil', items: ['Choix Nim pour l\'evasion', 'Architecture Docker Compose', 'Integration VT en boucle de feedback'], color: tokens.color.semantic.success },
  { label: 'On changerait', items: ['Fixer l\'API Mythic target en amont', 'Tests de compatibilite modules des le debut', 'Plus de temps sur la partie OPSEC prod'], color: tokens.color.semantic.warning },
]

export function Component(_: SlideContext) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', alignItems: 'flex-start' }}>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Eyebrow>15 - Apprentissages</Eyebrow>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ fontSize: tokens.type.size['2xl'], fontWeight: tokens.type.weight.semibold, letterSpacing: tokens.type.tracking.tight, color: tokens.color.text.primary, margin: 0 }}
      >
        Ce qu'on a appris
      </motion.h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16, width: '100%' }}>

        {/* Left - learnings by domain */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } }}
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          {LEARNINGS.map(({ color, domain, items }) => (
            <motion.div
              key={domain}
              variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0, transition: { duration: 0.4 } } }}
              style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderLeft: `3px solid ${color}`, borderRadius: 10, padding: '14px 18px' }}
            >
              <SectionLabel color={color}>{domain}</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
                {items.map(({ who, text }, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: tokens.type.family.mono, fontSize: '9px', color, fontWeight: 700, flexShrink: 0, marginTop: 3, minWidth: 40 }}>
                      {who}
                    </span>
                    <span style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.secondary, lineHeight: tokens.type.leading.relaxed }}>
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Right - retro */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            {RETROSPHERE.map(({ label, items, color }) => (
              <motion.div
                key={label}
                variants={{ hidden: { opacity: 0, x: 12 }, show: { opacity: 1, x: 0, transition: { duration: 0.4 } } }}
                style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 10, padding: '14px 16px' }}
              >
                <SectionLabel color={color}>{label}</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 8 }}>
                  {items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, fontSize: tokens.type.size.xs, color: tokens.color.text.secondary }}>
                      <span style={{ color, flexShrink: 0, fontWeight: 700 }}>{color === tokens.color.semantic.success ? '+' : '~'}</span>
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <Highlight color={tokens.color.accent.blue}>
              <strong style={{ color: tokens.color.accent.blue }}>Cle :</strong> la mesure objective (VT score par build) est ce qui a transforme la recherche en ingenierie - sans elle, on aurait itere a l'aveugle.
            </Highlight>
          </motion.div>
        </div>

      </div>
    </div>
  )
}
