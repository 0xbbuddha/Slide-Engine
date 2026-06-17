// Composants partagés — ignoré par l'auto-découverte (préfixe _)
import { ReactNode, CSSProperties, useEffect, useState, useRef } from 'react'
import { motion, Variants } from 'framer-motion'
import { tokens } from '../design/tokens'

// ── Variants ───────────────────────────────────────────────────────────────

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: [0.34, 1.2, 0.64, 1] } },
}

// ── ScrambleText — texte qui se décode depuis des caractères aléatoires ───

const SCRAMBLE_CHARS = 'ABCDEF0123456789@#$%!?><:;'

export function ScrambleText({ text, delay = 300 }: { text: string; delay?: number }) {
  const [display, setDisplay] = useState<string[]>(() => text.split('').map(c => c === ' ' ? ' ' : SCRAMBLE_CHARS[0]))
  const doneRef = useRef(false)

  useEffect(() => {
    doneRef.current = false
    const t0 = setTimeout(() => {
      let pos = 0
      const iv = setInterval(() => {
        if (doneRef.current) return
        setDisplay(
          text.split('').map((char, i) => {
            if (char === ' ') return ' '
            if (i < pos) return char
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
          })
        )
        pos += 0.35
        if (pos > text.length + 1) {
          doneRef.current = true
          clearInterval(iv)
          setDisplay(text.split(''))
        }
      }, 28)
      return () => clearInterval(iv)
    }, delay)
    return () => {
      clearTimeout(t0)
      doneRef.current = true
    }
  }, [text, delay])

  return <>{display.join('')}</>
}

// ── Terminal — fake terminal output avec lignes animées ───────────────────

export type TermLine =
  | { t: 'cmd'; text: string }
  | { t: 'info'; text: string }
  | { t: 'ok'; text: string }
  | { t: 'err'; text: string }
  | { t: 'data'; text: string }
  | { t: 'blank' }

const LINE_COLORS = {
  cmd: '#34d399',
  info: '#fbbf24',
  ok: '#4ade80',
  err: '#f87171',
  data: '#a1a1aa',
} as const

const LINE_PREFIX = {
  cmd: '$ ',
  info: '[*] ',
  ok: '[+] ',
  err: '[!] ',
  data: '    ',
} as const

export function Terminal({ title = 'hephaestus.exe', lines, stepDelay = 110 }: {
  title?: string; lines: TermLine[]; stepDelay?: number
}) {
  const [shown, setShown] = useState(0)

  useEffect(() => {
    setShown(0)
    const timers: ReturnType<typeof setTimeout>[] = []
    lines.forEach((_, i) => {
      timers.push(setTimeout(() => setShown(i + 1), 150 + i * stepDelay))
    })
    return () => timers.forEach(clearTimeout)
  }, [lines, stepDelay])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      style={{
        background: '#05050a',
        border: `1px solid ${tokens.color.surface.lineStrong}`,
        borderRadius: 8,
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '7px 14px',
        background: tokens.color.surface.subtle,
        borderBottom: `1px solid ${tokens.color.surface.line}`,
      }}>
        {(['#f87171', '#fbbf24', '#4ade80'] as const).map((c) => (
          <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.7 }} />
        ))}
        <span style={{ marginLeft: 8, fontFamily: tokens.type.family.mono, fontSize: '11px', color: tokens.color.text.tertiary, letterSpacing: '0.04em' }}>
          {title}
        </span>
      </div>

      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {lines.slice(0, shown).map((line, i) => {
          if (line.t === 'blank') return <div key={i} style={{ height: 5 }} />
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              style={{ fontFamily: tokens.type.family.mono, fontSize: '12.5px', lineHeight: 1.6, display: 'flex' }}
            >
              <span style={{ color: LINE_COLORS[line.t], opacity: 0.75, flexShrink: 0 }}>
                {LINE_PREFIX[line.t]}
              </span>
              <span style={{ color: line.t === 'data' ? '#52525b' : LINE_COLORS[line.t] }}>
                {line.text}
              </span>
            </motion.div>
          )
        })}
        {shown < lines.length && (
          <span style={{ fontFamily: tokens.type.family.mono, fontSize: '12.5px', color: '#4ade80', lineHeight: 1.6 }}>{'█'}</span>
        )}
      </div>
    </motion.div>
  )
}

