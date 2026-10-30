'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useTreeContext, useTreeItemContext } from './tree-context'
import styles from './tree.module.css'

type TreeItemRowRootAttributes = Pick<HTMLAttributes<HTMLDivElement>, 'children' | 'title'>

export type TreeItemRowProps = Omit<ComponentProps, 'index'> & TreeItemRowRootAttributes

const hasSelectedState = (selection: string): boolean =>
  selection === 'single' || selection === 'multiple'

/**
 * The focusable row of a node, with `role="treeitem"` and its `aria-*` state, around the
 * `TreeItemLabel`. The `TreeItem` renders it around its children; write it yourself to give it a
 * class. It has `data-selected`, `data-expanded`, `data-disabled` and `data-checked`.
 */
export const TreeItemRow = forwardRef<HTMLDivElement, TreeItemRowProps>(
  (
    { children, className, style, ...rest }: TreeItemRowProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const tree = useTreeContext('TreeItemRow')
    const item = useTreeItemContext('TreeItemRow')
    const { checked, disabled, expanded, hasChildren, selected, value } = item

    return (
      <div
        {...rest}
        aria-checked={checked}
        aria-disabled={disabled || undefined}
        aria-expanded={hasChildren ? expanded : undefined}
        aria-label={item.ariaLabel}
        aria-labelledby={item.ariaLabel ? undefined : item.labelId}
        aria-level={item.level}
        aria-owns={hasChildren ? item.groupId : undefined}
        aria-selected={hasSelectedState(tree.selection) ? selected : undefined}
        className={joinClasses(tree.isStyled && styles.row, className)}
        data-checked={checked === undefined ? undefined : String(checked)}
        data-disabled={disabled ? '' : undefined}
        data-expanded={expanded ? '' : undefined}
        data-plume-tree-item-row=""
        data-plume-tree-value={value}
        data-selected={selected ? '' : undefined}
        onClick={(event) => {
          if (disabled) return
          const onChevron = (event.target as HTMLElement).closest(
            '[data-plume-tree-item-chevron]',
          )
          if (onChevron && hasChildren && tree.selection === 'checkbox')
            tree.toggleExpanded(value)
          else tree.activate(value, hasChildren)
        }}
        onFocus={(event) => {
          if (event.target === event.currentTarget) tree.setActive(value)
        }}
        onKeyDown={(event) => {
          if (!disabled) tree.onItemKeyDown(event, value, hasChildren)
        }}
        ref={ref}
        role="treeitem"
        style={style}
        tabIndex={!disabled && tree.activeValue === value ? 0 : -1}
      >
        {children}
      </div>
    )
  },
)

TreeItemRow.displayName = 'TreeItemRow'
