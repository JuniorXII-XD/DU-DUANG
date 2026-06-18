import { useEffect, useRef, useState } from 'react';

const COOLDOWNS = {
  open_palm: 1500,
  pointing_finger: 1000,
  ok_sign: 1000,
};

export function useGestureController(rawGesture) {
  const [activeGesture, setActiveGesture] = useState('unknown');
  const lastTriggerTime = useRef({});
  const pendingReset = useRef(null);

  useEffect(() => {
    if (rawGesture === 'unknown' || !rawGesture) {
      setActiveGesture('unknown');
      return;
    }

    const now = Date.now();
    const cooldown = COOLDOWNS[rawGesture] || 0;
    const lastTime = lastTriggerTime.current[rawGesture] || 0;

    if (now - lastTime >= cooldown) {
      // Trigger accepted
      lastTriggerTime.current[rawGesture] = now;
      setActiveGesture(rawGesture);

      // Auto-reset gesture state after a brief moment so it acts as an event rather than a held state,
      // ensuring the state machine edge triggers correctly.
      clearTimeout(pendingReset.current);
      pendingReset.current = setTimeout(() => {
        setActiveGesture('unknown');
      }, 100);
    }
  }, [rawGesture]);

  // Clean up
  useEffect(() => {
    return () => clearTimeout(pendingReset.current);
  }, []);

  return activeGesture;
}
