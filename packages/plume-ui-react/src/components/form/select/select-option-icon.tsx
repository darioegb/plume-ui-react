'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useSelectContext } from './select-context'
import { useSelectOptionContext } from './select-option-context'
import styles from './select.module.css'

type SelectOptionIconRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export type SelectOptionIconProps = Omit<ComponentProps, 'index'> & SelectOptionIconRootAttributes

export const SelectOptionIcon = forwardRef<HTMLSpanElement, SelectOptionIconProps>(
  (
    { children, className, style }: SelectOptionIconProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled } = useSelectContext('SelectOptionIcon')
    const option = useSelectOptionContext('SelectOptionIcon')
    const content = children ?? option.icon
    if (!content) return null

    return (
      <span
        aria-hidden="true"
        className={joinClasses(isStyled && styles.optionIcon, className)}
        data-plume-select-option-icon=""
        ref={ref}
        style={style}
      >
        {content}
      </span>
    )
  },
)

SelectOptionIcon.displayName = 'SelectOptionIcon'
