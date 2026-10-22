'use client'

import type { CSSProperties, ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { mergeRefs } from '../../../overlay/trigger'
import { useSelectionState } from '../../../overlay/use-selection-state'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import { TreeContext, type TreeSelection, type TreeVariant } from './tree-context'
import { visibleItems } from './tree-navigation'
import styles from './tree.module.css'
import { useTreeKeyboard } from './use-tree-keyboard'

export type { TreeSelection, TreeVariant }

interface TreeBaseProps {
  colorScheme?: ColorScheme
  defaultExpanded?: string[]
  expanded?: string[]
  onExpandedChange?: (expanded: string[]) => void
  size?: Size
  variant?: TreeVariant
}

interface TreeSingleProps {
  defaultValue?: string
  onValueChange?: (value: string) => void
  selection?: 'none' | 'single'
  value?: string
}

interface TreeMultipleProps {
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  selection: 'multiple'
  value?: string[]
}

export type TreeOwnProps = TreeBaseProps & (TreeMultipleProps | TreeSingleProps)

type TreeRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'aria-label' | 'aria-labelledby' | 'children' | 'hidden' | 'id' | 'title'
>

export type TreeProps = Omit<ComponentProps, 'index'> & TreeRootAttributes & TreeOwnProps

const treeColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--tree-contrast': `var(--plume-color-${colorScheme}-solid-contrast)`,
    '--tree-hover': `var(--plume-color-${colorScheme}-solid-hover)`,
    '--tree-solid': `var(--plume-color-${colorScheme}-solid)`,
    '--tree-text': `var(--plume-color-${colorScheme}-text)`,
    '--tree-tint': `var(--plume-color-${colorScheme}-tint)`,
    '--tree-tint-text': `var(--plume-color-${colorScheme}-tint-text)`,
    ...style,
  }) as CSSProperties

export const Tree = forwardRef<HTMLDivElement, TreeProps>(
  (
    {
      children,
      className,
      colorScheme = 'primary',
      defaultExpanded,
      defaultValue,
      expanded: expandedProp,
      onExpandedChange,
      onValueChange,
      selection = 'single',
      size = 'md',
      style,
      value,
      variant = 'solid',
      ...rest
    }: TreeProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const root = useRef<HTMLDivElement | null>(null)
    const [activeValue, setActive] = useState<string | undefined>(undefined)
    const isStyled = variant !== 'unstyled'
    const { commit: commitExpanded, selected: expanded } = useSelectionState({
      defaultValue: defaultExpanded,
      multiple: true,
      onValueChange: onExpandedChange,
      value: expandedProp,
    })
    const { commit: commitSelected, selected } = useSelectionState({
      defaultValue,
      multiple: selection === 'multiple',
      onValueChange,
      value,
    })

    const toggleExpanded = useCallback(
      (item: string, expand: boolean): void => {
        const open = expanded.includes(item)
        if (expand === open) return
        commitExpanded(
          expand ? [...expanded, item] : expanded.filter((current) => current !== item),
        )
      },
      [commitExpanded, expanded],
    )

    const select = useCallback(
      (item: string): void => {
        const isSelected = selected.includes(item)
        if (selection === 'single' && !isSelected) commitSelected([item])
        else if (selection === 'multiple') {
          commitSelected(
            isSelected ? selected.filter((current) => current !== item) : [...selected, item],
          )
        }
      },
      [commitSelected, selected, selection],
    )

    const activate = useCallback(
      (item: string, hasChildren: boolean): void => {
        select(item)
        if (hasChildren) toggleExpanded(item, !expanded.includes(item))
      },
      [expanded, select, toggleExpanded],
    )

    const onItemKeyDown = useTreeKeyboard({ activate, expanded, root, select, toggleExpanded })

    useEffect(() => {
      const items = visibleItems(root.current)
      const values = items.map((item) => item.getAttribute('data-plume-tree-value'))
      if (activeValue !== undefined && values.includes(activeValue)) return
      const fallback =
        items.find((item) => item.getAttribute('aria-selected') === 'true') ?? items[0]
      setActive(fallback?.getAttribute('data-plume-tree-value') ?? undefined)
    }, [activeValue, children, expanded, selected])

    const context = useMemo(
      () => ({
        activate,
        activeValue,
        expanded,
        isStyled,
        onItemKeyDown,
        select,
        selected,
        selection,
        setActive,
        size,
      }),
      [activate, activeValue, expanded, isStyled, onItemKeyDown, select, selected, selection, size],
    )

    return (
      <TreeContext.Provider value={context}>
        <div
          aria-multiselectable={selection === 'multiple' ? true : undefined}
          className={joinClasses(
            isStyled && styles.tree,
            isStyled && styles[variant],
            isStyled && styles[size],
            className,
          )}
          data-plume-tree=""
          ref={mergeRefs(ref, root)}
          role="tree"
          style={treeColorVars(colorScheme, style)}
          {...rest}
        >
          {children}
        </div>
      </TreeContext.Provider>
    )
  },
)

Tree.displayName = 'Tree'
