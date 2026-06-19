import { SlideContext, SlideMeta } from '../engine/types'
import { motion } from 'framer-motion'
import { tokens } from '../design/tokens'
import { Eyebrow } from '../ui/Eyebrow'
import { AgentCard, Tag } from './_shared'

export const meta: SlideMeta = {
  title: 'Les 4 agents',
  speaker: ['Jeremy'],
  notes: 'Présentez les 4 agents from scratch. Insistez sur la diversité des langages et des cibles, puis enchaînez sur les deux loaders.',
}

const AGENTS = [
  {
    lang: 'C',
    name: 'Kratos',
    os: 'Windows',
    color: tokens.color.accent.blue,
    desc: 'Agent C99 minimaliste pour Windows.',
  },
  {
    lang: 'Go',
    name: 'Morpheus',
    os: 'Windows',
    color: tokens.color.accent.teal,
    desc: 'Agent Go pour Windows. Chaîne de build obfusquée et intégration propre à Mythic.',
  },
  {
    lang: 'Py',
    name: 'Hermes',
    os: 'Linux',
    color: tokens.color.semantic.warning,
    desc: 'Agent Python pour Linux. Pratique pour le scripting et la post-exploitation rapide.',
  },
  {
    lang: 'Nim',
    name: 'Aphrodite',
    os: 'Cross-platform',
    color: tokens.color.accent.violet,
    desc: 'Agent Nim cross-platform. Chiffrement, profils C2 multiples et configuration furtive.',
  },
]

export function Component(_: SlideContext) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', alignItems: 'flex-start' }}>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Eyebrow>07 - Agents Mythic</Eyebrow>
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
        {AGENTS.map(({ lang, name, os, color, desc }) => (
          <motion.div key={name} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
            <AgentCard lang={lang} name={name} os={os} color={color} desc={desc} />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.58 }}
        style={{ width: '72%', alignSelf: 'center', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
      >
        {/* Hephaestus */}
        <div style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderLeft: `2px solid ${tokens.color.semantic.warning}`, borderRadius: 8, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size.md, fontWeight: 700, color: tokens.color.semantic.warning }}>Hephaestus</div>
            <Tag color={tokens.color.semantic.warning}>Loader Nim · Windows</Tag>
          </div>
          <p style={{ fontSize: tokens.type.size.sm, color: tokens.color.text.secondary, lineHeight: tokens.type.leading.relaxed, margin: 0 }}>
            Wrapper Aphrodite via <strong style={{ color: tokens.color.text.primary, fontFamily: tokens.type.family.mono }}>donut</strong> (EXE → shellcode). Prépare l'exécution puis déclenche l'injection côté processus cible.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              'ntdll unhook, ETW patch, AMSI patch',
              'PPID spoofing et préparation mémoire',
              'Early Bird APC, Thread Hijacking, Process Hollowing',
            ].map((item) => (
              <div key={item} style={{ display: 'flex', gap: 8, fontSize: tokens.type.size.xs, color: tokens.color.text.secondary, lineHeight: 1.4 }}>
                <span style={{ color: tokens.color.semantic.warning, flexShrink: 0 }}>→</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Atreus */}
        <div style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderLeft: `2px solid ${tokens.color.accent.blue}`, borderRadius: 8, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size.md, fontWeight: 700, color: tokens.color.accent.blue }}>Atreus</div>
            <Tag color={tokens.color.accent.blue}>Loader C · Windows</Tag>
          </div>
          <p style={{ fontSize: tokens.type.size.sm, color: tokens.color.text.secondary, lineHeight: tokens.type.leading.relaxed, margin: 0 }}>
            Loader C minimaliste. Chargement de shellcode avec peu de dépendances, pensé pour rester léger et facilement adaptable.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              'Chaîne courte : déchiffrement, mapping, exécution',
              'Empreinte réduite côté runtime',
              'Base simple pour variantes et tests AV/EDR',
            ].map((item) => (
              <div key={item} style={{ display: 'flex', gap: 8, fontSize: tokens.type.size.xs, color: tokens.color.text.secondary, lineHeight: 1.4 }}>
                <span style={{ color: tokens.color.accent.blue, flexShrink: 0 }}>→</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

    </div>
  )
}
