'use client'

import type { HTMLAttributes, Ref } from 'react'
import { Children, forwardRef } from 'react'
import { TabIndexContext } from './tab-index-context'
import styles from './tabs.module.css'
import { useTabs } from './use-tabs'

export type TabListProps = Pick<
  HTMLAttributes<HTMLDivElement>,
  'aria-label' | 'aria-labelledby' | 'className' | 'id' | 'children' | 'style'
>

export const TabList = forwardRef<HTMLDivElement, TabListProps>(
  ({ children, ...rest }: TabListProps, ref: Ref<HTMLDivElement>) => {
    const { alignmentClass, isStyled, orientation, variantClass } = useTabs()

    return (
      <div
        aria-orientation={orientation}
        className={`${isStyled ? styles.tablist : ''} ${variantClass} ${alignmentClass}`.trim()}
        ref={ref}
        data-orientation={orientation}
        data-plume-tabs-list=""
        role="tablist"
        {...rest}
      >
        {Children.map(Children.toArray(children), (child, i) => (
          <TabIndexContext.Provider value={i}>{child}</TabIndexContext.Provider>
        ))}
      </div>
    )
  },
)

TabList.displayName = 'TabList'
