/**
 * useHandTracking.js
 * React hook that manages the HandTrackingService lifecycle
 * and exposes gesture state to components.
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { HandTrackingService } from '../services/handTrackingService'
import { classifyGesture } from '../services/gestureService'

const GESTURE_DEBOUNCE_MS = 120  // smoothing: only emit a new gesture after it holds

export function useHandTracking(videoRef) {
  const serviceRef  = useRef(null)
  const debounceRef = useRef(null)
  const pendingRef  = useRef('unknown')

  const [gesture,   setGesture]   = useState('unknown')
  const [landmarks, setLandmarks] = useState(null)
  const [status,    setStatus]    = useState('idle')  // idle | loading | active | error

  const handleResults = useCallback((results) => {
    const hand = results.multiHandLandmarks?.[0] ?? null
    setLandmarks(hand)

    const detected = classifyGesture(hand)

    // Debounce: only update state when gesture holds for GESTURE_DEBOUNCE_MS
    if (detected !== pendingRef.current) {
      pendingRef.current = detected
      clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        setGesture(detected)
      }, GESTURE_DEBOUNCE_MS)
    }
  }, [])

  useEffect(() => {
    if (!videoRef?.current) return

    let mounted = true
    setStatus('loading')

    const svc = new HandTrackingService()
    serviceRef.current = svc

    svc.init(videoRef.current, handleResults)
      .then(() => { if (mounted) setStatus('active') })
      .catch((err) => {
        console.error('[HandTracking] init failed:', err)
        if (mounted) setStatus('error')
      })

    return () => {
      mounted = false
      clearTimeout(debounceRef.current)
      svc.destroy().catch(console.error)
    }
  }, [videoRef, handleResults])

  return { gesture, landmarks, status }
}
