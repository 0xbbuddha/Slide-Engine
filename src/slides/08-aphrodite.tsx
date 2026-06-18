import { SlideContext, SlideMeta } from '../engine/types'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { tokens } from '../design/tokens'
import { Eyebrow } from '../ui/Eyebrow'
import { Tag, SectionLabel } from './_shared'

export const meta: SlideMeta = {
  title: 'Aphrodite',
  speaker: ['Killian'],
  notes: 'Laissez l\'animation XOR tourner. hidstr opere au compile-time, strings(1) ne montre rien. La deuxieme couche cible la config (URL C2, UUID, PSK).',
}

const CAPS = [
  { label: 'AES-256-CBC + HMAC-SHA256' },
  { label: 'hidstr XOR compile-time' },
  { label: 'HTTP · WebSocket · Chess.com · Notion' },
  { label: 'SOCKS5 proxy integre' },
  { label: 'Kill date + jitter configurable' },
  { label: 'Binaire statique, zero dependances runtime' },
]

const ENCRYPTION = [
  { mode: 'PSK', desc: 'AES-256-CBC + HMAC-SHA256 - cle compilee', color: tokens.color.accent.teal },
  { mode: 'EKE', desc: 'RSA-2048 - session AES negociee runtime', color: tokens.color.accent.blue },
  { mode: 'Plain', desc: 'Aucun chiffrement - lab/testing uniquement', color: tokens.color.text.muted },
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

    bytes.forEach((_, i) => {
      const t1 = setTimeout(() => setActiveIdx(i), i * 480 + 300)
      const t2 = setTimeout(() => {
        setEncoded(prev => prev.map((v, j) => j <= i ? true : v))
      }, i * 480 + 620)
      timers.push(t1, t2)
    })

    const total = bytes.length * 480 + 1600
    const t3 = setTimeout(() => setStrIdx(s => (s + 1) % STRINGS.length), total)
    timers.push(t3)

    return () => timers.forEach(clearTimeout)
  }, [strIdx])

  const CELL = 42

  return (
    <div style={{ fontFamily: mono, userSelect: 'none' }}>
      <div style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.muted, marginBottom: 6, letterSpacing: '0.08em' }}>
        hidstr - XOR compile-time
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={strIdx}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
          style={{ fontSize: tokens.type.size.sm, color: tokens.color.accent.violet, marginBottom: 10, letterSpacing: '0.04em' }}
        >
          <span style={{ color: tokens.color.text.muted }}>input  </span>
          <span style={{ color: tokens.color.accent.violet, fontWeight: 700 }}>"{text}"</span>
        </motion.div>
      </AnimatePresence>

      <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {bytes.map((b, i) => {
          const isActive = i === activeIdx
          const isDone = encoded[i]
          const xorKey = key[i]

          return (
            <motion.div
              key={`${strIdx}-${i}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
              style={{
                width: CELL, borderRadius: 5, overflow: 'hidden',
                border: `1px solid ${isActive ? tokens.color.accent.violet + '80' : isDone ? tokens.color.accent.teal + '40' : tokens.color.surface.line}`,
                background: isActive ? `${tokens.color.accent.violet}12` : isDone ? `${tokens.color.accent.teal}08` : tokens.color.surface.tech,
                transition: 'border 0.2s, background 0.2s',
              }}
            >
              <div style={{ textAlign: 'center', padding: '4px 0 2px', fontSize: 13, fontWeight: 700, color: isActive ? tokens.color.accent.violet : isDone ? tokens.color.accent.teal : tokens.color.text.muted, transition: 'color 0.3s' }}>
                {text[i]}
              </div>
              <div style={{ textAlign: 'center', fontSize: tokens.type.size['2xs'], color: tokens.color.text.muted, paddingBottom: 1 }}>
                {b.toString(16).padStart(2, '0').toUpperCase()}
              </div>
              <div style={{ height: 1, background: isActive ? `${tokens.color.accent.violet}50` : tokens.color.surface.line, transition: 'background 0.2s' }} />
              <div style={{ textAlign: 'center', fontSize: tokens.type.size['2xs'], color: isActive ? tokens.color.accent.violet : tokens.color.text.muted, padding: '2px 0', opacity: isActive || isDone ? 1 : 0.4, transition: 'opacity 0.2s, color 0.2s' }}>
                {isActive ? '⊕' : ''}{xorKey.toString(16).padStart(2, '0').toUpperCase()}
              </div>
              <div style={{ height: 1, background: isDone ? `${tokens.color.accent.teal}50` : tokens.color.surface.line, transition: 'background 0.3s' }} />
              <div style={{ textAlign: 'center', padding: '3px 0 4px', fontSize: tokens.type.size.xs, fontWeight: 700, color: isDone ? tokens.color.accent.teal : tokens.color.text.tertiary, transition: 'color 0.3s' }}>
                <AnimatePresence mode="wait">
                  {isDone ? (
                    <motion.span key="encoded" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25, ease: [0.34, 1.2, 0.64, 1] }}>
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

      <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
        {[
          { label: 'char', color: tokens.color.text.muted },
          { label: 'plaintext', color: tokens.color.text.muted },
          { label: 'XOR key', color: tokens.color.accent.violet },
          { label: 'encoded', color: tokens.color.accent.teal },
        ].map(({ label, color }) => (
          <div key={label} style={{ fontSize: tokens.type.size['2xs'], color, letterSpacing: '0.06em', fontWeight: 600 }}>
            {label.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Aphrodite logo hero ────────────────────────────────────────────────────

function AphroditeLogo() {
  const V = tokens.color.accent.violet
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 130, height: 130, flexShrink: 0 }}>
      {/* Outer pulse ring */}
      <motion.div
        animate={{ scale: [1, 1.25, 1], opacity: [0.18, 0, 0.18] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', border: `1px solid ${V}`, pointerEvents: 'none' }}
      />
      {/* Mid ring */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.28, 0.05, 0.28] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut', delay: 0.4 }}
        style={{ position: 'absolute', width: 96, height: 96, borderRadius: '50%', border: `1.5px solid ${V}`, pointerEvents: 'none' }}
      />
      {/* Inner glow */}
      <motion.div
        animate={{ opacity: [0.12, 0.22, 0.12] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        style={{ position: 'absolute', width: 72, height: 72, borderRadius: '50%', background: `radial-gradient(circle, ${V}40 0%, transparent 70%)`, pointerEvents: 'none' }}
      />
      {/* Aphrodite SVG logo */}
      <motion.img
        src="/aphrodite.svg"
        alt="Aphrodite"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.34, 1.2, 0.64, 1] }}
        style={{ width: 80, height: 80, objectFit: 'contain', filter: `drop-shadow(0 0 16px ${V}70)`, zIndex: 1 }}
      />
    </div>
  )
}

// ── Main slide ─────────────────────────────────────────────────────────────

export function Component(_: SlideContext) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', alignItems: 'flex-start' }}>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Eyebrow>08 - Aphrodite - Focus technique</Eyebrow>
      </motion.div>

      {/* Identity card - mirrors slide 07 AgentCard visual */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 18, background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderTop: `2px solid ${tokens.color.accent.violet}`, borderRadius: 8, padding: '12px 20px' }}
      >
        <span style={{ fontFamily: tokens.type.family.mono, fontSize: '28px', fontWeight: 700, color: tokens.color.accent.violet, letterSpacing: '-0.04em', lineHeight: 1 }}>Nim</span>
        <div style={{ width: 1, height: 28, background: tokens.color.surface.line }} />
        <div style={{ display: 'flex', gap: 7 }}>
          <Tag color={tokens.color.accent.violet}>Aphrodite</Tag>
          <Tag color={tokens.color.text.muted}>Cross-platform</Tag>
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size['2xs'], color: tokens.color.text.muted, letterSpacing: '0.06em' }}>{'<-'} suite slide 07</span>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 18, width: '100%' }}>

        {/* Left - Aphrodite hero + capabilities */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Hero card */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            style={{ background: `linear-gradient(135deg, ${tokens.color.surface.subtle} 60%, ${tokens.color.accent.violet}06 100%)`, border: `1px solid ${tokens.color.surface.line}`, borderLeft: `3px solid ${tokens.color.accent.violet}`, borderRadius: 10, padding: '18px 20px', display: 'flex', gap: 18, alignItems: 'center' }}
          >
            <AphroditeLogo />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: tokens.type.family.mono, fontSize: '22px', fontWeight: 700, color: tokens.color.accent.violet, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 6 }}>
                Aphrodite
              </div>
              <div style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.muted, lineHeight: tokens.type.leading.relaxed }}>
                Agent Nim full-featured. Cross-compilable depuis Linux vers Windows. Concu pour la furtivite et la flexibilite operationnelle.
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                <Tag color={tokens.color.accent.violet}>Nim</Tag>
                <Tag color={tokens.color.text.muted}>Cross-platform</Tag>
                <Tag color={tokens.color.text.muted}>mingw-w64</Tag>
              </div>
            </div>
          </motion.div>

          {/* Capabilities staggered */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } } }}
            style={{ display: 'flex', flexDirection: 'column', gap: 5 }}
          >
            {CAPS.map(({ label }) => (
              <motion.div
                key={label}
                variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0, transition: { duration: 0.35 } } }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 6, padding: '6px 12px' }}
              >
                <span style={{ color: tokens.color.accent.violet, flexShrink: 0, fontFamily: tokens.type.family.mono, fontSize: tokens.type.size['2xs'], fontWeight: 700 }}>→</span>
                <span style={{ fontSize: tokens.type.size.sm, color: tokens.color.text.secondary, lineHeight: 1.4 }}>{label}</span>
              </motion.div>
            ))}
          </motion.div>

        </div>

        {/* Right - XOR viz + encryption modes + callout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* hidstr animation */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            style={{ background: tokens.color.surface.tech, border: `1px solid ${tokens.color.surface.line}`, borderLeft: `2px solid ${tokens.color.accent.violet}`, borderRadius: 10, padding: '16px 18px' }}
          >
            <HidstrViz />
          </motion.div>

          {/* Encryption modes */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.38 }}
            style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 10, padding: '14px 18px' }}
          >
            <SectionLabel>Modes de chiffrement</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 10 }}>
              {ENCRYPTION.map(({ mode, desc, color }) => (
                <div key={mode} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ fontFamily: tokens.type.family.mono, fontWeight: 700, color, fontSize: tokens.type.size.sm, minWidth: 38, flexShrink: 0 }}>{mode}</span>
                  <span style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.tertiary, lineHeight: tokens.type.leading.normal }}>{desc}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Result callout */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.55 }}
            style={{ background: `${tokens.color.accent.teal}08`, border: `1px solid ${tokens.color.accent.teal}28`, borderRadius: 8, padding: '10px 14px' }}
          >
            <p style={{ fontSize: tokens.type.size.sm, color: tokens.color.text.secondary, margin: 0, lineHeight: tokens.type.leading.normal }}>
              <code style={{ fontFamily: tokens.type.family.mono }}>strings(1)</code> ne revele ni noms de commandes, ni cles protocole, ni appels systeme.
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
