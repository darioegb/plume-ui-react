'use client'

import { createContext, useContext } from 'react'

export type CarouselVariant = 'ghost' | 'outline' | 'overlay' | 'solid' | 'unstyled'

export interface CarouselLabels {
  dot: (index: number, count: number) => string
  dots: string
  next: string
  pause: string
  play: string
  previous: string
  slide: (index: number, count: number) => string
}

export interface CarouselContextValue {
  baseId: string
  count: number
  index: number
  isStyled: boolean
  labels: CarouselLabels
  loop: boolean
  next: () => void
  playing: boolean
  prev: () => void
  setCount: (count: number) => void
  setIndex: (index: number) => void
  setPlaying: (playing: boolean) => void
}

export const CarouselContext = createContext<CarouselContextValue | undefined>(undefined)

export const CarouselSlideIndexContext = createContext<number | undefined>(undefined)

export const CarouselDotIndexContext = createContext<number | undefined>(undefined)

export function useCarouselContext(part: string): CarouselContextValue {
  const context = useContext(CarouselContext)
  if (!context) throw new Error(`${part} must be used within a <Carousel>`)
  return context
}

export const getSlideId = (baseId: string, index: number): string => `${baseId}-slide-${index}`
