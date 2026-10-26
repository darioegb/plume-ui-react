'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { mergeRefs } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import { useProgressBarContext } from './progressbar-context'
import type { ProgressBarTrackAttributes } from './progressbar-context'
import { ProgressBarIndicator } from './progressbar-indicator'
import styles from './progressbar.module.css'

type ProgressBarTrackRootAttributes = ProgressBarTrackAttributes &
  Pick<HTMLAttributes<HTMLDivElement>, 'children'>

export type ProgressBarTrackProps = Omit<ComponentProps, 'index'> & ProgressBarTrackRootAttributes

/**
 * The element with `role="progressbar"` that holds the bar. It takes the `ref` and the
 * accessible name of the ProgressBar, and without children it renders a `ProgressBarIndicator`.
 */
export const ProgressBarTrack = forwardRef<HTMLDivElement, ProgressBarTrackProps>(
  (
    { children, className, style, ...own }: ProgressBarTrackProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const context = useProgressBarContext('ProgressBarTrack')
    const { current, indeterminate, isStyled, shape, size, total, trackProps, valueText } = context
    const setRef = useMemo(() => mergeRefs(context.trackRef, ref), [context.trackRef, ref])

    return (
      <div
        {...trackProps}
        {...own}
        aria-valuemax={total}
        aria-valuemin={0}
        aria-valuenow={indeterminate ? undefined : current}
        aria-valuetext={indeterminate ? undefined : valueText}
        className={joinClasses(
          isStyled && styles.progressbar,
          isStyled && styles[size],
          isStyled && styles[shape],
          className,
        )}
        data-indeterminate={indeterminate ? '' : undefined}
        data-plume-progressbar-track=""
        ref={setRef}
        role="progressbar"
        style={style}
      >
        {children ?? <ProgressBarIndicator />}
      </div>
    )
  },
)

ProgressBarTrack.displayName = 'ProgressBarTrack'
