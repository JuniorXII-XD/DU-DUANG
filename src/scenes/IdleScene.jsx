/**
 * IdleScene.jsx
 * IDLE state: stacked deck with constellation, waiting for open palm.
 */

import React from 'react'

const CONSTELLATION = [
  [80, 40], [55, 70], [105, 70], [42, 110], [80, 95],
  [118, 110], [60, 145], [100, 145], [80, 175],
]
const EDGES = [
  [0,1],[0,2],[1,3],[1,4],[2,4],[2,5],
  [3,6],[4,6],[4,7],[5,7],[6,8],[7,8],
]

function CardLayer({ offset, opacity }) {
  return (
    <div
      className="absolute inset-0 rounded-2xl border border-border"
      style={{
        transform: `translate(${offset}px, ${offset}px)`,
        opacity,
        background: 'linear-gradient(160deg, #1A1C35 0%, #111228 100%)',
      }}
    />
  )
}

export default function IdleScene() {
  return (
    <div className="flex flex-col items-center gap-10">
      {/* ── Deck stack ──────────────────────────────────────────────── */}
      <div className="relative" style={{ width: 160, height: 220 }}>
        <CardLayer offset={8} opacity={0.2} />
        <CardLayer offset={5} opacity={0.4} />
        <CardLayer offset={2} opacity={0.65} />

        {/* Front face */}
        <div
          className="absolute inset-0 rounded-2xl border border-border overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #1A1C35 0%, #0B0C1A 100%)',
            boxShadow: '0 8px 48px rgba(0,0,0,0.7)',
          }}
        >
          <svg viewBox="0 0 160 220" className="absolute inset-0 w-full h-full" aria-hidden="true">
            {EDGES.map(([a, b], i) => (
              <line
                key={i}
                x1={CONSTELLATION[a][0]} y1={CONSTELLATION[a][1]}
                x2={CONSTELLATION[b][0]} y2={CONSTELLATION[b][1]}
                stroke="#7B5EA7" strokeWidth="0.5" strokeOpacity="0.3"
              />
            ))}
            {CONSTELLATION.map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="2" fill="#7B5EA7" fillOpacity="0.6" />
            ))}
            <circle cx="80" cy="110" r="28" fill="none" stroke="#C9A84C" strokeWidth="0.5" strokeOpacity="0.2" />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl opacity-20 select-none" style={{ color: '#C9A84C' }}>◈</span>
          </div>

          <span className="absolute top-3 left-3.5 font-display text-[10px] tracking-widest text-gold-dim">ARCANA</span>
          <span className="absolute bottom-3 right-3.5 font-display text-[10px] tracking-widest text-gold-dim">22</span>
        </div>
      </div>

      {/* ── Prompt ──────────────────────────────────────────────────── */}
      <div className="text-center space-y-2">
        <p className="font-display text-2xl tracking-[0.15em] uppercase text-gold idle-pulse">
          Arcane Oracle
        </p>
        <p className="font-body text-sm text-silver">
          Show an open palm to begin your reading
        </p>
        <p className="font-body text-xs text-gold-dim tracking-widest mt-3 opacity-70">✋ Open Palm</p>
      </div>
    </div>
  )
}
