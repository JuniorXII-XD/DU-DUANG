import React, { useEffect, useRef, useState } from 'react'
import { useSoundSystem } from '../hooks/useSoundSystem'

const CARD_W = 52
const CARD_H = 72
const SYMBOLS = ['◈','✦','☽','◑','★','⊕','∞','△','⚖','○','☾','⛧','⚡','♡','☀']
const RUNES = ['☽', '★', '⚝', '☾']

export default function OrbitScene({ cards }) {
  const [rotation, setRotation] = useState(0)
  const [mountTime] = useState(() => Date.now())
  const [now, setNow] = useState(() => Date.now())
  const [vpScale, setVpScale] = useState(1)

  const rafRef = useRef(null)
  const lastRef = useRef(null)

  const { playOracleHum, stopOracleHum } = useSoundSystem()

  useEffect(() => {
    playOracleHum()
    return () => stopOracleHum()
  }, [playOracleHum, stopOracleHum])

  useEffect(() => {
    const handleResize = () => setVpScale(Math.min(window.innerWidth / 800, 1));
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const tick = (ts) => {
      if (lastRef.current !== null) {
        const dt = ts - lastRef.current
        setRotation(r => r + dt * 0.018)
      }
      lastRef.current = ts
      setNow(Date.now())
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const RINGS = [
    { r: 130 * vpScale, s: 1.0, d: 1 },
    { r: 190 * vpScale, s: 0.7, d: -1 },
    { r: 250 * vpScale, s: 0.4, d: 1 }
  ];

  const t = (now - mountTime) / 1000;
  const p = Math.min(t / 1.4, 1.0);
  const easeOut = 1 - Math.pow(1 - p, 3);

  const maxRadius = RINGS[2].r;

  return (
    <div className="flex flex-col items-center gap-0">
      <div
        className="relative"
        style={{ width: maxRadius * 2 + CARD_W, height: maxRadius * 2 * 0.65 + CARD_H }}
        aria-label="Orbiting tarot cards"
      >
        {/* Orbit Ring Tracks */}
        {RINGS.map((ring, i) => (
          <div
            key={`track-${i}`}
            className="absolute rounded-full border border-dashed border-cyan-neon pointer-events-none"
            style={{
              width: ring.r * 2 * easeOut,
              height: ring.r * 2 * 0.65 * easeOut,
              left: maxRadius + CARD_W / 2 - (ring.r * easeOut),
              top: maxRadius * 0.65 + CARD_H / 2 - (ring.r * 0.65 * easeOut),
              opacity: 0.06 + (i * 0.03), // Faint track opacity
              transition: 'all 0.1s linear'
            }}
          />
        ))}

        {/* Arcane Core (Premium Artifact) */}
        <div
          className={`absolute flex items-center justify-center opacity-90 ${p < 1 ? 'scale-up-center' : ''}`}
          style={{
            width: 120, height: 120,
            top: maxRadius * 0.65 + CARD_H / 2 - 60,
            left: maxRadius + CARD_W / 2 - 60,
          }}
        >
          {/* Energy Waves */}
          {[0, 1, 2].map((i) => (
            <div
              key={`wave-${i}`}
              className="absolute rounded-full border border-cyan-neon"
              style={{
                width: 60, height: 60,
                opacity: 0,
                animation: `energyWave 3s ease-out infinite ${i * 1}s`
              }}
            />
          ))}

          {/* Outer Ring (Cyan Dashed) */}
          <div className="absolute w-full h-full rounded-full border border-dashed border-cyan-neon outer-ring-spin">
            {/* Runes placed along the outer ring */}
            {RUNES.map((rune, i) => {
              const angle = (i * Math.PI) / 2; // 0, 90, 180, 270 deg
              const x = Math.cos(angle) * 60; // radius = 60
              const y = Math.sin(angle) * 60;
              return (
                <div
                  key={`rune-${i}`}
                  className="absolute text-cyan-neon"
                  style={{
                    fontSize: '10px',
                    left: `calc(50% + ${x}px - 5px)`,
                    top: `calc(50% + ${y}px - 7px)`,
                    transform: `rotate(${angle + Math.PI / 2}rad)`,
                    textShadow: '0 0 5px rgba(0,240,255,0.8)'
                  }}
                >
                  {rune}
                </div>
              );
            })}
          </div>

          {/* Middle Ring (Purple Solid + Glow) */}
          <div className="absolute rounded-full border border-purple-500 middle-ring-spin"
            style={{
              width: 90, height: 90,
              boxShadow: '0 0 15px 2px rgba(157,0,255,0.4), inset 0 0 10px rgba(157,0,255,0.3)'
            }}
          />

          {/* Inner Orb (Gradient Pulse) */}
          <div className="absolute rounded-full inner-orb-pulse"
            style={{
              width: 60, height: 60,
              background: 'radial-gradient(circle, rgba(157, 0, 255, 0.6) 0%, rgba(0, 240, 255, 0.4) 60%, transparent 100%)',
              boxShadow: '0 0 20px 5px rgba(0,240,255,0.3)',
            }}
          />

          {/* Center Text */}
          <span className="absolute font-display text-[11px] tracking-[0.3em] text-white opacity-90 core-text-fade drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] z-10" style={{marginLeft: '0.3em'}}>
            ORACLE
          </span>
        </div>

        {/* Orbit cards */}
        {cards.map((card, i) => {
          const ringIdx = i % 3;
          const ring = RINGS[ringIdx];
          const angleStep = (2 * Math.PI) / Math.ceil(cards.length / 3);
          const baseAngle = angleStep * Math.floor(i / 3);
          const angle = baseAngle + (rotation * ring.s * ring.d * Math.PI / 180) + ((1 - easeOut) * Math.PI * 4 * ring.d);

          const r = ring.r * easeOut;

          const cx = Math.cos(angle) * r;
          const cy = Math.sin(angle) * r * 0.65;
          const cx0 = maxRadius + CARD_W / 2;
          const cy0 = maxRadius * 0.65 + CARD_H / 2;

          const depth = Math.sin(angle) + Math.sin(now * 0.003 + i) * 0.15;
          const depthScale = 1 + (depth * 0.25);
          const depthBlur = Math.max(0, -depth * 3);
          const depthOpacity = 0.65 + (depth * 0.35);

          const zBase = Math.floor(depth * 100);

          return (
            <div
              key={card.uid}
              className="absolute rounded-lg border border-border overflow-hidden orbit-card"
              style={{
                width:  CARD_W,
                height: CARD_H,
                left:   cx0 + cx - CARD_W / 2,
                top:    cy0 + cy - CARD_H / 2,
                transform: `scale(${depthScale}) rotate(${angle + Math.PI / 2}rad) rotateX(25deg) rotateY(15deg) translateY(${Math.sin(now * 0.002 + i) * 10}px)`,
                background: 'linear-gradient(160deg, #131126 0%, #05050A 100%)',
                boxShadow: '0 2px 15px rgba(0,240,255,0.1)',
                opacity: easeOut * depthOpacity,
                filter: `blur(${depthBlur}px)`,
                transformStyle: 'preserve-3d',
                zIndex: 100 + zBase,
                transition: 'opacity 0.3s ease',
              }}
            >
              <div className="w-full h-full flex flex-col items-center justify-center gap-0.5 relative z-10">
                <span className="text-base" style={{ color: '#7B5EA7', opacity: 0.6 }}>
                  {SYMBOLS[i % SYMBOLS.length]}
                </span>
                <span className="font-display text-[7px] tracking-wider text-gold-dim text-center px-0.5 leading-tight" style={{ maxWidth: CARD_W - 4 }}>
                  {card.name.replace('The ', '')}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="text-center space-y-1.5 mt-4 transition-opacity duration-1000" style={{ opacity: easeOut }}>
        <p className="font-display text-xl tracking-[0.15em] uppercase text-mystic-light">The Cards Await</p>
        <p className="font-body text-sm text-silver">The Oracle is choosing your fate…</p>
        <div className="flex justify-center gap-4 mt-1">
          <p className="font-body text-xs text-cyan-neon tracking-widest opacity-70 animate-pulseGlow">✨ Reading the cosmos ✨</p>
        </div>
      </div>

      <style>{`
        @keyframes energyWave {
          0% { transform: scale(1); opacity: 0.6; border-width: 2px; }
          100% { transform: scale(3.5); opacity: 0; border-width: 0px; }
        }
        @keyframes outerRingSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .outer-ring-spin {
          animation: outerRingSpin 20s linear infinite;
        }
        @keyframes middleRingSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .middle-ring-spin {
          animation: middleRingSpin 15s linear infinite;
        }
        @keyframes innerOrbPulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        .inner-orb-pulse {
          animation: innerOrbPulse 4s ease-in-out infinite;
        }
        @keyframes coreTextFade {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .core-text-fade {
          animation: coreTextFade 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
