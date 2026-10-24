'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useEffect } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useSelectContext } from './select-context'
import { useSelectOptionContext } from './select-option-context'
import styles from './select.module.css'

type SelectOptionDescriptionRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export type SelectOptionDescriptionProps = Omit<ComponentProps, 'index'> &
  SelectOptionDescriptionRootAttributes

export const SelectOptionDescription = forwardRef<HTMLSpanElement, SelectOptionDescriptionProps>(
  (
    { children, className, style }: SelectOptionDescriptionProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled } = useSelectContext('SelectOptionDescription')
    const option = useSelectOptionContext('SelectOptionDescription')
    const { setDescribed } = option
    const content = children ?? option.description

    useEffect(() => {
      if (!content) return undefined
      setDescribed(true)
      return () => setDescribed(false)
    }, [content, setDescribed])

    if (!content) return null

    return (
      <>
        {' '}
        <span
          className={joinClasses(isStyled && styles.description, className)}
          data-plume-select-option-description=""
          id={option.descriptionId}
          ref={ref}
          style={style}
        >
          {content}
        </span>
      </>
    )
  },
)

SelectOptionDescription.displayName = 'SelectOptionDescription'
