'use client'

import type { ReactNode } from 'react'
import { Button } from '../../interaction/button'
import styles from './picker-trigger.module.css'

export interface PickerTriggerProps {
  disabled: boolean
  icon: ReactNode
  label: string
  onClick: () => void
  open: boolean
  unstyled?: boolean
}

export function PickerTrigger({
  disabled,
  icon,
  label,
  onClick,
  open,
  unstyled = false,
}: Readonly<PickerTriggerProps>): ReactNode {
  return (
    <Button
      aria-expanded={open}
      aria-haspopup="dialog"
      aria-label={label}
      className={unstyled ? `${styles.trigger} ${styles.floating}` : styles.trigger}
      disabled={disabled}
      onClick={onClick}
      shape="pill"
      variant="icon"
    >
      {icon}
    </Button>
  )
}
