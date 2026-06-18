/**
 * GestureLegend.jsx
 * Bottom-left legend showing all supported gestures.
 * Active gesture is highlighted.
 */

import React from 'react'
import { GESTURE_META } from '../services/gestureService'

const GESTURE_KEYS = ['open_palm', 'pointing_finger', 'ok_sign', 'fist']

export default function GestureLegend({ gesture }) {
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="flex flex-col gap-2 p-3 rounded-2xl bg-veil border border-border">
        <p className="font-display text-[10px] tracking-[0.2em] text-gold-dim uppercase mb-1 px-1">
          Gestures
        </p>

        {GESTURE_KEYS.map((key) => {
          const meta    = GESTURE_META[key]
          const isActive = gesture === key

          return (
            <div
              key={key}
              className={`
                flex items-center gap-2.5 px-2 py-1.5 rounded-xl transition-all duration-200
                ${isActive ? 'bg-deep border border-border' : ''}
              `}
            >
              {/* Active indicator */}
              <span
                className={`
                  w-1 h-4 rounded-full shrink-0 transition-all duration-200
                  ${isActive ? 'bg-mystic-light' : 'bg-border'}
                `}
              />

              {/* Symbol */}
              <span className="text-base leading-none w-6 text-center" aria-hidden="true">
                {meta.symbol}
              </span>

              {/* Label + meaning */}
              <div className="flex flex-col min-w-0">
                <span className={`font-display text-[11px] tracking-wide ${isActive ? meta.color : 'text-silver'}`}>
                  {meta.label}
                </span>
                <span className="font-body text-[10px] text-silver opacity-60 truncate">
                  {meta.meaning}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
