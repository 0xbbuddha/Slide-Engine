import { SlideContext, SlideMeta } from '../engine/types'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useCallback } from 'react'
import { tokens } from '../design/tokens'
import { Eyebrow } from '../ui/Eyebrow'
import { Tag, SectionLabel } from './_shared'

export const meta: SlideMeta = {
  title: 'Profils C2',
  speaker: ['Killian'],
  notes: 'Chess.com est le plus spectaculaire. Montrez le board qui joue. Trafic = partie d\'échecs publique. Base5 PNBRQ = payload bytes.',
}

// ── Chess engine ───────────────────────────────────────────────────────────

const CELL = 43

const PIECES: Record<string, string> = {
  K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
  k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟',
}

function parseFEN(fen: string): (string | null)[][] {
  return fen.split('/').map(rank => {
    const row: (string | null)[] = []
    for (const c of rank) {
      if (/[1-8]/.test(c)) row.push(...Array(Number(c)).fill(null))
      else row.push(c)
    }
    return row
  })
}

// Ruy Lopez — Berlin Defense opening
// Each position: FEN + last move from/to + C2 annotation
interface Position {
  fen: string
  from: [number, number] | null
  to: [number, number] | null
  side: 'server' | 'agent' | null
  byte: string
  comment: string
}

const GAME: Position[] = [
  {
    fen: 'r1bqkb1r/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R',
    from: null, to: null, side: null,
    byte: '',
    comment: '// canal C2 ouvert',
  },
  {
    fen: 'r1bqkb1r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R',
    from: [7, 5], to: [3, 1], side: 'server',
    byte: '0x2B',
    comment: '// server → exec "whoami"',
  },
  {
    fen: 'r1bqkb1r/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R',
    from: [1, 0], to: [2, 0], side: 'agent',
    byte: '0x41',
    comment: '// agent → ACK + output',
  },
  {
    fen: 'r1bqkb1r/1ppp1ppp/p1n5/4p3/B3P3/5N2/PPPP1PPP/RNBQK2R',
    from: [3, 1], to: [4, 0], side: 'server',
    byte: '0xF3',
    comment: '// server → "ls -la /tmp"',
  },
  {
    fen: 'r1bqkb1r/1ppp1ppp/p1n2n2/4p3/B3P3/5N2/PPPP1PPP/RNBQK2R',
    from: [0, 6], to: [2, 5], side: 'agent',
    byte: '0x1C',
    comment: '// agent → data chunk [1/3]',
  },
  {
    fen: 'r1bqkb1r/1ppp1ppp/p1n2n2/4p3/B3P3/5N2/PPPP1PPP/RNBQ1RK1',
    from: [7, 4], to: [7, 6], side: 'server',
    byte: '0x88',
    comment: '// server → kill date set',
  },
  {
    fen: 'r1bqk2r/1ppp1ppp/p1n2n2/4p3/B3P3/5N2/PPPP1PPP/RNBQ1RK1',
    from: [0, 5], to: [2, 4], side: 'agent',
    byte: '0x00',
    comment: '// agent → CMD_COMPLETE',
  },
]

const BASE5_MAP = ['P', 'N', 'B', 'R', 'Q']

// ── ChessBoard component ───────────────────────────────────────────────────

