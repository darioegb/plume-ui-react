import type { CSSProperties, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import styles from './skeleton.module.css'

export interface SkeletonLineOwnProps {
  height?: number | string
  width?: number | string
}

export type SkeletonLineProps = Omit<ComponentProps, 'index'> & SkeletonLineOwnProps

const toLength = (value: number | string | undefined): string | undefined =>
  typeof value === 'number' ? `${value}px` : value

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
