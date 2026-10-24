'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { type SelectedOption, useSelectContext } from './select-context'
import styles from './select.module.css'

type SelectValueTextRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export type SelectValueTextProps = Omit<ComponentProps, 'index'> & SelectValueTextRootAttributes

export const SelectValueText = forwardRef<HTMLSpanElement, SelectValueTextProps>(
  (
    { children, className, style }: SelectValueTextProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled } = useSelectContext('SelectValueText')

    return (
      <span
        className={joinClasses(isStyled && styles.valueText, className)}
        data-plume-select-value-text=""
        ref={ref}
        style={style}
      >
        {children}
      </span>
    )
  },
)

SelectValueText.displayName = 'SelectValueText'

export type SelectValueIconProps = SelectValueTextProps

export const SelectValueIcon = forwardRef<HTMLSpanElement, SelectValueIconProps>(
  (
    { children, className, style }: SelectValueIconProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled } = useSelectContext('SelectValueIcon')

    return (
      <span
        aria-hidden="true"
        className={joinClasses(isStyled && styles.valueIcon, className)}
        data-plume-select-value-icon=""
        ref={ref}
        style={style}
      >
        {children}
      </span>
    )
  },
)

SelectValueIcon.displayName = 'SelectValueIcon'

export interface SelectValueOptionOwnProps {
  option: SelectedOption
}

export type SelectValueOptionProps = Omit<ComponentProps, 'index'> &
  SelectValueTextRootAttributes &
  SelectValueOptionOwnProps

export const SelectValueOption = forwardRef<HTMLSpanElement, SelectValueOptionProps>(
  (
    { children, className, option, style }: SelectValueOptionProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled } = useSelectContext('SelectValueOption')

    return (
      <span
        className={joinClasses(isStyled && styles.value, className)}
        data-plume-select-value-option=""
        ref={ref}
        style={style}
      >
        {children ?? (
          <>
            {option.icon ? <SelectValueIcon>{option.icon}</SelectValueIcon> : null}
            <SelectValueText>{option.label}</SelectValueText>
          </>
        )}
      </span>
    )
  },
)

SelectValueOption.displayName = 'SelectValueOption'
