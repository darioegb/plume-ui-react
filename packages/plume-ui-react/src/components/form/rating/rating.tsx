'use client'

import type { CSSProperties, ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, Fragment, useId, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { hasPart } from '../../../overlay/has-part'
import { useLabels } from '../../../locale/locale-provider'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import { useFieldContext } from '../field/field-context'
import { RatingContext } from './rating-context'
import type { RatingContextValue, RatingLabels } from './rating-context'
import { StarIcon } from './rating-icons'
import { RatingItem } from './rating-item'
import { RatingValueText } from './rating-value-text'
import styles from './rating.module.css'
import { useRating } from './use-rating'

export type { RatingLabels }

export type RatingVariant = 'solid' | 'unstyled'

export interface RatingOwnProps {
  allowHalf?: boolean
  children?: ReactNode | ((position: number) => ReactNode)
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

const DEFAULT_LABELS: RatingLabels = {
  item: (value) => `${value} ${value === 1 ? 'star' : 'stars'}`,
  readOnly: (value, max) => `${value} out of ${max}`,
}

const FILLED_ICON = <StarIcon filled />
const OUTLINE_ICON = <StarIcon filled={false} />

export const Rating = forwardRef<HTMLElement, RatingProps>(
  (
    {
      allowHalf = false,
      children,
      className,
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
    const text = useLabels('rating', DEFAULT_LABELS, labels)
    const fieldLabel = field?.controlId === rest.id ? field?.labelId : undefined
    const labelledBy = rest['aria-labelledby'] ?? (rest['aria-label'] ? undefined : fieldLabel)
    const filledIcon = icon ?? FILLED_ICON
    const outlineIcon = emptyIcon ?? icon ?? OUTLINE_ICON
    const positions = [...new Array(max).keys()].map((index) => index + 1)
    const { preview, setHover, setValue, value } = rating
    const resolvedName = name ?? generatedName
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
    const context: RatingContextValue = useMemo(
      () => ({
        allowHalf,
        clearable,
        filledIcon,
        isStyled,
        labels: text,
        max,
        name: resolvedName,
        outlineIcon,
        preview,
        readOnly,
        setHover,
        setValue,
        value,
      }),
      [
        allowHalf,
        clearable,
        filledIcon,
        isStyled,
        max,
        outlineIcon,
        preview,
        readOnly,
        resolvedName,
        setHover,
        setValue,
        text,
        value,
      ],
    )

    let content: ReactNode
    if (typeof children === 'function') {
      content = (
        <>
          <RatingValueText />
          {positions.map((position) => (
            <Fragment key={position}>{children(position)}</Fragment>
          ))}
        </>
      )
    } else if (hasPart(children, [RatingItem, RatingValueText])) {
      content = children
    } else {
      content = (
        <>
          <RatingValueText />
          {positions.map((position) => (
            <RatingItem key={position} position={position} />
          ))}
        </>
      )
    }

    if (readOnly) {
      return (
        <RatingContext.Provider value={context}>
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
            {content}
          </span>
        </RatingContext.Provider>
      )
    }

    return (
      <RatingContext.Provider value={context}>
        <fieldset
          {...rest}
          aria-labelledby={labelledBy}
          aria-required={required || undefined}
          className={classes}
          data-plume-rating=""
          disabled={disabled}
          onPointerLeave={() => setHover(undefined)}
          ref={ref as ForwardedRef<HTMLFieldSetElement>}
          role="radiogroup"
          style={colorVars}
        >
          {content}
        </fieldset>
      </RatingContext.Provider>
    )
  },
)

Rating.displayName = 'Rating'
