/**
 * App.jsx
 * Root component. Creates the video ref and wires it to
 * useHandTracking, then passes state down to ReadingScene.
 */

import React, { useRef, useState } from 'react'
import { useHandTracking } from './hooks/useHandTracking'
import { useGestureController } from './hooks/useGestureController'
import ReadingScene        from './scenes/ReadingScene'
import LoadingScene        from './scenes/LoadingScene'

export default function App() {
  const videoRef = useRef(null)
  const { gesture: rawGesture, landmarks, status } = useHandTracking(videoRef)
  const gesture = useGestureController(rawGesture)
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      <ReadingScene
        videoRef={videoRef}
        gesture={gesture}
        landmarks={landmarks}
        status={status}
      />
      {isLoading && (
        <LoadingScene 
          isReady={status === 'active' || status === 'error'} 
          onComplete={() => setIsLoading(false)} 
        />
      )}
    </>
  )
}
