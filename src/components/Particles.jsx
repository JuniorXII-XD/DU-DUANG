import React, { useMemo } from 'react';

/**
 * Particles – Immersive mystical background
 *
 * Layer stack (back → front):
 *   1. Animated nebula   – 3 drifting radial gradients
 *   2. Star field        – 70 stars across 3 tiers (tiny / medium / bright)
 *   3. Floating motes    – 12 glowing orbs with sine-wave drift
 *   4. Fog bands         – 2 translucent blurred strips
 *
 * Total DOM elements: 3 + 70 + 12 + 2 = 87  (< 100 budget)
 */

/* ---------- helpers ---------- */
const rand = (min, max) => Math.random() * (max - min) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/* ---------- colour palettes ---------- */
const MOTE_COLORS = [
  'rgba(0, 240, 255, 0.35)',   // cyan
  'rgba(160, 60, 255, 0.40)',  // purple
  'rgba(255, 210, 80, 0.30)',  // gold
];

export default function Particles() {
  /* ---- star field data (50 tiny + 15 medium + 5 bright = 70) ---- */
  const stars = useMemo(() => {
    const out = [];
    // Tiny stars
    for (let i = 0; i < 50; i++) {
      const size = rand(1, 2);
      out.push({
        id: `s-${i}`,
        tier: 'tiny',
        x: rand(0, 100),
        y: rand(0, 100),
        size,
        opacity: rand(0.3, 0.7),
        twinkleDur: rand(2, 5),
        twinkleDelay: rand(0, 6),
      });
    }
    // Medium stars
    for (let i = 0; i < 15; i++) {
      const size = rand(2, 3);
      out.push({
        id: `m-${i}`,
        tier: 'medium',
        x: rand(0, 100),
        y: rand(0, 100),
        size,
        opacity: rand(0.5, 0.85),
        twinkleDur: rand(3, 6),
        twinkleDelay: rand(0, 8),
      });
    }
    // Bright stars
    for (let i = 0; i < 5; i++) {
      const size = rand(3, 4);
      out.push({
        id: `b-${i}`,
        tier: 'bright',
        x: rand(5, 95),
        y: rand(5, 95),
        size,
        opacity: rand(0.7, 1),
        twinkleDur: rand(4, 7),
        twinkleDelay: rand(0, 5),
        pulseDur: rand(6, 10),
      });
    }
    return out;
  }, []);

  /* ---- floating motes data (12 orbs) ---- */
  const motes = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: `mote-${i}`,
      x: rand(5, 95),
      size: rand(4, 8),
      color: pick(MOTE_COLORS),
      riseDur: rand(14, 24),       // seconds to float from bottom to top
      driftAmp: rand(30, 80),      // px horizontal sine amplitude
      driftDur: rand(6, 12),       // seconds per horizontal oscillation
      delay: rand(0, 12),          // stagger start
    }));
  }, []);

  /* ---- nebula gradient configs ---- */
  const nebulae = useMemo(() => [
    {
      id: 'neb-0',
      gradient:
        'radial-gradient(ellipse 80% 60% at 30% 70%, rgba(26,0,48,0.8) 0%, transparent 70%)',
      animName: 'nebulaDrift0',
      dur: 28,
    },
    {
      id: 'neb-1',
      gradient:
        'radial-gradient(ellipse 70% 80% at 70% 30%, rgba(10,5,32,0.7) 0%, transparent 65%)',
      animName: 'nebulaDrift1',
      dur: 34,
    },
    {
      id: 'neb-2',
      gradient:
        'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,26,42,0.55) 0%, transparent 60%)',
      animName: 'nebulaDrift2',
      dur: 22,
    },
  ], []);

  /* ---- render helpers ---- */
  const glowForStar = (s) => {
    if (s.tier === 'bright') {
      return `0 0 ${s.size * 4}px rgba(200,180,255,0.9), 0 0 ${s.size * 8}px rgba(140,100,255,0.4)`;
    }
    if (s.tier === 'medium') {
      return `0 0 ${s.size * 3}px rgba(220,220,255,0.7)`;
    }
    return `0 0 ${s.size * 2}px rgba(255,255,255,0.5)`;
  };

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* ============ 1. NEBULA LAYER ============ */}
      <div className="absolute inset-0 parallax-layer-1">
        {nebulae.map((n) => (
          <div
            key={n.id}
            className="motion-safe-anim"
            style={{
              position: 'absolute',
              inset: '-20%',           /* oversized so drift doesn't show edges */
              background: n.gradient,
              animation: `${n.animName} ${n.dur}s ease-in-out infinite`,
              willChange: 'transform',
            }}
          />
        ))}
      </div>

      {/* ============ 2. STAR FIELD ============ */}
      <div className="absolute inset-0 parallax-layer-2">
        {stars.map((s) => {
          const animName =
            s.tier === 'bright' ? 'starPulse' : 'starTwinkle';
          const reduceHideClass = s.tier === 'tiny' ? 'reduce-motion-hide' : '';
          return (
            <div
              key={s.id}
              className={`motion-safe-anim ${reduceHideClass}`}
              style={{
                position: 'absolute',
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                borderRadius: '50%',
                backgroundColor: s.tier === 'bright'
                  ? '#e0d0ff'
                  : '#ffffff',
                opacity: s.opacity,
                boxShadow: glowForStar(s),
                mixBlendMode: 'screen',
                animation: `${animName} ${s.twinkleDur}s ease-in-out infinite ${s.twinkleDelay}s`,
                willChange: 'opacity',
              }}
            />
          );
        })}
      </div>

      {/* ============ 3. FLOATING MOTES ============ */}
      <div className="absolute inset-0 parallax-layer-3 reduce-motion-hide">
        {motes.map((m) => (
          <div
            key={m.id}
            className="motion-safe-anim"
            style={{
              position: 'absolute',
              left: `${m.x}%`,
              bottom: '-2%',
              width: `${m.size}px`,
              height: `${m.size}px`,
              borderRadius: '50%',
              backgroundColor: m.color,
              boxShadow: `0 0 ${m.size * 2}px ${m.color}, 0 0 ${m.size * 4}px ${m.color}`,
              mixBlendMode: 'screen',
              animation: `moteRise ${m.riseDur}s linear infinite ${m.delay}s,
                           moteDrift ${m.driftDur}s ease-in-out infinite ${m.delay}s`,
              /* encode per-mote amplitude as a CSS custom property */
              '--drift-amp': `${m.driftAmp}px`,
              willChange: 'transform, opacity',
            }}
          />
        ))}
      </div>

      {/* ============ 4. FOG BANDS (Optimized - No blur) ============ */}
      {/* Bottom fog – purple tinted */}
      <div
        className="motion-safe-anim"
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-20%',
          width: '140%',
          height: '45%',
          background:
            'radial-gradient(ellipse at bottom, rgba(80, 20, 120, 0.4) 0%, transparent 70%)',
          opacity: 0.4,
          animation: 'fogDriftBottom 18s ease-in-out infinite',
          willChange: 'transform',
        }}
      />
      {/* Top fog – cyan tinted */}
      <div
        className="motion-safe-anim"
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-20%',
          width: '140%',
          height: '40%',
          background:
            'radial-gradient(ellipse at top, rgba(0, 160, 200, 0.25) 0%, transparent 70%)',
          opacity: 0.3,
          animation: 'fogDriftTop 22s ease-in-out infinite',
          willChange: 'transform',
        }}
      />

      {/* ============ KEYFRAMES ============ */}
      <style>{`
        /* --- Nebula drift: each follows a different elliptical path --- */
        @keyframes nebulaDrift0 {
          0%   { transform: translate(0, 0); }
          25%  { transform: translate(6%, -4%); }
          50%  { transform: translate(-3%, -8%); }
          75%  { transform: translate(-7%, 2%); }
          100% { transform: translate(0, 0); }
        }
        @keyframes nebulaDrift1 {
          0%   { transform: translate(0, 0); }
          25%  { transform: translate(-5%, 6%); }
          50%  { transform: translate(4%, 3%); }
          75%  { transform: translate(7%, -5%); }
          100% { transform: translate(0, 0); }
        }
        @keyframes nebulaDrift2 {
          0%   { transform: translate(0, 0); }
          33%  { transform: translate(8%, 5%); }
          66%  { transform: translate(-6%, -3%); }
          100% { transform: translate(0, 0); }
        }

        /* --- Star twinkle (tiny + medium) --- */
        @keyframes starTwinkle {
          0%, 100% { opacity: var(--tw-base, 0.4); }
          50%      { opacity: 1; }
        }

        /* --- Star pulse (bright stars) – includes subtle scale --- */
        @keyframes starPulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.5); }
        }

        /* --- Mote vertical rise --- */
        @keyframes moteRise {
          0%   { transform: translateY(0);       opacity: 0; }
          5%   { opacity: 0.5; }
          90%  { opacity: 0.4; }
          100% { transform: translateY(-110vh);  opacity: 0; }
        }

        /* --- Mote horizontal sine drift --- */
        @keyframes moteDrift {
          0%, 100% { margin-left: 0; }
          25%      { margin-left: var(--drift-amp, 40px); }
          75%      { margin-left: calc(var(--drift-amp, 40px) * -1); }
        }

        /* --- Fog horizontal oscillation --- */
        @keyframes fogDriftBottom {
          0%, 100% { transform: translateX(0); }
          50%      { transform: translateX(5%); }
        }
        @keyframes fogDriftTop {
          0%, 100% { transform: translateX(0); }
          50%      { transform: translateX(-4%); }
        }

        /* --- CSS Parallax Layers --- */
        @keyframes parallaxSlow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50%      { transform: translateY(-10px) translateX(5px); }
        }
        @keyframes parallaxMedium {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50%      { transform: translateY(-20px) translateX(-10px); }
        }
        @keyframes parallaxFast {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50%      { transform: translateY(-40px) translateX(15px); }
        }
        
        .parallax-layer-1 { animation: parallaxSlow 25s ease-in-out infinite; }
        .parallax-layer-2 { animation: parallaxMedium 18s ease-in-out infinite; }
        .parallax-layer-3 { animation: parallaxFast 12s ease-in-out infinite; }

        /* --- Accessibility: Reduced Motion --- */
        @media (prefers-reduced-motion: reduce) {
          .reduce-motion-hide {
            display: none !important;
          }
          .motion-safe-anim, .parallax-layer-1, .parallax-layer-2, .parallax-layer-3 {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}
