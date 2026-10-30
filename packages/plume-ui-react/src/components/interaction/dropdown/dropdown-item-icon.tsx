'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useDropdownContext } from './dropdown-context'
import styles from './dropdown.module.css'

type DropdownItemIconRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export type DropdownItemIconProps = Omit<ComponentProps, 'index'> & DropdownItemIconRootAttributes

/** The decorative icon of an item. It renders nothing without children. */
export const DropdownItemIcon = forwardRef<HTMLSpanElement, DropdownItemIconProps>(
  (
    { children, className, style }: DropdownItemIconProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled } = useDropdownContext('DropdownItemIcon')
    if (!children) return null

    return (
      <span
        aria-hidden="true"
        className={joinClasses(isStyled && styles.icon, className)}
        data-plume-dropdown-item-icon=""
        ref={ref}
        style={style}
      >
        {children}
      </span>
    )
  },
)

DropdownItemIcon.displayName = 'DropdownItemIcon'
