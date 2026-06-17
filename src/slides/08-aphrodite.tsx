import { SlideContext, SlideMeta } from '../engine/types'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { tokens } from '../design/tokens'
import { Eyebrow } from '../ui/Eyebrow'
import { Tag, SectionLabel, StaggerList, StaggerItem } from './_shared'

export const meta: SlideMeta = {
  title: 'Aphrodite',
  speaker: ['Killian'],
  notes: 'Laissez l\'animation XOR tourner — elle boucle. hidstr opère au compile-time, strings(1) ne montre rien. La deuxième couche cible la config (URL C2, UUID, PSK).',
}

const CAPS = [
  '42 commandes built-in (recon, files, exec, env...)',
  'Linux + Windows cross-compilé depuis Linux (mingw-w64)',
  'HTTP · WebSocket · Chess.com C2 profiles',
  'SOCKS5 proxy tunneling intégré',
  'Binaire statique optionnel (zéro dépendances runtime)',
  'Kill date · jitter configurable',
]

const ENCRYPTION = [
  { mode: 'PSK', desc: 'AES-256-CBC + HMAC-SHA256 — clé compilée dans le binaire', color: tokens.color.accent.teal },
  { mode: 'EKE', desc: 'RSA-2048 — session AES négociée au runtime (Linux)', color: tokens.color.accent.blue },
  { mode: 'Plain', desc: 'Aucun chiffrement — lab/testing uniquement', color: tokens.color.text.muted },
]

// ── hidstr XOR visualization ───────────────────────────────────────────────

const STRINGS = [
  { text: 'checkin',     key: [0x4A, 0x2F, 0x11, 0x8C, 0xA3, 0x7E, 0x1B] },
  { text: 'get_tasking', key: [0x31, 0xC4, 0x72, 0x0F, 0xAA, 0x58, 0x93, 0xB1, 0x12, 0xDE, 0x45] },
  { text: 'whoami',      key: [0xBB, 0x1E, 0x74, 0x2C, 0x5F, 0xD0] },
  { text: 'NtAllocate',  key: [0x99, 0x3C, 0x4A, 0xF1, 0x28, 0x7D, 0xC2, 0x0E, 0xA5, 0x61] },
]

