import { SlideContext, SlideMeta } from '../engine/types'
import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { tokens } from '../design/tokens'
import { Eyebrow } from '../ui/Eyebrow'

export const meta: SlideMeta = {
  title: 'Résultats',
  speaker: ['Jeremy'],
  notes: 'Laissez les chiffres parler. 47 → 8 détections sur Defender. 4 agents connectés à Mythic, chaîne complète testée.',
}

// ── Animated counter ───────────────────────────────────────────────────────

function AnimCounter({ from, to, duration = 1.6, delay = 0, color, suffix = '' }: {
  from: number; to: number; duration?: number; delay?: number; color: string; suffix?: string
}) {
  const [val, setVal] = useState(from)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const startTime = performance.now() + delay * 1000
    let started = false
    function tick(now: number) {
      if (now < startTime) { rafRef.current = requestAnimationFrame(tick); return }
      if (!started) started = true
      const elapsed = now - startTime
      const t = Math.min(elapsed / (duration * 1000), 1)
      const ease = 1 - Math.pow(1 - t, 4)
      setVal(Math.round(from + (to - from) * ease))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [from, to, duration, delay])

  return <span style={{ color, fontVariantNumeric: 'tabular-nums' }}>{val}{suffix}</span>
}

// ── Arc gauge ──────────────────────────────────────────────────────────────

