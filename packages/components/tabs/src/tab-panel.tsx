import type { HTMLAttributes, LazyExoticComponent, ReactNode } from 'react'
import { Suspense, createElement, forwardRef } from 'react'
import { Spinner } from '@plume-ui-react/spinner'
import { lazyLoadContent } from '@plume-ui-react/lazy-utils'
import type { ComponentProps } from '@plume-ui-react/core'
import styles from './tabs.module.css'
import { getPanelId, getTabId, useTabs } from './use-tabs'

export type TabPanelProps = Pick<HTMLAttributes<HTMLDivElement>, 'className' | 'children'> &
  Pick<ComponentProps, 'index'>

export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  ({ children, className = '', index = 0 }, ref) => {
    const { baseId, colorScheme, isLazy, isStyled } = useTabs()

    const tabContent = isLazy ? lazyLoadContent(children) : children

    return (
      <div
        aria-labelledby={getTabId(baseId, index)}
        className={`${isStyled ? styles.panel : ''} ${className}`.trim()}
        id={getPanelId(baseId, index)}
        ref={ref}
        role="tabpanel"
        tabIndex={0}
      >
        {isLazy ? (
          <Suspense fallback={<Spinner color={colorScheme} />}>
            {createElement(tabContent as LazyExoticComponent<() => ReactNode>)}
          </Suspense>
        ) : (
          (tabContent as ReactNode)
        )}
      </div>
    )
  },
)

TabPanel.displayName = 'TabPanel'
