'use client'

import type { ReactNode } from 'react'
import { useCallback, useId, useMemo, useState } from 'react'
import type { Placement } from '../../../overlay'
import type { Size } from '../../../theme'
import { PopoverContext, type PopoverVariant } from './popover-context'

export interface PopoverProps {
  children: ReactNode
  defaultOpen?: boolean
  flip?: boolean
  offset?: number
  onOpenChange?: (open: boolean) => void
  open?: boolean
  placement?: Placement
  shift?: boolean
  size?: Size
  variant?: PopoverVariant
}

export function Popover({
  children,
  defaultOpen = false,
  flip = true,
  offset = 8,
  onOpenChange,
  open: openProp,
  placement = 'bottom',
  shift = true,
  size = 'md',
  variant = 'elevated',
}: Readonly<PopoverProps>): ReactNode {
  const baseId = useId()
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const [trigger, setTrigger] = useState<HTMLElement | null>(null)
  const isControlled = openProp !== undefined
  const open = isControlled ? openProp : internalOpen

  const setOpen = useCallback(
    (next: boolean): void => {
      if (!isControlled) setInternalOpen(next)
      if (next !== open) onOpenChange?.(next)
    },
    [isControlled, onOpenChange, open],
  )

  const context = useMemo(
    () => ({
      contentId: `${baseId}-content`,
      flip,
      isStyled: variant !== 'unstyled',
      offset,
      open,
      placement,
      setOpen,
      setTrigger,
      shift,
      size,
      trigger,
      variant,
    }),
    [baseId, flip, offset, open, placement, setOpen, shift, size, trigger, variant],
  )

  return <PopoverContext.Provider value={context}>{children}</PopoverContext.Provider>
}
