import { forwardRef } from 'react'
import type { ForwardedRef, HTMLAttributes, KeyboardEvent, ReactNode } from 'react'
import { Button } from '../../interaction/button'
import type { ComponentProps } from '../../../theme'
import styles from './tabs.module.css'
import { getPanelId, getTabId, useTabs } from './use-tabs'

export interface TabOwnProps {
  label?: string
  isActive?: boolean
  disabled?: boolean
  extraContentLeft?: ReactNode
  extraContentRight?: ReactNode
}

type TabRootAttributes = Pick<HTMLAttributes<HTMLButtonElement>, 'children'>

export type TabProps = ComponentProps & TabRootAttributes & TabOwnProps

export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  (
    {
      label,
      isActive,
      disabled,
      extraContentLeft,
      extraContentRight,
      index = 0,
      children,
      className = '',
    }: TabProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    const { alignmentClass, baseId, isStyled, orientation, sizeClass, setActiveTabIndex, onChange } =
      useTabs()
    const [prevKey, nextKey] =
      orientation === 'vertical' ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight']

    const handleClick = (): void => {
      if (onChange) {
        onChange(index)
      }
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
        disabled={disabled}
        iconLeft={extraContentLeft}
        iconRight={extraContentRight}
        id={getTabId(baseId, index)}
        label={label ?? ''}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        ref={ref}
        role="tab"
        tabIndex={isActive ? 0 : -1}
        variant="unstyled"
      >
        {children}
      </Button>
    )
  },
)

Tab.displayName = 'Tab'
