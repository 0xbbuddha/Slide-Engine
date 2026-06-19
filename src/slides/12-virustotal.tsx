import { SlideContext, SlideMeta } from '../engine/types'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { tokens } from '../design/tokens'
import { Eyebrow } from '../ui/Eyebrow'
import { SectionLabel } from './_shared'

export const meta: SlideMeta = {
  title: 'VirusTotal',
  speaker: ['Harouna'],
  notes: 'Animation : score passe de 47 à 8. Les moteurs les plus connus passent au vert. C\'est la démonstration de l\'efficacité réelle du CodeGenerator.',
}

// ── Engine list ────────────────────────────────────────────────────────────

interface Engine {
  name: string
  detects_default: boolean
  detects_seemslegit: boolean
  delay: number
}

const ENGINES: Engine[] = [
  { name: 'Windows Defender', detects_default: true,  detects_seemslegit: true,  delay: 0 },
  { name: 'Kaspersky',        detects_default: true,  detects_seemslegit: true,  delay: 60 },
  { name: 'ESET NOD32',       detects_default: true,  detects_seemslegit: false, delay: 900 },
  { name: 'BitDefender',      detects_default: true,  detects_seemslegit: true,  delay: 0 },
  { name: 'CrowdStrike',      detects_default: true,  detects_seemslegit: false, delay: 1100 },
  { name: 'SentinelOne',      detects_default: true,  detects_seemslegit: false, delay: 1400 },
  { name: 'Malwarebytes',     detects_default: true,  detects_seemslegit: true,  delay: 80 },
  { name: 'TrendMicro',       detects_default: true,  detects_seemslegit: false, delay: 700 },
  { name: 'McAfee',           detects_default: true,  detects_seemslegit: false, delay: 1250 },
  { name: 'Avast',            detects_default: true,  detects_seemslegit: false, delay: 800 },
  { name: 'Avira',            detects_default: true,  detects_seemslegit: false, delay: 600 },
  { name: 'F-Secure',         detects_default: true,  detects_seemslegit: false, delay: 1600 },
  { name: 'Sophos',           detects_default: true,  detects_seemslegit: true,  delay: 40 },
  { name: 'Symantec',         detects_default: true,  detects_seemslegit: false, delay: 1800 },
  { name: 'Carbon Black',     detects_default: true,  detects_seemslegit: false, delay: 950 },
  { name: 'Cylance',          detects_default: true,  detects_seemslegit: false, delay: 1050 },
  { name: 'DrWeb',            detects_default: true,  detects_seemslegit: false, delay: 1350 },
  { name: 'Panda',            detects_default: true,  detects_seemslegit: false, delay: 750 },
  { name: 'Fortinet',         detects_default: false, detects_seemslegit: false, delay: 0 },
  { name: 'Trellix',          detects_default: false, detects_seemslegit: false, delay: 0 },
  { name: 'Cynet',            detects_default: false, detects_seemslegit: false, delay: 0 },
  { name: 'Webroot',          detects_default: false, detects_seemslegit: false, delay: 0 },
]

const TOTAL = 72
const DEFAULT_DETECTS = 47
const SL_DETECTS = ENGINES.filter(e => e.detects_seemslegit).length

// ── Score circle (SVG arc) ────────────────────────────────────────────────

function ScoreCircle({ detected, total, label, animate: doAnim }: {
  detected: number; total: number; label: string; animate: boolean
}) {
  const r = 42
  const circ = 2 * Math.PI * r
  const frac = detected / total
  const isLow = detected < 15

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ position: 'relative', width: 110, height: 110 }}>
        <svg width={110} height={110} viewBox="0 0 110 110">
          {/* BG ring */}
          <circle cx={55} cy={55} r={r} fill="none" stroke={isLow ? '#15803d18' : '#b91c1c18'} strokeWidth={9} />
          {/* Score arc */}
          <motion.circle
            cx={55} cy={55} r={r}
            fill="none"
            stroke={isLow ? '#15803d' : '#b91c1c'}
            strokeWidth={9}
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ * (1 - frac) }}
            transition={{ duration: doAnim ? 1.4 : 0, ease: [0.25, 0.46, 0.45, 0.94], delay: doAnim ? 0.3 : 0 }}
            style={{ transformOrigin: '55px 55px', rotate: -90 }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: isLow ? '#15803d' : '#b91c1c', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {detected}
          </div>
          <div style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.muted, fontFamily: tokens.type.family.mono }}>/ {total}</div>
        </div>
      </div>
      <div style={{ fontSize: tokens.type.size.xs, fontWeight: 600, color: tokens.color.text.tertiary, textAlign: 'center', maxWidth: 110 }}>
        {label}
      </div>
    </div>
  )
}

// ── Main slide ─────────────────────────────────────────────────────────────

