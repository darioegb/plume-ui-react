'use client'

import { Children, forwardRef } from 'react'
import type { HTMLAttributes, Ref } from 'react'
import { TabIndexContext } from './tab-index-context'
import { useTabs } from './use-tabs'

export type TabPanelsProps = Pick<HTMLAttributes<HTMLDivElement>, 'className' | 'id' | 'children'>

export const TabPanels = forwardRef(
  ({ children, ...rest }: TabPanelsProps, ref: Ref<HTMLDivElement>) => {
    const { index } = useTabs()

    return (
      <div ref={ref} {...rest}>
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
