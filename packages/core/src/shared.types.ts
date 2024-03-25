import type { CSSProperties } from 'react'

export interface ComponentProps {
  className?: string
  style?: CSSProperties
  index?: number
}

export type Size = 'sm' | 'md' | 'lg'
export type Shape = 'pill' | 'rounded'
