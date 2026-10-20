'use client'

import type { ForwardedRef, ReactElement } from 'react'
import { forwardRef } from 'react'
import { OverlayClose, type OverlayCloseProps } from '../../../overlay/overlay-close'
import { useModalContext } from './modal-context'
import styles from './modal.module.css'

export type ModalCloseProps = OverlayCloseProps

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
