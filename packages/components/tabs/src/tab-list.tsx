import type { Attributes, HTMLAttributes, Ref } from 'react'
import { Children, cloneElement, forwardRef, isValidElement } from 'react'
import styles from './tabs.module.css'
import { useTabs } from './use-tabs'

export type TabListProps = Pick<HTMLAttributes<HTMLDivElement>, 'className' | 'id' | 'children'>

export const TabList = forwardRef<HTMLDivElement, TabListProps>(
  ({ children, ...rest }: TabListProps, ref: Ref<HTMLDivElement>) => {
    const { index, alignmentClass, isStyled, variantClass } = useTabs()

    return (
      <div
        aria-label="Tab List"
        className={`${isStyled ? styles.tablist : ''} ${variantClass} ${alignmentClass}`.trim()}
        ref={ref}
        role="tablist"
        {...rest}
      >
        {Children.map(children, (child, i) => {
          if (isValidElement(child)) {
            return cloneElement(child, { index: i, isActive: i === index } as Attributes)
          }
          return child
        })}
      </div>
    )
  },
)

TabList.displayName = 'TabList'
