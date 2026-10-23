import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps, Size } from '../../../theme'
import styles from './divider.module.css'

export type DividerAlign = 'center' | 'end' | 'start'

export type DividerOrientation = 'horizontal' | 'vertical'

export type DividerPart = 'label'

export type DividerVariant = 'dashed' | 'dotted' | 'solid' | 'unstyled'

export interface DividerOwnProps {
  align?: DividerAlign
  classNames?: Partial<Record<DividerPart, string>>
  decorative?: boolean
  orientation?: DividerOrientation
  size?: Size
  spacing?: Size
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
      classNames,
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
          <span
            className={joinClasses(isStyled && styles.label, classNames?.label)}
            data-plume-divider-label=""
          >
            {children}
          </span>
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
