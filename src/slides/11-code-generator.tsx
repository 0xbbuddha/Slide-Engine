import { SlideContext, SlideMeta } from '../engine/types'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { tokens } from '../design/tokens'
import { Eyebrow } from '../ui/Eyebrow'
import { SectionLabel } from './_shared'

export const meta: SlideMeta = {
  title: 'Code Generator',
  speaker: ['Jeremy'],
  notes: 'Pièce centrale. La barre de compile se relance à chaque slide. Insistez : chaque build produit un binaire DIFFERENT. Le hash change à chaque fois.',
}

const MODULES = [
  { label: 'AMSI Patching',       color: tokens.color.semantic.critical },
  { label: 'ETW Patching',        color: tokens.color.semantic.critical },
  { label: 'Anti-debug',          color: tokens.color.semantic.warning },
  { label: 'Sandbox Detection',   color: tokens.color.semantic.warning },
  { label: 'PPID Spoofing',       color: tokens.color.accent.blue },
  { label: 'Sleep Obfuscation',   color: tokens.color.accent.blue },
  { label: 'Direct Syscalls',     color: tokens.color.semantic.critical },
  { label: 'ntdll Unhooking',     color: tokens.color.semantic.critical },
  { label: 'Self Injection',      color: tokens.color.accent.violet },
  { label: 'Fiber Injection',     color: tokens.color.accent.violet },
  { label: 'Remote Injection',    color: tokens.color.accent.violet },
  { label: 'Early Bird APC',      color: tokens.color.accent.violet },
  { label: 'Process Hollowing',   color: tokens.color.accent.violet },
  { label: 'Symbol Renaming',     color: tokens.color.accent.teal },
  { label: 'String Encryption',   color: tokens.color.accent.teal },
  { label: 'Junk Injection',      color: tokens.color.accent.teal },
]

// Random hex bytes for the binary preview
function randomHex(count: number): string[] {
  return Array.from({ length: count }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase())
}

function randomHash(): string {
  return Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')
}

// Compile log lines
const COMPILE_LOG = [
  '[nim] compiling aphrodite.nim...',
  '[gen] injecting symbol renames (2847 symbols)',
  '[gen] encrypting 312 string literals',
  '[gen] inserting 1024 junk blocks',
  '[gen] selecting injection method: Early Bird APC',
  '[gen] patching AMSI + ETW stubs',
  '[gen] PPID spoofing: enabled (target: svchost.exe)',
  '[nim] linking...',
  '[gen] RC4 key generation...',
  '[gen] applying PE obfuscation header',
  '[ok]  build complete',
]

// ── Compile progress animation ─────────────────────────────────────────────

interface BuildState {
  phase: 'idle' | 'compiling' | 'done'
  progress: number
  logLines: string[]
  hexBytes: string[]
  hash: string
  selectedModules: string[]
}

