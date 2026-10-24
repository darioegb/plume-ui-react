'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useSelectContext } from './select-context'
import styles from './select.module.css'

type SelectFieldRootAttributes = Pick<HTMLAttributes<HTMLDivElement>, 'children'>

export type SelectFieldProps = Omit<ComponentProps, 'index'> & SelectFieldRootAttributes

export const SelectField = forwardRef<HTMLDivElement, SelectFieldProps>(
  (
    { children, className, style }: SelectFieldProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { isStyled } = useSelectContext('SelectField')

    return (
      <div
        className={joinClasses(isStyled && styles.field, className)}
        data-plume-select-field=""
        ref={ref}
        style={style}
      >
        {children}
      </div>
    )
  },
)

SelectField.displayName = 'SelectField'
