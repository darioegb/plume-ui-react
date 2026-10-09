import { forwardRef } from 'react'
import type { HTMLAttributes, ForwardedRef, CSSProperties } from 'react'
import type { ColorScheme, ComponentProps, Size } from '@plume-ui-react/core'
import { TabsProvider } from './use-tabs'
import styles from './tabs.module.css'

export interface TabsOwnProps {
  alignment?: TabsAlignment
  colorScheme?: ColorScheme
  isLazy?: boolean
  onChange?: (index: number) => void
  orientation?: TabsOrientation
  size?: Size
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

// Maps the color scheme to the palette CSS variables emitted by <ThemeProvider>.
const tabsColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--tabs-scheme': `var(--plume-color-${colorScheme}-solid)`,
    '--tabs-background-color': `var(--plume-color-${colorScheme}-solid-active)`,
    '--tabs-text-color': `var(--plume-color-${colorScheme}-solid-contrast)`,
    ...(style ?? {}),
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
    const isStyled = variant !== 'unstyled'
    const tabsClassNames = `${
      orientation !== 'horizontal' || isStyled ? styles[orientation] : ''
    } ${isStyled ? styles.tabs : ''} ${className}`.trim()

    return (
      <TabsProvider
        config={{
          index,
          alignment,
          colorScheme,
          isLazy,
          isStyled,
          size,
          variant,
          onChange,
        }}
      >
        <div
          className={tabsClassNames}
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
