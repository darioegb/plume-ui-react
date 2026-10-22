'use client'

import type { KeyboardEvent } from 'react'
import { createContext, useContext } from 'react'
import type { Size } from '../../../theme'

export type TreeSelection = 'multiple' | 'none' | 'single'

export type TreeVariant = 'accent' | 'ghost' | 'solid' | 'unstyled'

export interface TreeContextValue {
  activate: (value: string, hasChildren: boolean) => void
  activeValue: string | undefined
  expanded: readonly string[]
  isStyled: boolean
  onItemKeyDown: (event: KeyboardEvent<HTMLElement>, value: string, hasChildren: boolean) => void
  select: (value: string) => void
  selected: readonly string[]
  selection: TreeSelection
  setActive: (value: string) => void
  size: Size
}

export const TreeContext = createContext<TreeContextValue | undefined>(undefined)

export function useTreeContext(part: string): TreeContextValue {
  const context = useContext(TreeContext)
  if (!context) throw new Error(`${part} must be used within a <Tree>`)
  return context
}

export interface TreeItemContextValue {
  disabled: boolean
  expanded: boolean
  groupId: string
  hasChildren: boolean
  labelId: string
  level: number
}

export const TreeItemContext = createContext<TreeItemContextValue | undefined>(undefined)

export function useTreeItemContext(part: string): TreeItemContextValue {
  const context = useContext(TreeItemContext)
  if (!context) throw new Error(`${part} must be used within a <TreeItem>`)
  return context
}

export const TreeLevelContext = createContext(0)
