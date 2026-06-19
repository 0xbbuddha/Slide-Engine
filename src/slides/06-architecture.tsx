import { SlideContext, SlideMeta } from '../engine/types'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { tokens } from '../design/tokens'
import { Eyebrow } from '../ui/Eyebrow'
import { SectionLabel } from './_shared'

export const meta: SlideMeta = {
  title: 'Architecture',
  speaker: ['Killian'],
  notes: 'Stack technique : 4 services Docker Compose. Le CLI centralise l\'installation, la configuration et l\'exploitation de la plateforme.',
}

const FEATURES = [
  { v: 'Multi-workspace', d: 'isolation par engagement' },
  { v: 'RBAC', d: 'Admin / Operator / Viewer' },
  { v: 'Audit log', d: 'toutes les actions tracées' },
  { v: 'Profils C2', d: 'HTTP · Chess.com · Notion' },
  { v: 'Mythic', d: 'intégration API native' },
]

const CLI_ACTIONS = [
  { cmd: 'seemslegit install', detail: 'bootstrap backend, frontend et dépendances' },
  { cmd: 'seemslegit up', detail: 'démarrage de la plateforme complète' },
  { cmd: 'seemslegit config init', detail: 'initialisation workspace, Mythic et profils C2' },
  { cmd: 'seemslegit logs backend', detail: 'diagnostic rapide, maintenance et update' },
]

// ── Network topology with packet animation ─────────────────────────────────

const blue   = '#1d4ed8'
const teal   = '#0f766e'
const violet = '#7c3aed'
const gray   = '#71717a'

// SVG viewport
const VW = 950
const VH = 170

// Node definitions (x, y = top-left corner)
interface SNode { id: string; label: string; sub: string; color: string; x: number; y: number; w: number; h: number }
const NODES: SNode[] = [
  { id: 'browser',  label: 'Browser',    sub: 'HTTPS',         color: gray,   x: 0,   y: 10, w: 90,  h: 44 },
  { id: 'nginx',    label: 'nginx',      sub: 'rev.proxy',     color: gray,   x: 145, y: 10, w: 80,  h: 44 },
  { id: 'react',    label: 'React',      sub: 'SPA / Vite',    color: blue,   x: 283, y: 10, w: 95,  h: 44 },
  { id: 'fastapi',  label: 'FastAPI',    sub: 'REST + JWT',    color: teal,   x: 446, y: 10, w: 95,  h: 44 },
  { id: 'pg',       label: 'PostgreSQL', sub: 'DB',            color: blue,   x: 620, y: 10, w: 110, h: 44 },
  { id: 'mythic',   label: 'Mythic C2',  sub: 'C2 Framework',  color: violet, x: 446, y: 100, w: 95, h: 44 },
  { id: 'profile',  label: 'Profil C2',  sub: 'HTTP · Chess · Notion', color: tokens.color.semantic.warning, x: 595, y: 100, w: 120, h: 44 },
  { id: 'agent',    label: 'Agent',      sub: 'Win/Linux',     color: teal,   x: 790, y: 100, w: 90, h: 44 },
]

// Edge definitions: which nodes to connect, and packet params
interface SEdge { from: string; to: string; color: string; reverse?: boolean; count?: number; dur?: number }
const EDGES: SEdge[] = [
  { from: 'browser', to: 'nginx',   color: blue,   count: 3, dur: 1.1 },
  { from: 'nginx',   to: 'react',   color: blue,   count: 3, dur: 1.0 },
  { from: 'react',   to: 'fastapi', color: blue,   count: 3, dur: 0.9 },
  { from: 'fastapi', to: 'pg',      color: blue,   count: 2, dur: 1.3 },
  { from: 'mythic',  to: 'fastapi', color: violet, count: 2, dur: 1.2, reverse: false },
  { from: 'fastapi', to: 'mythic',  color: teal,   count: 2, dur: 1.4 },
  { from: 'mythic',  to: 'profile', color: teal,   count: 2, dur: 1.0 },
  { from: 'profile', to: 'mythic',  color: violet, count: 2, dur: 1.2 },
  { from: 'profile', to: 'agent',   color: teal,   count: 2, dur: 0.95 },
  { from: 'agent',   to: 'profile', color: violet, count: 2, dur: 1.15 },
]

function cx(n: SNode) { return n.x + n.w / 2 }
function cy(n: SNode) { return n.y + n.h / 2 }
function nodeById(id: string) { return NODES.find(n => n.id === id)! }

function edgeLine(e: SEdge): { x1: number; y1: number; x2: number; y2: number } {
  const a = nodeById(e.from)
  const b = nodeById(e.to)

  // Connect from right/bottom of "from" to left/top of "to"
  const dx = cx(b) - cx(a)
  const dy = cy(b) - cy(a)
  const isH = Math.abs(dx) > Math.abs(dy)

  if (isH) {
    const fromX = dx > 0 ? a.x + a.w : a.x
    const toX   = dx > 0 ? b.x       : b.x + b.w
    return { x1: fromX, y1: cy(a), x2: toX, y2: cy(b) }
  } else {
    const fromY = dy > 0 ? a.y + a.h : a.y
    const toY   = dy > 0 ? b.y       : b.y + b.h
    return { x1: cx(a), y1: fromY, x2: cx(b), y2: toY }
  }
}

