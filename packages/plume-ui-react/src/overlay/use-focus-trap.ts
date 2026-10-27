'use client'

import { useEffect, useRef } from 'react'
import type { LayerCheck } from './layer'

const tabbableSelector = [
  'a[href]',
  'area[href]',
  'button',
  'input',
  'select',
  'textarea',
  'summary',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]',
].join(',')

export interface UseFocusTrapOptions {
  active: boolean
  initialFocus?: HTMLElement | null
  restoreFocus?: boolean
  returnFocus?: HTMLElement | null
  isTopmost?: (() => boolean) | LayerCheck
  trap?: boolean
}

export function getTabbableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(tabbableSelector)).filter((element) => {
    if (element.tabIndex < 0) return false
    if ((element as HTMLInputElement).disabled) return false
    if (element instanceof HTMLInputElement && element.type === 'hidden') return false
    if (element.closest('[hidden], [inert]')) return false
    const style = window.getComputedStyle(element)
    return style.display !== 'none' && style.visibility !== 'hidden'
  })
}

const ownsTab = (check: (() => boolean) | LayerCheck): boolean =>
  'ownsFocus' in check ? check.ownsFocus() : check()

export function useFocusTrap(
  container: HTMLElement | null,
  {
    active,
    initialFocus,
    restoreFocus = true,
    returnFocus,
    isTopmost = () => true,
    trap = true,
  }: UseFocusTrapOptions,
): void {
  const latest = useRef({ initialFocus, restoreFocus, returnFocus, isTopmost })

  useEffect(() => {
    latest.current = { initialFocus, restoreFocus, returnFocus, isTopmost }
  })

  useEffect(() => {
    if (!active || !container) return undefined

    const previouslyFocused = document.activeElement as HTMLElement | null
    const focusContainer = (): void => {
      if (!container.hasAttribute('tabindex')) container.setAttribute('tabindex', '-1')
      container.focus()
    }

    const initial = latest.current.initialFocus ?? getTabbableElements(container)[0]
    if (initial) initial.focus()
    else focusContainer()

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'Tab' || !ownsTab(latest.current.isTopmost)) return
      const tabbables = getTabbableElements(container)
      if (tabbables.length === 0) {
        event.preventDefault()
        focusContainer()
        return
      }
      const first = tabbables[0]
      const last = tabbables[tabbables.length - 1]
      const current = document.activeElement
      const inside = container.contains(current)
      if (inside && event.shiftKey && (current === first || current === container)) {
        event.preventDefault()
        last.focus()
      } else if (!inside || (!event.shiftKey && current === last)) {
        event.preventDefault()
        first.focus()
      }
    }

    if (trap) document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      const target = latest.current.returnFocus ?? previouslyFocused
      if (latest.current.restoreFocus && target?.isConnected) target.focus()
    }
  }, [active, container, trap])
}
