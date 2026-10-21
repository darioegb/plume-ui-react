'use client'

import type { CSSProperties, ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useId } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import { useFieldContext } from '../field/field-context'
import { StarIcon } from './rating-icons'
import { itemState, RatingItem, type RatingPart } from './rating-item'
import styles from './rating.module.css'
import { useRating } from './use-rating'

export type { RatingPart }

export type RatingVariant = 'solid' | 'unstyled'

export interface RatingOwnProps {
  allowHalf?: boolean
  classNames?: Partial<Record<RatingPart, string>>
  clearable?: boolean
  colorScheme?: ColorScheme
  defaultValue?: number
  disabled?: boolean
  emptyIcon?: ReactNode
  getItemLabel?: (value: number, max: number) => string
  icon?: ReactNode
  max?: number
  name?: string
  onValueChange?: (value: number) => void
  readOnly?: boolean
  readOnlyLabel?: (value: number, max: number) => string
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

const defaultItemLabel = (value: number): string => `${value} ${value === 1 ? 'star' : 'stars'}`

const defaultReadOnlyLabel = (value: number, max: number): string => `${value} out of ${max}`

const srOnly: CSSProperties = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: 1,
  margin: -1,
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: 1,
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
      getItemLabel = defaultItemLabel,
      icon,
      max = 5,
      name,
      onValueChange,
      readOnly = false,
      readOnlyLabel = defaultReadOnlyLabel,
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
    const fieldLabel = field?.controlId === rest.id ? field?.labelId : undefined
    const labelledBy = rest['aria-labelledby'] ?? (rest['aria-label'] ? undefined : fieldLabel)
    const filledIcon = icon ?? <StarIcon filled />
    const outlineIcon = emptyIcon ?? (icon ? icon : <StarIcon filled={false} />)
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
          <span style={srOnly}>{readOnlyLabel(rating.value, max)}</span>
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
                aria-label={getItemLabel(option, max)}
                checked={rating.value === option}
                className={isStyled ? styles.radio : undefined}
                data-half={allowHalf ? (option === position ? 'end' : 'start') : undefined}
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
