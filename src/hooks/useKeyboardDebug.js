import { useEffect } from 'react';
import { STATES } from './useReadingMachine';

// Keyboard debugging for all phases
export function useKeyboardDebug(machine, dispatch) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const { phase, detailCard } = machine;

      // IDLE: Space triggers shuffle
      if (phase === STATES.IDLE) {
        if (e.key === ' ' || e.key === 'Space') {
          e.preventDefault();
          dispatch({ type: 'START_SHUFFLE' });
        }
      }

      // THREE_CARD_READING: Arrow keys + Enter
      if (phase === STATES.THREE_CARD_READING && !detailCard) {
        if (e.key === 'ArrowRight') {
          dispatch({ type: 'FOCUS_NEXT' });
        } else if (e.key === 'ArrowLeft') {
          dispatch({ type: 'FOCUS_PREV' });
        } else if (e.key === 'Enter') {
          dispatch({ type: 'OPEN_FOCUSED_DETAIL' });
        }
      }

      // Close detail with Escape
      if (phase === STATES.THREE_CARD_READING && detailCard) {
        if (e.key === 'Escape') {
          dispatch({ type: 'CLOSE_DETAIL' });
        }
      }

      // Global reset with Escape (when not in detail)
      if (e.key === 'Escape' && !detailCard) {
        dispatch({ type: 'RESET' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [machine, dispatch]);
}
