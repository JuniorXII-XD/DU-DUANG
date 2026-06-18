/**
 * TarotDeckPlaceholder.jsx
 * Center-stage tarot deck placeholder.
 * Renders stacked card outlines with a constellation SVG and
 * gesture-reactive messaging.
 */

import React, { useMemo } from 'react'
import { GESTURE_META } from '../services/gestureService'

// Constellation dot positions (cx, cy) within 160×220 card space
const CONSTELLATION = [
  [80, 40], [55, 70], [105, 70], [42, 110], [80, 95],
  [118, 110], [60, 145], [100, 145], [80, 175],
]

// Connections between constellation points
const EDGES = [
  [0, 1], [0, 2], [1, 3], [1, 4], [2, 4], [2, 5],
  [3, 6], [4, 6], [4, 7], [5, 7], [6, 8], [7, 8],
]

const GESTURE_PROMPTS = {
  open_palm:       { headline: 'Card Revealed',   sub: 'The veil lifts…' },
  pointing_finger: { headline: 'Select Position', sub: 'Where shall it fall?' },
  ok_sign:         { headline: 'Confirmed',       sub: 'So it is written.' },
  fist:            { headline: 'Shuffling…',      sub: 'The fates are stirred.' },
  unknown:         { headline: 'Arcana',          sub: 'Show your hand to begin.' },
}

/** Single stacked card layer */
function CardLayer({ offset, opacity, className = '' }) {
  return (
    <div
      className={`absolute inset-0 rounded-2xl border border-border ${className}`}
      style={{
        transform: `translate(${offset}px, ${offset}px)`,
        opacity,
        background: 'linear-gradient(160deg, #1A1C35 0%, #111228 100%)',
      }}
    />
  )
}

export default function TarotDeckPlaceholder({ gesture }) {
  const meta   = GESTURE_META[gesture]   ?? GESTURE_META.unknown
  const prompt = GESTURE_PROMPTS[gesture] ?? GESTURE_PROMPTS.unknown
  const isActive = gesture !== 'unknown'

  // Pulse the constellation differently per gesture
  const accentColor = useMemo(() => {
    switch (gesture) {
      case 'open_palm':       return '#C9A84C'
      case 'pointing_finger': return '#A07DD4'
      case 'ok_sign':         return '#4ADE80'
      case 'fist':            return '#F87171'
      default:                return '#7B5EA7'
    }
  }, [gesture])

  return (
    <div className="flex flex-col items-center gap-8">
      {/* ── Card stack ─────────────────────────────────────────────── */}
      <div
        className="relative"
        style={{ width: 160, height: 220 }}
        aria-label="Tarot card deck"
      >
        {/* Stacked shadow cards */}
        <CardLayer offset={8} opacity={0.25} />
        <CardLayer offset={5} opacity={0.45} />
        <CardLayer offset={2} opacity={0.7}  />

        {/* Front card */}
        <div
          className={`
            absolute inset-0 rounded-2xl border transition-all duration-500
            ${isActive ? 'border-border' : 'border-border'}
            overflow-hidden
          `}
          style={{
            background: 'linear-gradient(160deg, #1A1C35 0%, #0B0C1A 100%)',
            boxShadow: isActive
              ? `0 0 30px 4px ${accentColor}33, inset 0 0 40px ${accentColor}11`
              : '0 8px 40px rgba(0,0,0,0.6)',
          }}
        >
          {/* Constellation SVG */}
          <svg
            viewBox="0 0 160 220"
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
          >
            {/* Edges */}
            {EDGES.map(([a, b], i) => (
              <line
                key={i}
                x1={CONSTELLATION[a][0]} y1={CONSTELLATION[a][1]}
                x2={CONSTELLATION[b][0]} y2={CONSTELLATION[b][1]}
                stroke={accentColor}
                strokeWidth="0.5"
                strokeOpacity="0.3"
              />
            ))}

            {/* Dots */}
            {CONSTELLATION.map(([cx, cy], i) => (
              <circle
                key={i}
                cx={cx} cy={cy}
                r="2"
                fill={accentColor}
                fillOpacity="0.7"
              />
            ))}

            {/* Center glow */}
            <circle
              cx="80" cy="110"
              r="28"
              fill="none"
              stroke={accentColor}
              strokeWidth="0.5"
              strokeOpacity="0.2"
            />
            <circle
              cx="80" cy="110"
              r="16"
              fill="none"
              stroke={accentColor}
              strokeWidth="0.5"
              strokeOpacity="0.15"
            />
          </svg>

          {/* Symbol overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-5xl opacity-20 select-none"
              style={{ color: accentColor }}
              aria-hidden="true"
            >
              {isActive ? meta.symbol : '◈'}
            </span>
          </div>

          {/* Top-left roman numeral */}
          <span className="absolute top-3 left-3.5 font-display text-[10px] tracking-widest text-gold-dim">
            ARCANA
          </span>

          {/* Bottom-right deck count */}
          <span className="absolute bottom-3 right-3.5 font-display text-[10px] tracking-widest text-gold-dim">
            22
          </span>
        </div>
      </div>

      {/* ── Gesture prompt ─────────────────────────────────────────── */}
      <div className="text-center space-y-1.5">
        <h2
          className="font-display text-xl tracking-[0.15em] uppercase"
          style={{ color: isActive ? accentColor : '#C9A84C' }}
        >
          {prompt.headline}
        </h2>
        <p className="font-body text-sm text-silver">
          {prompt.sub}
        </p>
      </div>
    </div>
  )
}
