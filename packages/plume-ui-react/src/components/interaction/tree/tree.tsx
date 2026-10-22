'use client'

import type { CSSProperties, ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { mergeRefs } from '../../../overlay/trigger'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import { TreeContext, type TreeVariant } from './tree-context'
import { visibleItems } from './tree-navigation'
import styles from './tree.module.css'
import { useTreeKeyboard } from './use-tree-keyboard'
import { useTreeState } from './use-tree-state'

export type { TreeSelection, TreeVariant } from './tree-context'

interface TreeBaseProps {
  cascade?: boolean
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
  selection: 'checkbox' | 'multiple'
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
      cascade = true,
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
    const [activeValue, setActiveValue] = useState<string | undefined>(undefined)
    const isStyled = variant !== 'unstyled'
    const { activate, checkState, expanded, select, selected, toggleExpanded } = useTreeState({
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
    })
    const toggleItem = useCallback(
      (item: string): void => toggleExpanded(item, !expanded.includes(item)),
      [expanded, toggleExpanded],
    )

    const onItemKeyDown = useTreeKeyboard({ activate, expanded, root, select, toggleExpanded })

    useEffect(() => {
      const items = visibleItems(root.current)
      const values = items.map((item) => item.dataset.plumeTreeValue)
      if (activeValue !== undefined && values.includes(activeValue)) return
      const fallback =
        items.find((item) => item.getAttribute('aria-selected') === 'true') ?? items[0]
      setActiveValue(fallback?.dataset.plumeTreeValue)
    }, [activeValue, children, expanded, selected])

    const context = useMemo(
      () => ({
        activate,
        activeValue,
        checkState,
        expanded,
        isStyled,
        onItemKeyDown,
        select,
        selected,
        selection,
        setActive: setActiveValue,
        size,
        toggleExpanded: toggleItem,
      }),
      [
        activate,
        activeValue,
        checkState,
        expanded,
        isStyled,
        onItemKeyDown,
        select,
        selected,
        selection,
        size,
        toggleItem,
      ],
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
