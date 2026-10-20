'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef, useId } from 'react'
import type { ComponentProps } from '../../../theme'
import { useSelectContext } from './select-context'
import styles from './select.module.css'

export interface SelectGroupOwnProps {
  children?: ReactNode
  label: ReactNode
  labelClassName?: string
}

export type SelectGroupProps = Omit<ComponentProps, 'index'> & SelectGroupOwnProps

export const SelectGroup = forwardRef<HTMLDivElement, SelectGroupProps>(
  (
    { children, className = '', label, labelClassName = '', style }: SelectGroupProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { isStyled } = useSelectContext('SelectGroup')
    const labelId = useId()
    const classes = [isStyled && styles.group, className].filter(Boolean).join(' ')

    return (
      <div
        aria-labelledby={labelId}
        className={classes || undefined}
        ref={ref}
        role="group"
        style={style}
      >
        <div
          className={
            [isStyled && styles.groupLabel, labelClassName].filter(Boolean).join(' ') || undefined
          }
          id={labelId}
          role="presentation"
        >
          {label}
        </div>
        {children}
      </div>
    )
  },
)

SelectGroup.displayName = 'SelectGroup'
