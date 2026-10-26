'use client'

import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'

export type RatingItemState = 'empty' | 'full' | 'half'

export interface RatingLabels {
  item: (value: number, max: number) => string
  readOnly: (value: number, max: number) => string
}

export interface RatingContextValue {
  allowHalf: boolean
  clearable: boolean
  filledIcon: ReactNode
  isStyled: boolean
  labels: RatingLabels
  max: number
  name: string
  outlineIcon: ReactNode
  preview: number
  readOnly: boolean
  setHover: (value: number | undefined) => void
  setValue: (value: number) => void
  value: number
}

export const RatingContext = createContext<RatingContextValue | undefined>(undefined)

export function useRatingContext(part: string): RatingContextValue {
  const context = useContext(RatingContext)
  if (!context) throw new Error(`${part} must be used within a <Rating>`)
  return context
}

export interface RatingItemContextValue {
  position: number
  state: RatingItemState
}

export const RatingItemContext = createContext<RatingItemContextValue | undefined>(undefined)

export function useRatingItemContext(part: string): RatingItemContextValue {
  const context = useContext(RatingItemContext)
  if (!context) throw new Error(`${part} must be used within a <RatingItem>`)
  return context
}

export const itemState = (position: number, value: number): RatingItemState => {
  if (value >= position) return 'full'
  return value >= position - 0.5 ? 'half' : 'empty'
}
