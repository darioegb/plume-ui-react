'use client'

import type { HTMLAttributes, LazyExoticComponent, ReactNode } from 'react'
import { Suspense, createElement, forwardRef } from 'react'
import { Spinner } from '../../presentation/spinner'
import { lazyLoadContent } from '../../../utils/lazy'
import type { ComponentProps } from '../../../theme'
import styles from './tabs.module.css'
import { useTabIndex } from './tab-index-context'
import { getPanelId, getTabId, useTabs } from './use-tabs'

export type TabPanelProps = Pick<
  HTMLAttributes<HTMLDivElement>,
  'className' | 'children' | 'style'
> &
  Pick<ComponentProps, 'index'>

export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  ({ children, className = '', index: indexProp, style }, ref) => {
    const { baseId, colorScheme, isLazy, isStyled } = useTabs()
    const index = useTabIndex(indexProp)

    const tabContent = isLazy ? lazyLoadContent(children) : children

    return (
      <div
        aria-labelledby={getTabId(baseId, index)}
        className={`${isStyled ? styles.panel : ''} ${className}`.trim()}
        data-plume-tabs-panel=""
        id={getPanelId(baseId, index)}
        ref={ref}
        role="tabpanel"
        style={style}
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
