'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useStepContext, useStepperContext } from './stepper-context'
import styles from './stepper.module.css'

type StepTitleRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children' | 'id' | 'title'>

export type StepTitleProps = Omit<ComponentProps, 'index'> & StepTitleRootAttributes

export const StepTitle = forwardRef<HTMLSpanElement, StepTitleProps>(
  (
    { children, className, style, ...rest }: StepTitleProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled } = useStepperContext('StepTitle')
    const { status } = useStepContext('StepTitle')

    return (
      <span
        className={joinClasses(isStyled && styles.title, className)}
        data-plume-step-title=""
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

StepTitle.displayName = 'StepTitle'
