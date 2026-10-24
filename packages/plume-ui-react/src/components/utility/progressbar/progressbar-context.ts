'use client'

import type { CSSProperties, HTMLAttributes, Ref } from 'react'
import { createContext, useContext } from 'react'
import type { ColorScheme, Shape, Size } from '../../../theme'

export type ProgressBarVariant = 'solid' | 'striped' | 'unstyled'

export type ProgressBarTrackAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'aria-label' | 'aria-labelledby' | 'hidden' | 'id' | 'title'
>

export interface ProgressBarContextValue {
  animated: boolean
  current: number
  formatValue: (value: number, max: number) => string
  indeterminate: boolean
  isStyled: boolean
  percent: number
  shape: Shape
  size: Size
  total: number
  trackProps: ProgressBarTrackAttributes
  trackRef: Ref<HTMLDivElement>
  valueText?: string
  variant: ProgressBarVariant
}

export const ProgressBarContext = createContext<ProgressBarContextValue | undefined>(undefined)

export function useProgressBarContext(part: string): ProgressBarContextValue {
  const context = useContext(ProgressBarContext)
  if (!context) throw new Error(`${part} must be used within a <ProgressBar>`)
  return context
}

export const progressBarColorVars = (
  colorScheme: ColorScheme,
  style?: CSSProperties,
): CSSProperties =>
  ({
    '--progressbar-solid': `var(--plume-color-${colorScheme}-solid)`,
    ...style,
  }) as CSSProperties
