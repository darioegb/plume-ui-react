'use client'

import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { getPaginatorItems } from './paginator-range'

interface FitOptions {
  current: number
  pages: number
  root: HTMLElement | null
}

interface Fit {
  boundaryCount: number
  siblingCount: number
}

const MAX_BOUNDARY = 1
const MAX_SIBLINGS = 1

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

const width = (element: Element): number => element.getBoundingClientRect().width

const gapOf = (element: Element): number =>
  Number.parseFloat(getComputedStyle(element).columnGap) || 0

/**
 * The most entries the list can show without the row wrapping, from the width the list has left
 * after the other parts (the page size, the summary) and from what a button takes today.
 */
const roomForEntries = (root: HTMLElement): number | undefined => {
  const list = root.querySelector('[data-plume-paginator-list]')
  if (!list) return undefined
  const items = Array.from(list.querySelectorAll(':scope > [data-plume-paginator-item]'))
  const fixed = items.filter(
    (item) => !item.querySelector('[data-plume-paginator-page], [data-plume-paginator-ellipsis]'),
  ).length
  if (items.length === fixed || root.clientWidth === 0) return undefined

  const listGap = gapOf(list)
  const unit = items.reduce((sum, item) => sum + width(item), 0) / items.length + listGap
  const others = Array.from(root.children).filter((child) => child !== list)
  const taken = others.reduce((sum, child) => sum + width(child), 0) + gapOf(root) * others.length
  const available = root.clientWidth - taken
  return Math.floor((available + listGap) / unit) - fixed
}

const pickFit = ({ current, pages }: Pick<FitOptions, 'current' | 'pages'>, room: number): Fit => {
  let best: Fit & { count: number } | undefined
  for (let siblings = MAX_SIBLINGS; siblings >= 0; siblings -= 1) {
    for (let boundary = MAX_BOUNDARY; boundary >= 0; boundary -= 1) {
      const count = getPaginatorItems({
        boundaryCount: boundary,
        count: pages,
        page: current,
        siblingCount: siblings,
      }).length
      const better =
        !best ||
        count > best.count ||
        (count === best.count && boundary > best.boundaryCount)
      if (count <= room && better) {
        best = { boundaryCount: boundary, count, siblingCount: siblings }
      }
    }
  }
  return best ?? { boundaryCount: 0, siblingCount: 0 }
}

/**
 * The page numbers stay on one row. It shows the current page, one on each side and the first and
 * the last, and when the list has no room for them it shows fewer pages. It measures the rendered buttons, so it does nothing
 * until it is in the page.
 */
export function usePaginatorFit(options: FitOptions): Fit {
  const { current, pages, root } = options
  const [fit, setFit] = useState<Fit | null>(null)

  const measure = useCallback((): void => {
    if (!root) return
    const room = roomForEntries(root)
    if (room === undefined) return
    const next = pickFit({ current, pages }, room)
    setFit((previous) =>
      previous?.boundaryCount === next.boundaryCount &&
      previous.siblingCount === next.siblingCount
        ? previous
        : next,
    )
  }, [current, pages, root])

  useIsomorphicLayoutEffect(measure, [measure])

  useEffect(() => {
    if (!root || typeof ResizeObserver === 'undefined') return undefined
    const observer = new ResizeObserver(measure)
    observer.observe(root)
    return () => observer.disconnect()
  }, [measure, root])

  return fit ?? { boundaryCount: MAX_BOUNDARY, siblingCount: MAX_SIBLINGS }
}
