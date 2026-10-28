'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { Children, forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { CarouselDot } from './carousel-dot'
import {
  CarouselDotIndexContext,
  type CarouselDotsAppearance,
  useCarouselContext,
} from './carousel-context'
import styles from './carousel.module.css'

export interface CarouselDotsOwnProps {
  /**
   * How the dots look. `dots` are small circles, the active one stretched; `bars` are thin
   * segments, like the progress of a story; `numbers` are buttons with the number of the slide;
   * `thumbnails` are boxes for you to fill with a preview of each slide, passing a function as
   * `children` that returns a `CarouselDot` with an image.
   * @default 'dots'
   */
  appearance?: CarouselDotsAppearance
  /**
   * The dots. A function gets the position of the dot and is called once per slide; nodes are
   * the `CarouselDot` elements themselves. Given none, there is one `CarouselDot` per slide.
   */
  children?: ((position: number) => ReactNode) | ReactNode
}

type CarouselDotsRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'aria-label' | 'hidden' | 'id' | 'title'
>

export type CarouselDotsProps = Omit<ComponentProps, 'index'> &
  CarouselDotsRootAttributes &
  CarouselDotsOwnProps

/** The tab list of the dots. */
export const CarouselDots = forwardRef<HTMLDivElement, CarouselDotsProps>(
  (
    { appearance = 'dots', 'aria-label': ariaLabel, children, className, style, ...rest }: CarouselDotsProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { count, isStyled, labels, orientation } = useCarouselContext('CarouselDots')

    const repeated = typeof children === 'function' || children === undefined
    const content = repeated
      ? Array.from({ length: count }, (_, position) => (
          <CarouselDotIndexContext.Provider key={position} value={position}>
            {typeof children === 'function' ? (
              children(position)
            ) : (
              <CarouselDot>{appearance === 'numbers' ? position + 1 : undefined}</CarouselDot>
            )}
          </CarouselDotIndexContext.Provider>
        ))
      : Children.map(children, (child, position) => (
          <CarouselDotIndexContext.Provider value={position}>
            {child}
          </CarouselDotIndexContext.Provider>
        ))

    return (
      <div
        aria-label={ariaLabel ?? labels.dots}
        aria-orientation={orientation}
        className={joinClasses(
          isStyled && styles.dots,
          isStyled && appearance !== 'dots' && styles[appearance],
          className,
        )}
        data-appearance={appearance}
        data-orientation={orientation}
        data-plume-carousel-dots=""
        ref={ref}
        role="tablist"
        style={style}
        {...rest}
      >
        {content}
      </div>
    )
  },
)

CarouselDots.displayName = 'CarouselDots'
