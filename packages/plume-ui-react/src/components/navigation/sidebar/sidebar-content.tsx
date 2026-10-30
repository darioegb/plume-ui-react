'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useSidebarStyle } from './sidebar-context'
import styles from './sidebar.module.css'

type SidebarContentRootAttributes = Pick<
  HTMLAttributes<HTMLElement>,
  'aria-label' | 'aria-labelledby' | 'children' | 'hidden' | 'id' | 'title'
>

export type SidebarContentProps = Omit<ComponentProps, 'index'> & SidebarContentRootAttributes

/** The `<nav>` with the items. */
export const SidebarContent = forwardRef<HTMLElement, SidebarContentProps>(
  (
    { children, className, style, ...rest }: SidebarContentProps,
    ref: ForwardedRef<HTMLElement>,
  ): ReactNode => {
    const { isStyled } = useSidebarStyle('SidebarContent')

    return (
      <nav
        className={joinClasses(isStyled && styles.content, className)}
        data-plume-sidebar-content=""
        ref={ref}
        style={style}
        {...rest}
      >
        {children}
      </nav>
    )
  },
)

SidebarContent.displayName = 'SidebarContent'
