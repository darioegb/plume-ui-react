'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { Portal } from '../../../overlay'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { ModalBackdropProvider } from './modal-backdrop-context'
import { useModalContext } from './modal-context'
import styles from './modal.module.css'

type ModalBackdropRootAttributes = Pick<HTMLAttributes<HTMLDivElement>, 'children'>

export type ModalBackdropProps = Omit<ComponentProps, 'index'> & ModalBackdropRootAttributes

export const ModalBackdrop = forwardRef<HTMLDivElement, ModalBackdropProps>(
  (
    { children, className, style, ...rest }: ModalBackdropProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { isStyled, open } = useModalContext('ModalBackdrop')

    if (!open) return null

    return (
      <Portal>
        <div
          {...rest}
          className={joinClasses(isStyled && styles.backdrop, className)}
          data-open=""
          data-plume-modal-backdrop=""
          ref={ref}
          style={style}
        >
          <ModalBackdropProvider value>{children}</ModalBackdropProvider>
        </div>
      </Portal>
    )
  },
)

ModalBackdrop.displayName = 'ModalBackdrop'
