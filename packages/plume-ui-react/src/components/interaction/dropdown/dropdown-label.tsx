'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'
import { useDropdownContext } from './dropdown-context'
import styles from './dropdown.module.css'

type DropdownLabelRootAttributes = Pick<HTMLAttributes<HTMLDivElement>, 'children'>

export type DropdownLabelProps = Omit<ComponentProps, 'index'> & DropdownLabelRootAttributes

export const DropdownLabel = forwardRef<HTMLDivElement, DropdownLabelProps>(
  (
    { children, className = '', style }: DropdownLabelProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { isStyled } = useDropdownContext('DropdownLabel')
    const classes = [isStyled && styles.groupLabel, className].filter(Boolean).join(' ')
    return (
      <div className={classes || undefined} ref={ref} role="presentation" style={style}>
        {children}
      </div>
    )
  },
)

DropdownLabel.displayName = 'DropdownLabel'
