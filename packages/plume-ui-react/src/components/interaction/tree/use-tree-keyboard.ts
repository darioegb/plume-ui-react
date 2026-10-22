'use client'

import type { KeyboardEvent, RefObject } from 'react'
import { useCallback, useEffect, useRef } from 'react'
import { findTypeaheadMatch, parentItem, visibleItems } from './tree-navigation'

const typeaheadDelay = 500

interface KeyContext {
  activate: (value: string, hasChildren: boolean) => void
  current: HTMLElement
  hasChildren: boolean
  index: number
  isOpen: boolean
  items: HTMLElement[]
  select: (value: string) => void
  toggleExpanded: (value: string, expand: boolean) => void
  value: string
}

const keyActions: Record<string, (context: KeyContext) => void> = {
  ArrowDown: ({ index, items }) => items[index + 1]?.focus(),
  ArrowLeft: ({ current, hasChildren, isOpen, toggleExpanded, value }) => {
    if (hasChildren && isOpen) toggleExpanded(value, false)
    else parentItem(current)?.focus()
  },
  ArrowRight: ({ hasChildren, index, isOpen, items, toggleExpanded, value }) => {
    if (!hasChildren) return
    if (isOpen) items[index + 1]?.focus()
    else toggleExpanded(value, true)
  },
  ArrowUp: ({ index, items }) => items[index - 1]?.focus(),
  End: ({ items }) => items[items.length - 1]?.focus(),
  Enter: ({ activate, hasChildren, value }) => activate(value, hasChildren),
  Home: ({ items }) => items[0]?.focus(),
  ' ': ({ select, value }) => select(value),
}

interface TreeKeyboardOptions {
  activate: (value: string, hasChildren: boolean) => void
  expanded: readonly string[]
  root: RefObject<HTMLElement | null>
  select: (value: string) => void
  toggleExpanded: (value: string, expand: boolean) => void
}

type ItemKeyDown = (event: KeyboardEvent<HTMLElement>, value: string, hasChildren: boolean) => void

const isCharacter = (event: KeyboardEvent<HTMLElement>): boolean =>
  event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey

export function useTreeKeyboard({
  activate,
  expanded,
  root,
  select,
  toggleExpanded,
}: TreeKeyboardOptions): ItemKeyDown {
  const typed = useRef('')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  return useCallback(
    (event, value, hasChildren) => {
      if (event.target !== event.currentTarget) return
      const items = visibleItems(root.current)
      const index = items.indexOf(event.currentTarget)
      const action = keyActions[event.key]

      if (action && !event.altKey && !event.ctrlKey && !event.metaKey) {
        event.preventDefault()
        action({
          activate,
          current: event.currentTarget,
          hasChildren,
          index,
          isOpen: expanded.includes(value),
          items,
          select,
          toggleExpanded,
          value,
        })
        return
      }

      if (!isCharacter(event)) return
      event.preventDefault()
      clearTimeout(timer.current)
      typed.current += event.key
      timer.current = setTimeout(() => {
        typed.current = ''
      }, typeaheadDelay)
      findTypeaheadMatch(items, index, typed.current)?.focus()
    },
    [activate, expanded, root, select, toggleExpanded],
  )
}
