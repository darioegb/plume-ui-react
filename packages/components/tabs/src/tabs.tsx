import { forwardRef, useState, Suspense, createElement } from 'react'
import type {
  HTMLAttributes,
  ForwardedRef,
  ReactNode,
  CSSProperties,
  LazyExoticComponent,
} from 'react'
import type {
  DefaultColorPalette,
  CustomColorPalette,
  ComponentProps,
  Size,
} from '@plume-ui-react/core'
import { getMergedConfig } from '@plume-ui-react/core'
import { getContrastColor, getLightenColor } from '@plume-ui-react/color-utils'
import { Button } from '@plume-ui-react/button'
import { Spinner } from '@plume-ui-react/spinner'
import { lazyLoadContent } from '@plume-ui-react/lazy-utils'
import styles from './tabs.module.css'

export interface TabsOwnProps {
  activeTab?: number
  alignment?: TabsAlignment
  colorScheme?: DefaultColorPalette | keyof CustomColorPalette
  isLazy?: boolean
  onTabChange?: (index: number) => void
  orientation?: TabsOrientation
  panelList: TabPanel[]
  size?: Size
  tabList: Tab[]
  variant?: TabsVariant
}

export interface Tab {
  label: string
  disabled?: boolean
  extraContent?: ReactNode
  isExtraContentRight?: boolean
}

export interface TabPanel {
  content: ReactNode
}

type TabsVariant = 'underline' | 'rounded' | 'enclosed' | 'segment' | 'unstyled'
type TabsOrientation = 'horizontal' | 'vertical'
type TabsAlignment = 'left' | 'center' | 'right'
type TabsRootAttributes = Pick<HTMLAttributes<HTMLDivElement>, 'hidden' | 'id' | 'tabIndex'>

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
      colorScheme,
      customStyles,
      panelList,
      tabList,
      onTabChange,
      activeTab = 0,
      alignment = 'left',
      customClasses = '',
      orientation = 'horizontal',
      size = 'md',
      variant = 'underline',
      isLazy = false,
      ...rest
    }: TabsProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const [activeTabIndex, setActiveTabIndex] = useState(activeTab)
    const color = (colorScheme && getMergedConfig().colors[colorScheme]) || '#d3d3d3'
    const lightenColor = getLightenColor(color, 20)
    const contrastColor = getContrastColor(color)
    const alignmentClass = alignment !== 'left' || variant !== 'unstyled' ? styles[alignment] : ''
    const orientationClass =
      orientation !== 'horizontal' || variant !== 'unstyled' ? styles[orientation] : ''
    const sizeClass = variant !== 'unstyled' ? styles[size] : ''
    const variantClass = variant !== 'unstyled' ? styles[variant] : ''
    const tabsClass = variant !== 'unstyled' ? styles.tabs : ''

    const tabsClassNames = `${orientationClass} ${tabsClass} ${customClasses}`.trim()

    const handleTabClick = (index: number): void => {
      setActiveTabIndex(index)
      if (onTabChange) {
        onTabChange(index)
      }
    }

    const tabContent = isLazy
      ? lazyLoadContent(panelList[activeTabIndex].content)
      : panelList[activeTabIndex].content

    return (
      <div
        className={tabsClassNames}
        ref={ref}
        style={createTabsStyles(color, contrastColor, lightenColor, customStyles)}
        {...rest}
      >
        <div
          aria-label="Tab List"
          className={`${tabsClass && styles.tablist} ${variantClass} ${alignmentClass}`.trim()}
          role="tablist"
        >
          {tabList.map((tab, index) => (
            <Button
              aria-selected={index === activeTabIndex}
              customClasses={`${tabsClass && styles.tab} ${sizeClass} ${
                index === activeTabIndex ? styles.active : ''
              } ${styles[alignment]}`.trim()}
              disabled={tab.disabled}
              iconLeft={!tab.isExtraContentRight ? tab.extraContent : null}
              iconRight={tab.isExtraContentRight ? tab.extraContent : null}
              key={tab.label}
              label={tab.label}
              onClick={() => {
                handleTabClick(index)
              }}
              role="tab"
              variant="unstyled"
            />
          ))}
        </div>
        <div>
          <div aria-label="Tab Panel" className={tabsClass ? styles.panel : ''} role="tabpanel">
            {isLazy ? (
              <Suspense fallback={<Spinner colorScheme={colorScheme} />}>
                {createElement(tabContent as LazyExoticComponent<() => ReactNode>)}
              </Suspense>
            ) : (
              (tabContent as ReactNode)
            )}
          </div>
        </div>
      </div>
    )
  },
)

Tabs.displayName = 'Tabs'
