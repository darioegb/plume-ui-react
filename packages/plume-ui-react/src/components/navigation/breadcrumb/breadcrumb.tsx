'use client'

import type { CSSProperties, ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import { BreadcrumbContext, type BreadcrumbVariant } from './breadcrumb-context'
import styles from './breadcrumb.module.css'

export type BreadcrumbPart = 'list' | 'separator'

export interface BreadcrumbOwnProps {
  colorScheme?: ColorScheme
  classNames?: Partial<Record<BreadcrumbPart, string>>
  /** @deprecated Use `classNames.list`. */
  listClassName?: string
  separator?: ReactNode
  /** @deprecated Use `classNames.separator`. */
  separatorClassName?: string
  size?: Size
  variant?: BreadcrumbVariant
}

type BreadcrumbRootAttributes = Pick<
  HTMLAttributes<HTMLElement>,
  'aria-label' | 'aria-labelledby' | 'children' | 'hidden' | 'id' | 'title'
>

export type BreadcrumbProps = Omit<ComponentProps, 'index'> &
  BreadcrumbRootAttributes &
  BreadcrumbOwnProps

const breadcrumbColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--breadcrumb-text': `var(--plume-color-${colorScheme}-text)`,
    '--breadcrumb-text-hover': `var(--plume-color-${colorScheme}-text-hover)`,
    '--breadcrumb-tint': `var(--plume-color-${colorScheme}-tint)`,
    '--breadcrumb-tint-text': `var(--plume-color-${colorScheme}-tint-text)`,
    ...style,
  }) as CSSProperties

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      className,
      colorScheme = 'primary',
      classNames,
      listClassName,
      separator = '/',
      separatorClassName,
      size = 'md',
      style,
      variant = 'plain',
      ...rest
    }: BreadcrumbProps,
    ref: ForwardedRef<HTMLElement>,
  ) => {
    const isStyled = variant !== 'unstyled'
    const context = useMemo(
      () => ({
        isStyled,
        separator,
        separatorClassName: joinClasses(separatorClassName, classNames?.separator),
      }),
      [classNames?.separator, isStyled, separator, separatorClassName],
    )

    return (
      <BreadcrumbContext.Provider value={context}>
        <nav
          aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : 'Breadcrumb')}
          aria-labelledby={ariaLabelledBy}
          className={joinClasses(
            isStyled && styles.breadcrumb,
            isStyled && styles[variant],
            isStyled && styles[size],
            className,
          )}
          data-plume-breadcrumb=""
          ref={ref}
          style={breadcrumbColorVars(colorScheme, style)}
          {...rest}
        >
          <ol
            className={joinClasses(isStyled && styles.list, listClassName, classNames?.list)}
            data-plume-breadcrumb-list=""
          >
            {children}
          </ol>
        </nav>
      </BreadcrumbContext.Provider>
    )
  },
)

Breadcrumb.displayName = 'Breadcrumb'
