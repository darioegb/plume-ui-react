'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useStepContext, useStepperContext } from './stepper-context'
import styles from './stepper.module.css'

type StepDescriptionRootAttributes = Pick<
  HTMLAttributes<HTMLSpanElement>,
  'children' | 'id' | 'title'
>

export type StepDescriptionProps = Omit<ComponentProps, 'index'> & StepDescriptionRootAttributes

/** A line of detail under the title. */
export const StepDescription = forwardRef<HTMLSpanElement, StepDescriptionProps>(
  (
    { children, className, style, ...rest }: StepDescriptionProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled } = useStepperContext('StepDescription')
    const { status } = useStepContext('StepDescription')

    return (
      <span
        className={joinClasses(isStyled && styles.description, className)}
        data-plume-step-description=""
        data-state={status}
        ref={ref}
        style={style}
        {...rest}
      >
        {children}
      </span>
    )
  },
)

StepDescription.displayName = 'StepDescription'
