import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps, Size } from '../../../theme'
import styles from './list.module.css'

export interface ListOwnProps {
  as?: 'ul' | 'ol'
  size?: Size
  spacing?: Size
  variant?: ListVariant
}

export type ListVariant = 'unordered' | 'ordered' | 'plain' | 'unstyled'

type ListRootAttributes = Pick<
  HTMLAttributes<HTMLUListElement>,
  'aria-label' | 'aria-labelledby' | 'children' | 'hidden' | 'id' | 'role' | 'title'
>

export type ListProps = Omit<ComponentProps, 'index'> & ListRootAttributes & ListOwnProps

export const List = forwardRef<HTMLUListElement, ListProps>(
  (
    {
      as,
      children,
      className = '',
      role,
      size = 'md',
      spacing = 'md',
      style,
      variant = 'unordered',
      ...rest
    }: ListProps,
    ref: ForwardedRef<HTMLUListElement>,
  ) => {
    const Element = as ?? (variant === 'ordered' ? 'ol' : 'ul')
    const isStyled = variant !== 'unstyled'
    const classes = [
      isStyled && styles.list,
      isStyled && styles[variant],
      isStyled && styles[size],
      isStyled && styles[`spacing-${spacing}`],
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <Element
        className={classes}
        ref={ref as ForwardedRef<HTMLOListElement>}
        role={role ?? (variant === 'plain' ? 'list' : undefined)}
        style={style}
        {...rest}
      >
        {children}
      </Element>
    )
  },
)

List.displayName = 'List'
