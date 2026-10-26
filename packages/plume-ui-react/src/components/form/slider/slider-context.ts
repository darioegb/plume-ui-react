'use client'

import type { CSSProperties, HTMLAttributes, ReactNode, Ref, RefObject } from 'react'
import { createContext, useContext } from 'react'
import type { ColorScheme } from '../../../theme'

export interface SliderMark {
  label?: ReactNode
  value: number
}

export interface SliderLabels {
  thumb: (index: number) => string
}

export type SliderRootAttributes = Pick<
  HTMLAttributes<HTMLElement>,
  'aria-describedby' | 'aria-invalid' | 'aria-label' | 'aria-labelledby' | 'hidden' | 'id' | 'title'
>

export interface SliderContextValue {
  ariaLabel: string | undefined
  commit: () => void
  describedBy: string | undefined
  disabled: boolean
  firstId: string
  formatValue: ((value: number) => string) | undefined
  fractions: number[]
  inputs: RefObject<(HTMLInputElement | null)[]>
  isInvalid: boolean
  isRange: boolean
  isStyled: boolean
  labelledBy: string | undefined
  marks: SliderMark[]
  max: number
  min: number
  name: string | undefined
  orientation: 'horizontal' | 'vertical'
  readOnly: boolean
  rootRef: Ref<HTMLInputElement> | undefined
  step: number
  text: SliderLabels
  update: (index: number, requested: number) => void
  values: number[]
}

export const SliderContext = createContext<SliderContextValue | undefined>(undefined)

export function useSliderContext(part: string): SliderContextValue {
  const context = useContext(SliderContext)
  if (!context) throw new Error(`${part} must be used within a <Slider>`)
  return context
}

export const sliderColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--slider-solid': `var(--plume-color-${colorScheme}-solid)`,
    '--slider-text': `var(--plume-color-${colorScheme}-text)`,
    '--slider-tint': `var(--plume-color-${colorScheme}-tint)`,
    ...style,
  }) as CSSProperties
