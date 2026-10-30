'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useTreeContext } from './tree-context'
import styles from './tree.module.css'

type TreeItemIconRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export type TreeItemIconProps = Omit<ComponentProps, 'index'> & TreeItemIconRootAttributes

/** The leading icon of the node. It renders nothing without children. */
export const TreeItemIcon = forwardRef<HTMLSpanElement, TreeItemIconProps>(
  (
    { children, className, style }: TreeItemIconProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled } = useTreeContext('TreeItemIcon')
    if (!children) return null

    return (
      <span
        aria-hidden="true"
        className={joinClasses(isStyled && styles.icon, className)}
        data-plume-tree-item-icon=""
        ref={ref}
        style={style}
      >
        {children}
      </span>
    )
  },
)

TreeItemIcon.displayName = 'TreeItemIcon'
