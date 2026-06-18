/**
 * App.jsx
 * Root component. Creates the video ref and wires it to
 * useHandTracking, then passes state down to ReadingScene.
 */

import React, { useRef } from 'react'
import { useHandTracking } from './hooks/useHandTracking'
import { useGestureController } from './hooks/useGestureController'
import ReadingScene        from './scenes/ReadingScene'

export default function App() {
  const videoRef = useRef(null)
  const { gesture: rawGesture, landmarks, status } = useHandTracking(videoRef)
  const gesture = useGestureController(rawGesture)

  return (
    <ReadingScene
      videoRef={videoRef}
      gesture={gesture}
      landmarks={landmarks}
      status={status}
    />
  )
}
