'use client'

import type { ButtonHTMLAttributes, ForwardedRef, ReactNode } from 'react'
import { forwardRef, useContext } from 'react'
import { ClockIcon } from '../../../overlay/icons'
import type { ComponentProps } from '../../../theme'
import { InputContext } from '../input/input-context'
import { PickerTrigger } from '../shared/picker-trigger'
import { useTimePickerContext } from './timepicker-context'

export interface TimePickerTriggerOwnProps {
  /** Another icon for the button. */
  children?: ReactNode
}

type TimePickerTriggerRootAttributes = Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-label' | 'disabled' | 'id' | 'title'
>

export type TimePickerTriggerProps = Omit<ComponentProps, 'index'> &
  TimePickerTriggerRootAttributes &
  TimePickerTriggerOwnProps

/**
 * The button that opens and closes the panel. It is disabled with its `TimePickerInput`, or on its
 * own.
 */
export const TimePickerTrigger = forwardRef<HTMLButtonElement, TimePickerTriggerProps>(
  (
    {
      'aria-label': ariaLabel,
      children,
      className,
      disabled,
      id,
      style,
      title,
    }: TimePickerTriggerProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const { labels, open, panelId, toggle, variant } = useTimePickerContext('TimePickerTrigger')
    const input = useContext(InputContext)
    const blocked = Boolean(disabled ?? (input?.disabled || input?.readOnly))

    return (
      <PickerTrigger
        className={className}
        controls={panelId}
        data-plume-timepicker-trigger=""
        disabled={blocked}
        icon={children ?? <ClockIcon />}
        id={id}
        label={ariaLabel ?? labels.openTimePicker}
        onClick={toggle}
        open={open}
        ref={ref}
        style={style}
        title={title}
        unstyled={variant === 'unstyled'}
      />
    )
  },
)

TimePickerTrigger.displayName = 'TimePickerTrigger'
