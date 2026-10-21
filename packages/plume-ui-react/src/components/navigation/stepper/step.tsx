'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useContext, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import {
  StepContext,
  StepIndexContext,
  type StepStatus,
  useStepperContext,
} from './stepper-context'
import styles from './stepper.module.css'

type StepRootAttributes = Pick<
  HTMLAttributes<HTMLLIElement>,
  'children' | 'hidden' | 'id' | 'title'
>

export type StepProps = Omit<ComponentProps, 'index'> & StepRootAttributes

const statusOf = (index: number, activeStep: number): StepStatus => {
  if (index < activeStep) return 'completed'
  return index === activeStep ? 'current' : 'upcoming'
}

export const Step = forwardRef<HTMLLIElement, StepProps>(
  (
    { children, className, style, ...rest }: StepProps,
    ref: ForwardedRef<HTMLLIElement>,
  ): ReactNode => {
    const { activeStep, isStyled } = useStepperContext('Step')
    const index = useContext(StepIndexContext)
    if (index === undefined) throw new Error('Step must be used within a <Stepper>')
    const status = statusOf(index, activeStep)
    const context = useMemo(() => ({ index, status }), [index, status])

    return (
      <StepContext.Provider value={context}>
        <li
          aria-current={status === 'current' ? 'step' : undefined}
          className={joinClasses(isStyled && styles.step, className)}
          data-plume-step=""
          data-state={status}
          ref={ref}
          style={style}
          {...rest}
        >
          {children}
        </li>
      </StepContext.Provider>
    )
  },
)

Step.displayName = 'Step'
