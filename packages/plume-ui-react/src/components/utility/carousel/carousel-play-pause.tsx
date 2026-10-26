'use client'

import type { ButtonHTMLAttributes, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { PauseIcon, PlayIcon } from '../../../overlay/icons'
import type { ComponentProps } from '../../../theme'
import { useCarouselContext } from './carousel-context'
import styles from './carousel.module.css'

type CarouselPlayPauseRootAttributes = Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'disabled' | 'id' | 'onClick' | 'title'
>

export type CarouselPlayPauseProps = Omit<ComponentProps, 'index'> &
  CarouselPlayPauseRootAttributes

/** Pauses and resumes the autoplay. It has `data-playing` while the carousel moves. */
export const CarouselPlayPause = forwardRef<HTMLButtonElement, CarouselPlayPauseProps>(
  (
    {
      children,
      className,
      onClick,
      style,
      ...rest
    }: CarouselPlayPauseProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const { isStyled, labels, playing, setPlaying } = useCarouselContext('CarouselPlayPause')

    return (
      <button
        aria-label={playing ? labels.pause : labels.play}
        className={joinClasses(isStyled && styles.arrow, isStyled && styles.playPause, className)}
        data-playing={playing ? '' : undefined}
        data-plume-carousel-play-pause=""
        onClick={(event) => {
          onClick?.(event)
          if (!event.defaultPrevented) setPlaying(!playing)
        }}
        ref={ref}
        style={style}
        type="button"
        {...rest}
      >
        {children ?? (playing ? <PauseIcon /> : <PlayIcon />)}
      </button>
    )
  },
)

CarouselPlayPause.displayName = 'CarouselPlayPause'
