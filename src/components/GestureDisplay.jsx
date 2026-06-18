/**
 * GestureDisplay.jsx
 * Shows the currently detected gesture name, symbol, and associated action.
 */

import React from 'react'
import { GESTURE_META } from '../services/gestureService'

export default function GestureDisplay({ gesture }) {
  const meta = GESTURE_META[gesture] ?? GESTURE_META.unknown
  const isActive = gesture !== 'unknown'

  return (
    <div
      className={`
        flex flex-col items-center gap-2 px-6 py-4
        rounded-2xl border transition-all duration-300
        ${isActive
          ? 'border-border bg-veil glow-mystic'
          : 'border-transparent bg-transparent'
        }
      `}
      aria-live="polite"
      aria-label={`Current gesture: ${meta.label}`}
    >
      {/* Symbol */}
      <span
        className="text-4xl leading-none select-none"
        role="img"
        aria-hidden="true"
      >
        {meta.symbol}
      </span>

      {/* Gesture name */}
      <span className={`font-display text-sm tracking-widest uppercase ${meta.color}`}>
        {meta.label}
      </span>

      {/* Action hint */}
      <span className="font-body text-xs text-silver tracking-wide">
        {meta.meaning}
      </span>
    </div>
  )
}
