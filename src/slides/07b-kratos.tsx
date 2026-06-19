import { SlideContext, SlideMeta } from '../engine/types'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { tokens } from '../design/tokens'
import { Eyebrow } from '../ui/Eyebrow'
import { Tag, SectionLabel } from './_shared'

export const meta: SlideMeta = {
  title: 'Kratos',
  speaker: ['Harouna'],
  notes: 'Kratos est le seul agent qui utilise des indirect syscalls via HellHall. Montrez l\'animation de résolution SSN. Insistez sur le fait que ntdll est scannée dynamiquement - aucun SSN hardcodé.',
}

const SYSCALLS = [
  { name: 'NtAllocateVirtualMemory', ssn: 0x18 },
  { name: 'NtProtectVirtualMemory',  ssn: 0x50 },
  { name: 'NtCreateThreadEx',        ssn: 0xC1 },
  { name: 'NtWriteVirtualMemory',    ssn: 0x3A },
]

function makeStub(ssn: number) {
  return [0x4C, 0x8B, 0xD1, 0xB8, ssn, 0x00, 0x00, 0x00, 0x0F, 0x05]
}

function makeNoise(n: number) {
  const pool = [0x48, 0x89, 0xE5, 0x55, 0x57, 0x56, 0x41, 0x53, 0x90, 0xCC, 0xC3, 0x33, 0xFF, 0xEB, 0x00]
  return Array.from({ length: n }, () => pool[Math.floor(Math.random() * pool.length)])
}

