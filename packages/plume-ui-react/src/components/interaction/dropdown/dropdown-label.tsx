'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useDropdownContext } from './dropdown-context'
import styles from './dropdown.module.css'

type DropdownLabelRootAttributes = Pick<HTMLAttributes<HTMLDivElement>, 'children' | 'id'>

export type DropdownLabelProps = Omit<ComponentProps, 'index'> & DropdownLabelRootAttributes

/** A heading for the items that follow. It isn't focusable. */
export const DropdownLabel = forwardRef<HTMLDivElement, DropdownLabelProps>(
  (
    { children, className, style, ...rest }: DropdownLabelProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { isStyled } = useDropdownContext('DropdownLabel')
    return (
      <div
        {...rest}
        className={joinClasses(isStyled && styles.groupLabel, className)}
        data-plume-dropdown-label=""
        ref={ref}
        style={style}
      >
        {children}
      </div>
    )
  },
)

DropdownLabel.displayName = 'DropdownLabel'
