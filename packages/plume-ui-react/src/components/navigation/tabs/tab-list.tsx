'use client'

import type { ForwardedRef, HTMLAttributes } from 'react'
import { Children, forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { TabIndexContext, useTabsContext } from './tabs-context'
import styles from './tabs.module.css'

export type TabListProps = Omit<ComponentProps, 'index'> &
  Pick<
    HTMLAttributes<HTMLDivElement>,
    'aria-label' | 'aria-labelledby' | 'children' | 'hidden' | 'id' | 'title'
  >

/** The `tablist` that holds the `Tab` items. It has `data-orientation` and `data-alignment`. */
export const TabList = forwardRef<HTMLDivElement, TabListProps>(
  ({ children, className, ...rest }: TabListProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { alignment, isStyled, orientation, variant } = useTabsContext('TabList')

    return (
      <div
        aria-orientation={orientation}
        className={joinClasses(isStyled && styles[variant], className)}
        data-alignment={alignment}
        data-orientation={orientation}
        data-plume-tabs-list=""
        ref={ref}
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
