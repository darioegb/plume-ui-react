import type { CSSProperties, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import styles from './skeleton.module.css'

export interface SkeletonLineOwnProps {
  /** Height, in pixels as a number or with any CSS unit as a string. */
  height?: number | string
  /**
   * Width, in pixels as a number or with any CSS unit as a string. The last line of a group is
   * shorter unless you give it one.
   */
  width?: number | string
}

export type SkeletonLineProps = Omit<ComponentProps, 'index'> & SkeletonLineOwnProps

const toLength = (value: number | string | undefined): string | undefined =>
  typeof value === 'number' ? `${value}px` : value

/** One line of text in a Skeleton with several. */
export const SkeletonLine = forwardRef<HTMLSpanElement, SkeletonLineProps>(
  (
    { className, height, style, width }: SkeletonLineProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const box: CSSProperties = { height: toLength(height), width: toLength(width), ...style }

    return (
      <span
        className={joinClasses(styles.line, className)}
        data-plume-skeleton=""
        data-plume-skeleton-line=""
        ref={ref}
        style={box}
      />
    )
  },
)

SkeletonLine.displayName = 'SkeletonLine'
