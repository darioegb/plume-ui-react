'use client'

import type { RefObject } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelectionState } from '../../../overlay/use-selection-state'
import {
  checkStateOf,
  expandChecked,
  readStructure,
  toggleChecked,
  type TreeCheckState,
  type TreeStructure,
} from './tree-checks'
import type { TreeSelection } from './tree-context'

interface TreeStateOptions {
  cascade: boolean
  children: unknown
  defaultExpanded?: string[]
  defaultValue?: string | string[]
  expanded?: string[]
  onExpandedChange?: (expanded: string[]) => void
  onValueChange?: (value: never) => void
  root: RefObject<HTMLElement | null>
  selection: TreeSelection
  value?: string | string[]
}

interface TreeState {
  activate: (item: string, hasChildren: boolean) => void
  checkState: (item: string) => TreeCheckState | undefined
  expanded: readonly string[]
  select: (item: string) => void
  selected: readonly string[]
  toggleExpanded: (item: string, expand: boolean) => void
}

export function useTreeState({
  cascade,
  children,
  defaultExpanded,
  defaultValue,
  expanded: expandedProp,
  onExpandedChange,
  onValueChange,
  root,
  selection,
  value,
}: TreeStateOptions): TreeState {
  const isCheckbox = selection === 'checkbox'
  const [structure, setStructure] = useState<TreeStructure>({})
  const { commit: commitExpanded, selected: expanded } = useSelectionState({
    defaultValue: defaultExpanded,
    multiple: true,
    onValueChange: onExpandedChange,
    value: expandedProp,
  })
  const { commit: commitSelected, selected } = useSelectionState({
    defaultValue,
    multiple: selection === 'multiple' || isCheckbox,
    onValueChange,
    value,
  })
  const checked = useMemo(
    () => expandChecked(selected, structure, isCheckbox && cascade),
    [cascade, isCheckbox, selected, structure],
  )

  useEffect(() => {
    if (!isCheckbox || !cascade) return
    const next = readStructure(root.current)
    setStructure((current) => (JSON.stringify(current) === JSON.stringify(next) ? current : next))
  }, [cascade, children, isCheckbox, root])

  const toggleExpanded = useCallback(
    (item: string, expand: boolean): void => {
      if (expand === expanded.includes(item)) return
      commitExpanded(expand ? [...expanded, item] : expanded.filter((current) => current !== item))
    },
    [commitExpanded, expanded],
  )

  const select = useCallback(
    (item: string): void => {
      const isSelected = selected.includes(item)
      if (isCheckbox) commitSelected(toggleChecked(item, checked, structure, cascade))
      else if (selection === 'single' && !isSelected) commitSelected([item])
      else if (selection === 'multiple') {
        commitSelected(
          isSelected ? selected.filter((current) => current !== item) : [...selected, item],
        )
      }
    },
    [cascade, checked, commitSelected, isCheckbox, selected, selection, structure],
  )

  const activate = useCallback(
    (item: string, hasChildren: boolean): void => {
      select(item)
      if (hasChildren && !isCheckbox) toggleExpanded(item, !expanded.includes(item))
    },
    [expanded, isCheckbox, select, toggleExpanded],
  )

  const checkState = useCallback(
    (item: string): TreeCheckState | undefined =>
      isCheckbox ? checkStateOf(item, checked, structure, cascade) : undefined,
    [cascade, checked, isCheckbox, structure],
  )

  return { activate, checkState, expanded, select, selected, toggleExpanded }
}
