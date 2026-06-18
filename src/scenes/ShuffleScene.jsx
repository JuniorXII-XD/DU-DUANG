/**
 * ShuffleScene.jsx
 * SHUFFLING state: 7 card layers fan out, spin, and collapse back.
 * Pure CSS keyframe animation — no JS timers here.
 * Parent (useReadingMachine) handles the timed transition to ORBITING.
 */

import React, { useMemo, useEffect } from 'react'
import { useSoundSystem } from '../hooks/useSoundSystem'

const CARD_COUNT = 7

export default function ShuffleScene() {
  const cards = useMemo(() =>
    Array.from({ length: CARD_COUNT }, (_, i) => {
      const ratio   = i / (CARD_COUNT - 1)          // 0 → 1
      const angle   = (ratio - 0.5) * 140           // -70° → +70°
      const tx      = (ratio - 0.5) * 220           // spread x
      const ty      = -Math.abs(ratio - 0.5) * 80   // arc up at edges
      const delay   = i * 80                         // stagger ms
      return { i, angle, tx, ty, delay }
    }), []
  )

  const { playShuffleSound } = useSoundSystem()

  useEffect(() => {
    playShuffleSound()
  }, [playShuffleSound])

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="relative" style={{ width: 160, height: 260 }}>
        {cards.map(({ i, angle, tx, ty, delay }) => (
          <div
            key={i}
            className="absolute inset-0 rounded-2xl border border-border overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, #1A1C35 0%, #0B0C1A 100%)',
              transformOrigin: 'center bottom',
              animation: `shuffleFan 1.8s ease-in-out ${delay}ms both`,
              '--tx': `${tx}px`,
              '--ty': `${ty}px`,
              '--rot': `${angle}deg`,
              boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
              zIndex: i,
            }}
          >
            {/* Card back pattern */}
            <svg viewBox="0 0 160 220" className="w-full h-full opacity-30" aria-hidden="true">
              <pattern id={`g${i}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="#7B5EA7" />
              </pattern>
              <rect width="160" height="220" fill={`url(#g${i})`} />
              <rect x="12" y="12" width="136" height="196" fill="none" stroke="#C9A84C" strokeWidth="0.5" strokeOpacity="0.3" rx="8" />
            </svg>
          </div>
        ))}
      </div>

      <div className="text-center space-y-2">
        <p className="font-display text-xl tracking-[0.15em] uppercase text-gold animate-pulse">
          Shuffling the Arcana…
        </p>
        <p className="font-body text-sm text-silver opacity-60">
          The fates are being woven
        </p>
      </div>
    </div>
  )
}
