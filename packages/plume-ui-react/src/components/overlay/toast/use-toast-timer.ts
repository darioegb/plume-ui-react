'use client'

import { useCallback, useEffect, useRef } from 'react'

interface ToastTimerHandlers {
  onBlur: () => void
  onFocus: () => void
  onPointerEnter: () => void
  onPointerLeave: () => void
}

export function useToastTimer(duration: number, onExpire: () => void): ToastTimerHandlers {
  const remaining = useRef(duration)
  const startedAt = useRef(0)
  const timer = useRef<number | undefined>(undefined)
  const hovered = useRef(false)
  const focused = useRef(false)

  const pause = useCallback((): void => {
    if (timer.current === undefined) return
    window.clearTimeout(timer.current)
    timer.current = undefined
    remaining.current -= Date.now() - startedAt.current
  }, [])

  const resume = useCallback((): void => {
    if (timer.current !== undefined || hovered.current || focused.current) return
    if (!Number.isFinite(duration) || duration <= 0) return
    startedAt.current = Date.now()
    timer.current = window.setTimeout(onExpire, Math.max(remaining.current, 0))
  }, [duration, onExpire])

  useEffect(() => {
    resume()
    return pause
  }, [pause, resume])

  return {
    onBlur: () => {
      focused.current = false
      resume()
    },
    onFocus: () => {
      focused.current = true
      pause()
    },
    onPointerEnter: () => {
      hovered.current = true
      pause()
    },
    onPointerLeave: () => {
      hovered.current = false
      resume()
    },
  }
}
