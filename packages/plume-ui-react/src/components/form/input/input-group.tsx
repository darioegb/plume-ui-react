'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useInputContext } from './input-context'
import styles from './input.module.css'

export type InputGroupProps = Omit<ComponentProps, 'index'> &
  Pick<HTMLAttributes<HTMLDivElement>, 'children'>

/**
 * The wrapper `Input` renders around its parts. Its `className` and `style` are the ones of the `Input`.
 */
export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
  (
    { children, className, style }: InputGroupProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { disabled, invalid, isStyled } = useInputContext('InputGroup')

    return (
      <div
        className={joinClasses(isStyled && styles.inputGroup, className)}
        data-disabled={disabled ? '' : undefined}
        data-invalid={invalid ? '' : undefined}
        data-plume-input-group=""
        ref={ref}
        style={style}
      >
        {children}
      </div>
    )
  },
)

InputGroup.displayName = 'InputGroup'
