import { useState, useEffect, useRef } from "react"

export function useAccurateTimer(active: boolean, resetSignal: boolean) {
  const [elapsed, setElapsed] = useState(0)
  const startRef = useRef<number | null>(null)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (resetSignal) setElapsed(0)
    if (active) {
      startRef.current = performance.now() - elapsed * 1000
      const update = () => {
        const now = performance.now()
        if (startRef.current != null) {
          setElapsed(Math.floor((now - startRef.current) / 1000))
        }
        frameRef.current = requestAnimationFrame(update)
      }
      frameRef.current = requestAnimationFrame(update)
      return () => {
        if (frameRef.current) {
          cancelAnimationFrame(frameRef.current)
        }
      }
    } else if (!active && frameRef.current) {
      cancelAnimationFrame(frameRef.current)
    }
  }, [active, resetSignal])

  return elapsed
}

export function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60).toString().padStart(2, "0")
  const secs = (seconds % 60).toString().padStart(2, "0")
  return `${mins}:${secs}`
}