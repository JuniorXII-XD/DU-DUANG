import { useState, useEffect, useRef } from 'react';

/**
 * useZoneFocus.js
 * Maps hand X position to 3 horizontal zones (left / center / right)
 * with 300ms dwell-time locking to prevent focus flickering.
 *
 * Zone layout:
 *   handX < 0.33  → zone 0 (left / Past)
 *   0.33–0.66     → zone 1 (center / Present)
 *   handX >= 0.66 → zone 2 (right / Future)
 *
 * Note: MediaPipe returns mirrored X (selfie mode), so we use (1 - x)
 * to get the true screen-relative position.
 */

const DWELL_MS = 300;

function getZone(handX) {
  // handX is already mirrored: 0 = right side of screen, 1 = left side
  // We invert so 0 = left, 1 = right (matching card layout)
  const screenX = 1 - handX;
  if (screenX < 0.33) return 0;
  if (screenX < 0.66) return 1;
  return 2;
}

export function useZoneFocus(landmarks, enabled) {
  const [focusedZone, setFocusedZone] = useState(null);
  const candidateRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!enabled || !landmarks || !landmarks[9]) {
      // landmarks[9] = middle finger MCP — stable proxy for hand center
      return;
    }

    const handX = landmarks[9].x;
    const zone = getZone(handX);

    if (zone !== candidateRef.current) {
      candidateRef.current = zone;
      clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        setFocusedZone(zone);
      }, DWELL_MS);
    }
  }, [landmarks, enabled]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return focusedZone;
}
