/**
 * WebcamPreview.jsx
 * Fixed top-right corner webcam feed with tracking status overlay.
 * The <video> element is passed as a ref so the parent can also send
 * it to MediaPipe.
 */

import React from 'react'

const STATUS_LABEL = {
  idle:    { text: 'Waiting',  dot: 'bg-silver' },
  loading: { text: 'Starting', dot: 'bg-gold animate-pulse' },
  active:  { text: 'Tracking', dot: 'bg-green-400' },
  error:   { text: 'Error',    dot: 'bg-red-500' },
}

export default function WebcamPreview({ videoRef, status }) {
  const info = STATUS_LABEL[status] ?? STATUS_LABEL.idle

  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col items-end gap-1.5"
      aria-label="Webcam preview"
    >
      {/* Video frame */}
      <div className="relative w-44 h-32 rounded-xl overflow-hidden border border-border bg-veil glow-mystic">
        <video
          ref={videoRef}
          className="w-full h-full object-cover scale-x-[-1]"   /* mirror */
          autoPlay
          muted
          playsInline
        />

        {/* Scanning line when active */}
        {status === 'active' && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-x-0 h-px bg-mystic-light opacity-40 animate-[scan_2.5s_linear_infinite]" />
          </div>
        )}

        {/* Corner brackets */}
        <span className="absolute top-1 left-1 w-3 h-3 border-t border-l border-gold-dim rounded-tl" />
        <span className="absolute top-1 right-1 w-3 h-3 border-t border-r border-gold-dim rounded-tr" />
        <span className="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-gold-dim rounded-bl" />
        <span className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-gold-dim rounded-br" />
      </div>

      {/* Status pill */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-veil border border-border text-xs font-body text-silver">
        <span className={`w-1.5 h-1.5 rounded-full ${info.dot}`} />
        {info.text}
      </div>
    </div>
  )
}
