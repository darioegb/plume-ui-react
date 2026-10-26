'use client'

import type { ForwardedRef, ReactElement } from 'react'
import { forwardRef } from 'react'
import { OverlayClose, type OverlayCloseProps } from '../../../overlay/overlay-close'
import { useModalContext } from './modal-context'
import styles from './modal.module.css'

export type ModalCloseProps = OverlayCloseProps

/**
 * A button that closes the Modal. Without children it is the corner X button; with an element,
 * such as a `Button`, it gives it the click handler.
 */
export const ModalClose = forwardRef<HTMLElement, ModalCloseProps>(
  (props: ModalCloseProps, ref: ForwardedRef<HTMLElement>): ReactElement => {
    const { isStyled, setOpen } = useModalContext('ModalClose')

    return (
      <OverlayClose
        {...props}
        closeClassName={isStyled ? styles.close : undefined}
        onClose={() => setOpen(false)}
        ref={ref}
      />
    )
  },
)

ModalClose.displayName = 'ModalClose'
