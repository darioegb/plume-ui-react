'use client'

import { useCallback, useState } from 'react'

export interface UseOpenStateOptions {
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

export function useOpenState({
  defaultOpen = false,
  onOpenChange,
  open: openProp,
}: UseOpenStateOptions): [boolean, (next: boolean) => void] {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isControlled = openProp !== undefined
  const open = isControlled ? openProp : internalOpen

  const setOpen = useCallback(
    (next: boolean): void => {
      if (!isControlled) setInternalOpen(next)
      if (next !== open) onOpenChange?.(next)
    },
    [isControlled, onOpenChange, open],
  )

  return [open, setOpen]
}
