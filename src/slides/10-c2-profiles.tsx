import { SlideContext, SlideMeta } from '../engine/types'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useCallback } from 'react'
import { tokens } from '../design/tokens'
import { Eyebrow } from '../ui/Eyebrow'
import { Tag, SectionLabel } from './_shared'

export const meta: SlideMeta = {
  title: 'Profils C2',
  speaker: ['Killian'],
  notes: 'Chess.com est le plus spectaculaire. Montrez le board qui joue. Notion utilise l\'API officielle - trafic 100% legitime dans les deux cas.',
}

// ── Chess engine ───────────────────────────────────────────────────────────

const CELL = 38

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

interface Position {
  fen: string
  from: [number, number] | null
  to: [number, number] | null
  side: 'server' | 'agent' | null
  byte: string
  comment: string
}

const GAME: Position[] = [
  { fen: 'r1bqkb1r/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R', from: null, to: null, side: null, byte: '', comment: '// canal C2 ouvert' },
  { fen: 'r1bqkb1r/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R', from: [7, 5], to: [3, 1], side: 'server', byte: '0x2B', comment: '// exec "whoami"' },
  { fen: 'r1bqkb1r/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R', from: [1, 0], to: [2, 0], side: 'agent', byte: '0x41', comment: '// ACK + output' },
  { fen: 'r1bqkb1r/1ppp1ppp/p1n5/4p3/B3P3/5N2/PPPP1PPP/RNBQK2R', from: [3, 1], to: [4, 0], side: 'server', byte: '0xF3', comment: '// "ls -la /tmp"' },
  { fen: 'r1bqkb1r/1ppp1ppp/p1n2n2/4p3/B3P3/5N2/PPPP1PPP/RNBQK2R', from: [0, 6], to: [2, 5], side: 'agent', byte: '0x1C', comment: '// data chunk [1/3]' },
  { fen: 'r1bqkb1r/1ppp1ppp/p1n2n2/4p3/B3P3/5N2/PPPP1PPP/RNBQ1RK1', from: [7, 4], to: [7, 6], side: 'server', byte: '0x88', comment: '// kill date set' },
  { fen: 'r1bqk2r/1ppp1ppp/p1n2n2/4p3/B3P3/5N2/PPPP1PPP/RNBQ1RK1', from: [0, 5], to: [2, 4], side: 'agent', byte: '0x00', comment: '// CMD_COMPLETE' },
]

const BASE5_MAP = ['P', 'N', 'B', 'R', 'Q']

function ChessBoard({ pos }: { pos: Position }) {
  const board = parseFEN(pos.fen)
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <div style={{ position: 'relative', width: CELL * 8, height: CELL * 8, border: `1px solid ${tokens.color.surface.lineStrong}`, borderRadius: 4, overflow: 'hidden' }}>
        {Array.from({ length: 64 }).map((_, idx) => {
          const r = Math.floor(idx / 8), c = idx % 8
          const isFrom = pos.from && pos.from[0] === r && pos.from[1] === c
          const isTo = pos.to && pos.to[0] === r && pos.to[1] === c
          const cc = pos.side === 'server' ? tokens.color.accent.teal : tokens.color.accent.blue
          let bg = (r + c) % 2 !== 0 ? '#eef2f7' : '#f8fafc'
          if (isFrom) bg = '#fef3c7'
          if (isTo) bg = `${cc}18`
          return (
            <div key={idx} style={{ position: 'absolute', top: r * CELL, left: c * CELL, width: CELL, height: CELL, background: bg, boxShadow: isTo ? `inset 0 0 0 1px ${cc}55` : undefined, transition: 'background 0.4s ease' }} />
          )
        })}
        {board.map((row, ri) => row.map((piece, ci) => {
          if (!piece) return null
          const isTo = pos.to && pos.to[0] === ri && pos.to[1] === ci
          const isWhite = piece === piece.toUpperCase()
          const cc = pos.side === 'server' ? tokens.color.accent.teal : tokens.color.accent.blue
          return (
            <motion.div key={`${piece}-${ri}-${ci}`}
              initial={isTo ? { scale: 0.4, opacity: 0 } : { scale: 1, opacity: 1 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45, ease: [0.34, 1.2, 0.64, 1] }}
              style={{ position: 'absolute', top: ri * CELL, left: ci * CELL, width: CELL, height: CELL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: isTo ? cc : isWhite ? '#64748b' : '#1e293b', textShadow: isTo ? `0 0 18px ${cc}` : '0 1px 0 rgba(255,255,255,0.65)', userSelect: 'none', zIndex: 1, filter: isTo ? `drop-shadow(0 0 8px ${cc}80)` : undefined }}
            >
              {PIECES[piece]}
            </motion.div>
          )
        }))}
      </div>
      <div style={{ display: 'flex', marginTop: 3 }}>
        {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(f => (
          <div key={f} style={{ width: CELL, textAlign: 'center', fontFamily: tokens.type.family.mono, fontSize: tokens.type.size['2xs'], color: tokens.color.text.muted }}>{f}</div>
        ))}
      </div>
    </div>
  )
}