export function Component(_: SlideContext) {
  const [build, setBuild] = useState<BuildState>({
    phase: 'idle',
    progress: 0,
    logLines: [],
    hexBytes: [],
    hash: '',
    selectedModules: [],
  })

  useEffect(() => {
    // Pick random subset of modules
    const shuffled = [...MODULES].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, 10 + Math.floor(Math.random() * 5))

    setBuild(b => ({ ...b, phase: 'compiling', progress: 0, logLines: [], selectedModules: selected.map(m => m.label) }))

    // Animate progress
    let p = 0
    let lineIdx = 0
    const iv = setInterval(() => {
      p += 2 + Math.random() * 3
      if (p > 100) p = 100

      lineIdx = Math.floor((p / 100) * COMPILE_LOG.length)

      setBuild(b => ({
        ...b,
        progress: p,
        logLines: COMPILE_LOG.slice(0, lineIdx),
      }))

      if (p >= 100) {
        clearInterval(iv)
        setBuild(b => ({
          ...b,
          phase: 'done',
          hexBytes: randomHex(48),
          hash: randomHash(),
        }))
      }
    }, 90)

    return () => clearInterval(iv)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', alignItems: 'flex-start' }}>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Eyebrow>10 — Code Generator</Eyebrow>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ fontSize: tokens.type.size['2xl'], fontWeight: 600, letterSpacing: tokens.type.tracking.tight, color: tokens.color.text.primary, margin: 0 }}
      >
        Moteur d'évasion polymorphique
      </motion.h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, width: '100%' }}>

        {/* Left — module selection + compile */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Module pool */}
          <div style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 8, padding: '14px 16px' }}>
            <SectionLabel>Pool de modules ({MODULES.length} disponibles)</SectionLabel>
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03, delayChildren: 0.1 } } }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 10 }}
            >
              {MODULES.map(({ label, color }) => {
                const isSelected = build.selectedModules.includes(label)
                return (
                  <motion.div
                    key={label}
                    variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: [0.34, 1.2, 0.64, 1] } } }}
                    animate={isSelected && build.phase !== 'idle' ? { opacity: 1, scale: 1 } : { opacity: 0.3, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      background: isSelected ? `${color}18` : 'transparent',
                      border: `1px solid ${isSelected ? color + '45' : tokens.color.surface.line}`,
                      borderRadius: 4,
                      padding: '3px 8px',
                      fontFamily: tokens.type.family.mono,
                      fontSize: '11px',
                      color: isSelected ? color : tokens.color.text.muted,
                    }}
                  >
                    {label}
                  </motion.div>
                )
              })}
            </motion.div>
          </div>

          {/* Compile progress */}
          <div style={{ background: '#05050a', border: `1px solid ${tokens.color.surface.line}`, borderRadius: 8, padding: '12px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <SectionLabel color={build.phase === 'done' ? tokens.color.semantic.success : tokens.color.accent.blue}>
                {build.phase === 'done' ? 'Build terminé' : build.phase === 'compiling' ? 'Compilation...' : 'En attente'}
              </SectionLabel>
              <span style={{ fontFamily: tokens.type.family.mono, fontSize: '11px', color: tokens.color.text.muted }}>
                {Math.round(build.progress)}%
              </span>
            </div>

            {/* Progress bar */}
            <div style={{ height: 3, background: tokens.color.surface.line, borderRadius: 2, overflow: 'hidden', marginBottom: 10 }}>
              <motion.div
                animate={{ width: `${build.progress}%` }}
                transition={{ duration: 0.2 }}
                style={{
                  height: '100%',
                  background: build.phase === 'done'
                    ? tokens.color.semantic.success
                    : `linear-gradient(90deg, ${tokens.color.accent.blue}, ${tokens.color.accent.teal})`,
                  borderRadius: 2,
                }}
              />
            </div>

            {/* Compile log */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minHeight: 80 }}>
              {build.logLines.map((line, i) => {
                const isOk = line.startsWith('[ok]')
                const isGen = line.startsWith('[gen]')
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      fontFamily: tokens.type.family.mono,
                      fontSize: '11px',
                      color: isOk ? tokens.color.semantic.success : isGen ? tokens.color.accent.teal : tokens.color.text.tertiary,
                      lineHeight: 1.5,
                    }}
                  >
                    {line}
                  </motion.div>
                )
              })}
              {build.phase === 'compiling' && (
                <span style={{ fontFamily: tokens.type.family.mono, fontSize: '11px', color: tokens.color.accent.blue }}>█</span>
              )}
            </div>
          </div>

        </div>

        {/* Right — binary output */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          <AnimatePresence>
            {build.phase === 'done' && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                {/* Hex dump */}
                <div style={{ background: '#05050a', border: `1px solid ${tokens.color.surface.line}`, borderRadius: 8, padding: '12px 14px' }}>
                  <SectionLabel color={tokens.color.semantic.success}>Binaire généré — aperçu hexdump</SectionLabel>
                  <div style={{ marginTop: 10 }}>
                    {Array.from({ length: 4 }).map((_, row) => (
                      <div key={row} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 3 }}>
                        <span style={{ fontFamily: tokens.type.family.mono, fontSize: '10px', color: tokens.color.text.muted, minWidth: 52 }}>
                          {(row * 16).toString(16).padStart(8, '0')}
                        </span>
                        <div style={{ display: 'flex', gap: 4, flex: 1 }}>
                          {build.hexBytes.slice(row * 12, (row + 1) * 12).map((b, i) => {
                            const v = parseInt(b, 16)
                            const color = v === 0 ? tokens.color.text.muted
                              : v > 200 ? tokens.color.semantic.critical
                              : v > 128 ? tokens.color.accent.violet
                              : v > 64 ? tokens.color.accent.blue
                              : tokens.color.accent.teal
                            return (
                              <span key={i} style={{ fontFamily: tokens.type.family.mono, fontSize: '11px', color, letterSpacing: '0.02em' }}>{b}</span>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SHA256 hash */}
                <div style={{ background: '#05050a', border: `1px solid ${tokens.color.surface.line}`, borderRadius: 8, padding: '12px 14px' }}>
                  <SectionLabel color={tokens.color.accent.teal}>SHA-256 — unique par build</SectionLabel>
                  <div style={{ fontFamily: tokens.type.family.mono, fontSize: '11px', color: tokens.color.accent.teal, marginTop: 8, letterSpacing: '0.04em', wordBreak: 'break-all', lineHeight: 1.6 }}>
                    {build.hash}
                  </div>
                </div>

                {/* Props */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {[
                    { l: 'Unique', d: 'binaire distinct\nà chaque build', c: tokens.color.accent.teal },
                    { l: 'Polymorphique', d: 'structure ASM\ndifférente', c: tokens.color.accent.blue },
                    { l: 'Automatisé', d: 'formulaire web\n→ binaire', c: tokens.color.accent.violet },
                  ].map(({ l, d, c }) => (
                    <div key={l} style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderLeft: `2px solid ${c}`, borderRadius: 6, padding: '10px 12px' }}>
                      <div style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size.sm, fontWeight: 700, color: c, marginBottom: 4 }}>{l}</div>
                      <div style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.muted, whiteSpace: 'pre-line', lineHeight: 1.4 }}>{d}</div>
                    </div>
                  ))}
                </div>

              </motion.div>
            )}
          </AnimatePresence>

          {build.phase !== 'done' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: tokens.color.text.muted, fontFamily: tokens.type.family.mono, fontSize: tokens.type.size.sm }}>
              compilation en cours...
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