function ChessBoard({ pos }: { pos: Position }) {
  const board = parseFEN(pos.fen)

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      {/* Board */}
      <div style={{
        position: 'relative',
        width: CELL * 8,
        height: CELL * 8,
        border: `1px solid ${tokens.color.surface.lineStrong}`,
        borderRadius: 4,
        overflow: 'hidden',
      }}>
        {/* Squares */}
        {Array.from({ length: 64 }).map((_, idx) => {
          const r = Math.floor(idx / 8)
          const c = idx % 8
          const isLight = (r + c) % 2 !== 0
          const isFrom = pos.from && pos.from[0] === r && pos.from[1] === c
          const isTo = pos.to && pos.to[0] === r && pos.to[1] === c

          let bg = isLight ? '#1c1c2e' : '#12121e'
          if (isFrom) bg = '#2a2a1a'
          if (isTo) bg = pos.side === 'server' ? '#34d39918' : '#60a5fa18'

          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                top: r * CELL, left: c * CELL,
                width: CELL, height: CELL,
                background: bg,
                boxShadow: isTo
                  ? `inset 0 0 0 1px ${pos.side === 'server' ? '#34d39955' : '#60a5fa55'}`
                  : undefined,
                transition: 'background 0.4s ease',
              }}
            />
          )
        })}

        {/* Pieces */}
        {board.map((row, ri) =>
          row.map((piece, ci) => {
            if (!piece) return null
            const isTo = pos.to && pos.to[0] === ri && pos.to[1] === ci
            const isWhite = piece === piece.toUpperCase()
            const carrierColor = pos.side === 'server' ? tokens.color.accent.teal : tokens.color.accent.blue

            return (
              <motion.div
                key={`${piece}-${ri}-${ci}`}
                initial={isTo ? { scale: 0.4, opacity: 0 } : { scale: 1, opacity: 1 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.45, ease: [0.34, 1.2, 0.64, 1] }}
                style={{
                  position: 'absolute',
                  top: ri * CELL, left: ci * CELL,
                  width: CELL, height: CELL,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24,
                  color: isTo ? carrierColor : isWhite ? '#c8c8d0' : '#2e2e44',
                  textShadow: isTo ? `0 0 18px ${carrierColor}` : undefined,
                  userSelect: 'none',
                  zIndex: 1,
                  filter: isTo ? `drop-shadow(0 0 8px ${carrierColor}80)` : undefined,
                }}
              >
                {PIECES[piece]}
              </motion.div>
            )
          })
        )}
      </div>

      {/* File labels */}
      <div style={{ display: 'flex', marginTop: 4 }}>
        {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(f => (
          <div key={f} style={{ width: CELL, textAlign: 'center', fontFamily: tokens.type.family.mono, fontSize: 10, color: tokens.color.text.muted }}>{f}</div>
        ))}
      </div>
    </div>
  )
}

// ── FEN display with animated update ──────────────────────────────────────

function LiveFEN({ fen }: { fen: string }) {
  const [displayed, setDisplayed] = useState(fen)
  useEffect(() => {
    setDisplayed(fen)
  }, [fen])

  return (
    <div style={{ fontFamily: tokens.type.family.mono, fontSize: '11px', color: tokens.color.text.tertiary, background: '#05050a', border: `1px solid ${tokens.color.surface.line}`, borderRadius: 5, padding: '6px 10px', letterSpacing: '0.04em', wordBreak: 'break-all', lineHeight: 1.6 }}>
      <span style={{ color: tokens.color.text.muted, marginRight: 6 }}>FEN</span>
      {displayed.split('').map((c, i) => {
        const isUpper = /[PNBRQK]/.test(c)
        return (
          <span key={i} style={{ color: isUpper ? tokens.color.accent.teal : tokens.color.text.tertiary }}>
            {c}
          </span>
        )
      })}
    </div>
  )
}

// ── Main slide ─────────────────────────────────────────────────────────────

