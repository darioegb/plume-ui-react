'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useContext } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { SidebarStyleContext } from './sidebar-context'
import styles from './sidebar.module.css'

export type SidebarItemLabelProps = Omit<ComponentProps, 'index'> &
  Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

/**
 * The text of an item. In the rail it is hidden visually and stays in the page for screen readers.
 */
export const SidebarItemLabel = forwardRef<HTMLSpanElement, SidebarItemLabelProps>(
  (
    { children, className, style }: SidebarItemLabelProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled } = useContext(SidebarStyleContext)

    return (
      <span
        className={joinClasses(isStyled && styles.label, className)}
        data-plume-sidebar-item-label=""
        ref={ref}
        style={style}
      >
        {children}
      </span>
    )
  },
)

SidebarItemLabel.displayName = 'SidebarItemLabel'
