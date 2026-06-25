import { useState, useEffect, useRef } from 'react'

/**
 * Intercepts the 'ok_sign' gesture and delays it by a set duration (500ms).
 * Returns the delayed gesture and the current progress (0 to 1).
 */
export function useHoldToReveal(gesture, isEnabled) {
  const [progress, setProgress] = useState(0)
  const [outputGesture, setOutputGesture] = useState(gesture)
  const [justRevealed, setJustRevealed] = useState(false)
  const holdTimer = useRef(null)
  const startTime = useRef(null)
  const frameRef = useRef(null)

  useEffect(() => {
    // Pass through non-target gestures or if disabled
    if (!isEnabled || gesture !== 'ok_sign') {
      if (holdTimer.current) {
        clearTimeout(holdTimer.current)
        holdTimer.current = null
      }
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
      setProgress(0)
      setOutputGesture(gesture)
      return
    }

    // If it's ok_sign and enabled, start the hold timer
    if (!holdTimer.current && progress === 0) {
      startTime.current = performance.now()
      
      const updateProgress = (time) => {
        const elapsed = time - startTime.current
        const newProgress = Math.min(elapsed / 500, 1)
        setProgress(newProgress)
        
        if (newProgress < 1) {
          frameRef.current = requestAnimationFrame(updateProgress)
        }
      }
      frameRef.current = requestAnimationFrame(updateProgress)

      holdTimer.current = setTimeout(() => {
        setOutputGesture('ok_sign')
        setJustRevealed(true)
        setTimeout(() => setJustRevealed(false), 1000) // Show fate revealed for 1s
      }, 500)
    }

    return () => {
      // Cleanup happens if gesture changes before timeout
    }
  }, [gesture, isEnabled])

  return { outputGesture, progress, justRevealed }
}
