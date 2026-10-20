import type { CSSProperties, ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import styles from './list.module.css'

export interface ListOwnProps {
  as?: 'ul' | 'ol'
  colorScheme?: ColorScheme
  divided?: boolean
  marker?: ListMarker
  size?: Size
  variant?: ListVariant
}

export type ListVariant = 'plain' | 'bordered' | 'filled' | 'unstyled'
export type ListMarker = 'none' | 'bullet' | 'number'

type ListRootAttributes = Pick<
  HTMLAttributes<HTMLUListElement>,
  'aria-label' | 'aria-labelledby' | 'children' | 'hidden' | 'id' | 'role' | 'title'
>

export type ListProps = Omit<ComponentProps, 'index'> & ListRootAttributes & ListOwnProps

const listColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--list-text': `var(--plume-color-${colorScheme}-text)`,
    '--list-tint': `var(--plume-color-${colorScheme}-tint)`,
    '--list-tint-strong': `var(--plume-color-${colorScheme}-tint-strong)`,
    ...style,
  }) as CSSProperties

export const List = forwardRef<HTMLUListElement, ListProps>(
  (
    {
      as,
      children,
      className = '',
      colorScheme = 'primary',
      divided,
      marker = 'none',
      role,
      size = 'md',
      style,
      variant = 'plain',
      ...rest
    }: ListProps,
    ref: ForwardedRef<HTMLUListElement>,
  ) => {
    const Element = as ?? (marker === 'number' ? 'ol' : 'ul')
    const isStyled = variant !== 'unstyled'
    const hasDividers = divided ?? variant === 'bordered'
    const classes = [
      isStyled && styles.list,
      isStyled && styles[variant],
      isStyled && styles[size],
      isStyled && styles[marker],
      isStyled && hasDividers && styles.divided,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <Element
        className={classes}
        ref={ref as ForwardedRef<HTMLOListElement>}
        role={role ?? (marker === 'none' ? 'list' : undefined)}
        style={listColorVars(colorScheme, style)}
        {...rest}
      >
        {children}
      </Element>
    )
  },
)

List.displayName = 'List'
