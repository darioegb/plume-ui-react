'use client'

import type { CSSProperties, ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { Children, forwardRef, isValidElement, useContext, useId, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { TreeItemContext, TreeLevelContext, useTreeContext } from './tree-context'
import { TreeItemGroup } from './tree-item-group'
import styles from './tree.module.css'

export interface TreeItemOwnProps {
  disabled?: boolean
  value: string
}

type TreeItemRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'aria-label' | 'children' | 'hidden' | 'id' | 'title'
>

export type TreeItemProps = Omit<ComponentProps, 'index'> &
  TreeItemRootAttributes &
  TreeItemOwnProps

const hasSelectedState = (selection: string): boolean =>
  selection === 'single' || selection === 'multiple'

const isGroup = (child: ReactNode): boolean => isValidElement(child) && child.type === TreeItemGroup

export const TreeItem = forwardRef<HTMLDivElement, TreeItemProps>(
  (
    {
      'aria-label': ariaLabel,
      children,
      className,
      disabled = false,
      style,
      value,
      ...rest
    }: TreeItemProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const tree = useTreeContext('TreeItem')
    const level = useContext(TreeLevelContext) + 1
    const groupId = useId()
    const labelId = useId()
    const nodes = Children.toArray(children)
    const group = nodes.find(isGroup)
    const hasChildren = group !== undefined
    const expanded = hasChildren && tree.expanded.includes(value)
    const selected = tree.selected.includes(value)
    const checked = tree.checkState(value)

    const context = useMemo(
      () => ({ checked, disabled, expanded, groupId, hasChildren, labelId, level }),
      [checked, disabled, expanded, groupId, hasChildren, labelId, level],
    )

    return (
      <TreeItemContext.Provider value={context}>
        <div data-plume-tree-node="">
          <div
            {...rest}
            aria-checked={checked}
            aria-disabled={disabled || undefined}
            aria-expanded={hasChildren ? expanded : undefined}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabel ? undefined : labelId}
            aria-level={level}
            aria-owns={hasChildren ? groupId : undefined}
            aria-selected={hasSelectedState(tree.selection) ? selected : undefined}
            className={joinClasses(tree.isStyled && styles.item, className)}
            data-checked={checked === undefined ? undefined : String(checked)}
            data-expanded={expanded ? '' : undefined}
            data-plume-tree-item=""
            data-plume-tree-value={value}
            data-selected={selected ? '' : undefined}
            onClick={(event) => {
              if (disabled) return
              const onChevron = (event.target as HTMLElement).closest('[data-plume-tree-chevron]')
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
            style={{ '--tree-level': level, ...style } as CSSProperties}
            tabIndex={!disabled && tree.activeValue === value ? 0 : -1}
          >
            {nodes.filter((node) => node !== group)}
          </div>
          {group}
        </div>
      </TreeItemContext.Provider>
    )
  },
)

TreeItem.displayName = 'TreeItem'
