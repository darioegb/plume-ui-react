'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'
import { Portal } from '../../../overlay'
import { joinClasses } from '../../../overlay/class-names'
import { mergeRefs } from '../../../overlay/trigger'
import { pickerPanelClasses } from '../shared/picker-panel'
import { TimePickerHours } from './timepicker-hours'
import { TimePickerMinutes } from './timepicker-minutes'
import { TimePickerPeriod } from './timepicker-period'
import { useTimePicker } from './use-timepicker'
import styles from './timepicker.module.css'

export interface TimePickerPanelOwnProps {
  'aria-label'?: string
  children?: ReactNode
}

export type TimePickerPanelProps = Omit<ComponentProps, 'index'> & TimePickerPanelOwnProps

const dialogRole = 'dialog'

const VARIANT_CLASS = {
  filled: 'variantFilled',
  outline: 'variantOutline',
  underline: 'variantUnderline',
} as const

export const TimePickerPanel = forwardRef<HTMLDivElement, TimePickerPanelProps>(
  (
    { 'aria-label': ariaLabel, children, className, style }: TimePickerPanelProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { isPanel, labels, open, panelStyle, setPanel, shape, size, variant } =
      useTimePicker('TimePickerPanel')

    if (!isPanel && !open) return null

    const panel = (
      <div
        aria-label={ariaLabel ?? labels.timePicker}
        className={joinClasses(
          styles.panel,
          pickerPanelClasses(variant, size, shape),
          variant !== 'unstyled' && styles[VARIANT_CLASS[variant]],
          isPanel && styles.inline,
          className,
        )}
        data-open={open ? '' : undefined}
        data-plume-timepicker-panel=""
        ref={mergeRefs<HTMLDivElement>(setPanel, ref)}
        role={dialogRole}
        style={{ ...panelStyle, ...style }}
      >
        {children ?? (
          <>
            <TimePickerHours />
            <TimePickerMinutes />
            <TimePickerPeriod />
          </>
        )}
      </div>
    )

    return isPanel ? panel : <Portal>{panel}</Portal>
  },
)

TimePickerPanel.displayName = 'TimePickerPanel'
