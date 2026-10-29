'use client'

import { createContext, useContext } from 'react'

export type CarouselVariant = 'overlay' | 'solid' | 'unstyled'

export type CarouselOrientation = 'horizontal' | 'vertical'

export type CarouselControls = 'inline' | 'overlay'

export type CarouselDotsAppearance = 'bars' | 'dots' | 'numbers' | 'thumbnails'

export interface CarouselLabels {
  dot: (index: number, count: number) => string
  dots: string
  next: string
  pause: string
  play: string
  previous: string
  roleDescription: string
  slide: (index: number, count: number) => string
  slideRoleDescription: string
}

export interface CarouselContextValue {
  baseId: string
  count: number
  index: number
  isStyled: boolean
  labels: CarouselLabels
  loop: boolean
  orientation: CarouselOrientation
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
