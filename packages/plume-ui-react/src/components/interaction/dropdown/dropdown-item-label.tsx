'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useDropdownContext } from './dropdown-context'
import styles from './dropdown.module.css'

type DropdownItemLabelRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export type DropdownItemLabelProps = Omit<ComponentProps, 'index'> & DropdownItemLabelRootAttributes

/** The text of an item. */
export const DropdownItemLabel = forwardRef<HTMLSpanElement, DropdownItemLabelProps>(
  (
    { children, className, style }: DropdownItemLabelProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled } = useDropdownContext('DropdownItemLabel')

    return (
      <span
        className={joinClasses(isStyled && styles.label, className)}
        data-plume-dropdown-item-label=""
        ref={ref}
        style={style}
      >
        {children}
      </span>
    )
  },
)

DropdownItemLabel.displayName = 'DropdownItemLabel'
