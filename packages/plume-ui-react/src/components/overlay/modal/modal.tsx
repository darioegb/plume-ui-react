'use client'

import type { ReactNode, RefObject } from 'react'
import { useCallback, useId, useMemo, useState } from 'react'
import type { Size } from '../../../theme'
import { ModalContext } from './modal-context'

export interface ModalProps {
  children: ReactNode
  closeOnEscape?: boolean
  closeOnOutside?: boolean
  defaultOpen?: boolean
  initialFocus?: RefObject<HTMLElement | null>
  onOpenChange?: (open: boolean) => void
  open?: boolean
  size?: Size
  variant?: ModalVariant
}

export type ModalVariant = 'default' | 'unstyled'

export function Modal({
  children,
  closeOnEscape = true,
  closeOnOutside = true,
  defaultOpen = false,
  initialFocus,
  onOpenChange,
  open: openProp,
  size = 'md',
  variant = 'default',
}: Readonly<ModalProps>): ReactNode {
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
      bodyId: `${baseId}-body`,
      closeOnEscape,
      closeOnOutside,
      contentId: `${baseId}-content`,
      initialFocus,
      isStyled: variant !== 'unstyled',
      open,
      setOpen,
      setTrigger,
      size,
      titleId: `${baseId}-title`,
      trigger,
    }),
    [baseId, closeOnEscape, closeOnOutside, initialFocus, open, setOpen, size, trigger, variant],
  )

  return <ModalContext.Provider value={context}>{children}</ModalContext.Provider>
}
