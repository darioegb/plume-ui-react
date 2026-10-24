'use client'

import type { ButtonHTMLAttributes, ForwardedRef, KeyboardEvent, ReactNode } from 'react'
import { forwardRef, useContext } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { CarouselDotIndexContext, getSlideId, useCarouselContext } from './carousel-context'
import styles from './carousel.module.css'

type CarouselDotRootAttributes = Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-label' | 'children' | 'disabled' | 'id' | 'onClick' | 'onKeyDown' | 'title'
>

const keyTargets = (key: string, current: number, count: number): number | undefined => {
  if (key === 'ArrowRight') return (current + 1) % count
  if (key === 'ArrowLeft') return (current - 1 + count) % count
  if (key === 'Home') return 0
  return key === 'End' ? count - 1 : undefined
}

export type CarouselDotProps = Omit<ComponentProps, 'index'> & CarouselDotRootAttributes

export const CarouselDot = forwardRef<HTMLButtonElement, CarouselDotProps>(
  (
    {
      'aria-label': ariaLabel,
      children,
      className,
      onClick,
      onKeyDown,
      style,
      ...rest
    }: CarouselDotProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const { baseId, count, index, isStyled, labels, setIndex } = useCarouselContext('CarouselDot')
    const position = useContext(CarouselDotIndexContext)
    if (position === undefined) throw new Error('CarouselDot must be used within a <CarouselDots>')
    const active = position === index

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
      onKeyDown?.(event)
      if (event.defaultPrevented) return
      const dots = Array.from(
        event.currentTarget
          .closest('[data-plume-carousel-dots]')
          ?.querySelectorAll<HTMLElement>('[data-plume-carousel-dot]') ?? [],
      )
      const target = keyTargets(event.key, dots.indexOf(event.currentTarget), dots.length)
      if (target === undefined) return
      event.preventDefault()
      setIndex(target)
      dots[target]?.focus()
    }

    return (
      <button
        aria-controls={getSlideId(baseId, position)}
        aria-label={ariaLabel ?? labels.dot(position, count)}
        aria-selected={active}
        className={joinClasses(isStyled && styles.dot, className)}
        data-active={active ? '' : undefined}
        data-plume-carousel-dot=""
        onClick={(event) => {
          onClick?.(event)
          if (!event.defaultPrevented) setIndex(position)
        }}
        onKeyDown={handleKeyDown}
        ref={ref}
        role="tab"
        style={style}
        tabIndex={active ? 0 : -1}
        type="button"
        {...rest}
      >
        {children}
      </button>
    )
  },
)

CarouselDot.displayName = 'CarouselDot'
