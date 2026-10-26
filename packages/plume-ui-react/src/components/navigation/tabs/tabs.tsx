import { forwardRef, useId } from 'react'
import type { HTMLAttributes, ForwardedRef, CSSProperties } from 'react'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import { TabsProvider } from './use-tabs'
import styles from './tabs.module.css'

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
   * Renders the selected panel inside `Suspense`, with a Spinner as fallback. Only the selected
   * panel is mounted either way.
   *
   * @default false
   */
  isLazy?: boolean
  /** Called with the index of the newly selected tab. */
  onChange?: (index: number) => void
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

export type TabsVariant = 'underline' | 'rounded' | 'enclosed' | 'segment' | 'unstyled'
export type TabsOrientation = 'horizontal' | 'vertical'
export type TabsAlignment = 'left' | 'center' | 'right'
type TabsRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'hidden' | 'id' | 'tabIndex' | 'children'
>

export type TabsProps = ComponentProps & TabsRootAttributes & TabsOwnProps

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
      children,
      style,
      onChange,
      index = 0,
      alignment = 'left',
      className = '',
      colorScheme = 'secondary',
      orientation = 'horizontal',
      size = 'md',
      variant = 'underline',
      isLazy = false,
      ...rest
    }: TabsProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const generatedId = useId()
    const baseId = rest.id ?? generatedId
    const isStyled = variant !== 'unstyled'
    const tabsClassNames = `${
      orientation !== 'horizontal' || isStyled ? styles[orientation] : ''
    } ${isStyled ? styles.tabs : ''} ${className}`.trim()

    return (
      <TabsProvider
        config={{
          index,
          alignment,
          baseId,
          colorScheme,
          isLazy,
          isStyled,
          orientation,
          size,
          variant,
          onChange,
        }}
      >
        <div
          className={tabsClassNames}
          data-orientation={orientation}
          data-plume-tabs=""
          ref={ref}
          style={tabsColorVars(colorScheme, style)}
          {...rest}
        >
          {children}
        </div>
      </TabsProvider>
    )
  },
)

Tabs.displayName = 'Tabs'
