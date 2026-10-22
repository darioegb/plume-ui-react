'use client'

import type { CSSProperties, ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef, useCallback, useEffect, useId, useMemo, useState } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { useControllableState } from '../../../overlay/use-controllable-state'
import { useMediaQuery } from '../../../overlay/use-media-query'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import { CarouselContext, type CarouselVariant } from './carousel-context'
import styles from './carousel.module.css'

export interface CarouselOwnProps {
  autoplay?: number | false
  colorScheme?: ColorScheme
  defaultIndex?: number
  index?: number
  loop?: boolean
  onIndexChange?: (index: number) => void
  size?: Size
  slideLabel?: (index: number, count: number) => string
  variant?: CarouselVariant
}

type CarouselRootAttributes = Pick<
  HTMLAttributes<HTMLElement>,
  'aria-label' | 'aria-labelledby' | 'children' | 'hidden' | 'id' | 'title'
>

export type CarouselProps = Omit<ComponentProps, 'index'> &
  CarouselRootAttributes &
  CarouselOwnProps

const defaultSlideLabel = (index: number, count: number): string => `${index + 1} of ${count}`

const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

const carouselColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--carousel-solid': `var(--plume-color-${colorScheme}-solid)`,
    '--carousel-contrast': `var(--plume-color-${colorScheme}-solid-contrast)`,
    '--carousel-hover': `var(--plume-color-${colorScheme}-solid-hover)`,
    '--carousel-text': `var(--plume-color-${colorScheme}-text)`,
    '--carousel-tint': `var(--plume-color-${colorScheme}-tint)`,
    ...style,
  }) as CSSProperties

export const Carousel = forwardRef<HTMLElement, CarouselProps>(
  (
    {
      autoplay = false,
      children,
      className,
      colorScheme = 'primary',
      defaultIndex = 0,
      id,
      index: indexProp,
      loop = false,
      onIndexChange,
      size = 'md',
      slideLabel = defaultSlideLabel,
      style,
      variant = 'solid',
      ...rest
    }: CarouselProps,
    ref: ForwardedRef<HTMLElement>,
  ) => {
    const generatedId = useId()
    const baseId = id ?? generatedId
    const isStyled = variant !== 'unstyled'
    const [index, setIndex] = useControllableState({
      defaultValue: defaultIndex,
      onChange: onIndexChange,
      value: indexProp,
    })
    const [count, setCount] = useState(0)
    const [playing, setPlaying] = useState(autoplay !== false)
    const [interacting, setInteracting] = useState(false)
    const reducedMotion = useMediaQuery(reducedMotionQuery)

    const go = useCallback(
      (target: number): void => {
        if (count === 0) return
        if (target < 0) setIndex(loop ? count - 1 : 0)
        else if (target >= count) setIndex(loop ? 0 : count - 1)
        else setIndex(target)
      },
      [count, loop, setIndex],
    )
    const next = useCallback(() => go(index + 1), [go, index])
    const prev = useCallback(() => go(index - 1), [go, index])

    const playingNow = autoplay !== false && playing && !reducedMotion
    const running = playingNow && !interacting && count > 1
    useEffect(() => {
      if (!running) return undefined
      const timer = setInterval(() => setIndex(index + 1 >= count ? 0 : index + 1), autoplay)
      return () => clearInterval(timer)
    }, [autoplay, count, index, running, setIndex])

    const context = useMemo(
      () => ({
        baseId,
        count,
        index,
        isStyled,
        loop,
        next,
        playing: playingNow,
        prev,
        setCount,
        setIndex: go,
        setPlaying,
        slideLabel,
      }),
      [baseId, count, go, index, isStyled, loop, next, playingNow, prev, slideLabel],
    )

    return (
      <CarouselContext.Provider value={context}>
        <section
          aria-roledescription="carousel"
          className={joinClasses(
            isStyled && styles.carousel,
            isStyled && styles[variant],
            isStyled && styles[size],
            className,
          )}
          data-plume-carousel=""
          id={baseId}
          onBlur={() => setInteracting(false)}
          onFocus={() => setInteracting(true)}
          onMouseEnter={() => setInteracting(true)}
          onMouseLeave={() => setInteracting(false)}
          ref={ref}
          style={carouselColorVars(colorScheme, style)}
          {...rest}
        >
          {children}
        </section>
      </CarouselContext.Provider>
    )
  },
)

Carousel.displayName = 'Carousel'
