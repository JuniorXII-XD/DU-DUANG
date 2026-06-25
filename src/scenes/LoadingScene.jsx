import React, { useState, useEffect } from 'react';

const MESSAGES = [
  'Synchronizing Fate...',
  'Preparing Tarot Deck...',
  'Reading Cosmic Signals...',
  'Loading Arcane Energy...'
];

export default function LoadingScene({ isReady, onComplete }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Cycle messages every 500ms
  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Enforce a minimum of 2 seconds load time
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Check if we should dismiss
  useEffect(() => {
    if (isReady && minTimeElapsed && !isFadingOut) {
      setIsFadingOut(true);
      setTimeout(() => {
        onComplete();
      }, 700); // Wait for fade out animation
    }
  }, [isReady, minTimeElapsed, isFadingOut, onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-void transition-opacity duration-700 pointer-events-none ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="flex flex-col items-center gap-8">
        <h1 className="font-display text-4xl md:text-5xl text-gold tracking-[0.25em] uppercase text-glow-gold animate-pulseGlow">
          DU DUANG
        </h1>
        
        <div className="relative flex flex-col items-center justify-center">
          {/* Circular progress orb */}
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-cyan-neon outer-ring-spin glow-mystic opacity-80" />
          <div className="absolute w-10 h-10 rounded-full border border-purple-500 middle-ring-spin opacity-60" />
        </div>

        <p className="font-body text-xs md:text-sm text-cyan-neon tracking-widest uppercase mt-4 transition-opacity duration-300">
          {MESSAGES[msgIndex]}
        </p>
      </div>
      <style>{`
        @keyframes outerRingSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .outer-ring-spin { animation: outerRingSpin 3s linear infinite; }
        
        @keyframes middleRingSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .middle-ring-spin { animation: middleRingSpin 2s linear infinite; }
      `}</style>
    </div>
  );
}