// ── CodeBlock ─────────────────────────────────────────────────────────────

export function CodeBlock({ lang, code, color }: { lang: string; code: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{ background: '#05050a', border: `1px solid ${tokens.color.surface.line}`, borderLeft: `2px solid ${color}`, borderRadius: 8, overflow: 'hidden' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 12px', background: tokens.color.surface.subtle, borderBottom: `1px solid ${tokens.color.surface.line}` }}>
        <span style={{ fontFamily: tokens.type.family.mono, fontSize: '11px', color, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{lang}</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {[1, 2, 3].map(n => <div key={n} style={{ width: 5, height: 5, borderRadius: '50%', background: `${color}35` }} />)}
        </div>
      </div>
      <pre style={{ fontFamily: tokens.type.family.mono, fontSize: '11.5px', color: '#71717a', lineHeight: 1.65, padding: '10px 14px', margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>
        {code}
      </pre>
    </motion.div>
  )
}

// ── Tag ────────────────────────────────────────────────────────────────────

export function Tag({ children, color }: { children: ReactNode; color: string }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      background: `${color}14`,
      color,
      border: `1px solid ${color}32`,
      borderRadius: 4,
      padding: '3px 9px',
      fontSize: tokens.type.size.xs,
      fontWeight: tokens.type.weight.semibold,
      fontFamily: tokens.type.family.mono,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      lineHeight: 1.6,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  )
}

// ── Card ───────────────────────────────────────────────────────────────────

interface CardProps { children: ReactNode; accent?: string; side?: 'top' | 'left'; hoverable?: boolean; style?: CSSProperties }
export function Card({ children, accent, side = 'left', hoverable, style }: CardProps) {
  const accentBorder = accent ? side === 'top' ? { borderTop: `2px solid ${accent}` } : { borderLeft: `2px solid ${accent}` } : {}
  return (
    <motion.div
      whileHover={hoverable ? { y: -3 } : undefined}
      transition={{ duration: 0.18 }}
      style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 8, padding: '18px 22px', ...accentBorder, ...style }}
    >
      {children}
    </motion.div>
  )
}

// ── SectionLabel ───────────────────────────────────────────────────────────

export function SectionLabel({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <div style={{ fontSize: tokens.type.size.xs, fontWeight: tokens.type.weight.semibold, letterSpacing: tokens.type.tracking.wider, textTransform: 'uppercase', fontFamily: tokens.type.family.mono, color: color ?? tokens.color.text.muted }}>
      {children}
    </div>
  )
}

// ── CountUp ────────────────────────────────────────────────────────────────

export function CountUp({ to, suffix = '', color, size = tokens.type.size['4xl'] }: { to: number; suffix?: string; color?: string; size?: string }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let raf: number
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / 1400, 1)
      setVal(Math.round((1 - Math.pow(1 - p, 4)) * to))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [to])
  return <span style={{ color, fontSize: size, fontWeight: tokens.type.weight.semibold, fontVariantNumeric: 'tabular-nums', letterSpacing: tokens.type.tracking.tighter, lineHeight: 1 }}>{val}{suffix}</span>
}

// ── FlowStep ───────────────────────────────────────────────────────────────

export function FlowStep({ n, text, color = tokens.color.accent.blue, last = false, mono = false }: { n: number; text: string; color?: string; last?: boolean; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ width: 24, height: 24, borderRadius: '50%', background: `${color}18`, border: `1px solid ${color}40`, color, fontSize: 11, fontWeight: 700, fontFamily: tokens.type.family.mono, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n}</div>
        {!last && <div style={{ width: 1, flex: 1, background: `${color}20`, marginTop: 3, minHeight: 10 }} />}
      </div>
      <div style={{ fontSize: tokens.type.size.sm, fontFamily: mono ? tokens.type.family.mono : undefined, color: tokens.color.text.secondary, lineHeight: tokens.type.leading.normal, paddingBottom: last ? 0 : 12, paddingTop: 2 }}>
        {text}
      </div>
    </div>
  )
}

