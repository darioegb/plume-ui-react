'use client'

import type { CSSProperties, ForwardedRef, HTMLAttributes } from 'react'
import { Children, forwardRef, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import {
  StepIndexContext,
  StepperContext,
  type StepperOrientation,
  type StepperVariant,
  type StepStatus,
} from './stepper-context'
import styles from './stepper.module.css'

export interface StepperOwnProps {
  activeStep?: number
  colorScheme?: ColorScheme
  orientation?: StepperOrientation
  size?: Size
  statusLabels?: Partial<Record<StepStatus, string>>
  variant?: StepperVariant
}

type StepperRootAttributes = Pick<
  HTMLAttributes<HTMLOListElement>,
  'aria-label' | 'aria-labelledby' | 'children' | 'hidden' | 'id' | 'title'
>

export type StepperProps = Omit<ComponentProps, 'index'> & StepperRootAttributes & StepperOwnProps

const defaultStatusLabels: Partial<Record<StepStatus, string>> = {
  completed: 'Completed',
  upcoming: 'Not started',
}

const stepperColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--stepper-solid': `var(--plume-color-${colorScheme}-solid)`,
    '--stepper-contrast': `var(--plume-color-${colorScheme}-solid-contrast)`,
    '--stepper-text': `var(--plume-color-${colorScheme}-text)`,
    '--stepper-tint': `var(--plume-color-${colorScheme}-tint)`,
    ...style,
  }) as CSSProperties

export const Stepper = forwardRef<HTMLOListElement, StepperProps>(
  (
    {
      activeStep = 0,
      children,
      className,
      colorScheme = 'primary',
      orientation = 'horizontal',
      size = 'md',
      statusLabels,
      style,
      variant = 'solid',
      ...rest
    }: StepperProps,
    ref: ForwardedRef<HTMLOListElement>,
  ) => {
    const isStyled = variant !== 'unstyled'
    const labels = useMemo(() => ({ ...defaultStatusLabels, ...statusLabels }), [statusLabels])
    const context = useMemo(
      () => ({ activeStep, isStyled, statusLabels: labels }),
      [activeStep, isStyled, labels],
    )

    return (
      <StepperContext.Provider value={context}>
        <ol
          className={joinClasses(
            isStyled && styles.stepper,
            isStyled && styles[variant],
            isStyled && styles[size],
            className,
          )}
          data-orientation={orientation}
          data-plume-stepper=""
          ref={ref}
          style={stepperColorVars(colorScheme, style)}
          {...rest}
        >
          {Children.map(children, (child, index) => (
            <StepIndexContext.Provider value={index}>{child}</StepIndexContext.Provider>
          ))}
        </ol>
      </StepperContext.Provider>
    )
  },
)

Stepper.displayName = 'Stepper'
