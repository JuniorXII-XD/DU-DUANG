import { useEffect, useRef, useState } from 'react';

const ORBIT_RADIUS = 210;
const CARD_W = 52;
const CARD_H = 72;

export function useSpatialSelection(landmarks, cards, rotation, onHighlightChange, mountTime) {
  const [highlightedId, setHighlightedId] = useState(null);
  const candidateRef = useRef(null);
  const timerRef = useRef(null);
  const [vpScale, setVpScale] = useState(1);

  useEffect(() => {
    const handleResize = () => setVpScale(Math.min(window.innerWidth / 800, 1));
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!landmarks || !landmarks[8] || !cards || cards.length === 0 || !mountTime) return;

    // Must wait until vortex summon completes (1.4s) before allowing selection
    if (Date.now() - mountTime < 1400) return;

    const tip = landmarks[8];
    const px = (1 - tip.x) * window.innerWidth;
    const py = tip.y * window.innerHeight;

    const screenCenterX = window.innerWidth / 2;
    const screenCenterY = window.innerHeight / 2 + 20;

    const RINGS = [
      { r: 130 * vpScale, s: 1.0, d: 1 },
      { r: 190 * vpScale, s: 0.7, d: -1 },
      { r: 250 * vpScale, s: 0.4, d: 1 }
    ];

    let closestId = null;
    let minD = Infinity;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const ringIdx = i % 3;
      const ring = RINGS[ringIdx];
      const angleStep = (2 * Math.PI) / Math.ceil(cards.length / 3);
      const baseAngle = angleStep * Math.floor(i / 3);
      const angle = baseAngle + (rotation * ring.s * ring.d * Math.PI / 180);
      
      const cx = screenCenterX + Math.cos(angle) * ring.r;
      const cy = screenCenterY + Math.sin(angle) * ring.r * 0.65;

      const d = Math.sqrt((px - cx)**2 + (py - cy)**2);
      if (d < minD) {
        minD = d;
        closestId = card.uid;
      }
    }

    if (minD > 200 * vpScale) {
      closestId = null;
    }

    if (closestId !== candidateRef.current) {
      candidateRef.current = closestId;
      clearTimeout(timerRef.current);
      
      if (closestId) {
        timerRef.current = setTimeout(() => {
          setHighlightedId(closestId);
          if (onHighlightChange) onHighlightChange(closestId);
        }, 300);
      } else {
        setHighlightedId(null);
        if (onHighlightChange) onHighlightChange(null);
      }
    }
  }, [landmarks, cards, rotation, onHighlightChange, mountTime, vpScale]);

  return highlightedId;
}
