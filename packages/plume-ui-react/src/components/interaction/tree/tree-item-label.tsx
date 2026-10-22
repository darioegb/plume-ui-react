'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { ChevronRightIcon } from '../../../overlay/icons'
import type { ComponentProps } from '../../../theme'
import { useTreeContext, useTreeItemContext } from './tree-context'
import styles from './tree.module.css'

export interface TreeItemLabelOwnProps {
  icon?: ReactNode
}

type TreeItemLabelRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children' | 'title'>

export type TreeItemLabelProps = Omit<ComponentProps, 'index'> &
  TreeItemLabelRootAttributes &
  TreeItemLabelOwnProps

export const TreeItemLabel = forwardRef<HTMLSpanElement, TreeItemLabelProps>(
  (
    { children, className, icon, style, ...rest }: TreeItemLabelProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled } = useTreeContext('TreeItemLabel')
    const item = useTreeItemContext('TreeItemLabel')

    return (
      <span
        className={joinClasses(isStyled && styles.label, className)}
        data-plume-tree-label=""
        id={item.labelId}
        ref={ref}
        style={style}
        {...rest}
      >
        <span
          aria-hidden="true"
          className={joinClasses(isStyled && styles.chevron)}
          data-plume-tree-chevron=""
          data-visible={item.hasChildren ? '' : undefined}
        >
          {item.hasChildren ? <ChevronRightIcon /> : null}
        </span>
        {icon ? (
          <span aria-hidden="true" className={joinClasses(isStyled && styles.icon)}>
            {icon}
          </span>
        ) : null}
        {children}
      </span>
    )
  },
)

TreeItemLabel.displayName = 'TreeItemLabel'
