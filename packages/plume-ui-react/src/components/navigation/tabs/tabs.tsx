'use client'

import { forwardRef, useId, useMemo } from 'react'
import type { CSSProperties, ForwardedRef, HTMLAttributes } from 'react'
import { useControllableState } from '../../../overlay/use-controllable-state'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import {
  TabsContext,
  type TabsAlignment,
  type TabsOrientation,
  type TabsVariant,
} from './tabs-context'

export interface TabsOwnProps {
  /**
   * Alignment of the Tabs within the container.
   *
   * @default 'left'
   */
  alignment?: TabsAlignment
  /**
   * Color scheme from the theme palette, including custom schemes added to it.
   *
   * @default 'secondary'
   */
  colorScheme?: ColorScheme
  /**
   * The index of the tab that is selected at first, when the Tabs keep their own state.
   *
   * @default 0
   */
  defaultIndex?: number
  /**
   * The index of the selected tab, to control the Tabs. Pair it with `onIndexChange`.
   */
  index?: number
  /**
   * Renders the selected panel inside `Suspense`, with a Spinner as fallback. Only the selected
   * panel is mounted either way.
   *
   * @default false
   */
  lazy?: boolean
  /** Called with the index of the newly selected tab. */
  onIndexChange?: (index: number) => void
  /**
   * Orientation of the Tabs.
   *
   * @default 'horizontal'
   */
  orientation?: TabsOrientation
  /**
   * Size of the Tabs.
   *
   * @default 'md'
   */
  size?: Size
  /**
   * Variant of the Tabs.
   *
   * @default 'underline'
   */
  variant?: TabsVariant
}

type TabsRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'hidden' | 'id' | 'tabIndex' | 'children'
>

export type TabsProps = Omit<ComponentProps, 'index'> & TabsRootAttributes & TabsOwnProps

const tabsColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--tabs-scheme': `var(--plume-color-${colorScheme}-text)`,
    '--tabs-solid': `var(--plume-color-${colorScheme}-solid)`,
    '--tabs-solid-active': `var(--plume-color-${colorScheme}-solid-active)`,
    '--tabs-text-color': `var(--plume-color-${colorScheme}-solid-contrast)`,
    ...style,
  }) as CSSProperties

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      alignment = 'left',
      children,
      className,
      colorScheme = 'secondary',
      defaultIndex = 0,
      index: indexProp,
      lazy = false,
      onIndexChange,
      orientation = 'horizontal',
      size = 'md',
      style,
      variant = 'underline',
      ...rest
    }: TabsProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const generatedId = useId()
    const baseId = rest.id ?? generatedId
    const isStyled = variant !== 'unstyled'
    const [index, select] = useControllableState({
      defaultValue: defaultIndex,
      onChange: onIndexChange,
      value: indexProp,
    })

    const context = useMemo(
      () => ({
        alignment,
        baseId,
        colorScheme,
        index,
        isStyled,
        lazy,
        orientation,
        select,
        size,
        variant,
      }),
      [alignment, baseId, colorScheme, index, isStyled, lazy, orientation, select, size, variant],
    )

    return (
      <TabsContext.Provider value={context}>
        <div
          className={className}
          data-orientation={orientation}
          data-plume-tabs=""
          ref={ref}
          style={tabsColorVars(colorScheme, style)}
          {...rest}
        >
          {children}
        </div>
      </TabsContext.Provider>
    )
  },
)

Tabs.displayName = 'Tabs'
