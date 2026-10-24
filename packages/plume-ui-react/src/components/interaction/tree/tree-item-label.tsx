'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { hasPart } from '../../../overlay/has-part'
import type { ComponentProps } from '../../../theme'
import { useTreeContext, useTreeItemContext } from './tree-context'
import { TreeItemCheckbox } from './tree-item-checkbox'
import { TreeItemChevron } from './tree-item-chevron'
import { TreeItemIcon } from './tree-item-icon'
import styles from './tree.module.css'

export interface TreeItemLabelOwnProps {
  icon?: ReactNode
}

type TreeItemLabelRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children' | 'title'>

export type TreeItemLabelProps = Omit<ComponentProps, 'index'> &
  TreeItemLabelRootAttributes &
  TreeItemLabelOwnProps

const LABEL_PARTS = [TreeItemChevron, TreeItemCheckbox, TreeItemIcon]

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
        {hasPart(children, LABEL_PARTS) ? (
          children
        ) : (
          <>
            <TreeItemChevron />
            <TreeItemCheckbox />
            {icon ? <TreeItemIcon>{icon}</TreeItemIcon> : null}
            {children}
          </>
        )}
      </span>
    )
  },
)

TreeItemLabel.displayName = 'TreeItemLabel'
