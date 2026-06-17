import { SlideContext, SlideMeta } from '../engine/types'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { tokens } from '../design/tokens'
import { Eyebrow } from '../ui/Eyebrow'
import { Reveal } from '../ui/Reveal'
import { SectionLabel, Highlight } from './_shared'

export const meta: SlideMeta = {
  title: 'Résultats',
  speaker: ['Harouna', 'Killian', 'Jeremy'],
  steps: 4,
  notes: 'Les métriques s\'animent au chargement. Révélez limitations avec →. Soyez honnêtes sur les limitations — le jury appréciera la lucidité.',
}

const SUCCESSES = [
  'CodeGenerator produit des binaires structurellement uniques par build',
  '4 agents check-in dans Mythic et exécutent des commandes',
  'Bypass des hooks EDR courants (ntdll userland hooking)',
  '3 profils C2 couverts opérationnels (Chess.com · Notion · HTTP)',
  'Boucle VirusTotal fonctionnelle — feedback itératif',
  'Multi-workspace avec isolation complète des engagements',
]

const LIMITATIONS = [
  'API Mythic — toutes les intégrations souhaitées pas encore implémentées',
  'Certains modules d\'évasion ne sont pas mutuellement compatibles',
  'Techniques plus modernes (kernel callbacks, direct syscalls full) non encore implémentées',
  'Clé API VirusTotal stockée non chiffrée en base (TODO production)',
]

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
      const ease = 1 - Math.pow(1 - t, 4)  // quartic out
      setVal(Math.round(from + (to - from) * ease))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [from, to, duration, delay])

  return (
    <span style={{ color, fontVariantNumeric: 'tabular-nums' }}>
      {val}{suffix}
    </span>
  )
}

// ── Arc gauge ──────────────────────────────────────────────────────────────

