'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { visuallyHidden } from '../../../overlay/visually-hidden'
import type { ComponentProps } from '../../../theme'
import { useStepContext, useStepperContext } from './stepper-context'

type StepIndicatorLabelRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export type StepIndicatorLabelProps = Omit<ComponentProps, 'index'> &
  StepIndicatorLabelRootAttributes

export const StepIndicatorLabel = forwardRef<HTMLSpanElement, StepIndicatorLabelProps>(
  (
    { children, className, style, ...rest }: StepIndicatorLabelProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { labels } = useStepperContext('StepIndicatorLabel')
    const { status } = useStepContext('StepIndicatorLabel')
    const label = children ?? labels[status]
    if (!label) return null

    return (
      <span
        className={className}
        data-plume-step-indicator-label=""
        data-state={status}
        ref={ref}
        style={{ ...visuallyHidden, ...style }}
        {...rest}
      >
        {label}
      </span>
    )
  },
)

StepIndicatorLabel.displayName = 'StepIndicatorLabel'
