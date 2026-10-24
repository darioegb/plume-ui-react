'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useContext } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { SidebarStyleContext, useSidebarContext } from './sidebar-context'
import styles from './sidebar.module.css'

type SidebarBackdropRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'hidden' | 'id' | 'onClick' | 'title'
>

export type SidebarBackdropProps = Omit<ComponentProps, 'index'> & SidebarBackdropRootAttributes

export const SidebarBackdrop = forwardRef<HTMLDivElement, SidebarBackdropProps>(
  (
    { className, onClick, style, ...rest }: SidebarBackdropProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { breakpoint, open, setOpen } = useSidebarContext('SidebarBackdrop')
    const { isStyled } = useContext(SidebarStyleContext)

    return (
      <div
        aria-hidden="true"
        className={joinClasses(isStyled && styles.backdrop, className)}
        data-breakpoint={breakpoint}
        data-open={open ? '' : undefined}
        data-plume-sidebar-backdrop=""
        onClick={(event) => {
          onClick?.(event)
          if (!event.defaultPrevented) setOpen(false)
        }}
        ref={ref}
        style={style}
        {...rest}
      />
    )
  },
)

SidebarBackdrop.displayName = 'SidebarBackdrop'