function LiveFEN({ fen }: { fen: string }) {
  return (
    <div style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size.xs, color: tokens.color.text.tertiary, background: tokens.color.surface.base, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 5, padding: '5px 8px', letterSpacing: '0.04em', wordBreak: 'break-all', lineHeight: 1.6 }}>
      <span style={{ color: tokens.color.text.muted, marginRight: 6 }}>FEN</span>
      {fen.split('').map((c, i) => (
        <span key={i} style={{ color: /[PNBRQK]/.test(c) ? tokens.color.accent.teal : tokens.color.text.tertiary }}>{c}</span>
      ))}
    </div>
  )
}

// ── Notion C2 visualization ────────────────────────────────────────────────

const NOTION_ROWS = [
  { id: '1a2b', status: 'done',    task: 'whoami',          payload: 'dGFza18x', response: 'NT AUTHORITY\\SYSTEM' },
  { id: '3c4d', status: 'done',    task: 'ls /tmp',         payload: 'bHMgL3Rt', response: '/tmp/x.bin  /tmp/.ssh' },
  { id: '5e6f', status: 'active',  task: 'upload implant',  payload: 'dXBsb2Fk', response: '...' },
  { id: '7g8h', status: 'pending', task: 'exec cmd',        payload: '-',         response: '-' },
]

