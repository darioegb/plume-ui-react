'use client'

import type { AnchorHTMLAttributes, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useBreadcrumbContext } from './breadcrumb-context'
import styles from './breadcrumb.module.css'

export interface BreadcrumbLinkOwnProps {
  current?: boolean
}

type BreadcrumbLinkRootAttributes = Pick<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  | 'children'
  | 'hidden'
  | 'href'
  | 'hrefLang'
  | 'id'
  | 'onClick'
  | 'referrerPolicy'
  | 'rel'
  | 'target'
  | 'title'
>

export type BreadcrumbLinkProps = Omit<ComponentProps, 'index'> &
  BreadcrumbLinkRootAttributes &
  BreadcrumbLinkOwnProps

export const BreadcrumbLink = forwardRef<HTMLElement, BreadcrumbLinkProps>(
  (
    {
      children,
      className,
      current = false,
      href,
      hrefLang,
      onClick,
      referrerPolicy,
      rel,
      style,
      target,
      ...rest
    }: BreadcrumbLinkProps,
    ref: ForwardedRef<HTMLElement>,
  ): ReactNode => {
    const { isStyled } = useBreadcrumbContext('BreadcrumbLink')
    const common = {
      'aria-current': current ? ('page' as const) : undefined,
      className: joinClasses(isStyled && styles.link, className),
      'data-current': current ? '' : undefined,
      'data-plume-breadcrumb-link': '',
      style,
      ...rest,
    }

    if (href === undefined) {
      return (
        <span {...common} ref={ref}>
          {children}
        </span>
      )
    }

    return (
      <a
        {...common}
        href={href}
        hrefLang={hrefLang}
        onClick={onClick}
        ref={ref as ForwardedRef<HTMLAnchorElement>}
        referrerPolicy={referrerPolicy}
        rel={rel}
        target={target}
      >
        {children}
      </a>
    )
  },
)

BreadcrumbLink.displayName = 'BreadcrumbLink'
