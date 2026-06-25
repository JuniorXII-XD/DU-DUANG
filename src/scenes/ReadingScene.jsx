/**
 * ReadingScene.jsx
 * Root scene: wires useReadingMachine to phase-specific sub-scenes.
 * All gesture-to-state logic lives in the machine; this file is display only.
 */

import React, { useEffect } from 'react'
import { useReadingMachine, STATES } from '../hooks/useReadingMachine'
import { useKeyboardDebug } from '../hooks/useKeyboardDebug'
import { useZoneFocus } from '../hooks/useZoneFocus'
import { useSoundSystem } from '../hooks/useSoundSystem'
import { useHoldToReveal } from '../hooks/useHoldToReveal'
import WebcamPreview  from '../components/WebcamPreview'
import GestureLegend  from '../components/GestureLegend'
import GestureDisplay from '../components/GestureDisplay'
import Particles from '../components/Particles'
import IdleScene      from './IdleScene'
import ShuffleScene   from './ShuffleScene'
import OrbitScene     from './OrbitScene'
import ThreeCardScene from './ThreeCardScene'

// Phase label shown in top-left breadcrumb
const PHASE_LABELS = {
  [STATES.IDLE]:               'Awaiting',
  [STATES.SHUFFLING]:          'Shuffling',
  [STATES.ORBITING]:           'Orbiting',
  [STATES.THREE_CARD_READING]: 'Three-Card Reading',
}

export default function ReadingScene({ videoRef, gesture, landmarks, status }) {
  // Zone-based focus: maps hand X position to card zones 0/1/2
  // We need phase to determine if it's enabled, but we need machine state.
  // We will intercept gesture right before passing it to useReadingMachine, 
  // but we need to know the phase first. Since we can't circular depend, we use a ref or track phase.
  // Actually, useReadingMachine doesn't break if we pass raw gesture, 
  // but we want to intercept 'ok_sign'.
  // Let's call the machine first, then override the gesture passed to it?
  // No, useReadingMachine takes a gesture. If we intercept, we must intercept based on previous phase.
  
  // We will intercept based on the state machine's *current* phase, which is safe to read.
  // The state machine will process outputGesture.
  
  // To avoid circular dependency, we pass raw gesture to the machine temporarily to get phase?
  // Wait, useReadingMachine internally uses useEffect to listen to gesture changes.
  
  // A safer way: apply useHoldToReveal, but it requires phase. 
  // We can't know phase until useReadingMachine runs.
  // But useReadingMachine only reads gesture in a useEffect, so we can pass the intercepted gesture.
  // We will pass the intercepted gesture to useReadingMachine.
  // We will determine isEnabled by checking if machine phase === STATES.THREE_CARD_READING.
  
  const [currentPhase, setCurrentPhase] = React.useState(STATES.IDLE)
  const zoneFocusEnabled = currentPhase === STATES.THREE_CARD_READING
  
  const { outputGesture, progress, justRevealed } = useHoldToReveal(gesture, zoneFocusEnabled)
  
  const { machine, dispatch } = useReadingMachine(outputGesture)
  const { phase, orbitCards, readingCards, focusedIndex, detailCard } = machine

  // Sync phase for the hook
  React.useEffect(() => { setCurrentPhase(phase) }, [phase])
  
  useKeyboardDebug(machine, dispatch)

  const zoneFocus = useZoneFocus(landmarks, zoneFocusEnabled && !detailCard)

  const { playAmbient, onHover, onShuffle, onReveal, onTransition } = useSoundSystem()

  // Start ambient drone once user interacts (leaves IDLE)
  React.useEffect(() => {
    if (phase !== STATES.IDLE) {
      playAmbient()
    }
  }, [phase, playAmbient])

  // Play focus tick sound when focusedIndex changes
  React.useEffect(() => {
    if (phase === STATES.THREE_CARD_READING) {
      onHover()
    }
  }, [focusedIndex, phase, onHover])

  // Play transition sound on phase change
  React.useEffect(() => {
    onTransition()
    if (phase === STATES.SHUFFLING) onShuffle()
  }, [phase, onTransition, onShuffle])

  // Play reveal sound when card just revealed
  React.useEffect(() => {
    if (justRevealed) onReveal()
  }, [justRevealed, onReveal])

  React.useEffect(() => {
    if (zoneFocus !== null && zoneFocusEnabled) {
      dispatch({ type: 'SET_FOCUS', payload: zoneFocus })
    }
  }, [zoneFocus, zoneFocusEnabled, dispatch])


  return (
    <div className="relative min-h-screen bg-void overflow-hidden select-none">

      {/* ── Ambient background ─────────────────────────────────────── */}
      <Particles />

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between px-6 pt-5 pb-4">
        <div>
          <h1 className="font-display text-gold text-xl tracking-[0.25em] uppercase">
            Arcana
          </h1>
          <p className="font-body text-[11px] tracking-[0.15em] text-silver mt-0.5 uppercase">
            {PHASE_LABELS[phase] ?? 'Hand-Read Tarot'}
          </p>
        </div>
        {/* Spacer so header doesn't clash with fixed webcam */}
        <div className="w-48" aria-hidden="true" />
      </header>

      {/* ── Divider ────────────────────────────────────────────────── */}
      <div className="mx-6 h-px bg-border opacity-50" />

      {/* ── Phase indicator pills ──────────────────────────────────── */}
      <div className="relative z-10 flex justify-center gap-1.5 pt-4">
        {Object.values(STATES).map((s) => (
          <span
            key={s}
            className="w-1.5 h-1.5 rounded-full transition-all duration-500"
            style={{
              background: s === phase ? '#C9A84C' : '#2A2D52',
              transform:  s === phase ? 'scale(1.4)' : 'scale(1)',
            }}
          />
        ))}
      </div>

      {/* ── Main content ───────────────────────────────────────────── */}
      <main className="relative z-10 flex flex-col items-center justify-center gap-6 pt-6 pb-24 px-4 min-h-[calc(100vh-140px)]">

        {/* Gesture readout (always visible) */}
        <GestureDisplay gesture={gesture} />

        {/* Phase-switching scene */}
        <div className="w-full flex flex-col items-center scene-transition" key={phase}>
          {phase === STATES.IDLE               && <IdleScene />}
          {phase === STATES.SHUFFLING          && <ShuffleScene />}
          {phase === STATES.ORBITING           && (
            <OrbitScene cards={orbitCards} />
          )}
          {phase === STATES.THREE_CARD_READING && (
            <ThreeCardScene
              cards={readingCards}
              focusedIndex={focusedIndex}
              detailCard={detailCard}
              holdProgress={progress}
              justRevealed={justRevealed}
            />
          )}
        </div>
      </main>

      {/* ── Fixed overlays ─────────────────────────────────────────── */}
      <WebcamPreview videoRef={videoRef} status={status} />
      <GestureLegend gesture={gesture} />

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="fixed bottom-4 right-4 z-50">
        <p className="font-body text-[10px] text-gold-dim tracking-widest uppercase opacity-40">
          MediaPipe · Hands
        </p>
      </footer>
    </div>
  )
}
