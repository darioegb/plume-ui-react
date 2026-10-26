import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { hasPart } from '../../../overlay/has-part'
import type { ComponentProps, Size } from '../../../theme'
import { DividerLabel } from './divider-label'
import styles from './divider.module.css'

export type DividerAlign = 'center' | 'end' | 'start'

export type DividerOrientation = 'horizontal' | 'vertical'

export type DividerVariant = 'dashed' | 'dotted' | 'solid' | 'unstyled'

export interface DividerOwnProps {
  /**
   * Where the label sits along the line.
   *
   * @default 'center'
   */
  align?: DividerAlign
  /**
   * Hides the line from assistive technology (`role="none"`).
   *
   * @default false
   */
  decorative?: boolean
  /**
   * Direction of the line.
   *
   * @default 'horizontal'
   */
  orientation?: DividerOrientation
  /**
   * Thickness of the line: 1, 2 or 3 pixels.
   *
   * @default 'sm'
   */
  size?: Size
  /** Space around the line. By default there is none. */
  spacing?: Size
  /**
   * Style of the line. `unstyled` drops the Plume styles so you can bring your own.
   *
   * @default 'solid'
   */
  variant?: DividerVariant
}

type DividerRootAttributes = Pick<
  HTMLAttributes<HTMLElement>,
  'aria-label' | 'aria-labelledby' | 'children' | 'hidden' | 'id' | 'title'
>

export type DividerProps = Omit<ComponentProps, 'index'> & DividerRootAttributes & DividerOwnProps

const spacingClass = { lg: styles.spacingLg, md: styles.spacingMd, sm: styles.spacingSm }

export const Divider = forwardRef<HTMLElement, DividerProps>(
  (
    {
      align = 'center',
      children,
      className,
      decorative = false,
      orientation = 'horizontal',
      size = 'sm',
      spacing,
      style,
      variant = 'solid',
      ...rest
    }: DividerProps,
    ref: ForwardedRef<HTMLElement>,
  ): ReactNode => {
    const isStyled = variant !== 'unstyled'
    const isVertical = orientation === 'vertical'
    const hasLabel =
      !isVertical && children !== undefined && children !== null && children !== false
    const classes = joinClasses(
      isStyled && styles.divider,
      isStyled && styles[orientation],
      isStyled && styles[variant],
      isStyled && styles[size],
      isStyled && spacing && spacingClass[spacing],
      isStyled && hasLabel && styles.labeled,
      className,
    )

    if (hasLabel) {
      return (
        <div
          className={classes}
          data-align={align}
          data-plume-divider=""
          ref={ref as ForwardedRef<HTMLDivElement>}
          style={style}
          {...rest}
        >
          {hasPart(children, [DividerLabel]) ? children : <DividerLabel>{children}</DividerLabel>}
        </div>
      )
    }

    return (
      <hr
        aria-orientation={isVertical ? 'vertical' : undefined}
        className={classes}
        data-plume-divider=""
        ref={ref as ForwardedRef<HTMLHRElement>}
        role={decorative ? 'none' : undefined}
        style={style}
        {...rest}
      />
    )
  },
)

Divider.displayName = 'Divider'
