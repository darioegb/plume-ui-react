'use client'

import type { CSSProperties, ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useId } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { mergeLabels } from '../../../overlay/labels'
import { visuallyHidden } from '../../../overlay/visually-hidden'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import { useFieldContext } from '../field/field-context'
import { StarIcon } from './rating-icons'
import { itemState, RatingItem, type RatingPart } from './rating-item'
import styles from './rating.module.css'
import { useRating } from './use-rating'

export type { RatingPart }

export type RatingVariant = 'solid' | 'unstyled'

export interface RatingLabels {
  item: (value: number, max: number) => string
  readOnly: (value: number, max: number) => string
}

export interface RatingOwnProps {
  allowHalf?: boolean
  classNames?: Partial<Record<RatingPart, string>>
  clearable?: boolean
  colorScheme?: ColorScheme
  defaultValue?: number
  disabled?: boolean
  emptyIcon?: ReactNode
  icon?: ReactNode
  labels?: Partial<RatingLabels>
  max?: number
  name?: string
  onValueChange?: (value: number) => void
  readOnly?: boolean
  required?: boolean
  size?: Size
  value?: number
  variant?: RatingVariant
}

type RatingRootAttributes = Pick<
  HTMLAttributes<HTMLElement>,
  'aria-describedby' | 'aria-invalid' | 'aria-label' | 'aria-labelledby' | 'hidden' | 'id' | 'title'
>

export type RatingProps = Omit<ComponentProps, 'index'> & RatingRootAttributes & RatingOwnProps

const halfOf = (allowHalf: boolean, option: number, position: number): string | undefined => {
  if (!allowHalf) return undefined
  return option === position ? 'end' : 'start'
}

const DEFAULT_LABELS: RatingLabels = {
  item: (value) => `${value} ${value === 1 ? 'star' : 'stars'}`,
  readOnly: (value, max) => `${value} out of ${max}`,
}

export const Rating = forwardRef<HTMLElement, RatingProps>(
  (
    {
      allowHalf = false,
      className,
      classNames,
      clearable = false,
      colorScheme = 'warning',
      defaultValue,
      disabled = false,
      emptyIcon,
      icon,
      labels,
      max = 5,
      name,
      onValueChange,
      readOnly = false,
      required = false,
      size = 'md',
      style,
      value: valueProp,
      variant = 'solid',
      ...rest
    }: RatingProps,
    ref: ForwardedRef<HTMLElement>,
  ): ReactNode => {
    const field = useFieldContext()
    const generatedName = useId()
    const rating = useRating({ allowHalf, defaultValue, max, onValueChange, value: valueProp })
    const isStyled = variant !== 'unstyled'
    const text = mergeLabels(DEFAULT_LABELS, labels)
    const fieldLabel = field?.controlId === rest.id ? field?.labelId : undefined
    const labelledBy = rest['aria-labelledby'] ?? (rest['aria-label'] ? undefined : fieldLabel)
    const filledIcon = icon ?? <StarIcon filled />
    const outlineIcon = emptyIcon ?? icon ?? <StarIcon filled={false} />
    const step = allowHalf ? 0.5 : 1
    const positions = [...new Array(max).keys()].map((index) => index + 1)
    const classes = joinClasses(
      isStyled && styles.rating,
      isStyled && styles[size],
      isStyled && !readOnly && !disabled && styles.interactive,
      isStyled && disabled && styles.disabled,
      className,
    )
    const colorVars = {
      '--rating-solid': `var(--plume-color-${colorScheme}-solid)`,
      '--rating-empty': 'var(--plume-border-strong)',
      ...style,
    } as CSSProperties

    if (readOnly) {
      return (
        <span
          className={classes}
          data-plume-rating=""
          ref={ref}
          style={colorVars}
          {...rest}
          aria-invalid={undefined}
          aria-label={undefined}
          aria-labelledby={undefined}
        >
          <span style={visuallyHidden}>{text.readOnly(rating.value, max)}</span>
          {positions.map((position) => (
            <RatingItem
              classNames={classNames}
              emptyIcon={outlineIcon}
              icon={filledIcon}
              isStyled={isStyled}
              key={position}
              state={itemState(position, rating.value)}
            />
          ))}
        </span>
      )
    }

    return (
      <fieldset
        {...rest}
        aria-labelledby={labelledBy}
        aria-required={required || undefined}
        className={classes}
        data-plume-rating=""
        disabled={disabled}
        onPointerLeave={() => rating.setHover(undefined)}
        ref={ref as ForwardedRef<HTMLFieldSetElement>}
        role="radiogroup"
        style={colorVars}
      >
        {positions.map((position) => (
          <RatingItem
            classNames={classNames}
            emptyIcon={outlineIcon}
            icon={filledIcon}
            isStyled={isStyled}
            key={position}
            state={itemState(position, rating.preview)}
          >
            {(allowHalf ? [position - step, position] : [position]).map((option) => (
              <input
                aria-label={text.item(option, max)}
                checked={rating.value === option}
                className={isStyled ? styles.radio : undefined}
                data-half={halfOf(allowHalf, option, position)}
                data-plume-rating-radio=""
                key={option}
                name={name ?? generatedName}
                onChange={() => rating.setValue(option)}
                onClick={() => {
                  if (clearable && rating.value === option) rating.setValue(0)
                }}
                onKeyDown={(event) => {
                  if (clearable && (event.key === 'Backspace' || event.key === 'Delete')) {
                    event.preventDefault()
                    rating.setValue(0)
                  }
                }}
                onPointerEnter={() => rating.setHover(option)}
                type="radio"
                value={option}
              />
            ))}
          </RatingItem>
        ))}
      </fieldset>
    )
  },
)

Rating.displayName = 'Rating'
