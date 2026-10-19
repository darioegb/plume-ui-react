import { Children, cloneElement, forwardRef, isValidElement } from 'react'
import type { Attributes, HTMLAttributes, Ref } from 'react'
import { useTabs } from './use-tabs'

export type TabPanelsProps = Pick<HTMLAttributes<HTMLDivElement>, 'className' | 'id' | 'children'>

export const TabPanels = forwardRef(
  ({ children, ...rest }: TabPanelsProps, ref: Ref<HTMLDivElement>) => {
    const { index } = useTabs()

    return (
      <div ref={ref} {...rest}>
        {Children.map(children, (child, i) => {
          if (i !== index) return null
          return isValidElement(child) ? cloneElement(child, { index: i } as Attributes) : child
        })}
      </div>
    )
  },
)

TabPanels.displayName = 'TabPanels'
