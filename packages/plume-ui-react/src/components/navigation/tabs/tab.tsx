'use client'

import { forwardRef } from 'react'
import type { ForwardedRef, HTMLAttributes, KeyboardEvent, ReactNode } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { Button } from '../../interaction/button'
import type { ComponentProps } from '../../../theme'
import styles from './tabs.module.css'
import { getPanelId, getTabId, useTabIndex, useTabsContext } from './tabs-context'

export interface TabOwnProps {
  /** The text of the tab. */
  label?: string
  /** Disables the tab: it can't be selected and the keyboard skips it. */
  disabled?: boolean
  /** Content shown before the label, such as an icon or a badge. */
  extraContentLeft?: ReactNode
  /** Content shown after the label, such as an icon or a badge. */
  extraContentRight?: ReactNode
  /**
   * The position of the tab, for a tab that is not a direct child of `TabList` (a wrapped one) and
   * so can't be counted. Without it the tabs take their order.
   */
  index?: number
}

type TabRootAttributes = Pick<HTMLAttributes<HTMLButtonElement>, 'children' | 'id' | 'title'>

export type TabProps = Omit<ComponentProps, 'index'> & TabRootAttributes & TabOwnProps

/** The button that selects a panel. It has `data-active` while it is selected. */
export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  (
    {
      className,
      disabled,
      extraContentLeft,
      extraContentRight,
      index: indexProp,
      label,
      ...rest
    }: TabProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    const {
      baseId,
      index: activeIndex,
      isStyled,
      orientation,
      select,
      size,
    } = useTabsContext('Tab')
    const index = useTabIndex('Tab', indexProp)
    const isActive = index === activeIndex
    const [prevKey, nextKey] =
      orientation === 'vertical' ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight']

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
      const tabList = event.currentTarget.closest('[role="tablist"]')
      if (!tabList) return
      const tabs = Array.from(tabList.querySelectorAll<HTMLButtonElement>('[role="tab"]:enabled'))
      const current = tabs.indexOf(event.currentTarget)

      const target = {
        [prevKey]: tabs[(current - 1 + tabs.length) % tabs.length],
        [nextKey]: tabs[(current + 1) % tabs.length],
        Home: tabs[0],
        End: tabs[tabs.length - 1],
      }[event.key]
      if (!target) return

      event.preventDefault()
      target.focus()
      target.click()
    }

    return (
      <Button
        aria-controls={isActive ? getPanelId(baseId, index) : undefined}
        aria-selected={isActive}
        className={joinClasses(isStyled && styles.tab, isStyled && styles[size], className)}
        data-active={isActive ? '' : undefined}
        data-plume-tabs-tab=""
        disabled={disabled}
        iconLeft={extraContentLeft}
        iconRight={extraContentRight}
        id={getTabId(baseId, index)}
        label={label ?? ''}
        onClick={() => select(index)}
        onKeyDown={handleKeyDown}
        ref={ref}
        role="tab"
        tabIndex={isActive ? 0 : -1}
        variant="unstyled"
        {...rest}
      />
    )
  },
)

Tab.displayName = 'Tab'
