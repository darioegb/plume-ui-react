'use client'

import type { CSSProperties, ForwardedRef, HTMLAttributes, MouseEvent, ReactNode } from 'react'
import { forwardRef, useId } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { CloseIcon } from '../../../overlay/icons'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'
import styles from './chip.module.css'

export type ChipPart = 'icon' | 'label' | 'remove'

export type ChipVariant = 'solid' | 'outline' | 'subtle' | 'unstyled'

export interface ChipOwnProps {
  classNames?: Partial<Record<ChipPart, string>>
  colorScheme?: ColorScheme
  disabled?: boolean
  icon?: ReactNode
  onRemove?: (event: MouseEvent<HTMLButtonElement>) => void
  removeLabel?: string
  shape?: Shape
  size?: Size
  variant?: ChipVariant
}

type ChipRootAttributes = Pick<
  HTMLAttributes<HTMLSpanElement>,
  'aria-label' | 'aria-labelledby' | 'children' | 'hidden' | 'id' | 'title'
>

export type ChipProps = Omit<ComponentProps, 'index'> & ChipRootAttributes & ChipOwnProps

const chipColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--chip-solid': `var(--plume-color-${colorScheme}-solid)`,
    '--chip-contrast': `var(--plume-color-${colorScheme}-solid-contrast)`,
    '--chip-text': `var(--plume-color-${colorScheme}-text)`,
    '--chip-tint': `var(--plume-color-${colorScheme}-tint)`,
    '--chip-tint-text': `var(--plume-color-${colorScheme}-tint-text)`,
    ...style,
  }) as CSSProperties

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(
  (
    {
      children,
      className = '',
      classNames,
      colorScheme = 'secondary',
      disabled = false,
      icon,
      onRemove,
      removeLabel,
      shape = 'pill',
      size = 'md',
      style,
      variant = 'subtle',
      ...rest
    }: ChipProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ) => {
    const isStyled = variant !== 'unstyled'
    const labelId = useId()
    const removeId = useId()
    const classes = joinClasses(
      isStyled && styles.chip,
      isStyled && styles[size],
      isStyled && styles[shape],
      isStyled && styles[variant],
      isStyled && disabled && styles.disabled,
      className,
    )

    return (
      <span
        className={classes}
        data-plume-chip=""
        ref={ref}
        style={chipColorVars(colorScheme, style)}
        {...rest}
      >
        {icon ? (
          <span
            aria-hidden="true"
            className={joinClasses(isStyled && styles.icon, classNames?.icon)}
          >
            {icon}
          </span>
        ) : null}
        <span className={joinClasses(isStyled && styles.label, classNames?.label)} id={labelId}>
          {children}
        </span>
        {onRemove ? (
          <button
            aria-label={removeLabel ?? 'Remove'}
            aria-labelledby={removeLabel ? undefined : `${removeId} ${labelId}`}
            className={joinClasses(isStyled && styles.remove, classNames?.remove)}
            data-plume-chip-remove=""
            disabled={disabled}
            id={removeId}
            onClick={onRemove}
            type="button"
          >
            <CloseIcon />
          </button>
        ) : null}
      </span>
    )
  },
)

Chip.displayName = 'Chip'
