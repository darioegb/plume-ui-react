'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { createElement, forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import {
  AccordionHeadingContext,
  useAccordionContext,
  useAccordionItemContext,
} from './accordion-context'
import styles from './accordion.module.css'

export interface AccordionHeadingOwnProps {
  /**
   * The heading level, from `1` to `6`, so you choose the one that fits your page.
   *
   * @default 3
   */
  level?: 1 | 2 | 3 | 4 | 5 | 6
}

type AccordionHeadingRootAttributes = Pick<HTMLAttributes<HTMLHeadingElement>, 'children' | 'title'>

export type AccordionHeadingProps = Omit<ComponentProps, 'index'> &
  AccordionHeadingRootAttributes &
  AccordionHeadingOwnProps

/**
 * The heading (`<h1>` to `<h6>`, `3` by default) around a trigger. Use it to style the heading or
 * to put something next to the trigger inside it. A trigger inside an `AccordionHeading` does not
 * add its own.
 */
export const AccordionHeading = forwardRef<HTMLHeadingElement, AccordionHeadingProps>(
  (
    { children, className, level = 3, style, ...rest }: AccordionHeadingProps,
    ref: ForwardedRef<HTMLHeadingElement>,
  ): ReactNode => {
    const { isStyled } = useAccordionContext('AccordionHeading')
    const item = useAccordionItemContext('AccordionHeading')

    return (
      <AccordionHeadingContext.Provider value>
        {createElement(
          `h${level}`,
          {
            className: joinClasses(isStyled && styles.heading, className),
            'data-disabled': item.disabled ? '' : undefined,
            'data-open': item.open ? '' : undefined,
            'data-plume-accordion-heading': '',
            ref,
            style,
            ...rest,
          },
          children,
        )}
      </AccordionHeadingContext.Provider>
    )
  },
)

AccordionHeading.displayName = 'AccordionHeading'
