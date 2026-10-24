'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { CheckIcon } from '../../../overlay/icons'
import { visuallyHidden } from '../../../overlay/visually-hidden'
import type { ComponentProps } from '../../../theme'
import { useStepContext, useStepperContext } from './stepper-context'
import styles from './stepper.module.css'

type StepIndicatorRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export type StepIndicatorProps = Omit<ComponentProps, 'index'> & StepIndicatorRootAttributes

export const StepIndicator = forwardRef<HTMLSpanElement, StepIndicatorProps>(
  (
    { children, className, style, ...rest }: StepIndicatorProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled, labels } = useStepperContext('StepIndicator')
    const { index, status } = useStepContext('StepIndicator')
    const label = labels[status]

    return (
      <span
        className={joinClasses(isStyled && styles.indicator, className)}
        data-plume-step-indicator=""
        data-state={status}
        ref={ref}
        style={style}
        {...rest}
      >
        <span aria-hidden="true" data-plume-step-indicator-content="">
          {children ?? (status === 'completed' ? <CheckIcon /> : index + 1)}
        </span>
        {label ? <span style={visuallyHidden}>{label}</span> : null}
      </span>
    )
  },
)

StepIndicator.displayName = 'StepIndicator'
