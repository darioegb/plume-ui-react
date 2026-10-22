'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { Children, forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { mergeRefs } from '../../../overlay/trigger'
import { useMediaQuery } from '../../../overlay/use-media-query'
import type { ComponentProps } from '../../../theme'
import { CarouselSlideIndexContext, useCarouselContext } from './carousel-context'
import styles from './carousel.module.css'

type CarouselSlidesRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'aria-label' | 'children' | 'id' | 'title'
>

export type CarouselSlidesProps = Omit<ComponentProps, 'index'> & CarouselSlidesRootAttributes

const scrollEndDelay = 700

const closestSlide = (scroller: HTMLElement): number => {
  const start = scroller.getBoundingClientRect().left
  let closest = 0
  let distance = Number.POSITIVE_INFINITY
  Array.from(scroller.children).forEach((slide, position) => {
    const gap = Math.abs(slide.getBoundingClientRect().left - start)
    if (gap < distance) {
      distance = gap
      closest = position
    }
  })
  return closest
}

export const CarouselSlides = forwardRef<HTMLDivElement, CarouselSlidesProps>(
  (
    { children, className, id, style, ...rest }: CarouselSlidesProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { baseId, index, isStyled, playing, setCount, setIndex } =
      useCarouselContext('CarouselSlides')
    const [scroller, setScroller] = useState<HTMLDivElement | null>(null)
    const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
    const count = Children.toArray(children).length
    const programmatic = useRef(false)
    const settled = useRef<number | undefined>(undefined)
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const frame = useRef<number | undefined>(undefined)

    useEffect(() => setCount(count), [count, setCount])

    useEffect(() => {
      if (!scroller || settled.current === index) return
      const slide = scroller.children.item(index)
      if (!slide) return
      const first = settled.current === undefined
      settled.current = index
      if (first && index === 0) return
      programmatic.current = true
      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        programmatic.current = false
      }, scrollEndDelay)
      scroller.scrollTo({
        behavior: first || reducedMotion ? 'auto' : 'smooth',
        left:
          slide.getBoundingClientRect().left -
          scroller.getBoundingClientRect().left +
          scroller.scrollLeft,
      })
    }, [index, reducedMotion, scroller, count])

    useEffect(
      () => () => {
        clearTimeout(timer.current)
        if (frame.current !== undefined) cancelAnimationFrame(frame.current)
      },
      [],
    )

    const handleScroll = useCallback((): void => {
      if (!scroller || programmatic.current) return
      if (frame.current !== undefined) cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(() => {
        const position = closestSlide(scroller)
        settled.current = position
        setIndex(position)
      })
    }, [scroller, setIndex])

    useEffect(() => {
      if (!scroller) return undefined
      const finish = (): void => {
        programmatic.current = false
        clearTimeout(timer.current)
      }
      scroller.addEventListener('scrollend', finish)
      return () => scroller.removeEventListener('scrollend', finish)
    }, [scroller])

    return (
      <div
        aria-live={playing ? 'off' : 'polite'}
        className={joinClasses(isStyled && styles.slides, className)}
        data-plume-carousel-slides=""
        id={id ?? `${baseId}-slides`}
        onScroll={handleScroll}
        ref={mergeRefs(ref, setScroller)}
        style={style}
        {...rest}
      >
        {Children.map(children, (child, position) => (
          <CarouselSlideIndexContext.Provider value={position}>
            {child}
          </CarouselSlideIndexContext.Provider>
        ))}
      </div>
    )
  },
)

CarouselSlides.displayName = 'CarouselSlides'
