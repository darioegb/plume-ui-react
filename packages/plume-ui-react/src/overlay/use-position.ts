'use client'

import type { CSSProperties } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { computePosition, type Placement } from './position'
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect'

export interface UsePositionOptions {
  anchor: HTMLElement | null
  floating: HTMLElement | null
  enabled: boolean
  placement?: Placement
  offset?: number
  padding?: number
  flip?: boolean
  shift?: boolean
}

export interface UsePositionResult {
  style: CSSProperties
  placement: Placement
  isPositioned: boolean
}

interface PositionState {
  x: number
  y: number
  placement: Placement
  isPositioned: boolean
}

export function usePosition({
  anchor,
  floating,
  enabled,
  placement = 'bottom',
  offset,
  padding,
  flip,
  shift,
}: UsePositionOptions): UsePositionResult {
  const [state, setState] = useState<PositionState>({ x: 0, y: 0, placement, isPositioned: false })

  const update = useCallback(() => {
    if (!anchor || !floating) return
    const anchorRect = anchor.getBoundingClientRect()
    const floatingRect = floating.getBoundingClientRect()
    const { documentElement } = document
    const result = computePosition({
      anchor: {
        x: anchorRect.left,
        y: anchorRect.top,
        width: anchorRect.width,
        height: anchorRect.height,
      },
      floating: { width: floatingRect.width, height: floatingRect.height },
      viewport: {
        width: documentElement.clientWidth || window.innerWidth,
        height: documentElement.clientHeight || window.innerHeight,
      },
      placement,
      offset,
      padding,
      flip,
      shift,
    })
    setState((current) =>
      current.isPositioned &&
      current.x === result.x &&
      current.y === result.y &&
      current.placement === result.placement
        ? current
        : { x: result.x, y: result.y, placement: result.placement, isPositioned: true },
    )
  }, [anchor, floating, placement, offset, padding, flip, shift])

  useIsomorphicLayoutEffect(() => {
    if (!enabled) return undefined
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(update)
    if (anchor) observer?.observe(anchor)
    if (floating) observer?.observe(floating)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
      observer?.disconnect()
    }
  }, [enabled, update, anchor, floating])

  useEffect(() => {
    if (!enabled) setState((current) => (current.isPositioned ? { ...current, isPositioned: false } : current))
  }, [enabled])

  return {
    placement: state.placement,
    isPositioned: state.isPositioned,
    style: { position: 'fixed', top: state.y, left: state.x },
  }
}
