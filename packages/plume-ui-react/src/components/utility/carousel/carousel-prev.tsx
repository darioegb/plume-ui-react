import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { CarouselArrow, type CarouselArrowProps } from './carousel-arrow'

export type CarouselPrevProps = CarouselArrowProps

/** The button that goes to the previous slide. */
export const CarouselPrev = forwardRef<HTMLButtonElement, CarouselPrevProps>(
  (props: CarouselPrevProps, ref: ForwardedRef<HTMLButtonElement>): ReactNode => (
    <CarouselArrow {...props} direction="prev" part="CarouselPrev" ref={ref} />
  ),
)

CarouselPrev.displayName = 'CarouselPrev'
