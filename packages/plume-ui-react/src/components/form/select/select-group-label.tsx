'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useSelectContext } from './select-context'
import { useSelectGroupContext } from './select-group-context'
import styles from './select.module.css'

type SelectGroupLabelRootAttributes = Pick<HTMLAttributes<HTMLDivElement>, 'children'>

export type SelectGroupLabelProps = Omit<ComponentProps, 'index'> & SelectGroupLabelRootAttributes

export const SelectGroupLabel = forwardRef<HTMLDivElement, SelectGroupLabelProps>(
  (
    { children, className, style }: SelectGroupLabelProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { isStyled } = useSelectContext('SelectGroupLabel')
    const { labelId } = useSelectGroupContext('SelectGroupLabel')

    return (
      <div
        className={joinClasses(isStyled && styles.groupLabel, className)}
        data-plume-select-group-label=""
        id={labelId}
        ref={ref}
        style={style}
      >
        {children}
      </div>
    )
  },
)

SelectGroupLabel.displayName = 'SelectGroupLabel'
