'use client'

import type { CSSProperties, ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef, useCallback, useEffect, useId, useMemo, useState } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { useLabels } from '../../../locale/locale-provider'
import { useControllableState } from '../../../overlay/use-controllable-state'
import { useMediaQuery } from '../../../overlay/use-media-query'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import {
  CarouselContext,
  type CarouselControls,
  type CarouselLabels,
  type CarouselOrientation,
  type CarouselVariant,
} from './carousel-context'
import styles from './carousel.module.css'

export interface CarouselOwnProps {
  /**
   * Time in milliseconds between slides. Without it the Carousel only moves when the user asks.
   * It pauses on hover and focus and never runs with `prefers-reduced-motion`.
   * @default false
   */
  autoplay?: number | false
  /**
   * Color scheme from the theme palette, including custom schemes added to it. It colors the
   * buttons and the active dot.
   * @default 'primary'
   */
  colorScheme?: ColorScheme
  /**
   * Where the buttons sit. `overlay` puts the previous and next buttons over the slides, at their
   * edges. `inline` takes them out of that layer and leaves them where you place them, for
   * example in a bar with the dots under the slides.
   * @default 'overlay'
   */
  controls?: CarouselControls,
  /**
   * The slide that is visible first, when it is not controlled.
   * @default 0
   */
  defaultIndex?: number
  /**
   * The visible slide, starting at 0. Makes the Carousel controlled: pass `onIndexChange` to
   * update it.
   */
  index?: number
  /**
   * The texts the Carousel shows to assistive technology: `slide(index, count)` and `dot(index,
   * count)` name each slide and dot, `dots` names the group of dots, `previous` and `next` name
   * the arrows, `play` and `pause` name the autoplay button, and `roleDescription` and
   * `slideRoleDescription` are the words a screen reader says for the carousel and for each slide.
   * The `label` of an arrow and the `aria-label` of a dots group or slide win over these.
   * @default { slide: (i, n) => `${i + 1} of ${n}`, dot: (i, n) => `Slide ${i + 1} of ${n}`, dots: 'Choose a slide', previous: 'Previous slide', next: 'Next slide', play: 'Start the slideshow', pause: 'Pause the slideshow', roleDescription: 'carousel', slideRoleDescription: 'slide' }
   */
  labels?: Partial<CarouselLabels>
  /**
   * Makes the buttons go from the last slide to the first, and the other way round, instead of
   * stopping.
   * @default false
   */
  loop?: boolean
  /**
   * Called with the new index when the visible slide changes, by a button, a dot, autoplay or a
   * swipe.
   */
  onIndexChange?: (index: number) => void
  /**
   * The direction the slides move in. `vertical` stacks them, puts the buttons at the top and
   * the bottom and the dots in a column at the end; give the Carousel a height, as the slides
   * fill it. The dots then use <kbd>↑</kbd> and <kbd>↓</kbd> instead of the horizontal arrows.
   * @default 'horizontal'
   */
  orientation?: CarouselOrientation
  /**
   * Size of the buttons and the dots.
   * @default 'md'
   */
  size?: Size
  /**
   * Visual variant of the buttons. `solid` fills them with the color, and `overlay` puts a dark
   * translucent circle behind a white arrow, to read over a photo. `unstyled` drops the Plume
   * styles so you can bring your own; the scrolling and the snapping keep working.
   * @default 'solid'
   */
  variant?: CarouselVariant
}

type CarouselRootAttributes = Pick<
  HTMLAttributes<HTMLElement>,
  'aria-label' | 'aria-labelledby' | 'children' | 'hidden' | 'id' | 'title'
>

export type CarouselProps = Omit<ComponentProps, 'index'> &
  CarouselRootAttributes &
  CarouselOwnProps

