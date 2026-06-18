import { useState, useEffect } from 'react';

// Central place for animation timings to keep Scenes clean
export function useCardAnimations(phase, readingCards, detailCard) {
  const [revealIndex, setRevealIndex] = useState(-1);

  // Sequential reveal in THREE_CARD_READING
  useEffect(() => {
    if (phase === 'THREE_CARD_READING') {
      let step = 0;
      setRevealIndex(-1); // Reset
      
      const interval = setInterval(() => {
        setRevealIndex(step);
        step++;
        if (step >= 3) {
          clearInterval(interval);
        }
      }, 500); // 0.5s delay between cards
      
      return () => clearInterval(interval);
    } else {
      setRevealIndex(-1);
    }
  }, [phase]);

  // Provide animation states for cards
  const getCardAnimState = (index) => {
    return {
      isVisible: phase === 'THREE_CARD_READING' && index <= revealIndex,
    };
  };

  return { getCardAnimState, revealIndex };
}
