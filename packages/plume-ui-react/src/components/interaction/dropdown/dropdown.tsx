'use client'

import type { ReactNode } from 'react'
import { useCallback, useId, useMemo, useRef, useState } from 'react'
import type { Placement } from '../../../overlay'
import { useOpenState } from '../../../overlay/use-open-state'
import type { Size } from '../../../theme'
import { DropdownContext, type DropdownInitialItem, type DropdownVariant } from './dropdown-context'

export type { DropdownVariant } from './dropdown-context'

export interface DropdownOwnProps {
  /** The `DropdownTrigger` and the `DropdownMenu`. */
  children: ReactNode
  /**
   * Whether selecting an item closes the menu. An item can override it.
   *
   * @default true
   */
  closeOnSelect?: boolean
  /**
   * Whether the menu is open at first, for an uncontrolled menu.
   *
   * @default false
   */
  defaultOpen?: boolean
  /**
   * Opens on the opposite side when there is no room on the one asked for.
   *
   * @default true
   */
  flip?: boolean
  /**
   * Distance in pixels between the trigger and the menu.
   *
   * @default 4
   */
  offset?: number
  /** Called with the new state when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Whether the menu is open, for a controlled menu. Pair it with `onOpenChange`. */
  open?: boolean
  /**
   * Where the menu opens, relative to the trigger: a side, with an optional alignment
   * (`bottom-start`, `top-end`).
   *
   * @default 'bottom-start'
   */
  placement?: Placement
  /**
   * Slides the menu along its side to keep it inside the screen.
   *
   * @default true
   */
  shift?: boolean
  /**
   * Size of the text and of the padding of the items.
   *
   * @default 'md'
   */
  size?: Size
  /**
   * Visual variant. `elevated` floats the menu with a shadow and `outline` draws its border.
   * `unstyled` drops the Plume styles so you can bring your own.
   *
   * @default 'elevated'
   */
  variant?: DropdownVariant
}

export type DropdownProps = DropdownOwnProps

export function Dropdown({
  children,
  closeOnSelect = true,
  defaultOpen = false,
  flip = true,
  offset = 4,
  onOpenChange,
  open: openProp,
  placement = 'bottom-start',
  shift = true,
  size = 'md',
  variant = 'elevated',
}: Readonly<DropdownProps>): ReactNode {
  const baseId = useId()
  const [trigger, setTrigger] = useState<HTMLElement | null>(null)
  const [open, setOpen] = useOpenState({ defaultOpen, onOpenChange, open: openProp })
  const initialItem = useRef<DropdownInitialItem>('none')

  const openMenu = useCallback(
    (initial: DropdownInitialItem): void => {
      initialItem.current = initial
      setOpen(true)
    },
    [setOpen],
  )

  const context = useMemo(
    () => ({
      closeOnSelect,
      flip,
      initialItem,
      isStyled: variant !== 'unstyled',
      menuId: `${baseId}-menu`,
      offset,
      open,
      openMenu,
      placement,
      setOpen,
      setTrigger,
      shift,
      size,
      trigger,
      triggerId: `${baseId}-trigger`,
      variant,
    }),
    [
      baseId,
      closeOnSelect,
      flip,
      offset,
      open,
      openMenu,
      placement,
      setOpen,
      shift,
      size,
      trigger,
      variant,
    ],
  )

  return <DropdownContext.Provider value={context}>{children}</DropdownContext.Provider>
}

Dropdown.displayName = 'Dropdown'
