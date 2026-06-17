import { SlideContext, SlideMeta } from '../engine/types'
import { motion } from 'framer-motion'
import { tokens } from '../design/tokens'
import { Eyebrow } from '../ui/Eyebrow'
import { Terminal, TermLine, Tag, SectionLabel, Highlight } from './_shared'

export const meta: SlideMeta = {
  title: 'Hephaestus',
  speaker: ['Killian'],
  notes: 'Montrez le terminal en temps réel. Chaque ligne = une étape réelle du flux d\'injection. Clé unique par build = pas de signature statique réutilisable.',
}

const INJECT_LOG: TermLine[] = [
  { t: 'cmd', text: 'hephaestus.exe --inject --pid 1337 --ppid 642' },
  { t: 'blank' },
  { t: 'info', text: 'Sandbox check: uptime=14m32s  ram=8192MB  cpu=4' },
  { t: 'ok', text:  'Sandbox: PASSED' },
  { t: 'info', text: 'Remapping ntdll.dll from disk  (0x77380000)' },
  { t: 'ok', text:  'ntdll userland hooks cleared  (34 functions restored)' },
  { t: 'info', text: 'Patching ETW: NtTraceEvent @ 0x7738FA20' },
  { t: 'ok', text:  'ETW: xor eax,eax; ret  [PATCHED]' },
  { t: 'info', text: 'Patching AMSI: AmsiScanBuffer @ 0x71A23B40' },
  { t: 'ok', text:  'AMSI: xor eax,eax; ret  [PATCHED]' },
  { t: 'blank' },
  { t: 'info', text: 'Spawning svchost.exe  PPID=642 (services.exe)  CREATE_SUSPENDED' },
  { t: 'ok', text:  'Child PID: 1337  handle: 0x000002A4' },
  { t: 'info', text: 'VirtualAllocEx: 0xA800 bytes PAGE_EXECUTE_READWRITE' },
  { t: 'ok', text:  'Remote buffer: 0x01F40000' },
  { t: 'info', text: 'WriteProcessMemory: 43008 bytes' },
  { t: 'ok', text:  'Shellcode written  [RC4 key: 8f3a...d92c]' },
  { t: 'info', text: 'Queuing APC via Early Bird injection' },
  { t: 'ok', text:  'ResumeThread: injected' },
  { t: 'info', text: 'Wiping local shellcode buffer' },
  { t: 'blank' },
  { t: 'ok', text:  'Agent alive.  C2: chess.com/fen/base5  UUID: a3f7...' },
]

const TECHNIQUES = [
  { name: 'PPID Spoofing', detail: 'process tree', color: tokens.color.semantic.warning },
  { name: 'ntdll Unhooking', detail: 'EDR userland hooks', color: tokens.color.semantic.critical },
  { name: 'ETW Patch', detail: 'NtTraceEvent xor ret', color: tokens.color.semantic.critical },
  { name: 'AMSI Patch', detail: 'AmsiScanBuffer', color: tokens.color.semantic.critical },
  { name: 'Memory Wipe', detail: 'anti-forensics', color: tokens.color.accent.blue },
]

export function Component(_: SlideContext) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', alignItems: 'flex-start' }}>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Eyebrow>08 — Hephaestus · Loader Windows · Nim</Eyebrow>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ fontSize: tokens.type.size['2xl'], fontWeight: tokens.type.weight.semibold, letterSpacing: tokens.type.tracking.tight, color: tokens.color.text.primary, margin: 0 }}
      >
        Injection &amp; Évasion
      </motion.h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, width: '100%' }}>

        {/* Terminal */}
        <Terminal title="hephaestus.exe" lines={INJECT_LOG} stepDelay={85} />

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.3 }}
            style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 8, padding: '16px 20px' }}
          >
            <SectionLabel>Techniques Anti-EDR</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
              {TECHNIQUES.map(({ name, detail, color }) => (
                <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#05050a', border: `1px solid ${tokens.color.surface.line}`, borderRadius: 5, padding: '6px 10px' }}>
                  <span style={{ fontSize: tokens.type.size.sm, color: tokens.color.text.secondary, fontFamily: tokens.type.family.mono }}>{name}</span>
                  <Tag color={color}>{detail}</Tag>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.42 }}
            style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 8, padding: '14px 18px' }}
          >
            <SectionLabel>Modes d'injection</SectionLabel>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <Tag color={tokens.color.accent.blue}>Early Bird APC</Tag>
              <Tag color={tokens.color.accent.violet}>Thread Hijacking</Tag>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.54 }}
          >
            <Highlight color={tokens.color.accent.teal}>
              Clé RC4/XOR générée à chaque build — chaque binaire est <strong style={{ color: tokens.color.accent.teal }}>unique et distinct</strong>, aucune signature statique réutilisable entre deux compilations.
            </Highlight>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
