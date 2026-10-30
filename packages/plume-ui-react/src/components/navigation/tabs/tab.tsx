'use client'

import { forwardRef } from 'react'
import type { ForwardedRef, HTMLAttributes, KeyboardEvent, ReactNode } from 'react'
import { Button } from '../../interaction/button'
import type { ComponentProps } from '../../../theme'
import styles from './tabs.module.css'
import { useTabIndex } from './tab-index-context'
import { getPanelId, getTabId, useTabs } from './use-tabs'

export interface TabOwnProps {
  /** The text of the tab. */
  label?: string
  /** Disables the tab: it can't be selected and the keyboard skips it. */
  disabled?: boolean
  /** Content shown before the label, such as an icon or a badge. */
  extraContentLeft?: ReactNode
  /** Content shown after the label, such as an icon or a badge. */
  extraContentRight?: ReactNode
}

type TabRootAttributes = Pick<HTMLAttributes<HTMLButtonElement>, 'children'>

export type TabProps = ComponentProps & TabRootAttributes & TabOwnProps

/** The button that selects a panel. It has `data-active` while it is selected. */
export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  (
    {
      label,
      disabled,
      extraContentLeft,
      extraContentRight,
      index: indexProp,
      children,
      className = '',
      style,
    }: TabProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    const {
      alignmentClass,
      baseId,
      index: activeIndex,
      isStyled,
      orientation,
      sizeClass,
      setActiveTabIndex,
    } = useTabs()
    const index = useTabIndex(indexProp)
    const isActive = index === activeIndex
    const [prevKey, nextKey] =
      orientation === 'vertical' ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight']

    const handleClick = (): void => {
      setActiveTabIndex(index)
    }

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
        aria-selected={Boolean(isActive)}
        className={`${isStyled ? styles.tab : ''} ${alignmentClass} ${sizeClass} ${
          isActive && isStyled ? styles.active : ''
        } ${className}`.trim()}
        data-active={isActive ? '' : undefined}
        data-plume-tabs-tab=""
        disabled={disabled}
        iconLeft={extraContentLeft}
        iconRight={extraContentRight}
        id={getTabId(baseId, index)}
        label={label ?? ''}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        ref={ref}
        role="tab"
        style={style}
        tabIndex={isActive ? 0 : -1}
        variant="unstyled"
      >
        {children}
      </Button>
    )
  },
)

Tab.displayName = 'Tab'
