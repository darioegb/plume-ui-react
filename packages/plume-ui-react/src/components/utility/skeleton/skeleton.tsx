import type { CSSProperties, ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { SkeletonLine } from './skeleton-line'
import styles from './skeleton.module.css'

export type SkeletonShape = 'text' | 'rect' | 'circle'

export type SkeletonVariant = 'pulse' | 'wave' | 'unstyled'

export interface SkeletonOwnProps {
  /**
   * Height, in pixels as a number or with any CSS unit as a string. A text is one line tall, a
   * rect 6rem and a circle 3rem.
   */
  height?: number | string
  /**
   * How many lines of text to show. The last one is shorter. It only applies to the `text`
   * shape.
   * @default 1
   */
  lines?: number
  /**
   * What the Skeleton stands for: a line of `text`, a `rect` (an image or a card) or a `circle`
   * (an avatar).
   * @default 'text'
   */
  shape?: SkeletonShape
  /**
   * Animation. `pulse` fades it in and out, `wave` sweeps a light across it. `unstyled` drops
   * the Plume styles, the animation too, and keeps the structure so you can bring your own.
   * @default 'pulse'
   */
  variant?: SkeletonVariant
  /**
   * Width, in pixels as a number or with any CSS unit as a string. A text fills its container by
   * default, a circle is 3rem.
   */
  width?: number | string
}

type SkeletonRootAttributes = Pick<HTMLAttributes<HTMLDivElement>, 'children' | 'hidden' | 'id'>

export type SkeletonProps = Omit<ComponentProps, 'index'> &
  SkeletonRootAttributes &
  SkeletonOwnProps

const toLength = (value: number | string | undefined): string | undefined =>
  typeof value === 'number' ? `${value}px` : value

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      children,
      className,
      height,
      lines = 1,
      shape = 'text',
      style,
      variant = 'pulse',
      width,
      ...rest
    }: SkeletonProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const isStyled = variant !== 'unstyled'
    const count = shape === 'text' ? Math.max(1, Math.floor(lines)) : 1
    const composed = children !== undefined && children !== null && children !== false
    const look = (extra?: string): string | undefined =>
      joinClasses(isStyled && styles.skeleton, isStyled && styles[variant], extra)
    const box = {
      '--skeleton-height': toLength(height),
      '--skeleton-width': toLength(width),
      ...style,
    } as CSSProperties

    if (composed || count > 1) {
      return (
        <div
          aria-hidden="true"
          className={joinClasses(
            isStyled && styles.lines,
            isStyled && styles[variant === 'wave' ? 'linesWave' : 'linesPulse'],
            className,
          )}
          data-plume-skeleton-lines=""
          data-shape={shape}
          ref={ref}
          style={box}
          {...rest}
        >
          {composed
            ? children
            : [...new Array(count).keys()].map((line) => <SkeletonLine key={line} />)}
        </div>
      )
    }

    return (
      <div
        aria-hidden="true"
        className={look(joinClasses(isStyled && styles[shape], className))}
        data-plume-skeleton=""
        data-shape={shape}
        ref={ref}
        style={box}
        {...rest}
      />
    )
  },
)

Skeleton.displayName = 'Skeleton'
