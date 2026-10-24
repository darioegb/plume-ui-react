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
  level?: 1 | 2 | 3 | 4 | 5 | 6
}

type AccordionHeadingRootAttributes = Pick<HTMLAttributes<HTMLHeadingElement>, 'children' | 'title'>

export type AccordionHeadingProps = Omit<ComponentProps, 'index'> &
  AccordionHeadingRootAttributes &
  AccordionHeadingOwnProps

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
