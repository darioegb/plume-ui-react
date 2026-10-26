'use client'

import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'
import { useModalContext } from './modal-context'
import styles from './modal.module.css'

type ModalFooterRootAttributes = Pick<HTMLAttributes<HTMLDivElement>, 'children'>

export type ModalFooterProps = Omit<ComponentProps, 'index'> & ModalFooterRootAttributes

/** A row for the actions. */
export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ children, className = '', style }: ModalFooterProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { isStyled } = useModalContext('ModalFooter')
    const classes = [isStyled && styles.footer, className].filter(Boolean).join(' ')

    return (
      <div className={classes} ref={ref} style={style}>
        {children}
      </div>
    )
  },
)

ModalFooter.displayName = 'ModalFooter'
