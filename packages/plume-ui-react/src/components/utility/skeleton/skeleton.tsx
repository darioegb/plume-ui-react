import type { CSSProperties, ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { SkeletonLine } from './skeleton-line'
import styles from './skeleton.module.css'

export type SkeletonShape = 'text' | 'rect' | 'circle'

export type SkeletonVariant = 'pulse' | 'wave' | 'unstyled'

export interface SkeletonOwnProps {
  height?: number | string
  lines?: number
  shape?: SkeletonShape
  variant?: SkeletonVariant
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
