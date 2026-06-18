import React from 'react'
import DetailView from './DetailView'
import { useCardAnimations } from '../hooks/useCardAnimations'

const POSITIONS      = ['Past', 'Present', 'Future']
const POSITION_COLORS = ['#A0AABF', '#FFD700', '#D280FF']

function TarotCard({ card, position, positionColor, index, isFocused, isVisible }) {
  const isFaceUp = card.faceUp

  return (
    <div 
      className="flex flex-col items-center gap-3 transition-opacity duration-500"
      style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)' }}
    >
      {/* Position label */}
      <span
        className="font-display text-[10px] tracking-[0.2em] uppercase transition-opacity duration-300"
        style={{ color: positionColor, opacity: isFocused ? 1 : 0.45 }}
      >
        {position}
      </span>

      {/* Focus ring + card */}
      <div
        className={`rounded-2xl transition-all duration-400 ${isFocused ? 'card-zone-focused' : ''}`}
        style={{
          padding: isFocused ? 4 : 0,
          background: isFocused
            ? `linear-gradient(135deg, rgba(0, 240, 255, 0.5), rgba(157, 0, 255, 0.3))`
            : 'transparent',
        }}
      >
        {/* Card with 3-D flip */}
        <div
          className="relative card-flip-container"
          style={{ width: 100, height: 155 }}
          aria-label={isFaceUp ? card.name : 'Unrevealed card'}
        >
          <div
            className="card-flipper"
            style={{ transform: isFaceUp ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
          >
            {/* Back face */}
            <div
              className="card-face card-back rounded-2xl border border-border overflow-hidden"
              style={{ background: 'linear-gradient(160deg, #131126 0%, #05050A 100%)' }}
            >
              <svg viewBox="0 0 100 155" className="w-full h-full" aria-hidden="true">
                <pattern id={`dots-${index}`} x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
                  <circle cx="7" cy="7" r="0.8" fill="#9D00FF" />
                </pattern>
                <rect width="100" height="155" fill={`url(#dots-${index})`} opacity="0.4" />
                <rect x="8" y="8" width="84" height="139" rx="6" fill="none" stroke="#FFD700" strokeWidth="0.5" strokeOpacity="0.35" />
                <text x="50" y="82" textAnchor="middle" dominantBaseline="middle" fontSize="22" fill="#00F0FF" fillOpacity="0.4">◈</text>
              </svg>
            </div>

            {/* Front face */}
            <div
              className="card-face card-front rounded-2xl border overflow-hidden"
              style={{
                background: 'linear-gradient(160deg, #131126 0%, #05050A 100%)',
                borderColor: positionColor,
                boxShadow: `0 0 20px 3px ${positionColor}33`,
              }}
            >
              <div className="absolute inset-2 rounded-xl border opacity-20" style={{ borderColor: positionColor }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <span className="text-3xl" style={{ color: positionColor, opacity: 0.8 }}>
                  {card.symbol}
                </span>
                <span
                  className="font-display text-[9px] tracking-wider text-center px-3 leading-snug"
                  style={{ color: positionColor }}
                >
                  {card.name}
                </span>
                <div className="flex gap-1 flex-wrap justify-center px-2 mt-1">
                  {card.keywords.slice(0, 2).map(kw => (
                    <span
                      key={kw}
                      className="font-body text-[7px] tracking-wide px-1 py-0.5 rounded border opacity-60"
                      style={{ borderColor: positionColor, color: positionColor }}
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
              <span className="absolute top-2.5 left-2.5 font-display text-[8px] tracking-widest text-gold-dim opacity-60">
                {String(card.id).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Focus Indicator below the card */}
      <div
        className="text-center transition-opacity duration-300"
        style={{ opacity: isFocused ? 1 : 0 }}
      >
        <span className="font-display text-[9px] tracking-[0.2em] text-cyan-neon zone-focus-label uppercase">FOCUSED</span>
      </div>

      {/* Card name under the card (visible once face-up) */}
      <div
        className="text-center transition-opacity duration-500 absolute -bottom-6 w-full"
        style={{ opacity: isFaceUp && !isFocused ? 1 : 0 }}
      >
        <p className="font-display text-[11px] tracking-wider" style={{ color: positionColor }}>
          {card.name}
        </p>
      </div>
    </div>
  )
}

export default function ThreeCardScene({ cards, focusedIndex, detailCard }) {
  const allRevealed     = cards.every(c => c.faceUp)
  const focusedCard     = cards[focusedIndex]
  const focusedFaceUp   = focusedCard?.faceUp ?? false
  const { getCardAnimState } = useCardAnimations('THREE_CARD_READING', cards, detailCard)

  return (
    <div className="flex flex-col items-center gap-8 w-full">

      {/* ── Three-card spread ─────────────────────────────────────────── */}
      <div className="flex items-end gap-6 relative">
        {cards.map((card, i) => (
          <TarotCard
            key={card.uid}
            card={card}
            position={POSITIONS[i]}
            positionColor={POSITION_COLORS[i]}
            index={i}
            isFocused={i === focusedIndex && !detailCard}
            isVisible={getCardAnimState(i).isVisible}
          />
        ))}
      </div>

      {/* ── Prompt ────────────────────────────────────────────────────── */}
      {!detailCard && (
        <div className="text-center space-y-1.5 mt-8">
          <p
            className="font-display text-lg tracking-[0.15em] uppercase"
            style={{ color: POSITION_COLORS[focusedIndex] }}
          >
            {focusedFaceUp ? focusedCard?.name : POSITIONS[focusedIndex]}
          </p>

          {!allRevealed ? (
            <>
              <p className="font-body text-sm text-silver">
                Move your hand left · center · right to focus · OK to reveal
              </p>
              <div className="flex justify-center gap-4 mt-1">
                <p className="font-body text-xs text-mystic-light tracking-widest opacity-70">🖐️ Move to focus</p>
                <p className="font-body text-xs text-cyan-neon tracking-widest opacity-70">👌 Reveal</p>
              </div>
            </>
          ) : (
            <>
              <p className="font-body text-sm text-silver">
                All cards revealed · OK to open · Fist to reset
              </p>
              <div className="flex justify-center gap-4 mt-1">
                <p className="font-body text-xs text-cyan-neon tracking-widest opacity-70">👌 Open</p>
                <p className="font-body text-xs text-red-400 tracking-widest opacity-70">✊ Reset</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Detail overlay ────────────────────────────────────────────── */}
      {detailCard && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 detail-backdrop p-6">
          <DetailView card={detailCard} />
        </div>
      )}
    </div>
  )
}


