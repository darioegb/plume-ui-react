'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { hasPart } from '../../../overlay/has-part'
import type { ComponentProps } from '../../../theme'
import { StepIndicatorContent } from './step-indicator-content'
import { StepIndicatorLabel } from './step-indicator-label'
import { useStepContext, useStepperContext } from './stepper-context'
import styles from './stepper.module.css'

type StepIndicatorRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

const INDICATOR_PARTS = [StepIndicatorContent, StepIndicatorLabel]

export type StepIndicatorProps = Omit<ComponentProps, 'index'> & StepIndicatorRootAttributes

/**
 * The circle. Given no parts it renders a `StepIndicatorContent` (the number, or a check when the
 * step is completed; `children` replaces it, for example with an icon) and a `StepIndicatorLabel`.
 * Given `StepIndicatorContent` or `StepIndicatorLabel` among its children it renders them as
 * written.
 */
export const StepIndicator = forwardRef<HTMLSpanElement, StepIndicatorProps>(
  (
    { children, className, style, ...rest }: StepIndicatorProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled } = useStepperContext('StepIndicator')
    const { status } = useStepContext('StepIndicator')

    return (
      <span
        className={joinClasses(isStyled && styles.indicator, className)}
        data-plume-step-indicator=""
        data-state={status}
        ref={ref}
        style={style}
        {...rest}
      >
        {hasPart(children, INDICATOR_PARTS) ? (
          children
        ) : (
          <>
            <StepIndicatorContent>{children}</StepIndicatorContent>
            <StepIndicatorLabel />
          </>
        )}
      </span>
    )
  },
)

StepIndicator.displayName = 'StepIndicator'
