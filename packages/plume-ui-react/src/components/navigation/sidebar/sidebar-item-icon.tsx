'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useContext } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { SidebarStyleContext } from './sidebar-context'
import styles from './sidebar.module.css'

export type SidebarItemIconProps = Omit<ComponentProps, 'index'> &
  Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export const SidebarItemIcon = forwardRef<HTMLSpanElement, SidebarItemIconProps>(
  (
    { children, className, style }: SidebarItemIconProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled } = useContext(SidebarStyleContext)

    return (
      <span
        aria-hidden="true"
        className={joinClasses(isStyled && styles.icon, className)}
        data-plume-sidebar-item-icon=""
        ref={ref}
        style={style}
      >
        {children}
      </span>
    )
  },
)

SidebarItemIcon.displayName = 'SidebarItemIcon'
