import { useRef, useState, useCallback, useEffect } from 'react';

/**
 * useSoundSystem.js
 * Procedural web-audio sound design for Tarot application.
 * All sounds generated mathematically without external assets.
 */

let audioCtx = null;
let ambientNodes = null;
let oracleNodes = null;
let isMuted = false;

// Set up simple listener pattern for muted state changes if UI needs it
const listeners = new Set();
const notifyListeners = () => {
  listeners.forEach(fn => fn(isMuted));
};

export function useSoundSystem() {
  const [muted, setMuted] = useState(isMuted);

  useEffect(() => {
    const handler = (m) => setMuted(m);
    listeners.add(handler);
    return () => listeners.delete(handler);
  }, []);

  const getAudioContext = useCallback(() => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }, []);

  const toggleMute = useCallback(() => {
    isMuted = !isMuted;
    notifyListeners();
  }, []);

  const playShuffleSound = useCallback(() => {
    if (muted) return;
    const ctx = getAudioContext();
    
    // Play 6 bursts over 1.5s
    const burstCount = 6;
    const duration = 1.5;
    const interval = duration / burstCount;
    const now = ctx.currentTime;

    for (let i = 0; i < burstCount; i++) {
      const burstTime = now + i * interval;
      
      const bufferSize = ctx.sampleRate * 0.2; // 200ms burst
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let j = 0; j < bufferSize; j++) {
        data[j] = Math.random() * 2 - 1; // White noise
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;

      // Bandpass filter for 'whoosh' quality
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1400; // between 800 and 2000
      filter.Q.value = 1.0;

      const gainNode = ctx.createGain();
      // Decreasing volume for each successive burst
      const peakVolume = 0.3 * (1 - i / burstCount);
      gainNode.gain.setValueAtTime(0, burstTime);
      gainNode.gain.linearRampToValueAtTime(peakVolume, burstTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, burstTime + 0.2);

      noiseSource.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      noiseSource.start(burstTime);
      noiseSource.stop(burstTime + 0.2);
    }
  }, [getAudioContext, muted]);

  const playRevealSound = useCallback(() => {
    if (muted) return;
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.4, now + 0.05);
    masterGain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
    masterGain.connect(ctx.destination);

    // Oscillator 1: Sine at ~880Hz
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 880;
    osc1.connect(masterGain);

    // Oscillator 2: Triangle at ~1320Hz
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.value = 1320;
    
    // slightly softer triangle
    const gain2 = ctx.createGain();
    gain2.gain.value = 0.5;
    osc2.connect(gain2);
    gain2.connect(masterGain);

    osc1.start(now);
    osc2.start(now);
    
    osc1.stop(now + 1.6);
    osc2.stop(now + 1.6);
  }, [getAudioContext, muted]);

  const playFocusSound = useCallback(() => {
    if (muted) return;
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 440;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }, [getAudioContext, muted]);

  const playAmbient = useCallback(() => {
    if (muted || ambientNodes) return;
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    // Very low total volume
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.08, now + 3); // Slow fade in
    masterGain.connect(ctx.destination);

    // Two detuned low sines for beating
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 60;
    osc1.connect(masterGain);

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 63;
    osc2.connect(masterGain);

    // High ethereal sine
    const osc3 = ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.value = 1200;
    
    const tremoloGain = ctx.createGain();
    tremoloGain.gain.value = 0.03;

    // LFO for tremolo
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.2; // 5 seconds period
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.02; // Modulate volume

    lfo.connect(lfoGain);
    lfoGain.connect(tremoloGain.gain);

    osc3.connect(tremoloGain);
    tremoloGain.connect(masterGain);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);
    lfo.start(now);

    ambientNodes = { osc1, osc2, osc3, lfo, masterGain };
  }, [getAudioContext, muted]);

  const stopAmbient = useCallback(() => {
    if (!ambientNodes) return;
    const { osc1, osc2, osc3, lfo, masterGain } = ambientNodes;
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Fade out over 2 seconds
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(masterGain.gain.value, now);
    masterGain.gain.linearRampToValueAtTime(0, now + 2);

    setTimeout(() => {
      osc1.stop();
      osc2.stop();
      osc3.stop();
      lfo.stop();
      osc1.disconnect();
      osc2.disconnect();
      osc3.disconnect();
      lfo.disconnect();
      masterGain.disconnect();
    }, 2100);

    ambientNodes = null;
  }, [getAudioContext]);

  const playOracleHum = useCallback(() => {
    if (muted || oracleNodes) return;
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.1, now + 2); // Fade in over 2s
    masterGain.connect(ctx.destination);

    // Minor chord (~130Hz, ~156Hz, ~196Hz) C3, D#3, G3 approximately
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 130;
    osc1.connect(masterGain);

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 156;
    osc2.connect(masterGain);

    const osc3 = ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.value = 196;
    osc3.connect(masterGain);

    // LFO for volume oscillation
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.5; // 2 seconds period
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.05; // Oscillation amplitude

    lfo.connect(lfoGain);
    lfoGain.connect(masterGain.gain);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);
    lfo.start(now);

    oracleNodes = { osc1, osc2, osc3, lfo, masterGain };
  }, [getAudioContext, muted]);

  const stopOracleHum = useCallback(() => {
    if (!oracleNodes) return;
    const { osc1, osc2, osc3, lfo, masterGain } = oracleNodes;
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(masterGain.gain.value, now);
    masterGain.gain.linearRampToValueAtTime(0, now + 1);

    setTimeout(() => {
      osc1.stop();
      osc2.stop();
      osc3.stop();
      lfo.stop();
      osc1.disconnect();
      osc2.disconnect();
      osc3.disconnect();
      lfo.disconnect();
      masterGain.disconnect();
    }, 1100);

    oracleNodes = null;
  }, [getAudioContext]);

  // Handle muting correctly
  useEffect(() => {
    if (muted) {
      stopAmbient();
      stopOracleHum();
    }
  }, [muted, stopAmbient, stopOracleHum]);

  // --- Future-proofing UX Event Hooks ---
  const onHover = useCallback(() => {
    // Placeholder for future hover audio hook
    playFocusSound();
  }, [playFocusSound]);

  const onShuffle = useCallback(() => {
    // Placeholder for future shuffle audio hook
    playShuffleSound();
  }, [playShuffleSound]);

  const onReveal = useCallback(() => {
    // Placeholder for future reveal audio hook
    playRevealSound();
  }, [playRevealSound]);

  const onTransition = useCallback(() => {
    // Placeholder for future scene transition audio hook
  }, []);

  return {
    muted,
    toggleMute,
    playShuffleSound,
    playRevealSound,
    playFocusSound,
    playAmbient,
    stopAmbient,
    playOracleHum,
    stopOracleHum,
    onHover,
    onShuffle,
    onReveal,
    onTransition,
  };
}
