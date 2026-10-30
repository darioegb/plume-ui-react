'use client'

import { Children, forwardRef } from 'react'
import type { ForwardedRef, HTMLAttributes } from 'react'
import type { ComponentProps } from '../../../theme'
import { TabIndexContext, useTabsContext } from './tabs-context'

export type TabPanelsProps = Omit<ComponentProps, 'index'> &
  Pick<HTMLAttributes<HTMLDivElement>, 'children' | 'hidden' | 'id' | 'title'>

/** The box that holds the `TabPanel` items, one per `Tab` and in the same order. */
export const TabPanels = forwardRef<HTMLDivElement, TabPanelsProps>(
  ({ children, ...rest }: TabPanelsProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { index } = useTabsContext('TabPanels')

    return (
      <div data-plume-tabs-panels="" ref={ref} {...rest}>
        {Children.map(Children.toArray(children), (child, i) =>
          i === index ? (
            <TabIndexContext.Provider value={i}>{child}</TabIndexContext.Provider>
          ) : null,
        )}
      </div>
    )
  },
)

TabPanels.displayName = 'TabPanels'
