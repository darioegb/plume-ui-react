'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'
import { useDropdownContext } from './dropdown-context'
import styles from './dropdown.module.css'

export type DropdownSeparatorProps = Omit<ComponentProps, 'index'>

export const DropdownSeparator = forwardRef<HTMLDivElement, DropdownSeparatorProps>(
  (
    { className = '', style }: DropdownSeparatorProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { isStyled } = useDropdownContext('DropdownSeparator')
    const classes = [isStyled && styles.separator, className].filter(Boolean).join(' ')
    return <div className={classes || undefined} ref={ref} role="separator" style={style} />
  },
)

DropdownSeparator.displayName = 'DropdownSeparator'
