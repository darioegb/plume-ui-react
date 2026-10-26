'use client'

import type { ForwardedRef, InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useRatingContext, useRatingItemContext } from './rating-context'
import styles from './rating.module.css'

export interface RatingRadioOwnProps {
  /**
   * The score it gives. It is the position of its item by default; with `allowHalf`, use `position
   * - 0.5` for the first half.
   */
  value?: number
}

type RatingRadioRootAttributes = Pick<InputHTMLAttributes<HTMLInputElement>, 'aria-label' | 'title'>

export type RatingRadioProps = Omit<ComponentProps, 'index'> &
  RatingRadioRootAttributes &
  RatingRadioOwnProps

/** The radio of a star. It renders nothing when the rating is read only. */
export const RatingRadio = forwardRef<HTMLInputElement, RatingRadioProps>(
  (
    { 'aria-label': ariaLabel, className, style, title, value: valueProp }: RatingRadioProps,
    ref: ForwardedRef<HTMLInputElement>,
  ): ReactNode => {
    const {
      allowHalf,
      clearable,
      isStyled,
      labels,
      max,
      name,
      readOnly,
      setHover,
      setValue,
      value,
    } = useRatingContext('RatingRadio')
    const { position } = useRatingItemContext('RatingRadio')
    if (readOnly) return null
    const option = valueProp ?? position
    let half: string | undefined
    if (allowHalf) half = option === position ? 'end' : 'start'

    return (
      <input
        aria-label={ariaLabel ?? labels.item(option, max)}
        checked={value === option}
        className={joinClasses(isStyled && styles.radio, className)}
        data-half={half}
        data-plume-rating-radio=""
        name={name}
        onChange={() => setValue(option)}
        onClick={() => {
          if (clearable && value === option) setValue(0)
        }}
        onKeyDown={(event) => {
          if (clearable && (event.key === 'Backspace' || event.key === 'Delete')) {
            event.preventDefault()
            setValue(0)
          }
        }}
        onPointerEnter={() => setHover(option)}
        ref={ref}
        style={style}
        title={title}
        type="radio"
        value={option}
      />
    )
  },
)

RatingRadio.displayName = 'RatingRadio'
