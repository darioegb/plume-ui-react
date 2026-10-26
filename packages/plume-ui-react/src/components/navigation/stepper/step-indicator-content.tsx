'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { CheckIcon } from '../../../overlay/icons'
import type { ComponentProps } from '../../../theme'
import { useStepContext } from './stepper-context'

type StepIndicatorContentRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export type StepIndicatorContentProps = Omit<ComponentProps, 'index'> &
  StepIndicatorContentRootAttributes

/**
 * What is drawn inside the circle: the number, a check when the step is completed, or `children`.
 * It is hidden from screen readers. It has `data-state`.
 */
export const StepIndicatorContent = forwardRef<HTMLSpanElement, StepIndicatorContentProps>(
  (
    { children, className, style, ...rest }: StepIndicatorContentProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { index, status } = useStepContext('StepIndicatorContent')

    return (
      <span
        aria-hidden="true"
        className={className}
        data-plume-step-indicator-content=""
        data-state={status}
        ref={ref}
        style={style}
        {...rest}
      >
        {children ?? (status === 'completed' ? <CheckIcon /> : index + 1)}
      </span>
    )
  },
)

StepIndicatorContent.displayName = 'StepIndicatorContent'
