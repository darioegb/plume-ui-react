import { forwardRef } from 'react'
import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { Button } from '@plume-ui-react/button'
import type { ComponentProps } from '@plume-ui-react/core'
import styles from './tabs.module.css'
import { useTabs } from './use-tabs'

export interface TabOwnProps {
  label?: string
  isActive?: boolean
  disabled?: boolean
  extraContentLeft?: ReactNode
  extraContentRight?: ReactNode
}

type TabRootAttributes = Pick<HTMLAttributes<HTMLButtonElement>, 'id' | 'children'>

export type TabProps = ComponentProps & TabRootAttributes & TabOwnProps

export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  (
    {
      label,
      isActive,
      disabled,
      extraContentLeft,
      extraContentRight,
      index,
      children,
      className = '',
    }: TabProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    const { alignmentClass, isStyled, sizeClass, setActiveTabIndex, onChange } = useTabs()

    const handleClick = (): void => {
      const tabIndex = index ?? 0
      if (onChange) {
        onChange(tabIndex)
      }
      setActiveTabIndex(tabIndex)
    }

    return (
      <Button
        aria-selected={isActive}
        className={`${isStyled ? styles.tab : ''} ${alignmentClass} ${sizeClass} ${
          isActive && isStyled ? styles.active : ''
        } ${className}`.trim()}
        disabled={disabled}
        iconLeft={extraContentLeft}
        iconRight={extraContentRight}
        index={index}
        key={label}
        label={label ?? ''}
        onClick={handleClick}
        ref={ref}
        role="tab"
        variant="unstyled"
      >
        {children}
      </Button>
    )
  },
)

Tab.displayName = 'Tab'
