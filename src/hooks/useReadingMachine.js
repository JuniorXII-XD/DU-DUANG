/**
 * useReadingMachine.js
 * Central state machine for the tarot reading flow.
 *
 * States:
 *   IDLE               → waiting, deck shown as stack
 *   SHUFFLING          → shuffle animation plays, then auto-advances
 *   ORBITING           → 15 cards orbit the center; auto-draws 3 after 1.5s
 *   THREE_CARD_READING → 3 cards side-by-side with focus + optional detail overlay
 *
 * NOTE: DETAIL_VIEW is NOT a separate phase. It is an overlay rendered inside
 * THREE_CARD_READING controlled by the nullable `detailCard` field. This lets
 * the user close detail and return to the same reading without losing state,
 * and allows all 3 cards to be independently opened.
 *
 * THREE_CARD_READING focus:
 *   Zone-based hand position → SET_FOCUS (left/center/right zones)
 *   ok_sign                  → reveal focusedCard; open it in detail overlay
 *   fist                     → if detail open: close detail; else: RESET to IDLE
 */

import { useEffect, useRef, useReducer } from 'react'
import { MAJOR_ARCANA, shuffleDeck } from '../data/tarotDeck'

// ─── State constants ──────────────────────────────────────────────────────────
export const STATES = {
  IDLE:               'IDLE',
  SHUFFLING:          'SHUFFLING',
  ORBITING:           'ORBITING',
  THREE_CARD_READING: 'THREE_CARD_READING',
}

// ─── Initial machine state ────────────────────────────────────────────────────
const INITIAL = {
  phase:        STATES.IDLE,
  orbitCards:   [],    // cards shown in orbit
  readingCards: [],    // selected cards
  focusedIndex: 0,     // which of the reading cards is currently highlighted
  detailCard:   null,  // non-null → detail overlay is open
}

// ─── Reducer ──────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {

    case 'START_SHUFFLE':
      return { ...INITIAL, phase: STATES.SHUFFLING }

    case 'ENTER_ORBIT': {
      const shuffled = shuffleDeck(MAJOR_ARCANA)
      const orbitCards = Array.from({ length: 15 }, (_, i) => ({
        ...shuffled[i % shuffled.length],
        uid: `orbit-${i}-${Date.now()}`,
        faceUp: false,
      }))
      return { ...state, phase: STATES.ORBITING, orbitCards, readingCards: [] }
    }

    // Auto-select 3 random cards from the orbit
    case 'SELECT_THREE': {
      if (state.orbitCards.length < 3) return state;

      // Pick 3 unique random indices
      const indices = []
      const pool = [...state.orbitCards]
      for (let n = 0; n < 3; n++) {
        const idx = Math.floor(Math.random() * pool.length)
        indices.push(pool[idx])
        pool.splice(idx, 1)
      }

      const readingCards = indices.map(card => ({ ...card, faceUp: false }))

      return {
        ...state,
        orbitCards: pool,
        readingCards,
        phase: STATES.THREE_CARD_READING,
        focusedIndex: 0,
        detailCard: null,
      }
    }

    // Set focus directly to a specific card index (zone-based)
    case 'SET_FOCUS': {
      const idx = action.payload
      if (idx == null || idx < 0 || idx >= state.readingCards.length) return state
      if (idx === state.focusedIndex) return state
      return { ...state, focusedIndex: idx }
    }

    // Advance focus to next card (wraps) — keyboard debug only
    case 'FOCUS_NEXT': {
      const next = (state.focusedIndex + 1) % state.readingCards.length
      return { ...state, focusedIndex: next }
    }

    // Move focus to prev card (wraps) — keyboard debug only
    case 'FOCUS_PREV': {
      const prev = (state.focusedIndex - 1 + state.readingCards.length) % state.readingCards.length
      return { ...state, focusedIndex: prev }
    }

    // Flip the focused card face-up and open it in the detail overlay
    case 'OPEN_FOCUSED_DETAIL': {
      const idx  = state.focusedIndex
      const card = state.readingCards[idx]
      if (!card) return state

      // Mark the card face-up in readingCards so the spread reflects it
      const updatedCards = state.readingCards.map((c, i) =>
        i === idx ? { ...c, faceUp: true } : c
      )

      return {
        ...state,
        readingCards: updatedCards,
        detailCard:   updatedCards[idx],  // open this card in the overlay
      }
    }

    // Close the detail overlay, return to card spread (phase stays the same)
    case 'CLOSE_DETAIL':
      return { ...state, detailCard: null }

    case 'RESET':
      return { ...INITIAL }

    default:
      return state
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useReadingMachine(gesture) {
  const [machine, dispatch] = useReducer(reducer, INITIAL)
  const prevGestureRef  = useRef('unknown')
  const shuffleTimerRef = useRef(null)
  const orbitTimerRef   = useRef(null)

  // Auto-advance: SHUFFLING → ORBITING after animation duration
  useEffect(() => {
    if (machine.phase === STATES.SHUFFLING) {
      shuffleTimerRef.current = setTimeout(() => {
        dispatch({ type: 'ENTER_ORBIT' })
      }, 1800)
    }
    return () => clearTimeout(shuffleTimerRef.current)
  }, [machine.phase])

  // Auto-advance: ORBITING → SELECT_THREE after 1.5s of orbit + vortex settle
  useEffect(() => {
    if (machine.phase === STATES.ORBITING) {
      // 1.4s vortex settle + 1.5s orbit display = 2.9s total before auto-draw
      orbitTimerRef.current = setTimeout(() => {
        dispatch({ type: 'SELECT_THREE' })
      }, 2900)
    }
    return () => clearTimeout(orbitTimerRef.current)
  }, [machine.phase])

  // Gesture → transition (rising-edge only)
  useEffect(() => {
    const prev = prevGestureRef.current
    prevGestureRef.current = gesture
    if (gesture === prev || gesture === 'unknown') return

    const { phase, detailCard } = machine

    switch (gesture) {

      case 'open_palm':
        if (phase === STATES.IDLE) dispatch({ type: 'START_SHUFFLE' })
        break

      // pointing_finger no longer cycles focus.
      // Focus is now driven by zone-based hand position (useZoneFocus).

      case 'ok_sign':
        if (phase === STATES.THREE_CARD_READING && !detailCard) {
          // Reveal + open the currently focused card
          dispatch({ type: 'OPEN_FOCUSED_DETAIL' })
        }
        break

      case 'fist':
        if (phase === STATES.THREE_CARD_READING && detailCard) {
          // Close the detail overlay, stay in the reading
          dispatch({ type: 'CLOSE_DETAIL' })
        } else {
          // Anywhere else: full reset
          dispatch({ type: 'RESET' })
        }
        break

      default:
        break
    }
  }, [gesture, machine.phase, machine.detailCard])

  return { machine, dispatch }
}
