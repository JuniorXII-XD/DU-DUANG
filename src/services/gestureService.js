/**
 * gestureService.js
 * Pure functions for classifying hand landmark data into named gestures.
 * MediaPipe Hands returns 21 landmarks per hand.
 *
 * Landmark indices:
 *   0  = WRIST        4  = THUMB_TIP     8  = INDEX_TIP
 *   12 = MIDDLE_TIP  16  = RING_TIP     20  = PINKY_TIP
 *   6  = INDEX_PIP   10  = MIDDLE_PIP   14  = RING_PIP
 *  18  = PINKY_PIP
 */

const LM = {
  WRIST: 0, THUMB_CMC: 1, THUMB_MCP: 2, THUMB_IP: 3, THUMB_TIP: 4,
  INDEX_MCP: 5, INDEX_PIP: 6, INDEX_DIP: 7, INDEX_TIP: 8,
  MIDDLE_MCP: 9, MIDDLE_PIP: 10, MIDDLE_DIP: 11, MIDDLE_TIP: 12,
  RING_MCP: 13, RING_PIP: 14, RING_DIP: 15, RING_TIP: 16,
  PINKY_MCP: 17, PINKY_PIP: 18, PINKY_DIP: 19, PINKY_TIP: 20,
}

function dist(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

function isFingerExtended(landmarks, tipIdx, pipIdx) {
  return landmarks[tipIdx].y < landmarks[pipIdx].y
}

export function classifyGesture(landmarks) {
  if (!landmarks || landmarks.length < 21) return 'unknown'
  const lm = landmarks

  const thumbExtended  = lm[LM.THUMB_TIP].x < lm[LM.THUMB_IP].x
  const indexExtended  = isFingerExtended(lm, LM.INDEX_TIP,  LM.INDEX_PIP)
  const middleExtended = isFingerExtended(lm, LM.MIDDLE_TIP, LM.MIDDLE_PIP)
  const ringExtended   = isFingerExtended(lm, LM.RING_TIP,   LM.RING_PIP)
  const pinkyExtended  = isFingerExtended(lm, LM.PINKY_TIP,  LM.PINKY_PIP)

  const extendedCount = [indexExtended, middleExtended, ringExtended, pinkyExtended]
    .filter(Boolean).length

  // OPEN PALM — all four fingers extended
  if (extendedCount === 4) return 'open_palm'

  // PINCH — thumb tip very close to index tip, other fingers not extended
  const thumbIndexDist = dist(lm[LM.THUMB_TIP], lm[LM.INDEX_TIP])
  const handSize = dist(lm[LM.WRIST], lm[LM.MIDDLE_MCP])
  if (thumbIndexDist / handSize < 0.15 && extendedCount <= 1) {
    return 'pinch'
  }

  // POINTING FINGER — only index extended
  if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended)
    return 'pointing_finger'

  // OK SIGN — thumb close to index, middle/ring/pinky extended
  if (middleExtended && ringExtended && pinkyExtended) {
    if (thumbIndexDist / handSize < 0.35) return 'ok_sign'
  }

  // FIST — all fingers curled
  if (extendedCount === 0) return 'fist'

  return 'unknown'
}

export const GESTURE_META = {
  open_palm: {
    label:   'Open Palm',
    symbol:  '✋',
    meaning: 'Begin — shuffle the deck',
    color:   'text-gold',
  },
  pointing_finger: {
    label:   'Pointing Finger',
    symbol:  '☝️',
    meaning: 'Move focus',
    color:   'text-mystic-light',
  },
  pinch: {
    label:   'Pinch',
    symbol:  '🤏',
    meaning: 'Select highlighted card',
    color:   'text-cyan-neon',
  },
  ok_sign: {
    label:   'OK Sign',
    symbol:  '👌',
    meaning: 'Reveal focused card',
    color:   'text-green-400',
  },
  fist: {
    label:   'Fist',
    symbol:  '✊',
    meaning: 'Close detail · Reset',
    color:   'text-red-400',
  },
  unknown: {
    label:   'No Gesture',
    symbol:  '·',
    meaning: 'Show your hand',
    color:   'text-silver',
  },
}
