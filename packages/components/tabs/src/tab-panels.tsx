import { Children, forwardRef } from 'react'
import type { HTMLAttributes, Ref } from 'react'
import { useTabs } from './use-tabs'

export type TabPanelsProps = Pick<HTMLAttributes<HTMLDivElement>, 'className' | 'id' | 'children'>

export const TabPanels = forwardRef(
  ({ children, ...rest }: TabPanelsProps, ref: Ref<HTMLDivElement>) => {
    const { index } = useTabs()

    return (
      <div ref={ref} {...rest}>
        {Children.map(children, (child, i) => i === index && child)}
      </div>
    )
  },
)

TabPanels.displayName = 'TabPanels'
