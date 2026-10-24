'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useInputContext } from './input-context'
import styles from './input.module.css'

export type InputControlProps = Omit<ComponentProps, 'index'> &
  Pick<HTMLAttributes<HTMLDivElement>, 'children'>

export const InputControl = forwardRef<HTMLDivElement, InputControlProps>(
  (
    { children, className, style }: InputControlProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { isStyled } = useInputContext('InputControl')

    return (
      <div
        className={joinClasses(isStyled && styles.control, className)}
        data-plume-input-control=""
        ref={ref}
        style={style}
      >
        {children}
      </div>
    )
  },
)

InputControl.displayName = 'InputControl'
