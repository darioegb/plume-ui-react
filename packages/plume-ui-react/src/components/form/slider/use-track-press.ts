'use client'

import type { PointerEvent, RefObject } from 'react'
import { useRef } from 'react'
import { clamp } from './slider-math'
import type { SliderOrientation } from './slider'

interface TrackPressOptions {
  commit: () => void
  disabled: boolean
  inputs: RefObject<(HTMLInputElement | null)[]>
  isRange: boolean
  max: number
  min: number
  orientation: SliderOrientation
  readOnly: boolean
  update: (index: number, value: number) => void
  values: number[]
}

interface TrackPressHandlers {
  onPointerCancel: (event: PointerEvent<HTMLElement>) => void
  onPointerDown: (event: PointerEvent<HTMLElement>) => void
  onPointerMove: (event: PointerEvent<HTMLElement>) => void
  onPointerUp: (event: PointerEvent<HTMLElement>) => void
}

export function useTrackPress({
  commit,
  disabled,
  inputs,
  isRange,
  max,
  min,
  orientation,
  readOnly,
  update,
  values,
}: TrackPressOptions): TrackPressHandlers {
  const dragging = useRef<number | null>(null)

  const valueAt = (event: PointerEvent<HTMLElement>): number => {
    const box = event.currentTarget.getBoundingClientRect()
    const ratio =
      orientation === 'vertical'
        ? (box.bottom - event.clientY) / box.height
        : (event.clientX - box.left) / box.width
    return min + clamp(ratio, 0, 1) * (max - min)
  }

  const nearest = (requested: number): number => {
    const first = values[0] ?? min
    const second = values[1] ?? max
    return requested <= second && Math.abs(requested - first) <= Math.abs(requested - second)
      ? 0
      : 1
  }

  const onPointerDown = (event: PointerEvent<HTMLElement>): void => {
    if (!isRange || disabled || readOnly || event.target instanceof HTMLInputElement) return
    const requested = valueAt(event)
    dragging.current = nearest(requested)
    event.currentTarget.setPointerCapture?.(event.pointerId)
    update(dragging.current, requested)
  }

  const onPointerMove = (event: PointerEvent<HTMLElement>): void => {
    if (dragging.current !== null) update(dragging.current, valueAt(event))
  }

  const end = (event: PointerEvent<HTMLElement>): void => {
    const index = dragging.current
    if (index === null) return
    dragging.current = null
    event.currentTarget.releasePointerCapture?.(event.pointerId)
    inputs.current[index]?.focus()
    commit()
  }

  return { onPointerCancel: end, onPointerDown, onPointerMove, onPointerUp: end }
}
