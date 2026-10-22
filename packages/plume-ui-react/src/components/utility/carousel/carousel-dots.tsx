'use client'

import type { ForwardedRef, HTMLAttributes, KeyboardEvent, ReactNode } from 'react'
import { forwardRef, useRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { getSlideId, useCarouselContext } from './carousel-context'
import styles from './carousel.module.css'

export interface CarouselDotsOwnProps {
  dotClassName?: string
  dotLabel?: (index: number, count: number) => string
}

type CarouselDotsRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'aria-label' | 'hidden' | 'id' | 'title'
>

export type CarouselDotsProps = Omit<ComponentProps, 'index'> &
  CarouselDotsRootAttributes &
  CarouselDotsOwnProps

const defaultDotLabel = (index: number, count: number): string => `Slide ${index + 1} of ${count}`

const keyTargets = (key: string, current: number, count: number): number | undefined => {
  if (key === 'ArrowRight') return (current + 1) % count
  if (key === 'ArrowLeft') return (current - 1 + count) % count
  if (key === 'Home') return 0
  return key === 'End' ? count - 1 : undefined
}

export const CarouselDots = forwardRef<HTMLDivElement, CarouselDotsProps>(
  (
    {
      'aria-label': ariaLabel = 'Choose a slide',
      className,
      dotClassName,
      dotLabel = defaultDotLabel,
      style,
      ...rest
    }: CarouselDotsProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { baseId, count, index, isStyled, setIndex } = useCarouselContext('CarouselDots')
    const dots = useRef<(HTMLButtonElement | null)[]>([])

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, current: number): void => {
      const target = keyTargets(event.key, current, count)
      if (target === undefined) return
      event.preventDefault()
      setIndex(target)
      dots.current[target]?.focus()
    }

    return (
      <div
        aria-label={ariaLabel}
        className={joinClasses(isStyled && styles.dots, className)}
        data-plume-carousel-dots=""
        ref={ref}
        role="tablist"
        style={style}
        {...rest}
      >
        {Array.from({ length: count }, (_, position) => (
          <button
            aria-controls={getSlideId(baseId, position)}
            aria-label={dotLabel(position, count)}
            aria-selected={position === index}
            className={joinClasses(isStyled && styles.dot, dotClassName)}
            data-active={position === index ? '' : undefined}
            data-plume-carousel-dot=""
            key={position}
            onClick={() => setIndex(position)}
            onKeyDown={(event) => handleKeyDown(event, position)}
            ref={(node) => {
              dots.current[position] = node
            }}
            role="tab"
            tabIndex={position === index ? 0 : -1}
            type="button"
          />
        ))}
      </div>
    )
  },
)

CarouselDots.displayName = 'CarouselDots'
