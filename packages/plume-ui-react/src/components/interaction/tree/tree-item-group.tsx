'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'
import { Collapse } from '../../utility/collapse'
import { TreeLevelContext, useTreeItemContext } from './tree-context'

type TreeItemGroupRootAttributes = Pick<HTMLAttributes<HTMLElement>, 'children' | 'title'>

export type TreeItemGroupProps = Omit<ComponentProps, 'index'> & TreeItemGroupRootAttributes

/**
 * The children of a branch: more `TreeItem`s. It opens and closes with a height animation. It must
 * be a direct child of the `TreeItem`.
 */
export const TreeItemGroup = forwardRef<HTMLElement, TreeItemGroupProps>(
  (
    { children, className, style, ...rest }: TreeItemGroupProps,
    ref: ForwardedRef<HTMLElement>,
  ): ReactNode => {
    const item = useTreeItemContext('TreeItemGroup')

    return (
      <Collapse
        className={className}
        data-plume-tree-item-group=""
        id={item.groupId}
        open={item.expanded}
        ref={ref}
        role="group"
        style={style}
        variant="unstyled"
        {...rest}
      >
        <TreeLevelContext.Provider value={item.level}>{children}</TreeLevelContext.Provider>
      </Collapse>
    )
  },
)

TreeItemGroup.displayName = 'TreeItemGroup'
