'use client'

import type { CSSProperties, ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import { ListContext } from './list-context'
import styles from './list.module.css'

export interface ListOwnProps {
  /**
   * The element to render. By default it follows the marker: `ol` for `number` and `ul` for the
   * rest. Use it to get an `<ol>` with the `unstyled` variant.
   */
  as?: 'ul' | 'ol'
  /**
   * Color scheme from the theme palette, used for the selected item and the focus ring.
   *
   * @default 'primary'
   */
  colorScheme?: ColorScheme
  /**
   * Draws a line between the items. It is on by default for `bordered` and off for the other
   * variants.
   */
  divided?: boolean
  /**
   * Bullets or numbers for a list of plain text items. `number` renders an `<ol>`. The markers go
   * with text items: a row with an icon or a button is a flex row and has none.
   *
   * @default 'none'
   */
  marker?: ListMarker
  /**
   * Size of the text and of the padding of the items.
   *
   * @default 'md'
   */
  size?: Size
  /**
   * Visual variant. `plain` has no container, `bordered` draws a border and divides the items, and
   * `filled` gives the List a muted background. `unstyled` drops the Plume styles so you can bring
   * your own.
   *
   * @default 'plain'
   */
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
    '--list-tint-text': `var(--plume-color-${colorScheme}-tint-text)`,
    ...style,
  }) as CSSProperties

export const List = forwardRef<HTMLUListElement, ListProps>(
  (
    {
      as,
      children,
      className,
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
    const context = useMemo(() => ({ isStyled }), [isStyled])
    const classes = joinClasses(
      isStyled && styles.list,
      isStyled && styles[variant],
      isStyled && styles[size],
      isStyled && styles[marker],
      isStyled && hasDividers && styles.divided,
      className,
    )

    return (
      <ListContext.Provider value={context}>
        <Element
          className={classes}
          data-plume-list=""
          ref={ref as ForwardedRef<HTMLOListElement>}
          role={role ?? (marker === 'none' ? 'list' : undefined)}
          style={listColorVars(colorScheme, style)}
          {...rest}
        >
          {children}
        </Element>
      </ListContext.Provider>
    )
  },
)

List.displayName = 'List'
