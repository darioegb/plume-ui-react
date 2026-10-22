'use client'

import type { ButtonHTMLAttributes, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { PauseIcon, PlayIcon } from '../../../overlay/icons'
import type { ComponentProps } from '../../../theme'
import { useCarouselContext } from './carousel-context'
import styles from './carousel.module.css'

export interface CarouselPlayPauseOwnProps {
  pauseLabel?: string
  playLabel?: string
}

type CarouselPlayPauseRootAttributes = Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'disabled' | 'id' | 'onClick' | 'title'
>

export type CarouselPlayPauseProps = Omit<ComponentProps, 'index'> &
  CarouselPlayPauseRootAttributes &
  CarouselPlayPauseOwnProps

export const CarouselPlayPause = forwardRef<HTMLButtonElement, CarouselPlayPauseProps>(
  (
    {
      children,
      className,
      onClick,
      pauseLabel = 'Pause the slideshow',
      playLabel = 'Start the slideshow',
      style,
      ...rest
    }: CarouselPlayPauseProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const { isStyled, playing, setPlaying } = useCarouselContext('CarouselPlayPause')

    return (
      <button
        aria-label={playing ? pauseLabel : playLabel}
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
