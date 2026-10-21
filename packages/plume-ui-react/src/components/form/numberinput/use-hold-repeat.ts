'use client'

import type { MouseEvent, PointerEvent } from 'react'
import { useCallback, useEffect, useRef } from 'react'

const START_DELAY = 400
const REPEAT_DELAY = 60

interface HoldRepeatHandlers {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
  onPointerCancel: () => void
  onPointerDown: (event: PointerEvent<HTMLButtonElement>) => void
  onPointerLeave: () => void
  onPointerUp: () => void
}

export function useHoldRepeat(action: () => void, enabled: boolean): HoldRepeatHandlers {
  const latest = useRef(action)
  latest.current = action
  const timers = useRef<{ interval?: number; timeout?: number }>({})

  const stop = useCallback((): void => {
    window.clearTimeout(timers.current.timeout)
    window.clearInterval(timers.current.interval)
    window.removeEventListener('pointerup', stop)
  }, [])

  const start = useCallback((): void => {
    latest.current()
    window.addEventListener('pointerup', stop)
    timers.current.timeout = window.setTimeout(() => {
      timers.current.interval = window.setInterval(() => latest.current(), REPEAT_DELAY)
    }, START_DELAY)
  }, [stop])

  useEffect(() => {
    if (!enabled) stop()
  }, [enabled, stop])

  useEffect(() => stop, [stop])

  return {
    onClick: (event) => {
      if (event.detail === 0) latest.current()
    },
    onPointerCancel: stop,
    onPointerDown: (event) => {
      if (event.button === 0) start()
    },
    onPointerLeave: stop,
    onPointerUp: stop,
  }
}
