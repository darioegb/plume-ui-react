'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'
import { mergeRefs } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import { useSelectOptionContext } from './select-option-context'

type SelectOptionTextRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export type SelectOptionTextProps = Omit<ComponentProps, 'index'> & SelectOptionTextRootAttributes

/** The text of an option. */
export const SelectOptionText = forwardRef<HTMLSpanElement, SelectOptionTextProps>(
  (
    { children, className, style }: SelectOptionTextProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { textId, textRef } = useSelectOptionContext('SelectOptionText')
    const mergedRef = useMemo(() => mergeRefs<HTMLSpanElement>(textRef, ref), [ref, textRef])

    return (
      <span
        className={className}
        data-plume-select-option-text=""
        id={textId}
        ref={mergedRef}
        style={style}
      >
        {children}
      </span>
    )
  },
)

SelectOptionText.displayName = 'SelectOptionText'