// Single animated packet along a line segment
function Packet({ x1, y1, x2, y2, color, delay, dur }: {
  x1: number; y1: number; x2: number; y2: number
  color: string; delay: number; dur: number
}) {
  return (
    <motion.circle
      r={3.5}
      fill={color}
      filter="url(#pkglow)"
      animate={{ cx: [x1, x2], cy: [y1, y2] }}
      transition={{ repeat: Infinity, duration: dur, ease: 'linear', delay }}
    />
  )
}

// SVG node box (foreignObject for HTML inside SVG)
function NodeBox({ n, active }: { n: SNode; active: boolean }) {
  return (
    <foreignObject x={n.x} y={n.y} width={n.w} height={n.h}>
      <div
        // @ts-ignore
        xmlns="http://www.w3.org/1999/xhtml"
        style={{
          width: '100%', height: '100%',
          border: `1px solid ${n.color}50`,
          borderRadius: 7,
          background: active ? `${n.color}10` : '#f9f9fb',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 1,
          boxShadow: active ? `0 0 12px ${n.color}25` : undefined,
        }}
      >
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: tokens.type.size.xs, fontWeight: 700, color: n.color, lineHeight: 1.2 }}>
          {n.label}
        </span>
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: tokens.type.size['2xs'], color: '#a3a3a3', lineHeight: 1 }}>
          {n.sub}
        </span>
      </div>
    </foreignObject>
  )
}

function TopologyMap() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const iv = setInterval(() => setTick(t => t + 1), 5000)
    return () => clearInterval(iv)
  }, [])

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      style={{ width: '100%', height: 'auto', display: 'block' }}
      overflow="visible"
    >
      <defs>
        <filter id="pkglow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Connection lines */}
      {EDGES.map((e, i) => {
        const { x1, y1, x2, y2 } = edgeLine(e)
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={e.color} strokeWidth={1.5} strokeOpacity={0.25}
            strokeDasharray="5 3"
          />
        )
      })}

      {/* Animated packets */}
      {EDGES.map((e, ei) => {
        const { x1, y1, x2, y2 } = edgeLine(e)
        const cnt = e.count ?? 2
        const dur = e.dur ?? 1.1
        return Array.from({ length: cnt }).map((_, pi) => (
          <Packet key={`${ei}-${pi}`}
            x1={x1} y1={y1} x2={x2} y2={y2}
            color={e.color}
            delay={(pi / cnt) * dur}
            dur={dur}
          />
        ))
      })}

      {/* Node boxes */}
      {NODES.map(n => <NodeBox key={n.id} n={n} active={tick % 2 === 0} />)}

      {/* Docker label */}
      <text x="0" y={VH} fontSize="13" fill="#a3a3a3" fontFamily='"JetBrains Mono", monospace'>
        Docker Compose - 4 services
      </text>
    </svg>
  )
}

// ── Main slide ─────────────────────────────────────────────────────────────

export function Component(_: SlideContext) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', alignItems: 'flex-start' }}>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Eyebrow>06 - Architecture de la plateforme</Eyebrow>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ fontSize: tokens.type.size['2xl'], fontWeight: tokens.type.weight.semibold, letterSpacing: tokens.type.tracking.tight, color: tokens.color.text.primary, margin: 0 }}
      >
        Architecture SeemsLegit
      </motion.h2>

      {/* Topology */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ width: '100%', background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 12, padding: '18px 22px' }}
      >
        <TopologyMap />
      </motion.div>

      {/* Features + CLI */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, width: '100%' }}>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.35 }}
          style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderLeft: `3px solid ${tokens.color.accent.teal}`, borderRadius: 10, padding: '14px 18px' }}
        >
          <SectionLabel color={tokens.color.accent.teal}>Fonctionnalités plateforme</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 10 }}>
            {FEATURES.map(({ v, d }, i) => (
              <div key={v} style={{ display: 'flex', alignItems: 'baseline', gap: 10, padding: '5px 0', borderBottom: i < FEATURES.length - 1 ? `1px solid ${tokens.color.surface.line}` : 'none' }}>
                <span style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size.xs, fontWeight: tokens.type.weight.semibold, color: tokens.color.accent.teal, minWidth: 76, flexShrink: 0 }}>{v}</span>
                <span style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.muted }}>{d}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.45 }}
          style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderLeft: `3px solid ${tokens.color.accent.blue}`, borderRadius: 10, padding: '14px 18px' }}
        >
          <SectionLabel color={tokens.color.accent.blue}>CLI seemslegit-cli</SectionLabel>
          <p style={{ fontSize: tokens.type.size.sm, color: tokens.color.text.secondary, lineHeight: tokens.type.leading.relaxed, margin: '10px 0 0' }}>
            Un point d'entrée unique pour installer, configurer et piloter l'infrastructure sans repasser par chaque service séparément.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 12 }}>
            {CLI_ACTIONS.map(({ cmd, detail }) => (
              <div key={cmd} style={{ display: 'flex', alignItems: 'baseline', gap: 10, background: tokens.color.surface.base, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 6, padding: '7px 10px' }}>
                <span style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size.xs, color: tokens.color.accent.blue, fontWeight: 700, minWidth: 182, flexShrink: 0 }}>
                  $ {cmd}
                </span>
                <span style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.muted }}>
                  {detail}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  )
}
