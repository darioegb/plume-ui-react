'use client'

import type { CSSProperties, FocusEvent } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useDismiss } from '../../../overlay/use-dismiss'
import { usePosition } from '../../../overlay/use-position'

interface UseTimePopupOptions {
  input: HTMLInputElement | null
  root: HTMLDivElement | null
}

interface UseTimePopupResult {
  close: () => void
  handleBlur: (event: FocusEvent<HTMLDivElement>) => void
  open: boolean
  panelStyle: CSSProperties
  setPanel: (node: HTMLDivElement | null) => void
  toggle: () => void
}

export function useTimePopup({ input, root }: Readonly<UseTimePopupOptions>): UseTimePopupResult {
  const [open, setOpen] = useState(false)
  const [panel, setPanel] = useState<HTMLDivElement | null>(null)
  const position = usePosition({
    anchor: root,
    enabled: open,
    floating: panel,
    offset: 8,
    placement: 'bottom-start',
  })

  useEffect(() => {
    if (open) panel?.querySelector<HTMLElement>('[role="option"][tabindex="0"]')?.focus()
  }, [open, panel])

  useDismiss({
    elements: [root, panel],
    enabled: open,
    onDismiss: (reason) => {
      setOpen(false)
      if (reason === 'escape') input?.focus()
    },
  })

  const close = useCallback((): void => setOpen(false), [])
  const toggle = useCallback((): void => setOpen((isOpen) => !isOpen), [])

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLDivElement>): void => {
      const next = event.relatedTarget as Node | null
      if (next && !event.currentTarget.contains(next) && !panel?.contains(next)) setOpen(false)
    },
    [panel],
  )

  return {
    close,
    handleBlur,
    open,
    panelStyle: { ...position.style, opacity: position.isPositioned ? undefined : 0 },
    setPanel,
    toggle,
  }
}