export function Component(_: SlideContext) {
  const [posIdx, setPosIdx] = useState(0)
  const [payloadLog, setPayloadLog] = useState<{ byte: string; comment: string; side: 'server' | 'agent' }[]>([])

  const advance = useCallback(() => {
    setPosIdx(prev => {
      const next = (prev + 1) % GAME.length
      const nextPos = GAME[next]
      if (nextPos.byte && nextPos.side) {
        setPayloadLog(log => [...log.slice(-6), { byte: nextPos.byte, comment: nextPos.comment, side: nextPos.side as 'server' | 'agent' }])
      }
      return next
    })
  }, [])

  useEffect(() => {
    const iv = setInterval(advance, 2200)
    return () => clearInterval(iv)
  }, [advance])

  const current = GAME[posIdx]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', alignItems: 'flex-start' }}>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Eyebrow>09 — Canaux C2 Couverts</Eyebrow>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ fontSize: tokens.type.size['2xl'], fontWeight: 600, letterSpacing: tokens.type.tracking.tight, color: tokens.color.text.primary, margin: 0 }}
      >
        Chess.com — canal C2 covert
      </motion.h2>

      <div style={{ display: 'flex', gap: 20, width: '100%', alignItems: 'flex-start' }}>

        {/* Left — chess board */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
          <ChessBoard pos={current} />
          <LiveFEN fen={current.fen} />
        </div>

        {/* Right — explanation + payload stream */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>

          {/* How it works */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderLeft: `2px solid ${tokens.color.accent.teal}`, borderRadius: 8, padding: '14px 18px' }}
          >
            <SectionLabel color={tokens.color.accent.teal}>Principe</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 10 }}>
              {[
                'Payload bytes encodés en positions FEN via Base5 PNBRQ',
                'Partage publié sur Chess.com comme une vraie partie',
                'Agent fetch + décode : trafic = chess.com HTTPS',
              ].map((l, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, fontSize: tokens.type.size.sm, color: tokens.color.text.secondary, lineHeight: tokens.type.leading.normal }}>
                  <span style={{ color: tokens.color.accent.teal, flexShrink: 0 }}>→</span>{l}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Base5 mapping */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.32 }}
            style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 8, padding: '12px 16px' }}
          >
            <SectionLabel>Base5 encoding — PNBRQ</SectionLabel>
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              {BASE5_MAP.map((p, i) => (
                <div key={p} style={{ background: '#05050a', border: `1px solid ${tokens.color.surface.line}`, borderRadius: 5, padding: '6px 10px', textAlign: 'center', flex: 1 }}>
                  <div style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size.xl, fontWeight: 700, color: tokens.color.accent.teal, lineHeight: 1 }}>{p}</div>
                  <div style={{ fontFamily: tokens.type.family.mono, fontSize: '10px', color: tokens.color.text.muted, marginTop: 3 }}>{i}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Live payload stream */}
          <div style={{ background: '#05050a', border: `1px solid ${tokens.color.surface.line}`, borderRadius: 8, padding: '12px 14px', flex: 1 }}>
            <SectionLabel>Flux payload décodé</SectionLabel>

            {/* Current move */}
            <AnimatePresence mode="wait">
              <motion.div
                key={posIdx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ marginTop: 10, marginBottom: 10 }}
              >
                <div style={{ fontFamily: tokens.type.family.mono, fontSize: '11px', color: current.side === 'server' ? tokens.color.accent.teal : tokens.color.accent.blue, lineHeight: 1.6 }}>
                  {current.byte ? (
                    <>
                      <span style={{ opacity: 0.6 }}>{current.side === 'server' ? '[server] ' : '[agent]  '}</span>
                      <span style={{ fontWeight: 700, fontSize: '13px' }}>{current.byte}</span>
                      {'  '}
                      <span style={{ color: tokens.color.text.muted }}>{current.comment}</span>
                    </>
                  ) : (
                    <span style={{ color: tokens.color.text.muted }}>{'// en attente de moves...'}</span>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* History log */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {payloadLog.map(({ byte, comment, side }, i) => (
                <motion.div
                  key={`${byte}-${i}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 0.45 }}
                  transition={{ duration: 0.3 }}
                  style={{ fontFamily: tokens.type.family.mono, fontSize: '11px', color: side === 'server' ? tokens.color.accent.teal : tokens.color.accent.blue, lineHeight: 1.5 }}
                >
                  <span style={{ opacity: 0.5 }}>{side === 'server' ? '[server] ' : '[agent]  '}</span>
                  {byte}{'  '}
                  <span style={{ color: tokens.color.text.muted }}>{comment}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Other profiles */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            style={{ display: 'flex', gap: 10, alignItems: 'center' }}
          >
            <span style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.muted, fontFamily: tokens.type.family.mono }}>autres profils :</span>
            <Tag color={tokens.color.accent.blue}>Notion API</Tag>
            <Tag color={tokens.color.semantic.warning}>HTTP Standard</Tag>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
