'use client'

import type { CSSProperties, ForwardedRef, HTMLAttributes } from 'react'
import { Children, forwardRef, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { useLabels } from '../../../locale/locale-provider'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import {
  StepIndexContext,
  StepperContext,
  type StepperLabels,
  type StepperOrientation,
  type StepperVariant,
} from './stepper-context'
import styles from './stepper.module.css'

export interface StepperOwnProps {
  /**
   * Index of the current step, starting at 0. The steps before it are completed and the ones after
   * it are upcoming. An index past the last step completes all of them.
   *
   * @default 0
   */
  activeStep?: number
  /**
   * Color scheme from the theme palette, including custom schemes added to it. It colors the
   * completed and the current steps.
   *
   * @default 'primary'
   */
  colorScheme?: ColorScheme
  /**
   * The text a screen reader says for each status. Pass only the ones you want to change; use an
   * empty string to say nothing for a status.
   */
  labels?: Partial<StepperLabels>
  /**
   * Whether the steps go in a row or in a column.
   *
   * @default 'horizontal'
   */
  orientation?: StepperOrientation
  /**
   * Size of the Stepper.
   *
   * @default 'md'
   */
  size?: Size
  /**
   * Visual variant. `solid` fills the indicators of the completed and current steps, `outline` only
   * draws their border. `unstyled` drops the Plume styles so you can bring your own; the layout and
   * the hidden last separator keep working.
   *
   * @default 'solid'
   */
  variant?: StepperVariant
}

type StepperRootAttributes = Pick<
  HTMLAttributes<HTMLOListElement>,
  'aria-label' | 'aria-labelledby' | 'children' | 'hidden' | 'id' | 'title'
>

export type StepperProps = Omit<ComponentProps, 'index'> & StepperRootAttributes & StepperOwnProps

const DEFAULT_LABELS: StepperLabels = {
  completed: 'Completed',
  current: '',
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
      labels,
      orientation = 'horizontal',
      size = 'md',
      style,
      variant = 'solid',
      ...rest
    }: StepperProps,
    ref: ForwardedRef<HTMLOListElement>,
  ) => {
    const isStyled = variant !== 'unstyled'
    const mergedLabels = useLabels('stepper', DEFAULT_LABELS, labels)
    const context = useMemo(
      () => ({ activeStep, isStyled, labels: mergedLabels }),
      [activeStep, isStyled, mergedLabels],
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