function ArcGauge({ value, max, color, label, unit }: {
  value: number; max: number; color: string; label: string; unit?: string
}) {
  const r = 36
  const circ = 2 * Math.PI * r
  const frac = value / max

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: 90, height: 90 }}>
        <svg width={90} height={90} viewBox="0 0 90 90">
          <circle cx={45} cy={45} r={r} fill="none" stroke={`${color}15`} strokeWidth={7} />
          <motion.circle
            cx={45} cy={45} r={r}
            fill="none"
            stroke={color}
            strokeWidth={7}
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ * (1 - frac) }}
            transition={{ duration: 1.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
            style={{ transformOrigin: '45px 45px', rotate: -90 }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            <AnimCounter from={0} to={value} color={color} suffix={unit ?? ''} />
          </div>
        </div>
      </div>
      <div style={{ fontSize: '10px', fontWeight: 600, color: tokens.color.text.tertiary, textAlign: 'center', fontFamily: tokens.type.family.mono, letterSpacing: '0.04em' }}>
        {label}
      </div>
    </div>
  )
}

// ── Agent network mini-graph ───────────────────────────────────────────────

const AGENT_NODES = [
  { id: 'c2',      label: 'C2',      x: 80, y: 60,  color: '#7c3aed', r: 18 },
  { id: 'kratos',  label: 'Kratos',  x: 168, y: 18,  color: '#1d4ed8', r: 12 },
  { id: 'morpheus',label: 'Morpheus',x: 168, y: 60, color: '#0f766e', r: 12 },
  { id: 'hermes',  label: 'Hermes',  x: 168, y: 102, color: '#1d4ed8', r: 12 },
  { id: 'aphrodite',label: 'Aphrodite',x: 168, y: 144, color: '#7c3aed', r: 12 },
]

function AgentGraph() {
  const [pulse, setPulse] = useState(0)

  useEffect(() => {
    const iv = setInterval(() => setPulse(p => (p + 1) % 4), 900)
    return () => clearInterval(iv)
  }, [])

  const c2 = AGENT_NODES[0]
  const agents = AGENT_NODES.slice(1)

  return (
    <svg viewBox="0 0 230 165" style={{ width: '100%', height: 'auto' }} overflow="visible">
      <defs>
        <filter id="agentglow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Edges */}
      {agents.map((a, i) => (
        <g key={a.id}>
          <line x1={c2.x} y1={c2.y} x2={a.x} y2={a.y}
            stroke={a.color} strokeWidth={1.5} strokeOpacity={0.3}
            strokeDasharray="4 3"
          />
          {/* Animated packet along each edge */}
          {[0, 0.5].map((d, pi) => (
            <motion.circle
              key={pi}
              r={2.5}
              fill={a.color}
              filter="url(#agentglow)"
              animate={{
                cx: pulse % 4 < 2 ? [c2.x, a.x] : [a.x, c2.x],
                cy: pulse % 4 < 2 ? [c2.y, a.y] : [a.y, c2.y],
              }}
              transition={{ repeat: Infinity, duration: 1.1, ease: 'linear', delay: d + i * 0.18 }}
            />
          ))}
        </g>
      ))}

      {/* C2 node */}
      <circle cx={c2.x} cy={c2.y} r={c2.r} fill={`${c2.color}15`} stroke={c2.color} strokeWidth={2} />
      <motion.circle
        cx={c2.x} cy={c2.y} r={c2.r + 4}
        fill="none" stroke={c2.color} strokeWidth={1} strokeOpacity={0.4}
        animate={{ r: [c2.r + 3, c2.r + 9], opacity: [0.5, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
      />
      <text x={c2.x} y={c2.y + 4} textAnchor="middle" fontSize="8" fontFamily='"JetBrains Mono", monospace' fill={c2.color} fontWeight="700">
        {c2.label}
      </text>

      {/* Agent nodes */}
      {agents.map((a, i) => (
        <g key={a.id}>
          <circle cx={a.x} cy={a.y} r={a.r}
            fill={`${a.color}15`}
            stroke={a.color}
            strokeWidth={1.5}
            filter={i === (pulse % 4) ? 'url(#agentglow)' : undefined}
          />
          <text x={a.x + a.r + 4} y={a.y + 4} fontSize="9" fontFamily='"JetBrains Mono", monospace' fill={a.color}>
            {a.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

// ── Main slide ─────────────────────────────────────────────────────────────

export function Component({ step }: SlideContext) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, width: '100%', alignItems: 'flex-start' }}>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Eyebrow>13 — Résultats</Eyebrow>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ fontSize: tokens.type.size['2xl'], fontWeight: tokens.type.weight.semibold, letterSpacing: tokens.type.tracking.tight, color: tokens.color.text.primary, margin: 0 }}
      >
        Ce qu'on a livré
      </motion.h2>

      {/* Top metrics bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, width: '100%' }}
      >
        {[
          { label: 'Détections VT', from: 47, to: 8, max: 72, color: '#15803d', unit: '/72' },
          { label: 'Réduction', from: 0, to: 83, max: 100, color: '#0f766e', unit: '%' },
          { label: 'Agents actifs', from: 0, to: 4, max: 4, color: '#1d4ed8', unit: '' },
          { label: 'Modules évasion', from: 0, to: 16, max: 16, color: '#7c3aed', unit: '' },
        ].map(({ label, from, to, max, color, unit }) => (
          <div key={label} style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 10, padding: '14px', display: 'flex', justifyContent: 'center' }}>
            <ArcGauge value={to} max={max} color={color} label={label} unit={unit} />
          </div>
        ))}
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, width: '100%' }}>

        {/* Left — successes */}
        <div>
          <SectionLabel color={tokens.color.semantic.success}>Succès</SectionLabel>
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } } }}
            style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 10 }}
          >
            {SUCCESSES.map((s) => (
              <motion.div
                key={s}
                variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0, transition: { duration: 0.35 } } }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 7, padding: '6px 12px' }}
              >
                <span style={{ color: tokens.color.semantic.success, flexShrink: 0, fontWeight: tokens.type.weight.bold }}>✓</span>
                <span style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.secondary, lineHeight: tokens.type.leading.normal }}>{s}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right — agent network + limitations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Agent network graph */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 10, padding: '12px 16px' }}
          >
            <SectionLabel>Réseau C2 actif</SectionLabel>
            <div style={{ marginTop: 8 }}>
              <AgentGraph />
            </div>
          </motion.div>

          <Reveal show={step >= 3}>
            <div>
              <SectionLabel color={tokens.color.semantic.warning}>Limitations</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 8 }}>
                {LIMITATIONS.map((l) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 7, padding: '6px 12px' }}>
                    <span style={{ color: tokens.color.semantic.warning, flexShrink: 0, fontWeight: tokens.type.weight.bold }}>!</span>
                    <span style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.secondary, lineHeight: tokens.type.leading.normal }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal show={step >= 4}>
            <Highlight color={tokens.color.accent.blue}>
              <strong style={{ color: tokens.color.accent.blue }}>Bilan :</strong> objectif principal atteint — agent unique et fonctionnel par build, avec bypass EDR démontré.
            </Highlight>
          </Reveal>

        </div>
      </div>
    </div>
  )
}