// ── TechBox ────────────────────────────────────────────────────────────────

export function TechBox({ abbr, label, sub, color }: { abbr: string; label: string; sub: string; color: string }) {
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18 }}
      style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderTop: `2px solid ${color}`, borderRadius: 8, padding: '18px 14px', textAlign: 'center' }}
    >
      <div style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size.xl, fontWeight: 700, color, letterSpacing: '-0.02em', marginBottom: 8 }}>{abbr}</div>
      <div style={{ fontSize: tokens.type.size.sm, fontWeight: 600, color: tokens.color.text.primary, marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.muted }}>{sub}</div>
    </motion.div>
  )
}

// ── AgentCard ─────────────────────────────────────────────────────────────

export function AgentCard({ lang, name, os, color, desc, code }: { lang: string; name: string; os: string; color: string; desc: string; code?: string }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
      style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderTop: `2px solid ${color}`, borderRadius: 8, padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}
    >
      <div style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size['2xl'], fontWeight: 700, color, letterSpacing: '-0.04em', lineHeight: 1 }}>{lang}</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <Tag color={color}>{name}</Tag>
        <Tag color={tokens.color.text.muted}>{os}</Tag>
      </div>
      <p style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.tertiary, lineHeight: tokens.type.leading.relaxed, margin: 0 }}>{desc}</p>
      {code && (
        <pre style={{ fontFamily: tokens.type.family.mono, fontSize: '11px', color: '#52525b', background: '#05050a', border: `1px solid ${tokens.color.surface.line}`, borderLeft: `2px solid ${color}40`, borderRadius: 5, padding: '8px 10px', margin: 0, lineHeight: 1.6, whiteSpace: 'pre', overflowX: 'auto' }}>
          {code}
        </pre>
      )}
    </motion.div>
  )
}

// ── InfoRow ────────────────────────────────────────────────────────────────

export function InfoRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#05050a', border: `1px solid ${tokens.color.surface.line}`, borderRadius: 5, padding: '6px 10px' }}>
      <span style={{ fontSize: tokens.type.size.sm, color: tokens.color.text.secondary, fontFamily: tokens.type.family.mono }}>{label}</span>
      <Tag color={color}>{value}</Tag>
    </div>
  )
}

// ── Highlight ─────────────────────────────────────────────────────────────

export function Highlight({ children, color = tokens.color.accent.teal }: { children: ReactNode; color?: string }) {
  return (
    <div style={{ background: `${color}0a`, border: `1px solid ${color}22`, borderRadius: 8, padding: '12px 18px', fontSize: tokens.type.size.sm, color: tokens.color.text.secondary, lineHeight: tokens.type.leading.relaxed, width: '100%' }}>
      {children}
    </div>
  )
}

// ── StaggerList + StaggerItem ──────────────────────────────────────────────

interface StaggerListProps { children: ReactNode; gap?: number; delay?: number; direction?: 'column' | 'row'; wrap?: boolean; style?: CSSProperties }
export function StaggerList({ children, gap = 10, delay = 0.07, direction = 'column', wrap, style }: StaggerListProps) {
  return (
    <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: delay, delayChildren: 0.05 } } }}
      style={{ display: 'flex', flexDirection: direction, gap, width: '100%', flexWrap: wrap ? 'wrap' : undefined, ...style }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, style, variant = 'up' }: { children: ReactNode; style?: CSSProperties; variant?: 'up' | 'left' | 'scale' }) {
  const v = variant === 'left' ? slideLeft : variant === 'scale' ? scaleIn : fadeUp
  return <motion.div variants={v} style={style}>{children}</motion.div>
}