function HellsGate() {
  const B = tokens.color.accent.blue
  const mono = tokens.type.family.mono
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<'scan' | 'found' | 'done'>('scan')
  const [scanPos, setScanPos] = useState(0)

  const sc = SYSCALLS[idx]
  const stub = makeStub(sc.ssn)
  const prefix = makeNoise(4)
  const suffix = makeNoise(4)
  const allBytes = [...prefix, ...stub, ...suffix]
  const stubStart = 4

  useEffect(() => {
    setPhase('scan')
    setScanPos(0)
    let pos = 0
    const iv = setInterval(() => {
      pos += 1
      setScanPos(pos)
      if (pos >= stubStart + stub.length) {
        clearInterval(iv)
        setPhase('found')
        setTimeout(() => {
          setPhase('done')
          setTimeout(() => setIdx(i => (i + 1) % SYSCALLS.length), 1400)
        }, 700)
      }
    }, 110)
    return () => clearInterval(iv)
  }, [idx])

  const stubLabels: Record<number, string> = {
    0: 'mov r10,rcx',
    3: `mov eax,0x${sc.ssn.toString(16).padStart(2,'0').toUpperCase()}`,
    8: 'syscall',
  }

  return (
    <div style={{ fontFamily: mono, userSelect: 'none' }}>
      <div style={{ fontSize: '12px', color: tokens.color.text.muted, marginBottom: 8, letterSpacing: '0.08em' }}>
        {"HellHall - résolution SSN depuis ntdll.dll"}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}
          style={{ fontSize: '13px', color: B, fontWeight: 700, marginBottom: 10, letterSpacing: '0.02em' }}
        >
          <span style={{ color: tokens.color.text.muted }}>target  </span>
          {sc.name}
        </motion.div>
      </AnimatePresence>
      <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', marginBottom: 10 }}>
        {allBytes.map((b, i) => {
          const isStub = i >= stubStart && i < stubStart + stub.length
          const isScanned = i < scanPos
          const isActive = i === scanPos - 1
          const stubOff = i - stubStart
          const bg = isActive ? `${B}20` : isStub && isScanned ? phase === 'done' ? `${B}12` : `${B}18` : tokens.color.surface.subtle
          const border = isActive ? `${B}90` : isStub && isScanned ? `${B}50` : tokens.color.surface.line
          const textColor = isStub && isScanned ? (phase === 'done' && stubOff === 4 ? tokens.color.semantic.success : B) : tokens.color.text.muted
          return (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.015 }}
              style={{ borderRadius: 4, overflow: 'hidden', border: `1px solid ${border}`, background: bg, transition: 'border 0.15s, background 0.15s', width: 30 }}
            >
              <div style={{ textAlign: 'center', padding: '4px 2px', fontSize: '12px', fontWeight: isStub && isScanned ? 700 : 400, color: textColor, transition: 'color 0.15s' }}>
                {b.toString(16).padStart(2, '0').toUpperCase()}
              </div>
              <div style={{ textAlign: 'center', fontSize: '9px', color: isStub && isScanned ? B : 'transparent', padding: '1px 0 3px', lineHeight: 1 }}>
                {isStub && stubLabels[stubOff] ? stubLabels[stubOff].split(' ')[0] : ' '}
              </div>
            </motion.div>
          )
        })}
      </div>
      <AnimatePresence mode="wait">
        {phase === 'done' ? (
          <motion.div key={`done-${idx}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, background: `${tokens.color.semantic.success}08`, border: `1px solid ${tokens.color.semantic.success}30`, borderRadius: 6, padding: '8px 12px' }}
          >
            <span style={{ fontSize: '12px', color: tokens.color.text.muted }}>SSN résolu</span>
            <span style={{ fontSize: '15px', fontWeight: 700, color: tokens.color.semantic.success }}>0x{sc.ssn.toString(16).padStart(2,'0').toUpperCase()}</span>
            <span style={{ fontSize: '12px', color: tokens.color.text.muted, flex: 1, textAlign: 'right' }}>{sc.name}</span>
          </motion.div>
        ) : (
          <motion.div key="scanning" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px' }}>
            <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 0.7 }}
              style={{ width: 6, height: 6, borderRadius: '50%', background: B }} />
            <span style={{ fontSize: '12px', color: tokens.color.text.muted }}>scan ntdll.dll...</span>
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
        {[{ label: 'bruit', color: tokens.color.text.muted }, { label: 'stub syscall', color: B }, { label: 'SSN extrait', color: tokens.color.semantic.success }].map(({ label, color }) => (
          <div key={label} style={{ fontSize: '11px', color, letterSpacing: '0.06em', fontWeight: 600 }}>{label.toUpperCase()}</div>
        ))}
      </div>
    </div>
  )
}

function KratosLogo() {
  const B = tokens.color.accent.blue
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 130, height: 130, flexShrink: 0 }}>
      <motion.div animate={{ scale: [1, 1.25, 1], opacity: [0.18, 0, 0.18] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', border: `1px solid ${B}`, pointerEvents: 'none' }} />
      <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.28, 0.05, 0.28] }} transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut', delay: 0.4 }}
        style={{ position: 'absolute', width: 96, height: 96, borderRadius: '50%', border: `1.5px solid ${B}`, pointerEvents: 'none' }} />
      <motion.div animate={{ opacity: [0.12, 0.22, 0.12] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        style={{ position: 'absolute', width: 72, height: 72, borderRadius: '50%', background: `radial-gradient(circle, ${B}40 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <motion.img src="/kratos.svg" alt="Kratos" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.34, 1.2, 0.64, 1] }}
        style={{ width: 80, height: 80, objectFit: 'contain', filter: `drop-shadow(0 0 16px ${B}70)`, zIndex: 1 }} />
    </div>
  )
}

const EVASION = [
  'ntdll unhook - remapping depuis le disque',
  'ETW/AMSI patch en mémoire',
  "Indirect syscalls via HellHall (SSN dynamique)",
  'PPID spoofing - parent process usurpé',
  'Sandbox detection - artefacts VM/timing',
]

const POSTEX = [
  { label: 'Creds',   items: ['runas', 'steal_token', 'rev2self'] },
  { label: 'Lateral', items: ['spawn', 'spawnto'] },
  { label: 'Pivot',   items: ['ligolo', 'socks'] },
]

