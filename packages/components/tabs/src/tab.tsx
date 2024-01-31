import { forwardRef } from 'react'
import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { Button } from '@plume-ui-react/button'
import styles from './tabs.module.css'
import { useTabs } from './use-tabs'

export interface TabOwnProps {
  label?: string
  index?: number
  isActive?: boolean
  disabled?: boolean
  isExtraContentRight?: boolean
  extraContent?: ReactNode
}

type TabRootAttributes = Pick<HTMLAttributes<HTMLButtonElement>, 'id' | 'children' | 'className'>

export type TabProps = TabRootAttributes & TabOwnProps

export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  (
    {
      label,
      isActive,
      disabled,
      isExtraContentRight,
      extraContent,
      index,
      children,
      className = '',
    }: TabProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    const { alignmentClass, isStyled, sizeClass, setActiveTabIndex, onChange } = useTabs()

    const handleClick = (): void => {
      const tabIndex = index || 0
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
        iconLeft={!isExtraContentRight ? extraContent : null}
        iconRight={isExtraContentRight ? extraContent : null}
        index={index}
        key={label}
        label={label ?? ''}
        onClick={handleClick}
        ref={ref}
        role="tab"
        variant="unstyled"
      >
        {children ?? null}
      </Button>
    )
  },
)

Tab.displayName = 'Tab'
