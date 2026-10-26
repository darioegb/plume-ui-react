'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'
import { Divider } from '../../presentation/divider'
import { useDropdownContext } from './dropdown-context'
import styles from './dropdown.module.css'

export type DropdownSeparatorProps = Omit<ComponentProps, 'index'>

/** A line between groups of items. */
export const DropdownSeparator = forwardRef<HTMLHRElement, DropdownSeparatorProps>(
  (
    { className = '', style }: DropdownSeparatorProps,
    ref: ForwardedRef<HTMLHRElement>,
  ): ReactNode => {
    const { isStyled } = useDropdownContext('DropdownSeparator')
    const classes = [isStyled && styles.separator, className].filter(Boolean).join(' ')
    return (
      <Divider
        className={classes || undefined}
        ref={ref}
        spacing={isStyled ? 'sm' : undefined}
        style={style}
        variant={isStyled ? 'solid' : 'unstyled'}
      />
    )
  },
)

DropdownSeparator.displayName = 'DropdownSeparator'
