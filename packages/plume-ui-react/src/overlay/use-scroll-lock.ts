'use client'

import { useEffect } from 'react'

let locks = 0
let restore: (() => void) | undefined

function lock(): void {
  locks += 1
  if (locks > 1) return
  const { body, documentElement } = document
  const previous = { overflow: body.style.overflow, paddingRight: body.style.paddingRight }
  const scrollbarWidth = window.innerWidth - documentElement.clientWidth
  if (scrollbarWidth > 0) {
    const currentPadding = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0
    body.style.paddingRight = `${currentPadding + scrollbarWidth}px`
  }
  body.style.overflow = 'hidden'
  restore = () => {
    body.style.overflow = previous.overflow
    body.style.paddingRight = previous.paddingRight
  }
}

function unlock(): void {
  locks = Math.max(0, locks - 1)
  if (locks > 0) return
  restore?.()
  restore = undefined
}

export function useScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return undefined
    lock()
    return unlock
  }, [locked])
}
