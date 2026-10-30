'use client'

import type { CSSProperties, ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { Children, forwardRef, isValidElement, useContext, useId, useMemo } from 'react'
import { hasPart } from '../../../overlay/has-part'
import type { ComponentProps } from '../../../theme'
import { TreeItemContext, TreeLevelContext, useTreeContext } from './tree-context'
import { TreeItemGroup } from './tree-item-group'
import { TreeItemRow } from './tree-item-row'

export interface TreeItemOwnProps {
  /**
   * Disables the node: it can't be selected, expanded or focused with the keyboard.
   *
   * @default false
   */
  disabled?: boolean
  /**
   * The id of the node. It is what `value`, `defaultValue` and `expanded` of the `Tree` refer to.
   */
  value: string
}

type TreeItemRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'aria-label' | 'children' | 'hidden' | 'id' | 'title'
>

export type TreeItemProps = Omit<ComponentProps, 'index'> &
  TreeItemRootAttributes &
  TreeItemOwnProps

const isGroup = (child: ReactNode): boolean => isValidElement(child) && child.type === TreeItemGroup

/**
 * One node: a `TreeItemRow` (the `treeitem`, which it renders around its other children) and, for
 * a branch, a `TreeItemGroup`. Put a `TreeItemLabel` and the group as its direct children, or a
 * `TreeItemRow` with the label inside and the group after it. `aria-label` names the row. It has
 * `data-selected`, `data-expanded`, `data-disabled` and `data-checked`, and sets `--tree-level`.
 */
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
      () => ({
        ariaLabel,
        checked,
        disabled,
        expanded,
        groupId,
        hasChildren,
        labelId,
        level,
        selected,
        value,
      }),
      [ariaLabel, checked, disabled, expanded, groupId, hasChildren, labelId, level, selected, value],
    )

    return (
      <TreeItemContext.Provider value={context}>
        <div
          {...rest}
          className={className}
          data-checked={checked === undefined ? undefined : String(checked)}
          data-disabled={disabled ? '' : undefined}
          data-expanded={expanded ? '' : undefined}
          data-plume-tree-item=""
          data-selected={selected ? '' : undefined}
          ref={ref}
          style={{ '--tree-level': level, ...style } as CSSProperties}
        >
          {hasPart(children, [TreeItemRow]) ? (
            children
          ) : (
            <>
              <TreeItemRow>{nodes.filter((node) => node !== group)}</TreeItemRow>
              {group}
            </>
          )}
        </div>
      </TreeItemContext.Provider>
    )
  },
)

TreeItem.displayName = 'TreeItem'
