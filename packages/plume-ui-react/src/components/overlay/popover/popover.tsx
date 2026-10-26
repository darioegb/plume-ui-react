'use client'

import type { ReactNode } from 'react'
import { useId, useMemo, useState } from 'react'
import type { Placement } from '../../../overlay'
import { useOpenState } from '../../../overlay/use-open-state'
import type { Size } from '../../../theme'
import { PopoverContext, type PopoverVariant } from './popover-context'

export interface PopoverProps {
  /** The `PopoverTrigger` and the `PopoverContent`. */
  children: ReactNode
  /**
   * Whether the popover is open at first, for an uncontrolled popover.
   * @default false
   */
  defaultOpen?: boolean
  /**
   * Opens on the opposite side when there is no room on the one asked for.
   * @default true
   */
  flip?: boolean
  /**
   * Distance in pixels between the trigger and the panel.
   * @default 8
   */
  offset?: number
  /** Called with the new state when the popover opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Whether the popover is open, for a controlled popover. Pair it with `onOpenChange`. */
  open?: boolean
  /**
   * Where the panel opens, relative to the trigger: a side, with an optional alignment
   * (`top-start`, `bottom-end`).
   * @default 'bottom'
   */
  placement?: Placement
  /**
   * Slides the panel along its side to keep it inside the screen.
   * @default true
   */
  shift?: boolean
  /**
   * Maximum width of the panel.
   * @default 'md'
   */
  size?: Size
  /**
   * Visual variant. `elevated` floats the panel with a shadow and `outline` draws its border.
   * `unstyled` drops the Plume styles so you can bring your own.
   * @default 'elevated'
   */
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
  const [trigger, setTrigger] = useState<HTMLElement | null>(null)
  const [open, setOpen] = useOpenState({ defaultOpen, onOpenChange, open: openProp })

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
