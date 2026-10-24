'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { ChevronRightIcon } from '../../../overlay/icons'
import type { ComponentProps } from '../../../theme'
import { useTreeContext, useTreeItemContext } from './tree-context'
import styles from './tree.module.css'

type TreeItemChevronRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export type TreeItemChevronProps = Omit<ComponentProps, 'index'> & TreeItemChevronRootAttributes

export const TreeItemChevron = forwardRef<HTMLSpanElement, TreeItemChevronProps>(
  (
    { children, className, style }: TreeItemChevronProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled } = useTreeContext('TreeItemChevron')
    const { hasChildren } = useTreeItemContext('TreeItemChevron')

    return (
      <span
        aria-hidden="true"
        className={joinClasses(isStyled && styles.chevron, className)}
        data-plume-tree-chevron=""
        data-visible={hasChildren ? '' : undefined}
        ref={ref}
        style={style}
      >
        {hasChildren ? (children ?? <ChevronRightIcon />) : null}
      </span>
    )
  },
)

TreeItemChevron.displayName = 'TreeItemChevron'
