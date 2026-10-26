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
  /** Accessible name of the panel. By default it is `labels.timePicker`. */
  'aria-label'?: string
  /** The lists of the panel, in the order they should appear. */
  children?: ReactNode
}

export type TimePickerPanelProps = Omit<ComponentProps, 'index'> & TimePickerPanelOwnProps

const dialogRole = 'dialog'

const VARIANT_CLASS = {
  filled: 'variantFilled',
  outline: 'variantOutline',
  underline: 'variantUnderline',
} as const

/**
 * The popup, or the page content when the picker is `isPanel`. Given no children it holds the
 * hours, the minutes and, with `hour12`, the period.
 */
export const TimePickerPanel = forwardRef<HTMLDivElement, TimePickerPanelProps>(
  (
    { 'aria-label': ariaLabel, children, className, style }: TimePickerPanelProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { isPanel, labels, open, panelId, panelStyle, setPanel, shape, size, variant } =
      useTimePicker('TimePickerPanel')

    if (!isPanel && !open) return null

    const panel = (
      <div
        aria-label={ariaLabel ?? labels.timePicker}
        aria-modal={isPanel ? undefined : true}
        className={joinClasses(
          styles.panel,
          pickerPanelClasses(variant, size, shape),
          variant !== 'unstyled' && styles[VARIANT_CLASS[variant]],
          isPanel && styles.inline,
          className,
        )}
        data-open={open ? '' : undefined}
        data-plume-timepicker-panel=""
        id={isPanel ? undefined : panelId}
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
