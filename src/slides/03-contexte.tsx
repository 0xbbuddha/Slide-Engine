import { SlideContext, SlideMeta } from '../engine/types'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { tokens } from '../design/tokens'
import { Eyebrow } from '../ui/Eyebrow'
import { StaggerList, StaggerItem } from './_shared'

export const meta: SlideMeta = {
  title: 'Contexte',
  speaker: ['Killian'],
  notes: 'Contexte : les frameworks C2 open-source sont connus des EDR. Citez Mandiant M-Trends 2024. Les EDR hookent ntdll au chargement du process.',
}

const POINTS = [
  { text: 'Les frameworks C2 open-source (Mythic, Havoc...) ont leurs signatures référencées dans toutes les bases EDR et AV.', accent: tokens.color.semantic.critical },
  { text: 'Les EDR patchent ntdll.dll au chargement de chaque process pour hooker les Windows API — contourner ça demande des syscalls directs ou un unhooking ntdll.', accent: tokens.color.semantic.warning },
  { text: 'Un agent Mythic par défaut est détecté et bloqué en quelques secondes. Sans implant custom, il n\'y a pas d\'opération.', accent: tokens.color.semantic.critical },
]

// ── EDR Hook Flow Diagram ──────────────────────────────────────────────────

const HOOK_PHASES = [
  {
    label: 'Appel système normal',
    sub: 'UserProcess → ntdll → syscall direct',
    color: '#1d4ed8',
    ntdllLabel: 'ntdll.dll',
    hasEDR: false,
    speed: 0.75,
  },
  {
    label: 'EDR userland hook actif',
    sub: 'jmp 0xE9 → EDR.dll → inspection → original',
    color: '#b91c1c',
    ntdllLabel: 'ntdll.dll  [HOOK 0xE9]',
    hasEDR: true,
    speed: 1.5,
  },
  {
    label: 'Après ntdll unhooking',
    sub: 'restaurée depuis disque — flux propre et direct',
    color: '#0f766e',
    ntdllLabel: 'ntdll.dll  [RESTORED]',
    hasEDR: false,
    speed: 0.5,
  },
]

function FlowNode({ label, color, small }: { label: string; color: string; small?: boolean }) {
  return (
    <motion.div
      layout
      animate={{ borderColor: `${color}70`, background: `${color}0c`, color }}
      transition={{ duration: 0.45 }}
      style={{
        border: '1px solid',
        borderRadius: 6,
        padding: small ? '4px 10px' : '6px 14px',
        fontFamily: tokens.type.family.mono,
        fontSize: small ? '10px' : '11px',
        fontWeight: 600,
        textAlign: 'center',
        boxShadow: `0 0 10px ${color}20`,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </motion.div>
  )
}

function VConn({ color, height = 28, speed }: { color: string; height?: number; speed: number }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: 2, height, background: `${color}50`, overflow: 'hidden' }}>
        {[0, 0.33, 0.66].map(d => (
          <motion.div
            key={d}
            style={{ position: 'absolute', left: -3, width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 5px ${color}` }}
            animate={{ top: ['-20%', '120%'] }}
            transition={{ repeat: Infinity, duration: speed, ease: 'linear', delay: d * speed }}
          />
        ))}
      </div>
    </div>
  )
}

function HConn({ color, width = 36, speed }: { color: string; width?: number; speed: number }) {
  return (
    <div style={{ position: 'relative', height: 2, width, background: `${color}50`, overflow: 'hidden', alignSelf: 'center', flexShrink: 0 }}>
      <motion.div
        style={{ position: 'absolute', top: -3, width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 5px ${color}` }}
        animate={{ left: ['-20%', '120%'] }}
        transition={{ repeat: Infinity, duration: speed * 0.7, ease: 'linear' }}
      />
    </div>
  )
}

function HookFlowDiagram() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const iv = setInterval(() => setPhase(p => (p + 1) % 3), 3600)
    return () => clearInterval(iv)
  }, [])

  const ph = HOOK_PHASES[phase]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: '100%' }}>

      {/* Phase badge */}
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.25 }}
          style={{ marginBottom: 16 }}
        >
          <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center', background: `${ph.color}12`, border: `1px solid ${ph.color}40`, borderRadius: 5, padding: '4px 10px' }}>
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              style={{ width: 6, height: 6, borderRadius: '50%', background: ph.color, flexShrink: 0 }}
            />
            <span style={{ fontFamily: tokens.type.family.mono, fontSize: '10px', color: ph.color, fontWeight: 700, letterSpacing: '0.04em' }}>
              {ph.label}
            </span>
          </div>
          <div style={{ fontFamily: tokens.type.family.mono, fontSize: '10px', color: tokens.color.text.muted, marginTop: 5, paddingLeft: 4 }}>
            {ph.sub}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Flow nodes */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, flex: 1 }}>

        {/* UserProcess */}
        <FlowNode label="User Process" color={ph.color} />
        <VConn color={ph.color} height={26} speed={ph.speed} />

        {/* ntdll + EDR branch - space always reserved to avoid layout shift */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <FlowNode label={ph.ntdllLabel} color={ph.hasEDR ? tokens.color.semantic.critical : ph.color} />
          <motion.div
            animate={{ opacity: ph.hasEDR ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', alignItems: 'center', gap: 0, pointerEvents: ph.hasEDR ? 'auto' : 'none' }}
          >
            <HConn color={tokens.color.semantic.critical} width={28} speed={ph.speed} />
            <FlowNode label="EDR.dll" color={tokens.color.semantic.critical} small />
          </motion.div>
        </div>
        <VConn color={ph.color} height={26} speed={ph.speed} />

        {/* Kernel */}
        <FlowNode label="Kernel (syscall)" color={ph.color} />

        {/* Phase dots navigation */}
        <div style={{ display: 'flex', gap: 6, marginTop: 18 }}>
          {HOOK_PHASES.map(({ color }, i) => (
            <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: i === phase ? color : tokens.color.surface.line, transition: 'background 0.3s' }} />
          ))}
        </div>

      </div>
    </div>
  )
}

