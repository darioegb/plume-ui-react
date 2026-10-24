'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { visuallyHidden } from '../../../overlay/visually-hidden'
import type { ComponentProps } from '../../../theme'
import { useTextarea } from './textarea-context'

export type TextareaStatusProps = Omit<ComponentProps, 'index'>

const isNearLimit = (remaining: number, max: number): boolean =>
  remaining <= Math.max(10, Math.ceil(max / 10))

export const TextareaStatus = forwardRef<HTMLOutputElement, TextareaStatusProps>(
  ({ className, style }: TextareaStatusProps, ref: ForwardedRef<HTMLOutputElement>): ReactNode => {
    const { labels, maxLength, remaining } = useTextarea('TextareaStatus')
    const announcement =
      maxLength !== undefined && remaining !== undefined && isNearLimit(remaining, maxLength)
        ? labels.remaining(Math.max(remaining, 0))
        : ''

    return (
      <output
        className={className}
        data-plume-textarea-status=""
        ref={ref}
        style={{ ...visuallyHidden, ...style }}
      >
        {announcement}
      </output>
    )
  },
)

TextareaStatus.displayName = 'TextareaStatus'
