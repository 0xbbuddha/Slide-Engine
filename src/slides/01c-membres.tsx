import { SlideContext, SlideMeta } from '../engine/types'
import { motion } from 'framer-motion'
import { tokens } from '../design/tokens'
import { Eyebrow } from '../ui/Eyebrow'

export const meta: SlideMeta = {
  title: 'Equipe',
  speaker: ['Harouna', 'Killian', 'Jeremy'],
  notes: 'Presentez-vous brievement chacun. Nom, parcours, ce qui vous a amene a ce projet.',
}

const MEMBERS = [
  {
    name: 'Harouna Coulibaly',
    initials: 'HC',
    color: tokens.color.accent.teal,
    photo: '/harouna.png',
    role: 'Project Lead · Malware Developer · Infrastructure Architect',
    tags: ['C99 / C++', 'Process Injection', 'Lab Proxmox'],
  },
  {
    name: 'Killian Prin-Abeil',
    initials: 'KP',
    color: tokens.color.accent.blue,
    photo: '/killian.jpg',
    role: 'Malware Developer · Platform Architect · C2 Researcher',
    tags: ['Nim / Python', 'Mythic API', 'Covert C2'],
  },
  {
    name: 'Jeremy Diaz',
    initials: 'JD',
    color: tokens.color.accent.violet,
    photo: '/jeremy.png',
    role: 'Malware Developer · Build Engineer · Technical Tester',
    tags: ['Go', 'Cross-compile', 'AV Testing'],
  },
]

export function Component(_: SlideContext) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, width: '100%', alignItems: 'flex-start' }}>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Eyebrow>Presentation de l'equipe</Eyebrow>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08 }}
        style={{ fontSize: tokens.type.size['2xl'], fontWeight: tokens.type.weight.semibold, letterSpacing: tokens.type.tracking.tight, color: tokens.color.text.primary, margin: 0 }}
      >
        L'equipe SeemsLegit
      </motion.h2>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } } }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, width: '100%' }}
      >
        {MEMBERS.map(({ name, initials, color, photo, role, tags }) => (
          <motion.div
            key={name}
            variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } } }}
            style={{
              background: tokens.color.surface.subtle,
              border: `1px solid ${tokens.color.surface.line}`,
              borderTop: `2px solid ${color}`,
              borderRadius: 12,
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
            }}
          >
            {/* Photo / avatar */}
            <div style={{ position: 'relative' }}>
              <motion.div
                animate={{ opacity: [0.15, 0.3, 0.15] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                style={{ position: 'absolute', inset: -6, borderRadius: '50%', border: `1px solid ${color}`, pointerEvents: 'none' }}
              />
              <div style={{ width: 90, height: 90, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${color}40`, flexShrink: 0 }}>
                <img
                  src={photo}
                  alt={name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    const target = e.currentTarget
                    target.style.display = 'none'
                    const parent = target.parentElement!
                    parent.style.background = `${color}15`
                    parent.style.display = 'flex'
                    parent.style.alignItems = 'center'
                    parent.style.justifyContent = 'center'
                    parent.innerHTML = `<span style="font-family:monospace;font-size:22px;font-weight:700;color:${color}">${initials}</span>`
                  }}
                />
              </div>
            </div>

            {/* Info */}
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
              <div style={{ fontSize: tokens.type.size.md, fontWeight: tokens.type.weight.semibold, color: tokens.color.text.primary, letterSpacing: '-0.01em' }}>
                {name}
              </div>

              <div style={{ fontSize: tokens.type.size.sm, color, fontWeight: 600 }}>
                {role}
              </div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
                {tags.map(t => (
                  <span key={t} style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size['2xs'], background: `${color}10`, color, border: `1px solid ${color}30`, borderRadius: 4, padding: '2px 8px', fontWeight: 600 }}>
                    {t}
                  </span>
                ))}
              </div>

              <div style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.muted }}>
                M1 Cybersecurite · Oteria Cyber School
              </div>
            </div>

          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        style={{ width: '100%', textAlign: 'center', fontSize: tokens.type.size.xs, color: tokens.color.text.muted, fontFamily: tokens.type.family.mono, letterSpacing: '0.04em' }}
      >
        Projet SeemsLegit - Soutenance M1 · 2025/2026
      </motion.div>

    </div>
  )
}
