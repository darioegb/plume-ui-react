'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useTimeColumn } from './time-column-context'
import { useTimePicker } from './use-timepicker'
import styles from './timepicker.module.css'

export interface TimePickerOptionData<T extends number | string = number | string> {
  label: string
  value: T
}

export interface TimePickerOptionOwnProps {
  /** What it shows instead of the label of the option. */
  children?: ReactNode
  /** The option it shows: its `value` and its `label`. */
  option: TimePickerOptionData
}

export type TimePickerOptionProps = Omit<ComponentProps, 'index'> & TimePickerOptionOwnProps

/** One option of a list. It carries the selection and the keyboard model of the list. */
export const TimePickerOption = forwardRef<HTMLButtonElement, TimePickerOptionProps>(
  (
    { children, className, option, style }: TimePickerOptionProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const { variant } = useTimePicker('TimePickerOption')
    const column = useTimeColumn('TimePickerOption')
    const selected = column.isSelected(option.value)

    return (
      <button
        aria-selected={selected}
        className={joinClasses(
          variant !== 'unstyled' && styles.option,
          variant !== 'unstyled' && selected && styles.selected,
          className,
        )}
        data-plume-timepicker-option=""
        data-selected={selected ? '' : undefined}
        onClick={() => {
          column.select(option.value)
        }}
        onFocus={() => {
          column.onFocus(option.value)
        }}
        onKeyDown={column.onKeyDown}
        ref={ref}
        role="option"
        style={style}
        tabIndex={column.isTabStop(option.value) ? 0 : -1}
        type="button"
      >
        {children ?? option.label}
      </button>
    )
  },
)

TimePickerOption.displayName = 'TimePickerOption'
