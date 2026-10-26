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
  /**
   * Only with `selection="checkbox"`. Checking a branch checks everything under it, and a branch is
   * checked, unchecked or mixed from the items under it. Items that are disabled keep their state.
   *
   * @default true
   */
  cascade?: boolean
  /**
   * Color scheme from the theme palette, including custom schemes added to it.
   *
   * @default 'primary'
   */
  colorScheme?: ColorScheme
  /** The branches that are open first, when the open state is not controlled. */
  defaultExpanded?: string[]
  /**
   * The `value` of every open branch. Makes the open state controlled: pass `onExpandedChange` to
   * update it.
   */
  expanded?: string[]
  /** Called with the list of open branches when one opens or closes. */
  onExpandedChange?: (expanded: string[]) => void
  /**
   * Size of the text and the rows.
   *
   * @default 'md'
   */
  size?: Size
  /**
   * How the selected item looks. `solid` fills its row with the color, `ghost` tints it and
   * `accent` draws a bar at its start. `unstyled` drops the Plume styles so you can bring your own;
   * the structure and the keyboard keep working.
   *
   * @default 'solid'
   */
  variant?: TreeVariant
}

interface TreeSingleProps {
  defaultValue?: string
  onValueChange?: (value: string) => void
  selection?: 'none' | 'single'
  value?: string
}

interface TreeMultipleProps {
  /** The selected item or items when the selection is not controlled. */
  defaultValue?: string[]
  /**
   * Called with the new selection: a `value`, or a list of them with `selection="multiple"` or
   * `"checkbox"`.
   */
  onValueChange?: (value: string[]) => void
  /**
   * How the items are picked. `single` selects one, `multiple` any number, `checkbox` shows a
   * checkbox on every item (with `aria-checked`), and `none` selects nothing: the tree only opens
   * and closes.
   *
   * @default 'single'
   */
  selection: 'checkbox' | 'multiple'
  /**
   * The `value` of the selected item, or a list of them with `selection="multiple"` or
   * `"checkbox"`. Makes the selection controlled: pass `onValueChange` to update it.
   */
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
