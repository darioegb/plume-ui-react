'use client'

import type { CSSProperties, ForwardedRef, ReactNode, TextareaHTMLAttributes } from 'react'
import { forwardRef, useId, useState } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { useLabels } from '../../../locale/locale-provider'
import { visuallyHidden } from '../../../overlay/visually-hidden'
import type { TextareaLabels } from './textarea'
import styles from './textarea.module.css'

interface TextareaCounterProps {
  className?: string
  countClassName?: string
  labels?: Partial<TextareaLabels>
  isStyled: boolean
  style: CSSProperties
  textareaProps: TextareaHTMLAttributes<HTMLTextAreaElement>
}

const DEFAULT_LABELS: TextareaLabels = {
  count: (count, max) => (max === undefined ? String(count) : `${count} / ${max}`),
  remaining: (remaining) => `${remaining} ${remaining === 1 ? 'character' : 'characters'} left`,
}

const isNearLimit = (remaining: number, max: number): boolean =>
  remaining <= Math.max(10, Math.ceil(max / 10))

export const TextareaCounter = forwardRef<HTMLTextAreaElement, TextareaCounterProps>(
  (
    { className, countClassName, labels, isStyled, style, textareaProps }: TextareaCounterProps,
    ref: ForwardedRef<HTMLTextAreaElement>,
  ): ReactNode => {
    const { defaultValue, maxLength, onChange, value } = textareaProps
    const text = useLabels('textarea', DEFAULT_LABELS, labels)
    const countId = useId()
    const [typed, setTyped] = useState(String(defaultValue ?? '').length)
    const count = value === undefined ? typed : String(value).length
    const remaining = maxLength === undefined ? undefined : maxLength - count
    const announcement =
      maxLength !== undefined && remaining !== undefined && isNearLimit(remaining, maxLength)
        ? text.remaining(Math.max(remaining, 0))
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
          {text.count(count, maxLength)}
        </span>
        <output style={visuallyHidden}>{announcement}</output>
      </div>
    )
  },
)

TextareaCounter.displayName = 'TextareaCounter'
