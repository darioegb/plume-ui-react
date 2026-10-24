import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { NumberInputStepperProps } from './numberinput-stepper'
import { NumberInputStepper } from './numberinput-stepper'

export type NumberInputIncrementProps = NumberInputStepperProps

export const NumberInputIncrement = forwardRef<HTMLButtonElement, NumberInputIncrementProps>(
  (props: NumberInputIncrementProps, ref: ForwardedRef<HTMLButtonElement>): ReactNode => (
    <NumberInputStepper {...props} direction={1} part="NumberInputIncrement" ref={ref} />
  ),
)

NumberInputIncrement.displayName = 'NumberInputIncrement'
