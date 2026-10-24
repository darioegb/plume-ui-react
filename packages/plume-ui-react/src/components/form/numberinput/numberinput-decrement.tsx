import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { NumberInputStepperProps } from './numberinput-stepper'
import { NumberInputStepper } from './numberinput-stepper'

export type NumberInputDecrementProps = NumberInputStepperProps

export const NumberInputDecrement = forwardRef<HTMLButtonElement, NumberInputDecrementProps>(
  (props: NumberInputDecrementProps, ref: ForwardedRef<HTMLButtonElement>): ReactNode => (
    <NumberInputStepper {...props} direction={-1} part="NumberInputDecrement" ref={ref} />
  ),
)

NumberInputDecrement.displayName = 'NumberInputDecrement'
