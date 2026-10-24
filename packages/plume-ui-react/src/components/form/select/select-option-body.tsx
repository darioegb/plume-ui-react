'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useSelectContext } from './select-context'
import styles from './select.module.css'

type SelectOptionBodyRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export type SelectOptionBodyProps = Omit<ComponentProps, 'index'> & SelectOptionBodyRootAttributes

export const SelectOptionBody = forwardRef<HTMLSpanElement, SelectOptionBodyProps>(
  (
    { children, className, style }: SelectOptionBodyProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled } = useSelectContext('SelectOptionBody')

    return (
      <span
        className={joinClasses(isStyled && styles.optionBody, className)}
        data-plume-select-option-body=""
        ref={ref}
        style={style}
      >
        {children}
      </span>
    )
  },
)

SelectOptionBody.displayName = 'SelectOptionBody'
