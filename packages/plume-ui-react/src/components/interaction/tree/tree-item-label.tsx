'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { CheckIcon, ChevronRightIcon, MinusIcon } from '../../../overlay/icons'
import type { ComponentProps } from '../../../theme'
import type { TreeCheckState } from './tree-checks'
import { useTreeContext, useTreeItemContext } from './tree-context'
import styles from './tree.module.css'

export interface TreeItemLabelOwnProps {
  icon?: ReactNode
}

type TreeItemLabelRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children' | 'title'>

export type TreeItemLabelProps = Omit<ComponentProps, 'index'> &
  TreeItemLabelRootAttributes &
  TreeItemLabelOwnProps

const checkboxIcon = (checked: TreeCheckState | undefined): ReactNode => {
  if (checked === 'mixed') return <MinusIcon />
  return checked ? <CheckIcon /> : null
}

const checkboxState = (checked: TreeCheckState | undefined): string => {
  if (checked === 'mixed') return 'mixed'
  return checked ? 'checked' : 'unchecked'
}

export const TreeItemLabel = forwardRef<HTMLSpanElement, TreeItemLabelProps>(
  (
    { children, className, icon, style, ...rest }: TreeItemLabelProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled, selection } = useTreeContext('TreeItemLabel')
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
        {selection === 'checkbox' ? (
          <span
            aria-hidden="true"
            className={joinClasses(isStyled && styles.checkbox)}
            data-plume-tree-checkbox=""
            data-state={checkboxState(item.checked)}
          >
            {checkboxIcon(item.checked)}
          </span>
        ) : null}
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
