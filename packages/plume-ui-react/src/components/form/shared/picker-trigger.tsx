'use client'

import type { ButtonHTMLAttributes, CSSProperties, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { Button } from '../../interaction/button'
import styles from './picker-trigger.module.css'

export interface PickerTriggerOwnProps {
  className?: string
  controls?: string
  disabled: boolean
  icon: ReactNode
  label: string
  onClick: () => void
  open: boolean
  style?: CSSProperties
  unstyled?: boolean
}

export type PickerTriggerProps = PickerTriggerOwnProps &
  Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'id' | 'title'>

export const PickerTrigger = forwardRef<HTMLButtonElement, PickerTriggerProps>(
  (
    {
      className,
      controls,
      disabled,
      icon,
      label,
      onClick,
      open,
      style,
      unstyled = false,
      ...rest
    }: Readonly<PickerTriggerProps>,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => (
    <Button
      aria-controls={open ? controls : undefined}
      aria-expanded={open}
      aria-haspopup="dialog"
      aria-label={label}
      className={joinClasses(styles.trigger, unstyled && styles.floating, className)}
      data-open={open ? '' : undefined}
      disabled={disabled}
      onClick={onClick}
      ref={ref}
      shape="pill"
      style={style}
      variant="icon"
      {...rest}
    >
      {icon}
    </Button>
  ),
)

PickerTrigger.displayName = 'PickerTrigger'