function ArcGauge({ value, max, color, label, unit, from = 0 }: {
  value: number; max: number; color: string; label: string; unit?: string; from?: number
}) {
  const r = 38
  const circ = 2 * Math.PI * r
  const frac = value / max

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: 96, height: 96 }}>
        <svg width={96} height={96} viewBox="0 0 96 96">
          <circle cx={48} cy={48} r={r} fill="none" stroke={`${color}18`} strokeWidth={7} />
          <motion.circle
            cx={48} cy={48} r={r}
            fill="none" stroke={color} strokeWidth={7}
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ * (1 - frac) }}
            transition={{ duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
            style={{ transformOrigin: '48px 48px', rotate: -90 }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <div style={{ fontSize: tokens.type.size.lg, fontWeight: 800, color, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            <AnimCounter from={from} to={value} color={color} />
          </div>
          {unit && (
            <div style={{ fontSize: tokens.type.size['2xs'], fontWeight: 600, color, lineHeight: 1, fontFamily: tokens.type.family.mono }}>{unit}</div>
          )}
        </div>
      </div>
      <div style={{ fontSize: tokens.type.size.xs, fontWeight: 600, color: tokens.color.text.tertiary, textAlign: 'center', fontFamily: tokens.type.family.mono, letterSpacing: '0.04em', lineHeight: 1.3 }}>
        {label}
      </div>
    </div>
  )
}

// ── Agent network ──────────────────────────────────────────────────────────

const AGENT_NODES = [
  { id: 'c2',       label: 'Mythic C2', x: 40,  y: 90,  color: '#7c3aed', r: 22 },
  { id: 'profiles', label: 'Profils C2', x: 140, y: 90,  color: '#0f766e', r: 18 },
  { id: 'kratos',   label: 'Kratos',    x: 240, y: 20,  color: '#1d4ed8', r: 13 },
  { id: 'morpheus', label: 'Morpheus',  x: 240, y: 65,  color: '#0f766e', r: 13 },
  { id: 'hermes',   label: 'Hermes',    x: 240, y: 112, color: '#1d4ed8', r: 13 },
  { id: 'aphrodite',label: 'Aphrodite', x: 240, y: 158, color: '#7c3aed', r: 13 },
]

function AgentGraph() {
  const [pulse, setPulse] = useState(0)
  useEffect(() => {
    const iv = setInterval(() => setPulse(p => (p + 1) % 4), 900)
    return () => clearInterval(iv)
  }, [])

  const c2 = AGENT_NODES[0]
  const profiles = AGENT_NODES[1]
  const agents = AGENT_NODES.slice(2)

  return (
    <svg viewBox="0 0 310 180" style={{ width: '100%', height: '100%' }} overflow="visible">
      <defs>
        <filter id="aglow2" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <line x1={c2.x} y1={c2.y} x2={profiles.x} y2={profiles.y} stroke={profiles.color} strokeWidth={1.5} strokeOpacity={0.3} strokeDasharray="5 3" />
      {[0, 0.5].map((d, pi) => (
        <motion.circle key={pi} r={3} fill={profiles.color} filter="url(#aglow2)"
          animate={{ cx: [c2.x, profiles.x], cy: [c2.y, profiles.y] }}
          transition={{ repeat: Infinity, duration: 1.1, ease: 'linear', delay: d }}
        />
      ))}

      {agents.map((a, i) => (
        <g key={a.id}>
          <line x1={profiles.x} y1={profiles.y} x2={a.x} y2={a.y} stroke={a.color} strokeWidth={1.5} strokeOpacity={0.3} strokeDasharray="5 3" />
          {[0, 0.5].map((d, pi) => (
            <motion.circle key={pi} r={3} fill={a.color} filter="url(#aglow2)"
              animate={{ cx: [profiles.x, a.x], cy: [profiles.y, a.y] }}
              transition={{ repeat: Infinity, duration: 1.1, ease: 'linear', delay: d + i * 0.2 }}
            />
          ))}
        </g>
      ))}

      <circle cx={c2.x} cy={c2.y} r={c2.r} fill={`${c2.color}15`} stroke={c2.color} strokeWidth={2} />
      <motion.circle cx={c2.x} cy={c2.y} r={c2.r + 5} fill="none" stroke={c2.color} strokeWidth={1} strokeOpacity={0.4}
        animate={{ r: [c2.r + 4, c2.r + 12], opacity: [0.5, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
      />
      <text x={c2.x} y={c2.y - 2} textAnchor="middle" fontSize="9" fontFamily='"JetBrains Mono", monospace' fill={c2.color} fontWeight="700">Mythic</text>
      <text x={c2.x} y={c2.y + 9} textAnchor="middle" fontSize="9" fontFamily='"JetBrains Mono", monospace' fill={c2.color} fontWeight="700">C2</text>

      <circle cx={profiles.x} cy={profiles.y} r={profiles.r} fill={`${profiles.color}15`} stroke={profiles.color} strokeWidth={2} />
      <text x={profiles.x} y={profiles.y - 2} textAnchor="middle" fontSize="8" fontFamily='"JetBrains Mono", monospace' fill={profiles.color} fontWeight="700">Profils</text>
      <text x={profiles.x} y={profiles.y + 9} textAnchor="middle" fontSize="8" fontFamily='"JetBrains Mono", monospace' fill={profiles.color} fontWeight="700">C2</text>

      {agents.map((a, i) => (
        <g key={a.id}>
          <circle cx={a.x} cy={a.y} r={a.r} fill={`${a.color}15`} stroke={a.color} strokeWidth={1.5}
            filter={i === (pulse % 4) ? 'url(#aglow2)' : undefined}
          />
          <text x={a.x + a.r + 5} y={a.y + 4} fontSize="11" fontFamily='"JetBrains Mono", monospace' fill={a.color}>{a.label}</text>
        </g>
      ))}
    </svg>
  )
}

// ── Main slide ─────────────────────────────────────────────────────────────

const METRICS = [
  { label: 'Détections\nVirusTotal', from: 47, to: 8,  max: 72, color: '#15803d', unit: '/72' },
  { label: 'Réduction\ndétections', from: 0,  to: 83, max: 100, color: '#0f766e', unit: '%' },
  { label: 'Agents\nfrom scratch', from: 0,  to: 4,  max: 4,   color: '#1d4ed8', unit: '' },
  { label: 'Loaders\nWindows',     from: 0,  to: 2,  max: 2,   color: '#d97706', unit: '' },
  { label: 'Profils C2\ncouverts', from: 0,  to: 3,  max: 3,   color: '#7c3aed', unit: '' },
]

export function Component(_: SlideContext) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', alignItems: 'flex-start' }}>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Eyebrow>14 - Résultats</Eyebrow>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ fontSize: tokens.type.size['2xl'], fontWeight: tokens.type.weight.semibold, letterSpacing: tokens.type.tracking.tight, color: tokens.color.text.primary, margin: 0 }}
      >
        Ce qu'on a livré
      </motion.h2>

      {/* Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, width: '100%' }}
      >
        {METRICS.map(({ label, from, to, max, color, unit }) => (
          <div key={label} style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 12, padding: '16px 8px', display: 'flex', justifyContent: 'center' }}>
            <ArcGauge value={to} max={max} color={color} label={label} unit={unit} from={from} />
          </div>
        ))}
      </motion.div>

      {/* Agent graph + callout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 16, width: '100%' }}>

        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 12, padding: '18px 20px', height: 200 }}
        >
          <AgentGraph />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'center' }}
        >
          {[
            { color: tokens.color.semantic.success, text: 'Chaîne complète testée de bout en bout - build, scan VT, loader, exécution, check-in Mythic.' },
            { color: tokens.color.accent.blue, text: '47 → 8 détections sur la comparaison statique : réduction de 83% grâce au polymorphisme par build.' },
            { color: tokens.color.accent.teal, text: 'Prototype fonctionnel : pas encore furtif face à Elastic EDR, mais la base technique est là.' },
          ].map(({ color, text }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 + i * 0.1 }}
              style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderLeft: `3px solid ${color}`, borderRadius: 8, padding: '12px 16px' }}
            >
              <span style={{ fontSize: tokens.type.size.sm, color: tokens.color.text.secondary, lineHeight: tokens.type.leading.relaxed }}>{text}</span>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  )
}
