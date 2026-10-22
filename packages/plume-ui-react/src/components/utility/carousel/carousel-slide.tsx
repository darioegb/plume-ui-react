'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useContext, useEffect, useState } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { mergeRefs } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import { CarouselSlideIndexContext, getSlideId, useCarouselContext } from './carousel-context'
import styles from './carousel.module.css'

type CarouselSlideRootAttributes = Pick<
  HTMLAttributes<HTMLDivElement>,
  'aria-label' | 'children' | 'hidden' | 'title'
>

export type CarouselSlideProps = Omit<ComponentProps, 'index'> & CarouselSlideRootAttributes

export const CarouselSlide = forwardRef<HTMLDivElement, CarouselSlideProps>(
  (
    { 'aria-label': ariaLabel, children, className, style, ...rest }: CarouselSlideProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { baseId, count, index, isStyled, slideLabel } = useCarouselContext('CarouselSlide')
    const position = useContext(CarouselSlideIndexContext)
    if (position === undefined)
      throw new Error('CarouselSlide must be used within a <CarouselSlides>')
    const [element, setElement] = useState<HTMLDivElement | null>(null)
    const active = position === index

    useEffect(() => {
      element?.toggleAttribute('inert', !active)
    }, [active, element])

    return (
      <div
        aria-label={ariaLabel ?? slideLabel(position, count)}
        aria-roledescription="slide"
        className={joinClasses(isStyled && styles.slide, className)}
        data-active={active ? '' : undefined}
        data-plume-carousel-slide=""
        id={getSlideId(baseId, position)}
        ref={mergeRefs(ref, setElement)}
        role="tabpanel"
        style={style}
        tabIndex={active ? 0 : undefined}
        {...rest}
      >
        {children}
      </div>
    )
  },
)

CarouselSlide.displayName = 'CarouselSlide'