// ── Main slide ─────────────────────────────────────────────────────────────

export function Component(_: SlideContext) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, width: '100%', alignItems: 'flex-start' }}>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Eyebrow>02 — Contexte</Eyebrow>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ fontSize: tokens.type.size['2xl'], fontWeight: tokens.type.weight.semibold, letterSpacing: tokens.type.tracking.tight, color: tokens.color.text.primary, margin: 0 }}
      >
        Le contexte Red Team
      </motion.h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, width: '100%' }}>

        {/* Left — points */}
        <StaggerList gap={12} delay={0.1}>
          {POINTS.map(({ text, accent }, i) => (
            <StaggerItem key={i} variant="left">
              <div style={{ display: 'flex', gap: 14, background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderLeft: `3px solid ${accent}`, borderRadius: 10, padding: '12px 16px' }}>
                <span style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size.xs, fontWeight: tokens.type.weight.bold, color: accent, flexShrink: 0, marginTop: 2, minWidth: 20 }}>
                  0{i + 1}
                </span>
                <p style={{ fontSize: tokens.type.size.sm, color: tokens.color.text.secondary, lineHeight: tokens.type.leading.relaxed, margin: 0 }}>{text}</p>
              </div>
            </StaggerItem>
          ))}

          {/* Mandiant stat - compact */}
          <StaggerItem variant="left">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderLeft: `3px solid ${tokens.color.accent.blue}`, borderRadius: 10, padding: '10px 16px' }}>
              <div style={{ fontSize: tokens.type.size['3xl'], fontWeight: tokens.type.weight.semibold, color: tokens.color.text.primary, lineHeight: 1, flexShrink: 0 }}>~10j</div>
              <div>
                <div style={{ fontSize: tokens.type.size.xs, fontWeight: 600, color: tokens.color.accent.blue }}>Mandiant M-Trends 2024</div>
                <div style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.muted, marginTop: 2 }}>Dwell time médian — atteignable uniquement avec implants custom</div>
              </div>
            </div>
          </StaggerItem>
        </StaggerList>

        {/* Right — EDR hook flow */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.35 }}
          style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 12, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
        >
          <HookFlowDiagram />
        </motion.div>

      </div>
    </div>
  )
}