function HidstrViz() {
  const [strIdx, setStrIdx] = useState(0)
  const [activeIdx, setActiveIdx] = useState(-1)
  const [encoded, setEncoded] = useState<boolean[]>([])

  const { text, key } = STRINGS[strIdx]
  const bytes = Array.from(text).map(c => c.charCodeAt(0))
  const result = bytes.map((b, i) => b ^ key[i])
  const mono = tokens.type.family.mono

  useEffect(() => {
    setEncoded(Array(text.length).fill(false))
    setActiveIdx(-1)

    const timers: ReturnType<typeof setTimeout>[] = []

    // Animate each byte
    bytes.forEach((_, i) => {
      const t1 = setTimeout(() => setActiveIdx(i), i * 480 + 300)
      const t2 = setTimeout(() => {
        setEncoded(prev => prev.map((v, j) => j <= i ? true : v))
      }, i * 480 + 620)
      timers.push(t1, t2)
    })

    // After all done, pause then next string
    const total = bytes.length * 480 + 1600
    const t3 = setTimeout(() => {
      setStrIdx(s => (s + 1) % STRINGS.length)
    }, total)
    timers.push(t3)

    return () => timers.forEach(clearTimeout)
  }, [strIdx])

  const CELL = 42

  return (
    <div style={{ fontFamily: mono, userSelect: 'none' }}>
      <div style={{ fontSize: '10px', color: tokens.color.text.muted, marginBottom: 6, letterSpacing: '0.08em' }}>
        hidstr — XOR compile-time
      </div>

      {/* String label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={strIdx}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
          style={{ fontSize: '12px', color: tokens.color.accent.violet, marginBottom: 10, letterSpacing: '0.04em' }}
        >
          <span style={{ color: tokens.color.text.muted }}>input  </span>
          <span style={{ color: tokens.color.accent.violet, fontWeight: 700 }}>"{text}"</span>
        </motion.div>
      </AnimatePresence>

      {/* Byte grid */}
      <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {bytes.map((b, i) => {
          const isActive = i === activeIdx
          const isDone = encoded[i]
          const byteVal = isDone ? result[i] : b
          const xorKey = key[i]

          return (
            <motion.div
              key={`${strIdx}-${i}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
              style={{
                width: CELL,
                borderRadius: 5,
                overflow: 'hidden',
                border: `1px solid ${isActive ? tokens.color.accent.violet + '80' : isDone ? tokens.color.accent.teal + '40' : tokens.color.surface.line}`,
                background: isActive ? `${tokens.color.accent.violet}12`
                  : isDone ? `${tokens.color.accent.teal}08`
                  : '#05050a',
                transition: 'border 0.2s, background 0.2s',
              }}
            >
              {/* Char */}
              <div style={{ textAlign: 'center', padding: '4px 0 2px', fontSize: 13, fontWeight: 700, color: isActive ? tokens.color.accent.violet : isDone ? tokens.color.accent.teal : tokens.color.text.muted, transition: 'color 0.3s' }}>
                {text[i]}
              </div>

              {/* Original byte */}
              <div style={{ textAlign: 'center', fontSize: '10px', color: tokens.color.text.muted, paddingBottom: 1 }}>
                {b.toString(16).padStart(2, '0').toUpperCase()}
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: isActive ? `${tokens.color.accent.violet}50` : tokens.color.surface.line, transition: 'background 0.2s' }} />

              {/* XOR key */}
              <div style={{ textAlign: 'center', fontSize: '9px', color: isActive ? tokens.color.accent.violet : tokens.color.text.muted, padding: '2px 0', opacity: isActive || isDone ? 1 : 0.4, transition: 'opacity 0.2s, color 0.2s' }}>
                {isActive ? '⊕' : ''}
                {xorKey.toString(16).padStart(2, '0').toUpperCase()}
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: isDone ? `${tokens.color.accent.teal}50` : tokens.color.surface.line, transition: 'background 0.3s' }} />

              {/* Result byte */}
              <div style={{ textAlign: 'center', padding: '3px 0 4px', fontSize: '11px', fontWeight: 700, color: isDone ? tokens.color.accent.teal : '#1e1e2a', transition: 'color 0.3s' }}>
                <AnimatePresence mode="wait">
                  {isDone ? (
                    <motion.span
                      key="encoded"
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.25, ease: [0.34, 1.2, 0.64, 1] }}
                    >
                      {result[i].toString(16).padStart(2, '0').toUpperCase()}
                    </motion.span>
                  ) : (
                    <motion.span key="hidden" style={{ opacity: 0.2 }}>??</motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
        {[
          { label: 'char', color: tokens.color.text.muted },
          { label: 'plaintext byte', color: tokens.color.text.muted },
          { label: 'XOR key', color: tokens.color.accent.violet },
          { label: 'encoded', color: tokens.color.accent.teal },
        ].map(({ label, color }) => (
          <div key={label} style={{ fontSize: '9px', color, letterSpacing: '0.06em', fontWeight: 600 }}>
            {label.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main slide ─────────────────────────────────────────────────────────────

export function Component(_: SlideContext) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, width: '100%', alignItems: 'flex-start' }}>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Eyebrow>07 — Aphrodite · Nim · Cross-platform</Eyebrow>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ fontSize: tokens.type.size['2xl'], fontWeight: tokens.type.weight.semibold, letterSpacing: tokens.type.tracking.tight, color: tokens.color.text.primary, margin: 0 }}
      >
        Agent Nim — Focus technique
      </motion.h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 18, width: '100%' }}>

        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderLeft: `3px solid ${tokens.color.accent.violet}`, borderRadius: 10, padding: '16px 20px' }}
          >
            <SectionLabel color={tokens.color.accent.violet}>Capacités</SectionLabel>
            <StaggerList gap={5} delay={0.07} style={{ marginTop: 10 }}>
              {CAPS.map((c) => (
                <StaggerItem key={c} variant="left">
                  <div style={{ display: 'flex', gap: 8, fontSize: tokens.type.size.sm, color: tokens.color.text.secondary, lineHeight: tokens.type.leading.normal }}>
                    <span style={{ color: tokens.color.accent.violet, flexShrink: 0 }}>→</span>{c}
                  </div>
                </StaggerItem>
              ))}
            </StaggerList>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.35 }}
            style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 10, padding: '14px 18px' }}
          >
            <SectionLabel>Modes de chiffrement</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 10 }}>
              {ENCRYPTION.map(({ mode, desc, color }) => (
                <div key={mode} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ fontFamily: tokens.type.family.mono, fontWeight: tokens.type.weight.bold, color, fontSize: tokens.type.size.sm, minWidth: 38, flexShrink: 0 }}>{mode}</span>
                  <span style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.tertiary, lineHeight: tokens.type.leading.normal }}>{desc}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Right — animated XOR + layer 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* hidstr animation */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            style={{ background: '#05050a', border: `1px solid #2a2a35`, borderLeft: `2px solid ${tokens.color.accent.violet}`, borderRadius: 10, padding: '16px 18px' }}
          >
            <HidstrViz />
          </motion.div>

          {/* Layer 2 */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.38 }}
            style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderLeft: `2px solid ${tokens.color.accent.blue}`, borderRadius: 10, padding: '14px 16px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size.xs, fontWeight: tokens.type.weight.semibold, color: tokens.color.accent.blue }}>
                obfuscation: xor/aes
              </span>
              <Tag color={tokens.color.accent.blue}>Option de build</Tag>
            </div>
            <p style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.tertiary, lineHeight: tokens.type.leading.relaxed, margin: 0 }}>
              Valeurs de config uniquement : URL C2, UUID, PSK, kill date, user-agent.
              Chiffrées dans le binaire, décodées au runtime.
            </p>
          </motion.div>

          {/* Result callout */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.55 }}
            style={{ background: `${tokens.color.accent.teal}08`, border: `1px solid ${tokens.color.accent.teal}28`, borderRadius: 8, padding: '10px 14px' }}
          >
            <p style={{ fontSize: tokens.type.size.sm, color: tokens.color.text.secondary, margin: 0, lineHeight: tokens.type.leading.normal }}>
              <code style={{ fontFamily: tokens.type.family.mono }}>strings(1)</code> ne révèle ni noms de commandes, ni clés protocole, ni appels système.
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
