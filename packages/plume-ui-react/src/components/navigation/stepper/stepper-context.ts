'use client'

import { createContext, useContext } from 'react'

export type StepperVariant = 'solid' | 'outline' | 'unstyled'
export type StepperOrientation = 'horizontal' | 'vertical'
export type StepStatus = 'completed' | 'current' | 'upcoming'
export type StepperLabels = Record<StepStatus, string>

export interface StepperContextValue {
  activeStep: number
  isStyled: boolean
  labels: StepperLabels
}

export interface StepContextValue {
  index: number
  status: StepStatus
}

export const StepperContext = createContext<StepperContextValue | undefined>(undefined)

export const StepIndexContext = createContext<number | undefined>(undefined)

export const StepContext = createContext<StepContextValue | undefined>(undefined)

export function useStepperContext(part: string): StepperContextValue {
  const context = useContext(StepperContext)
  if (!context) throw new Error(`${part} must be used within a <Stepper>`)
  return context
}

export function useStepContext(part: string): StepContextValue {
  const context = useContext(StepContext)
  if (!context) throw new Error(`${part} must be used within a <Step>`)
  return context
}
