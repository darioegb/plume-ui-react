'use client'

import type { CSSProperties, ForwardedRef, ReactNode, TextareaHTMLAttributes } from 'react'
import { forwardRef, useId, useState } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { visuallyHidden } from '../../../overlay/visually-hidden'
import styles from './textarea.module.css'

interface TextareaCounterProps {
  className?: string
  countClassName?: string
  formatCount?: (count: number, max: number | undefined) => string
  formatRemaining?: (remaining: number) => string
  isStyled: boolean
  style: CSSProperties
  textareaProps: TextareaHTMLAttributes<HTMLTextAreaElement>
}

const defaultFormatCount = (count: number, max: number | undefined): string =>
  max === undefined ? String(count) : `${count} / ${max}`

const defaultFormatRemaining = (remaining: number): string =>
  `${remaining} ${remaining === 1 ? 'character' : 'characters'} left`

const isNearLimit = (remaining: number, max: number): boolean =>
  remaining <= Math.max(10, Math.ceil(max / 10))

export const TextareaCounter = forwardRef<HTMLTextAreaElement, TextareaCounterProps>(
  (
    {
      className,
      countClassName,
      formatCount = defaultFormatCount,
      formatRemaining = defaultFormatRemaining,
      isStyled,
      style,
      textareaProps,
    }: TextareaCounterProps,
    ref: ForwardedRef<HTMLTextAreaElement>,
  ): ReactNode => {
    const { defaultValue, maxLength, onChange, value } = textareaProps
    const countId = useId()
    const [typed, setTyped] = useState(String(defaultValue ?? '').length)
    const count = value === undefined ? typed : String(value).length
    const remaining = maxLength === undefined ? undefined : maxLength - count
    const announcement =
      maxLength !== undefined && remaining !== undefined && isNearLimit(remaining, maxLength)
        ? formatRemaining(Math.max(remaining, 0))
        : ''
    const describedBy = [textareaProps['aria-describedby'], countId].filter(Boolean).join(' ')

    return (
      <div className={className} data-plume-textarea-group="" style={style}>
        <textarea
          {...textareaProps}
          aria-describedby={describedBy}
          onChange={(event) => {
            setTyped(event.target.value.length)
            onChange?.(event)
          }}
          ref={ref}
        />
        <span
          className={joinClasses(isStyled && styles.count, countClassName)}
          data-limit={remaining !== undefined && remaining <= 0 ? '' : undefined}
          data-plume-textarea-count=""
          id={countId}
        >
          {formatCount(count, maxLength)}
        </span>
        <output style={visuallyHidden}>{announcement}</output>
      </div>
    )
  },
)

TextareaCounter.displayName = 'TextareaCounter'
