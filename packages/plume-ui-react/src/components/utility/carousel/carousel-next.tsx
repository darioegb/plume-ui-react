import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { CarouselArrow, type CarouselArrowProps } from './carousel-arrow'

export type CarouselNextProps = CarouselArrowProps

/** The button that goes to the next slide. */
export const CarouselNext = forwardRef<HTMLButtonElement, CarouselNextProps>(
  (props: CarouselNextProps, ref: ForwardedRef<HTMLButtonElement>): ReactNode => (
    <CarouselArrow {...props} direction="next" part="CarouselNext" ref={ref} />
  ),
)

CarouselNext.displayName = 'CarouselNext'
