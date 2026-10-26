'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useDropdownContext } from './dropdown-context'
import styles from './dropdown.module.css'

type DropdownItemShortcutRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export type DropdownItemShortcutProps = Omit<ComponentProps, 'index'> &
  DropdownItemShortcutRootAttributes

/** The shortcut of an item. It renders nothing without children. */
export const DropdownItemShortcut = forwardRef<HTMLSpanElement, DropdownItemShortcutProps>(
  (
    { children, className, style }: DropdownItemShortcutProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled } = useDropdownContext('DropdownItemShortcut')
    if (!children) return null

    return (
      <span
        className={joinClasses(isStyled && styles.shortcut, className)}
        data-plume-menu-item-shortcut=""
        ref={ref}
        style={style}
      >
        {children}
      </span>
    )
  },
)

DropdownItemShortcut.displayName = 'DropdownItemShortcut'
