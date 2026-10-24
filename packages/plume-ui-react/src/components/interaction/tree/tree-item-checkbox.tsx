'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { CheckIcon, MinusIcon } from '../../../overlay/icons'
import type { ComponentProps } from '../../../theme'
import type { TreeCheckState } from './tree-checks'
import { useTreeContext, useTreeItemContext } from './tree-context'
import styles from './tree.module.css'

type TreeItemCheckboxRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export type TreeItemCheckboxProps = Omit<ComponentProps, 'index'> & TreeItemCheckboxRootAttributes

const checkboxIcon = (checked: TreeCheckState | undefined): ReactNode => {
  if (checked === 'mixed') return <MinusIcon />
  return checked ? <CheckIcon /> : null
}

const checkboxState = (checked: TreeCheckState | undefined): string => {
  if (checked === 'mixed') return 'mixed'
  return checked ? 'checked' : 'unchecked'
}

export const TreeItemCheckbox = forwardRef<HTMLSpanElement, TreeItemCheckboxProps>(
  (
    { children, className, style }: TreeItemCheckboxProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled, selection } = useTreeContext('TreeItemCheckbox')
    const { checked } = useTreeItemContext('TreeItemCheckbox')
    if (selection !== 'checkbox') return null

    return (
      <span
        aria-hidden="true"
        className={joinClasses(isStyled && styles.checkbox, className)}
        data-plume-tree-checkbox=""
        data-state={checkboxState(checked)}
        ref={ref}
        style={style}
      >
        {children ?? checkboxIcon(checked)}
      </span>
    )
  },
)

TreeItemCheckbox.displayName = 'TreeItemCheckbox'