const DEFAULT_LABELS: CarouselLabels = {
  dot: (index, count) => `Slide ${index + 1} of ${count}`,
  dots: 'Choose a slide',
  next: 'Next slide',
  pause: 'Pause the slideshow',
  play: 'Start the slideshow',
  previous: 'Previous slide',
  roleDescription: 'carousel',
  slide: (index, count) => `${index + 1} of ${count}`,
  slideRoleDescription: 'slide',
}

const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

const carouselColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--carousel-solid': `var(--plume-color-${colorScheme}-solid)`,
    '--carousel-contrast': `var(--plume-color-${colorScheme}-solid-contrast)`,
    '--carousel-hover': `var(--plume-color-${colorScheme}-solid-hover)`,
    '--carousel-text': `var(--plume-color-${colorScheme}-text)`,
    '--carousel-tint': `var(--plume-color-${colorScheme}-tint)`,
    ...style,
  }) as CSSProperties

export const Carousel = forwardRef<HTMLElement, CarouselProps>(
  (
    {
      autoplay = false,
      children,
      className,
      colorScheme = 'primary',
      controls = 'overlay',
      defaultIndex = 0,
      id,
      index: indexProp,
      labels,
      loop = false,
      onIndexChange,
      orientation = 'horizontal',
      size = 'md',
      style,
      variant = 'solid',
      ...rest
    }: CarouselProps,
    ref: ForwardedRef<HTMLElement>,
  ) => {
    const generatedId = useId()
    const baseId = id ?? generatedId
    const isStyled = variant !== 'unstyled'
    const [index, setIndex] = useControllableState({
      defaultValue: defaultIndex,
      onChange: onIndexChange,
      value: indexProp,
    })
    const [count, setCount] = useState(0)
    const [playing, setPlaying] = useState(autoplay !== false)
    const [interacting, setInteracting] = useState(false)
    const reducedMotion = useMediaQuery(reducedMotionQuery)

    const go = useCallback(
      (target: number): void => {
        if (count === 0) return
        if (target < 0) setIndex(loop ? count - 1 : 0)
        else if (target >= count) setIndex(loop ? 0 : count - 1)
        else setIndex(target)
      },
      [count, loop, setIndex],
    )
    const next = useCallback(() => go(index + 1), [go, index])
    const prev = useCallback(() => go(index - 1), [go, index])

    const playingNow = autoplay !== false && playing && !reducedMotion
    const running = playingNow && !interacting && count > 1
    useEffect(() => {
      if (!running) return undefined
      const timer = setInterval(() => setIndex(index + 1 >= count ? 0 : index + 1), autoplay)
      return () => clearInterval(timer)
    }, [autoplay, count, index, running, setIndex])

    const resolvedLabels = useLabels('carousel', DEFAULT_LABELS, labels)
    const context = useMemo(
      () => ({
        baseId,
        count,
        index,
        isStyled,
        labels: resolvedLabels,
        loop,
        next,
        orientation,
        playing: playingNow,
        prev,
        setCount,
        setIndex: go,
        setPlaying,
      }),
      [baseId, count, go, index, isStyled, loop, next, orientation, playingNow, prev, resolvedLabels],
    )

    return (
      <CarouselContext.Provider value={context}>
        <section
          aria-roledescription={resolvedLabels.roleDescription}
          className={joinClasses(
            isStyled && styles.carousel,
            isStyled && styles[variant],
            isStyled && styles[size],
            isStyled && styles[orientation],
            isStyled && controls === 'inline' && styles.inline,
            className,
          )}
          data-controls={controls}
          data-orientation={orientation}
          data-plume-carousel=""
          id={baseId}
          onBlur={() => setInteracting(false)}
          onFocus={() => setInteracting(true)}
          onMouseEnter={() => setInteracting(true)}
          onMouseLeave={() => setInteracting(false)}
          ref={ref}
          style={carouselColorVars(colorScheme, style)}
          {...rest}
        >
          {children}
        </section>
      </CarouselContext.Provider>
    )
  },
)

Carousel.displayName = 'Carousel'
