import { forwardRef } from 'react'
import type { HTMLAttributes, ForwardedRef, CSSProperties } from 'react'
import type { ColorPalette, ComponentProps, Size } from '@plume-ui-react/core'
import { getMergedConfig } from '@plume-ui-react/core'
import { getContrastColor, getLightenColor } from '@plume-ui-react/color-utils'
import { TabsProvider } from './use-tabs'
import styles from './tabs.module.css'

export interface TabsOwnProps {
  alignment?: TabsAlignment
  colorScheme?: keyof ColorPalette
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

const createTabsStyles = (
  color: string,
  contrastColor: string,
  lightenColor: string,
  style?: CSSProperties,
): Record<string, unknown> => ({
  '--tabs-scheme': color,
  '--tabs-background-color': lightenColor,
  '--tabs-text-color': contrastColor,

  ...(style ?? {}),
})

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      children,
      colorScheme,
      style,
      onChange,
      index = 0,
      alignment = 'left',
      className = '',
      orientation = 'horizontal',
      size = 'md',
      variant = 'underline',
      isLazy = false,
      ...rest
    }: TabsProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const color = (colorScheme && (getMergedConfig().colors[colorScheme] )) || '#d3d3d3'
    const lightenColor = getLightenColor(color, 20)
    const contrastColor = getContrastColor(color)
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
          style={createTabsStyles(color, contrastColor, lightenColor, style)}
          {...rest}
        >
          {children}
        </div>
      </TabsProvider>
    )
  },
)

Tabs.displayName = 'Tabs'
