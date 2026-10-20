'use client'

import type { ReactNode } from 'react'
import { useCallback, useId, useMemo, useRef, useState } from 'react'
import type { Placement } from '../../../overlay'
import { useOpenState } from '../../../overlay/use-open-state'
import type { Size } from '../../../theme'
import { DropdownContext, type DropdownInitialItem, type DropdownVariant } from './dropdown-context'

export interface DropdownProps {
  children: ReactNode
  closeOnSelect?: boolean
  defaultOpen?: boolean
  flip?: boolean
  offset?: number
  onOpenChange?: (open: boolean) => void
  open?: boolean
  placement?: Placement
  shift?: boolean
  size?: Size
  variant?: DropdownVariant
}

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
