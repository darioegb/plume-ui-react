'use client'

import type { ButtonHTMLAttributes, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { ChevronLeftIcon, ChevronRightIcon } from '../../../overlay/icons'
import type { ComponentProps } from '../../../theme'
import { useCarouselContext } from './carousel-context'
import styles from './carousel.module.css'

export interface CarouselArrowOwnProps {
  /** Replaces the arrow. `children` replaces all of the content of the button. */
  icon?: ReactNode
  /**
   * The accessible name of the button. It wins over `labels.previous` and `labels.next` of the
   * Carousel.
   */
  label?: string
}

type CarouselArrowRootAttributes = Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'disabled' | 'id' | 'onClick' | 'title'
>

export type CarouselArrowProps = Omit<ComponentProps, 'index'> &
  CarouselArrowRootAttributes &
  CarouselArrowOwnProps

interface CarouselArrowInternalProps extends CarouselArrowProps {
  direction: 'next' | 'prev'
  part: string
}

export const CarouselArrow = forwardRef<HTMLButtonElement, CarouselArrowInternalProps>(
  (
    {
      children,
      className,
      direction,
      disabled,
      icon,
      label,
      onClick,
      part,
      style,
      ...rest
    }: CarouselArrowInternalProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const carousel = useCarouselContext(part)
    const isNext = direction === 'next'
    const atEdge = isNext ? carousel.index >= carousel.count - 1 : carousel.index <= 0
    const blocked = disabled || carousel.count < 2 || (!carousel.loop && atEdge)

    return (
      <button
        aria-controls={`${carousel.baseId}-slides`}
        aria-label={label ?? (isNext ? carousel.labels.next : carousel.labels.previous)}
        className={joinClasses(
          carousel.isStyled && styles.arrow,
          carousel.isStyled && styles[direction],
          className,
        )}
        data-direction={direction}
        data-plume-carousel-arrow=""
        data-plume-carousel-next={isNext ? '' : undefined}
        data-plume-carousel-prev={isNext ? undefined : ''}
        disabled={blocked}
        onClick={(event) => {
          onClick?.(event)
          if (event.defaultPrevented) return
          if (isNext) carousel.next()
          else carousel.prev()
        }}
        ref={ref}
        style={style}
        type="button"
        {...rest}
      >
        {children ?? icon ?? (isNext ? <ChevronRightIcon /> : <ChevronLeftIcon />)}
      </button>
    )
  },
)

CarouselArrow.displayName = 'CarouselArrow'
