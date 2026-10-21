'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useStepContext, useStepperContext } from './stepper-context'
import styles from './stepper.module.css'

export type StepSeparatorProps = Omit<ComponentProps, 'index'>

export const StepSeparator = forwardRef<HTMLSpanElement, StepSeparatorProps>(
  (
    { className, style, ...rest }: StepSeparatorProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled } = useStepperContext('StepSeparator')
    const { status } = useStepContext('StepSeparator')

    return (
      <span
        aria-hidden="true"
        className={joinClasses(isStyled && styles.separator, className)}
        data-plume-step-separator=""
        data-state={status}
        ref={ref}
        style={style}
        {...rest}
      />
    )
  },
)

StepSeparator.displayName = 'StepSeparator'
