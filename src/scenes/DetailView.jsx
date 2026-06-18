/**
 * DetailView.jsx
 * DETAIL_VIEW state: large single card with full reading text.
 * Fist resets (handled by machine). CSS slide-up entrance.
 */

import React, { useEffect } from 'react'
import { useSoundSystem } from '../hooks/useSoundSystem'

const MEANINGS = {
  0:  'A fresh start beckons. Embrace the unknown with open arms — the journey itself is the destination.',
  1:  'You hold all the tools you need. Focus your will and manifest your intentions with clarity.',
  2:  'Trust the quiet voice within. Hidden truths will reveal themselves in stillness and patience.',
  3:  'Abundance flows from nurturing. Tend to what you love, and watch it flourish beyond expectation.',
  4:  'Establish firm foundations. Structure and discipline are your allies on the path ahead.',
  5:  'Seek wisdom from tradition. Ancient pathways hold guidance for present challenges.',
  6:  'A meaningful choice approaches. Listen to both heart and mind before you decide.',
  7:  'Victory belongs to the focused. Harness your drive and let nothing divert your course.',
  8:  'Your greatest power is inner. Patience and compassion will outlast brute force every time.',
  9:  'Retreat and reflect. The answers you seek are already within — create space to hear them.',
  10: 'Change is the only constant. Ride the wheel\'s turning and trust in the cycles of fate.',
  11: 'Truth will out. Act with integrity and accept the consequences of your choices with grace.',
  12: 'Let go. A new perspective emerges when you surrender your grip on how things must be.',
  13: 'An ending clears the way. What seems like loss is transformation opening into renewal.',
  14: 'Blend and balance. The middle path between extremes leads to sustainable harmony.',
  15: 'Examine your chains. Many are illusions — what binds you can be released with awareness.',
  16: 'Sudden revelation shatters old structures. The chaos is clearing ground for something true.',
  17: 'After the storm, clarity. Allow hope to guide you — the stars have not abandoned you.',
  18: 'Dreams and fears walk the same road tonight. Face the shadows; they hold your power.',
  19: 'Joy is your birthright. Celebrate, create, and let your light shine without apology.',
  20: 'A reckoning arrives. Answer the call to rise into your higher purpose without hesitation.',
  21: 'A great cycle completes. Honour what you have built and prepare to begin once more.',
}

export default function DetailView({ card, onClose }) {
  const { playRevealSound } = useSoundSystem()

  useEffect(() => {
    if (card) playRevealSound()
  }, [card, playRevealSound])

  if (!card) return null

  const meaning = MEANINGS[card.id] ?? 'The mysteries of this card deepen the further you gaze.'

  return (
    <div className="detail-enter flex flex-col items-center gap-8 w-full max-w-md mx-auto">

      {/* ── Large card ───────────────────────────────────────────────── */}
      <div
        className="relative rounded-3xl border overflow-hidden"
        style={{
          width: 180, height: 280,
          borderColor: '#C9A84C',
          background: 'linear-gradient(160deg, #1A1C35 0%, #0B0C1A 100%)',
          boxShadow: '0 0 48px 8px rgba(201,168,76,0.18), 0 16px 64px rgba(0,0,0,0.7)',
        }}
      >
        {/* Decorative inner frame */}
        <div className="absolute inset-3 rounded-2xl border border-gold-dim opacity-30" />

        {/* Symbol */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <span className="text-6xl" style={{ color: '#C9A84C', opacity: 0.85 }}>
            {card.symbol}
          </span>
          <div className="text-center px-6">
            <p className="font-display text-sm tracking-[0.15em] uppercase text-gold leading-snug">
              {card.name}
            </p>
          </div>
          {/* Keywords */}
          <div className="flex flex-wrap gap-1.5 justify-center px-4">
            {card.keywords.map(kw => (
              <span
                key={kw}
                className="font-body text-[9px] tracking-wide px-2 py-0.5 rounded-full border border-gold-dim text-gold-dim"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Card number */}
        <span className="absolute top-4 left-4 font-display text-[9px] tracking-[0.2em] text-gold-dim">
          {String(card.id).padStart(2,'0')}
        </span>
        <span className="absolute top-4 right-4 font-display text-[9px] tracking-[0.2em] text-gold-dim">
          ARCANA
        </span>
      </div>

      {/* ── Reading panel ───────────────────────────────────────────── */}
      <div
        className="w-full rounded-2xl border border-border p-5 space-y-3"
        style={{ background: 'rgba(26,28,53,0.7)' }}
      >
        <p className="font-display text-[10px] tracking-[0.2em] uppercase text-gold-dim">
          Your Reading
        </p>
        <p className="font-body text-sm text-silver leading-relaxed">
          {meaning}
        </p>
        <div className="pt-1 border-t border-border">
          <p className="font-body text-[10px] text-gold-dim tracking-widest opacity-60">
            {card.keywords.join(' · ')}
          </p>
        </div>
      </div>

      {/* ── Navigation hints ────────────────────────────────────────── */}
      <div className="text-center space-y-1">
        <p className="font-body text-sm text-silver">
          Fist to close · Point to change focus · Fist again to reset
        </p>
        <div className="flex justify-center gap-4">
          <p className="font-body text-xs text-red-400 tracking-widest opacity-70">✊ Close</p>
          <p className="font-body text-xs text-mystic-light tracking-widest opacity-70">☝️ Focus next</p>
        </div>
      </div>
    </div>
  )
}