export function Component(_: SlideContext) {
  const B = tokens.color.accent.blue
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', alignItems: 'flex-start' }}>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Eyebrow>08 - Kratos - Focus C99</Eyebrow>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.08 }}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 18, background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderTop: `2px solid ${B}`, borderRadius: 8, padding: '12px 20px' }}
      >
        <span style={{ fontFamily: tokens.type.family.mono, fontSize: '31px', fontWeight: 700, color: B, letterSpacing: '-0.04em', lineHeight: 1 }}>C99</span>
        <div style={{ width: 1, height: 28, background: tokens.color.surface.line }} />
        <div style={{ display: 'flex', gap: 7 }}>
          <Tag color={B}>Kratos</Tag>
          <Tag color={tokens.color.text.muted}>Windows x64</Tag>
          <Tag color={tokens.color.text.muted}>Modular</Tag>
        </div>
        <div style={{ flex: 1 }} />
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 18, width: '100%' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.18 }}
            style={{ background: `linear-gradient(135deg, ${tokens.color.surface.subtle} 60%, ${B}06 100%)`, border: `1px solid ${tokens.color.surface.line}`, borderLeft: `3px solid ${B}`, borderRadius: 10, padding: '18px 20px', display: 'flex', gap: 18, alignItems: 'center' }}
          >
            <KratosLogo />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: tokens.type.family.mono, fontSize: '25px', fontWeight: 700, color: B, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 6 }}>Kratos</div>
              <div style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.muted, lineHeight: tokens.type.leading.relaxed }}>
                Agent C99 minimaliste pour Windows x64. Architecture modulaire compilée conditionnellement - chaque commande est un module indépendant.
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                <Tag color={B}>C99</Tag>
                <Tag color={tokens.color.text.muted}>Windows x64</Tag>
                <Tag color={tokens.color.text.muted}>{"HellHall"}</Tag>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: 0.28 }}
            style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderLeft: `3px solid ${B}`, borderRadius: 10, padding: '14px 18px' }}
          >
            <SectionLabel color={B}>Evasion</SectionLabel>
            <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } } }}
              style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}
            >
              {EVASION.map(item => (
                <motion.div key={item} variants={{ hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0, transition: { duration: 0.3 } } }}
                  style={{ display: 'flex', gap: 8, fontSize: tokens.type.size.xs, color: tokens.color.text.secondary, lineHeight: 1.4 }}
                >
                  <span style={{ color: B, flexShrink: 0, fontFamily: tokens.type.family.mono, fontSize: '12px', fontWeight: 700 }}>→</span>
                  {item}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: 0.38 }}
            style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 10, padding: '12px 18px' }}
          >
            <SectionLabel>Post-exploitation</SectionLabel>
            <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
              {POSTEX.map(({ label, items }) => (
                <div key={label}>
                  <div style={{ fontSize: '11px', fontFamily: tokens.type.family.mono, color: tokens.color.text.muted, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {items.map(cmd => (
                      <span key={cmd} style={{ fontFamily: tokens.type.family.mono, fontSize: '12px', color: B, background: `${B}10`, border: `1px solid ${B}30`, borderRadius: 4, padding: '2px 6px' }}>{cmd}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
            style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderLeft: `2px solid ${B}`, borderRadius: 10, padding: '16px 18px', flex: 1 }}
          >
            <HellsGate />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: 0.4 }}
            style={{ background: `${B}08`, border: `1px solid ${B}28`, borderRadius: 8, padding: '10px 14px' }}
          >
            <p style={{ fontSize: tokens.type.size.sm, color: tokens.color.text.secondary, margin: 0, lineHeight: tokens.type.leading.normal }}>
              Aucun SSN hardcodé. Le stub syscall est résolu dynamiquement depuis ntdll.dll - contourne les hooks userland sans patcher la mémoire de l'EDR.
            </p>
          </motion.div>
        </div>

      </div>
    </div>
  )
}
