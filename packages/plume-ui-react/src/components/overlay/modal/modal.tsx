'use client'

import type { ReactNode, RefObject } from 'react'
import { useId, useMemo, useState } from 'react'
import { useOpenState } from '../../../overlay/use-open-state'
import type { Size } from '../../../theme'
import { ModalBackdropProvider } from './modal-backdrop-context'
import { ModalContext } from './modal-context'

export interface ModalProps {
  /** The `ModalTrigger` and the `ModalContent`. */
  children: ReactNode
  /**
   * Whether <kbd>Esc</kbd> closes the Modal.
   * @default true
   */
  closeOnEscape?: boolean
  /**
   * Whether a click on the backdrop closes the Modal.
   * @default true
   */
  closeOnOutside?: boolean
  /**
   * Whether the Modal is open at first, for an uncontrolled Modal.
   * @default false
   */
  defaultOpen?: boolean
  /**
   * A ref to the element that gets the focus when the Modal opens. By default, the first element
   * that can be focused.
   */
  initialFocus?: RefObject<HTMLElement | null>
  /** Called with the new state when the Modal opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Whether the Modal is open, for a controlled Modal. Pair it with `onOpenChange`. */
  open?: boolean
  /**
   * Maximum width of the dialog.
   * @default 'md'
   */
  size?: Size
  /**
   * Visual variant. `default` has the backdrop, the surface and the spacing of the parts.
   * `unstyled` drops the Plume styles so you can bring your own.
   * @default 'default'
   */
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
  const [trigger, setTrigger] = useState<HTMLElement | null>(null)
  const [open, setOpen] = useOpenState({ defaultOpen, onOpenChange, open: openProp })

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

  return (
    <ModalContext.Provider value={context}>
      <ModalBackdropProvider value={false}>{children}</ModalBackdropProvider>
    </ModalContext.Provider>
  )
}

Modal.displayName = 'Modal'
