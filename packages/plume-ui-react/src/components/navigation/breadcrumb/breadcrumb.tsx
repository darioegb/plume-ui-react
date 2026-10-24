'use client'

import type { CSSProperties, ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { hasPart } from '../../../overlay/has-part'
import { useLabels } from '../../../locale/locale-provider'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import { BreadcrumbContext, type BreadcrumbVariant } from './breadcrumb-context'
import { BreadcrumbList } from './breadcrumb-list'
import styles from './breadcrumb.module.css'

export interface BreadcrumbLabels {
  breadcrumb: string
}

export interface BreadcrumbOwnProps {
  colorScheme?: ColorScheme
  labels?: Partial<BreadcrumbLabels>
  separator?: ReactNode
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

const DEFAULT_LABELS: BreadcrumbLabels = { breadcrumb: 'Breadcrumb' }

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
      labels,
      separator = '/',
      size = 'md',
      style,
      variant = 'plain',
      ...rest
    }: BreadcrumbProps,
    ref: ForwardedRef<HTMLElement>,
  ) => {
    const text = useLabels('breadcrumb', DEFAULT_LABELS, labels)
    const isStyled = variant !== 'unstyled'
    const context = useMemo(() => ({ isStyled, separator }), [isStyled, separator])

    return (
      <BreadcrumbContext.Provider value={context}>
        <nav
          aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : text.breadcrumb)}
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
          {hasPart(children, [BreadcrumbList]) ? (
            children
          ) : (
            <BreadcrumbList>{children}</BreadcrumbList>
          )}
        </nav>
      </BreadcrumbContext.Provider>
    )
  },
)

Breadcrumb.displayName = 'Breadcrumb'
