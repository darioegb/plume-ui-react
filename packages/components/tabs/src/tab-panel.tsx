import type { HTMLAttributes, LazyExoticComponent, ReactNode } from 'react'
import { Suspense, createElement, forwardRef } from 'react'
import { Spinner } from '@plume-ui-react/spinner'
import { lazyLoadContent } from '@plume-ui-react/lazy-utils'
import styles from './tabs.module.css'
import { useTabs } from './use-tabs'

export type TabPanelProps = Pick<HTMLAttributes<HTMLDivElement>, 'className' | 'id' | 'children'>

export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(({ children }, ref) => {
  const { colorScheme, isLazy, isStyled } = useTabs()

  const tabContent = isLazy ? lazyLoadContent(children) : children

  return (
    <div aria-label="Tab Panel" className={isStyled ? styles.panel : ''} ref={ref} role="tabpanel">
      {isLazy ? (
        <Suspense fallback={<Spinner colorScheme={colorScheme} />}>
          {createElement(tabContent as LazyExoticComponent<() => ReactNode>)}
        </Suspense>
      ) : (
        (tabContent as ReactNode)
      )}
    </div>
  )
})

TabPanel.displayName = 'TabPanel'