function NotionView() {
  const [visibleRows, setVisibleRows] = useState(1)
  const [blink, setBlink] = useState(false)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    timers.push(setTimeout(() => setVisibleRows(2), 1200))
    timers.push(setTimeout(() => setVisibleRows(3), 2200))
    timers.push(setTimeout(() => setVisibleRows(4), 3200))
    const iv = setInterval(() => setBlink(b => !b), 800)
    return () => { timers.forEach(clearTimeout); clearInterval(iv) }
  }, [])

  const statusColor = (s: string) => s === 'done' ? tokens.color.semantic.success : s === 'active' ? tokens.color.accent.violet : tokens.color.text.muted

  return (
    <div style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size.xs }}>
      {/* Fake Notion page header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size.xs, color: tokens.color.accent.violet, fontWeight: 700 }}>[db]</span>
        <span style={{ fontSize: tokens.type.size.sm, fontWeight: 600, color: tokens.color.text.primary, fontFamily: tokens.type.family.sans }}>C2 Tasking Queue</span>
        <span style={{ fontSize: tokens.type.size['2xs'], color: tokens.color.text.muted, fontFamily: tokens.type.family.mono }}>notion.so/workspace/</span>
      </div>

      {/* Table header */}
      <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr 88px 1fr', gap: '0 8px', padding: '4px 8px', background: tokens.color.surface.base, borderBottom: `1px solid ${tokens.color.surface.line}` }}>
        {['Status', 'Task', 'Payload', 'Response'].map(h => (
          <div key={h} style={{ fontSize: tokens.type.size['2xs'], letterSpacing: '0.08em', textTransform: 'uppercase', color: tokens.color.text.muted, fontWeight: 600 }}>{h}</div>
        ))}
      </div>

      {/* Rows */}
      {NOTION_ROWS.slice(0, visibleRows).map((row, i) => (
        <motion.div
          key={row.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ display: 'grid', gridTemplateColumns: '52px 1fr 88px 1fr', gap: '0 8px', padding: '6px 8px', borderBottom: `1px solid ${tokens.color.surface.line}`, background: row.status === 'active' ? `${tokens.color.accent.violet}06` : 'transparent' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor(row.status), flexShrink: 0, display: 'inline-block' }} />
            <span style={{ color: statusColor(row.status), fontSize: tokens.type.size['2xs'], fontWeight: 600 }}>{row.status}</span>
          </div>
          <div style={{ color: tokens.color.text.secondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.task}</div>
          <div style={{ color: tokens.color.accent.violet, letterSpacing: '0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {row.payload}{row.status === 'active' && blink ? '|' : ''}
          </div>
          <div style={{ color: tokens.color.text.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {row.response === '...' ? (blink ? '_' : '') : row.response}
          </div>
        </motion.div>
      ))}

      {/* Principle */}
      <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {[
          'Tasks = entrees d\'une database Notion publique',
          'Agent lit via l\'API officielle (api.notion.com)',
          'Trafic = requetes HTTPS Notion legitimes',
        ].map((l, i) => (
          <div key={i} style={{ display: 'flex', gap: 6, fontSize: tokens.type.size.xs, color: tokens.color.text.tertiary, lineHeight: 1.5 }}>
            <span style={{ color: tokens.color.accent.violet, flexShrink: 0 }}>→</span>{l}
          </div>
        ))}
      </div>
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
        setPayloadLog(log => [...log.slice(-4), { byte: nextPos.byte, comment: nextPos.comment, side: nextPos.side as 'server' | 'agent' }])
      }
      return next
    })
  }, [])

  useEffect(() => {
    const iv = setInterval(advance, 2200)
    return () => clearInterval(iv)
  }, [advance])

  const current = GAME[posIdx]
  const historyRows = Array.from({ length: 4 }, (_, idx) => payloadLog[idx - (4 - payloadLog.length)] ?? null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 'calc(100% + 80px)', marginLeft: -40, alignItems: 'flex-start' }}>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Eyebrow>09 - Canaux C2 Couverts</Eyebrow>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ fontSize: tokens.type.size['2xl'], fontWeight: 600, letterSpacing: tokens.type.tracking.tight, color: tokens.color.text.primary, margin: 0 }}
      >
        Profils C2 - Chess.com & Notion
      </motion.h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 12, width: '100%' }}>

        {/* Chess.com card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderTop: `2px solid ${tokens.color.accent.teal}`, borderRadius: 10, padding: '14px', display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}
        >
          <SectionLabel color={tokens.color.accent.teal}>Chess.com - covert channel</SectionLabel>

          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', minWidth: 0 }}>
            {/* Board */}
            <div style={{ flexShrink: 0 }}>
              <ChessBoard pos={current} />
              <div style={{ marginTop: 4 }}>
                <LiveFEN fen={current.fen} />
              </div>
            </div>

            {/* Right of board */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>

              {/* Principle */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[
                  'Payload bytes encodes Base5 PNBRQ -> positions FEN',
                  'Partie publiee sur Chess.com comme vraie game',
                  'Trafic indiscernable du chess normal',
                ].map((l, i) => (
                  <div key={i} style={{ display: 'flex', gap: 6, fontSize: tokens.type.size.xs, color: tokens.color.text.secondary, lineHeight: 1.5 }}>
                    <span style={{ color: tokens.color.accent.teal, flexShrink: 0 }}>→</span>{l}
                  </div>
                ))}
              </div>

              {/* Base5 */}
              <div style={{ display: 'flex', gap: 4 }}>
                {BASE5_MAP.map((p, i) => (
                  <div key={p} style={{ background: tokens.color.surface.base, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 4, padding: '4px 8px', textAlign: 'center', flex: 1 }}>
                    <div style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size.md, fontWeight: 700, color: tokens.color.accent.teal, lineHeight: 1 }}>{p}</div>
                    <div style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size['2xs'], color: tokens.color.text.muted, marginTop: 2 }}>{i}</div>
                  </div>
                ))}
              </div>

              {/* Payload stream */}
              <div style={{ background: tokens.color.surface.base, border: `1px solid ${tokens.color.surface.line}`, borderRadius: 6, padding: '8px 10px', height: 146, overflow: 'hidden' }}>
                <div style={{ fontSize: tokens.type.size['2xs'], letterSpacing: '0.08em', color: tokens.color.text.muted, textTransform: 'uppercase', fontWeight: 600, fontFamily: tokens.type.family.mono, marginBottom: 6 }}>payload flux</div>
                <div style={{ display: 'grid', gridTemplateRows: 'repeat(5, 22px)', gap: 2 }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={posIdx}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size.xs, color: current.side === 'server' ? tokens.color.accent.teal : tokens.color.accent.blue, height: 22, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', overflow: 'hidden' }}
                  >
                    {current.byte ? (
                      <>
                        <span style={{ opacity: 0.5 }}>{current.side === 'server' ? '[srv] ' : '[agt] '}</span>
                        <span style={{ fontWeight: 700 }}>{current.byte}</span>
                        {'  '}
                        <span style={{ color: tokens.color.text.muted, fontSize: tokens.type.size.xs, overflow: 'hidden', textOverflow: 'ellipsis' }}>{current.comment}</span>
                      </>
                    ) : (
                      <span style={{ color: tokens.color.text.muted }}>{'// en attente...'}</span>
                    )}
                  </motion.div>
                </AnimatePresence>
                {historyRows.map((row, i) => (
                  row ? (
                    <motion.div
                      key={`${row.byte}-${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.4 }}
                      transition={{ duration: 0.3 }}
                      style={{ fontFamily: tokens.type.family.mono, fontSize: tokens.type.size.xs, color: row.side === 'server' ? tokens.color.accent.teal : tokens.color.accent.blue, height: 22, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', overflow: 'hidden' }}
                    >
                      <span style={{ opacity: 0.5 }}>{row.side === 'server' ? '[srv] ' : '[agt] '}</span>
                      {row.byte}{'  '}
                      <span style={{ color: tokens.color.text.muted, fontSize: tokens.type.size.xs, overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.comment}</span>
                    </motion.div>
                  ) : (
                    <div key={`placeholder-${i}`} style={{ height: 22 }} />
                  )
                ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notion card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          style={{ background: tokens.color.surface.subtle, border: `1px solid ${tokens.color.surface.line}`, borderTop: `2px solid ${tokens.color.accent.violet}`, borderRadius: 10, padding: '14px', display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}
        >
          <SectionLabel color={tokens.color.accent.violet}>Notion API - database channel</SectionLabel>
          <NotionView />
        </motion.div>

      </div>

      {/* Footer - HTTP profile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        style={{ display: 'flex', gap: 10, alignItems: 'center' }}
      >
        <span style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.muted, fontFamily: tokens.type.family.mono }}>+ profil de base :</span>
        <Tag color={tokens.color.semantic.warning}>HTTP Standard</Tag>
        <span style={{ fontSize: tokens.type.size.xs, color: tokens.color.text.muted }}>Jitter configurable, kill date, user-agent spoofing</span>
      </motion.div>

    </div>
  )
}