export function Component(_: SlideContext) {
  const [phase, setPhase] = useState<'before' | 'scanning' | 'after'>('before')
  const [clearedEngines, setClearedEngines] = useState<Set<string>>(new Set())
  const [scanLine, setScanLine] = useState(0)
  const [showAfterScore, setShowAfterScore] = useState(false)

  useEffect(() => {
    // Start scanning after 1.2s
    const t1 = setTimeout(() => {
      setPhase('scanning')
      setScanLine(0)
    }, 1200)

    // Scan line animation
    const t2 = setTimeout(() => {
      const iv = setInterval(() => {
        setScanLine(s => {
          if (s >= ENGINES.length - 1) { clearInterval(iv); return s }
          return s + 1
        })
      }, 60)
    }, 1400)

    // Engines flip to green
    ENGINES.forEach(e => {
      if (!e.detects_seemslegit && e.detects_default) {
        const t = setTimeout(() => {
          setClearedEngines(prev => new Set([...prev, e.name]))
        }, 2000 + e.delay)
        ;(t2 as unknown as number)  // keep linter happy
        void t
      }
    })

    // Show "after" score
    const t3 = setTimeout(() => {
      setPhase('after')
      setShowAfterScore(true)
    }, 2200)

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  const currentDetections = phase === 'before' ? DEFAULT_DETECTS
    : DEFAULT_DETECTS - clearedEngines.size

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', alignItems: 'flex-start' }}>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Eyebrow>13 - VirusTotal</Eyebrow>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ fontSize: tokens.type.size['2xl'], fontWeight: 600, letterSpacing: tokens.type.tracking.tight, color: tokens.color.text.primary, margin: 0 }}
      >
        De 47 / 72 à{' '}
        <motion.span
          animate={{ color: showAfterScore ? '#15803d' : tokens.color.text.primary }}
          transition={{ duration: 0.5 }}
        >
          {SL_DETECTS} / 72
        </motion.span>{' '}
        détections
      </motion.h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 20, width: '100%' }}>

        {/* Left - scores */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Score comparison */}
          <div style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 10, padding: '18px 20px' }}>
            <SectionLabel>Résultat scan</SectionLabel>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: 16 }}>
              <ScoreCircle detected={DEFAULT_DETECTS} total={TOTAL} label="Mythic par défaut" animate={false} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: showAfterScore ? 1 : 0 }}
                  style={{ fontSize: 22, color: '#15803d', fontWeight: 700, fontFamily: tokens.type.family.mono }}
                >
                  -83%
                </motion.div>
                <div style={{ fontSize: 18, color: tokens.color.text.muted }}>→</div>
              </div>
              <div style={{ position: 'relative' }}>
                <ScoreCircle detected={SL_DETECTS} total={TOTAL} label="SeemsLegit build" animate />
                {!showAfterScore && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${tokens.color.surface.subtle}cc`, borderRadius: 8 }}>
                    <motion.div
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size.xs, color: tokens.color.accent.blue }}
                    >
                      scanning...
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SHA + features */}
          <div style={{ background: tokens.color.surface.tech, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 10, padding: '14px 16px' }}>
            <div style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size.xs, color: tokens.color.text.tertiary, marginBottom: 6 }}>SHA-256</div>
            <div style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size.xs, color: '#4ade80', wordBreak: 'break-all', letterSpacing: '0.04em' }}>
              8f3a1b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { l: 'Auto-scan post-génération', c: '#15803d' },
              { l: 'Hash SHA-256 par build unique', c: '#15803d' },
              { l: '72 moteurs scannés', c: '#15803d' },
              { l: 'Historique par agent', c: '#15803d' },
            ].map(({ l, c }) => (
              <div key={l} style={{ display: 'flex', gap: 8, fontSize: tokens.type.size.xs, color: tokens.color.text.secondary }}>
                <span style={{ color: c, flexShrink: 0, fontWeight: 700 }}>✓</span>{l}
              </div>
            ))}
          </div>

        </div>

        {/* Right - engine list */}
        <div style={{ background: tokens.color.surface.tech, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 10, padding: '14px 16px', overflow: 'hidden', position: 'relative' }}>

          {/* Scan line */}
          {phase === 'scanning' && (
            <motion.div
              style={{
                position: 'absolute',
                left: 0, right: 0,
                height: 1,
                background: 'linear-gradient(90deg, transparent, #60a5fa80, transparent)',
                zIndex: 10,
              }}
              animate={{ top: [14, 14 + ENGINES.length * 28] }}
              transition={{ duration: (ENGINES.length * 60) / 1000, ease: 'linear', repeat: Infinity }}
            />
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, paddingBottom: 8, borderBottom: `1px solid ${tokens.color.surface.line}` }}>
            <span style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size.xs, color: tokens.color.text.tertiary }}>Moteur AV/EDR</span>
            <span style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size.xs, color: tokens.color.text.tertiary }}>Résultat</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {ENGINES.map((engine, i) => {
              const wasDetected = engine.detects_default
              const nowClean = clearedEngines.has(engine.name)
              const currentlyDetects = wasDetected && !nowClean
              const isScanned = i <= scanLine || phase === 'before'

              return (
                <motion.div
                  key={engine.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: isScanned ? 1 : 0.2, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.015 }}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 4px', borderRadius: 3 }}
                >
                  <span style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size.xs, color: currentlyDetects ? '#f87171' : nowClean ? '#4ade80' : tokens.color.text.tertiary }}>
                    {engine.name}
                  </span>
                  <AnimatePresence mode="wait">
                    {isScanned && (
                      <motion.span
                        key={`${engine.name}-${nowClean}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size['2xs'], fontWeight: 700, letterSpacing: '0.06em' }}
                      >
                        {!wasDetected ? (
                          <span style={{ color: '#4ade80' }}>CLEAN</span>
                        ) : nowClean ? (
                          <span style={{ color: '#4ade80' }}>CLEAN</span>
                        ) : (
                          <span style={{ color: '#f87171' }}>DETECT</span>
                        )}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
