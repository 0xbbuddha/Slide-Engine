import { SlideContext, SlideMeta } from '../engine/types'
import { motion } from 'framer-motion'
import { tokens } from '../design/tokens'
import { Eyebrow } from '../ui/Eyebrow'
import { Tag, SectionLabel } from './_shared'

export const meta: SlideMeta = {
  title: 'Aphrodite',
  speaker: ['Killian'],
  notes: 'Insistez sur les capacités offensives : 3 techniques d\'injection, execute_assembly CLR, BOF loader. Pour le chiffrement si question : "AES-256 standard, on a choisi la lib nimcrypto pour ne pas réinventer la roue." Passez vite.',
}

function AphroditeLogo() {
  const V = tokens.color.accent.violet
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 120, height: 120, flexShrink: 0 }}>
      <motion.div animate={{ scale: [1, 1.25, 1], opacity: [0.18, 0, 0.18] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        style={{ position: 'absolute', width: 112, height: 112, borderRadius: '50%', border: `1px solid ${V}`, pointerEvents: 'none' }} />
      <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.28, 0.05, 0.28] }} transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut', delay: 0.4 }}
        style={{ position: 'absolute', width: 88, height: 88, borderRadius: '50%', border: `1.5px solid ${V}`, pointerEvents: 'none' }} />
      <motion.div animate={{ opacity: [0.12, 0.22, 0.12] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        style={{ position: 'absolute', width: 66, height: 66, borderRadius: '50%', background: `radial-gradient(circle, ${V}40 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <motion.img src="/aphrodite.svg" alt="Aphrodite" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.34, 1.2, 0.64, 1] }}
        style={{ width: 72, height: 72, objectFit: 'contain', filter: `drop-shadow(0 0 16px ${V}70)`, zIndex: 1 }} />
    </div>
  )
}

const EVASION = [
  { text: 'Obfuscation des chaines au build - aucun artefact strings(1)' },
  { text: 'AMSI/ETW désactivés en mémoire avant chaque opération sensible' },
  { text: 'Sleep jitter - intervalle aleatoire entre beacons' },
  { text: 'Binaire statique optionnel - zero dependance runtime sur la cible' },
]

const INJECTION = [
  { label: 'createremotethread', tag: 'EDR-visible', color: tokens.color.semantic.warning },
  { label: 'queueapcthread',     tag: 'discret',     color: tokens.color.accent.blue },
  { label: 'ntmapview',         tag: 'stealth max',  color: tokens.color.semantic.success },
]

const POSTEX = [
  { cmd: 'execute_assembly', note: 'CLR en mémoire, bypass AMSI intégré' },
  { cmd: 'inline_execute',   note: 'loader BOF/COFF x64, Beacon API complete' },
  { cmd: 'steal_token',      note: 'impersonation + SeDebugPrivilege' },
  { cmd: 'screenshot',       note: 'capture GDI exfiltree via canal C2 actif' },
]

export function Component(_: SlideContext) {
  const V = tokens.color.accent.violet
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', alignItems: 'flex-start' }}>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Eyebrow>09 - Aphrodite - Focus technique</Eyebrow>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.08 }}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 18, background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderTop: `2px solid ${V}`, borderRadius: 8, padding: '12px 20px' }}
      >
        <span style={{ fontFamily: tokens.type.family.mono, fontSize: '31px', fontWeight: 700, color: V, letterSpacing: '-0.04em', lineHeight: 1 }}>Nim</span>
        <div style={{ width: 1, height: 28, background: tokens.color.surface.line }} />
        <div style={{ display: 'flex', gap: 7 }}>
          <Tag color={V}>Aphrodite</Tag>
          <Tag color={tokens.color.text.muted}>Linux / Windows x64</Tag>
          <Tag color={tokens.color.text.muted}>EXE / shellcode</Tag>
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: tokens.type.family.mono, fontSize: '12px', color: tokens.color.text.muted, letterSpacing: '0.06em' }}>focus agent Nim</span>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: 16, width: '100%' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.18 }}
            style={{ background: `linear-gradient(135deg, ${tokens.color.surface.subtle} 60%, ${V}06 100%)`, border: `1px solid ${tokens.color.surface.line}`, borderLeft: `3px solid ${V}`, borderRadius: 10, padding: '16px 18px', display: 'flex', gap: 16, alignItems: 'center' }}
          >
            <AphroditeLogo />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: tokens.type.family.mono, fontSize: '23px', fontWeight: 700, color: V, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 6 }}>Aphrodite</div>
              <div style={{ fontSize: tokens.type.size.sm, color: tokens.color.text.muted, lineHeight: tokens.type.leading.relaxed }}>
                Agent Nim full-featured. Cross-compile Linux {'→'} Windows via mingw-w64. Livraison en EXE ou shellcode position-indépendant.
              </div>
              <div style={{ display: 'flex', gap: 5, marginTop: 8, flexWrap: 'wrap' }}>
                <Tag color={V}>Nim</Tag>
                <Tag color={tokens.color.text.muted}>mingw-w64</Tag>
                <Tag color={tokens.color.text.muted}>3 canaux C2</Tag>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: 0.28 }}
            style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderLeft: `3px solid ${V}`, borderRadius: 10, padding: '13px 16px' }}
          >
            <SectionLabel color={V}>Evasion</SectionLabel>
            <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.32 } } }}
              style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 8 }}
            >
              {EVASION.map(({ text }) => (
                <motion.div key={text} variants={{ hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0, transition: { duration: 0.3 } } }}
                  style={{ display: 'flex', gap: 8, fontSize: tokens.type.size.sm, color: tokens.color.text.secondary, lineHeight: 1.4 }}
                >
                  <span style={{ color: V, flexShrink: 0, fontFamily: tokens.type.family.mono, fontWeight: 700, fontSize: '13px' }}>→</span>
                  {text}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
            style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderLeft: `2px solid ${V}`, borderRadius: 10, padding: '14px 18px' }}
          >
            <SectionLabel color={V}>inject - 3 techniques (furtivite croissante)</SectionLabel>
            <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
              style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}
            >
              {INJECTION.map(({ label, tag, color }) => (
                <motion.div key={label} variants={{ hidden: { opacity: 0, x: 10 }, show: { opacity: 1, x: 0, transition: { duration: 0.35 } } }}
                  style={{ background: tokens.color.surface.base, border: `1px solid ${tokens.color.surface.line}`, borderLeft: `3px solid ${color}`, borderRadius: 7, padding: '8px 12px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontFamily: tokens.type.family.mono, fontSize: '13px', fontWeight: 700, color }}>{label}</span>
                    <div style={{ display: 'flex', gap: 2, marginLeft: 'auto' }}>
                      {[1, 2, 3].map(n => {
                        const rank = label === 'createremotethread' ? 1 : label === 'queueapcthread' ? 2 : 3
                        return <div key={n} style={{ width: 8, height: 8, borderRadius: 2, background: n <= rank ? color : `${color}20` }} />
                      })}
                    </div>
                  </div>
                  <span style={{ fontFamily: tokens.type.family.mono, fontSize: '10px', color, background: `${color}15`, border: `1px solid ${color}30`, borderRadius: 3, padding: '1px 5px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{tag}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: 0.4 }}
            style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 10, padding: '12px 16px' }}
          >
            <SectionLabel>Post-exploitation notable</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
              {POSTEX.map(({ cmd, note }) => (
                <div key={cmd} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ fontFamily: tokens.type.family.mono, fontSize: '13px', fontWeight: 700, color: V, flexShrink: 0, minWidth: 130 }}>{cmd}</span>
                  <span style={{ fontSize: tokens.type.size.sm, color: tokens.color.text.tertiary, lineHeight: 1.35 }}>{note}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
