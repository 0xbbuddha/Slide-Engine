import { SlideContext, SlideMeta } from '../engine/types'
import { motion } from 'framer-motion'
import { tokens } from '../design/tokens'
import { Eyebrow } from '../ui/Eyebrow'
import { Tag, SectionLabel } from './_shared'

export const meta: SlideMeta = {
  title: 'Loaders',
  speaker: ['Killian', 'Harouna'],
  notes: 'Deux loaders complémentaires. Hephaestus est en Nim (même stack qu\'Aphrodite), Atreus est en C++ (même stack que Kratos). Ils partagent les mêmes primitives d\'évasion mais ont des techniques d\'injection différentes.',
}

const W = tokens.color.semantic.warning
const B = tokens.color.accent.blue

const HEP_TECH = [
  { label: 'Early Bird APC',     detail: 'shellcode injecté avant le point d\'entrée du process' },
  { label: 'Thread Hijacking',   detail: 'suspension + modification du contexte d\'un thread existant' },
  { label: 'Process Hollowing',  detail: 'image PE remplacée en mémoire après création suspendue' },
]

const ATREUS_TECH = [
  { label: 'Process Hollowing',  detail: 'image PE remplacée en mémoire - process cible lancé suspendu' },
  { label: 'Fiber Injection',    detail: 'exécution via fiber Win32 - évite CreateThread' },
  { label: 'Module Stomping',    detail: 'écrase une DLL légitime déjà chargée en mémoire' },
  { label: 'Remote Injection',   detail: 'VirtualAllocEx + WriteProcessMemory dans process distant' },
  { label: 'Thread Hijacking',   detail: 'même technique que Hephaestus, impl. C++' },
]

const SHARED = [
  'PPID Spoofing - parent process usurpé (ex. services.exe)',
  'Sandbox detection - uptime, RAM, CPU, artefacts VM',
  'ntdll remapping + ETW / AMSI patch avant injection',
  'Heap wiping - efface les traces du shellcode en RAM',
]

// ── Injection flow mini-diagram ───────────────────────────────────────────────

const STEPS = [
  { label: 'Sandbox\ncheck', color: B },
  { label: 'ntdll\nunhook', color: W },
  { label: 'ETW/AMSI\npatch', color: W },
  { label: 'Spawn +\nPPID spoof', color: tokens.color.accent.violet },
  { label: 'Inject\nshellcode', color: tokens.color.semantic.success },
  { label: 'Heap\nwipe', color: tokens.color.text.muted },
]

function InjectionFlow() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, width: '100%', overflowX: 'auto' }}>
      {STEPS.map(({ label, color }, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.4 + i * 0.09 }}
          style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}
        >
          <div style={{ background: `${color}10`, border: `1px solid ${color}35`, borderRadius: 7, padding: '6px 10px', textAlign: 'center', minWidth: 72 }}>
            <div style={{ fontFamily: tokens.type.family.mono, fontSize: '11px', fontWeight: 700, color, letterSpacing: '0.04em', whiteSpace: 'pre-line', lineHeight: 1.3 }}>{label}</div>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ width: 22, height: 1, background: tokens.color.surface.line, flexShrink: 0, position: 'relative' }}>
              <div style={{ position: 'absolute', right: -2, top: '50%', transform: 'translateY(-50%)', width: 5, height: 5, borderTop: `1px solid ${tokens.color.surface.line}`, borderRight: `1px solid ${tokens.color.surface.line}`, rotate: '45deg' }} />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

// ── Slide ─────────────────────────────────────────────────────────────────────

export function Component(_: SlideContext) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', alignItems: 'flex-start' }}>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Eyebrow>10 - Loaders - Hephaestus & Atreus</Eyebrow>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.08 }}
        style={{ fontSize: tokens.type.size['2xl'], fontWeight: tokens.type.weight.semibold, letterSpacing: tokens.type.tracking.tight, color: tokens.color.text.primary, margin: 0 }}
      >
        Deux loaders, un objectif
      </motion.h2>

      {/* Two loaders side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, width: '100%' }}>

        {/* Hephaestus */}
        <motion.div
          initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.18 }}
          style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderTop: `2px solid ${W}`, borderRadius: 10, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: tokens.type.family.mono, fontSize: '23px', fontWeight: 800, color: W, letterSpacing: '-0.02em' }}>Hephaestus</span>
            <Tag color={W}>Nim</Tag>
            <Tag color={tokens.color.text.muted}>Windows</Tag>
          </div>

          <div style={{ fontSize: tokens.type.size.sm, color: tokens.color.text.muted, lineHeight: tokens.type.leading.relaxed }}>
            Même stack qu'Aphrodite. Emballe le shellcode de l'agent et gère tout le flux d'injection.
          </div>

          <div>
            <SectionLabel color={W}>Techniques d'injection</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 8 }}>
              {HEP_TECH.map(({ label, detail }) => (
                <div key={label} style={{ background: tokens.color.surface.base, border: `1px solid ${tokens.color.surface.line}`, borderLeft: `2px solid ${W}`, borderRadius: 6, padding: '6px 10px' }}>
                  <div style={{ fontFamily: tokens.type.family.mono, fontSize: '13px', fontWeight: 700, color: W, marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.muted, lineHeight: 1.35 }}>{detail}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Atreus */}
        <motion.div
          initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
          style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderTop: `2px solid ${B}`, borderRadius: 10, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: tokens.type.family.mono, fontSize: '23px', fontWeight: 800, color: B, letterSpacing: '-0.02em' }}>Atreus</span>
            <Tag color={B}>C++</Tag>
            <Tag color={tokens.color.text.muted}>Windows</Tag>
          </div>

          <div style={{ fontSize: tokens.type.size.sm, color: tokens.color.text.muted, lineHeight: tokens.type.leading.relaxed }}>
            Même stack que Kratos. Techniques d'injection distinctes pour varier le profil comportemental selon la cible.
          </div>

          <div>
            <SectionLabel color={B}>Techniques d'injection</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 8 }}>
              {ATREUS_TECH.map(({ label, detail }) => (
                <div key={label} style={{ background: tokens.color.surface.base, border: `1px solid ${tokens.color.surface.line}`, borderLeft: `2px solid ${B}`, borderRadius: 6, padding: '6px 10px' }}>
                  <div style={{ fontFamily: tokens.type.family.mono, fontSize: '13px', fontWeight: 700, color: B, marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.muted, lineHeight: 1.35 }}>{detail}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Shared techniques + flow */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.38 }}
        style={{ width: '100%', background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 10, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        <SectionLabel>Flux commun aux deux loaders</SectionLabel>
        <InjectionFlow />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SHARED.map((text, i) => (
            <motion.div key={i}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.07 }}
              style={{ display: 'flex', gap: 6, alignItems: 'flex-start', fontSize: tokens.type.size.xs, color: tokens.color.text.secondary, flex: '1 1 200px' }}
            >
              <span style={{ color: tokens.color.text.muted, flexShrink: 0, fontFamily: tokens.type.family.mono, fontSize: '12px' }}>→</span>
              {text}
            </motion.div>
          ))}
        </div>
      </motion.div>

    </div>
  )
}
