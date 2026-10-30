'use client'

import type { ForwardedRef, HTMLAttributes, LazyExoticComponent, ReactNode } from 'react'
import { Suspense, createElement, forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { Spinner } from '../../presentation/spinner'
import { lazyLoadContent } from '../../../utils/lazy'
import type { ComponentProps } from '../../../theme'
import styles from './tabs.module.css'
import { getPanelId, getTabId, useTabIndex, useTabsContext } from './tabs-context'

export interface TabPanelOwnProps {
  /**
   * The position of the panel, for a panel that is not a direct child of `TabPanels` (a wrapped one)
   * and so can't be counted. Without it the panels take their order.
   */
  index?: number
}

type TabPanelRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'hidden' | 'title'
>

export type TabPanelProps = Omit<ComponentProps, 'index'> &
  TabPanelRootAttributes &
  TabPanelOwnProps

/** The content of a tab, shown while its `Tab` is selected. */
export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  (
    { children, className, index: indexProp, ...rest }: TabPanelProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const { baseId, colorScheme, isStyled, lazy } = useTabsContext('TabPanel')
    const index = useTabIndex('TabPanel', indexProp)

    const tabContent = lazy ? lazyLoadContent(children) : children

    return (
      <div
        aria-labelledby={getTabId(baseId, index)}
        className={joinClasses(isStyled && styles.panel, className)}
        data-plume-tabs-panel=""
        id={getPanelId(baseId, index)}
        ref={ref}
        role="tabpanel"
        tabIndex={0}
        {...rest}
      >
        {lazy ? (
          <Suspense fallback={<Spinner colorScheme={colorScheme} />}>
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
