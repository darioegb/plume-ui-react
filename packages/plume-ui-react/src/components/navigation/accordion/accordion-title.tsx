'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'
import { useAccordionItemContext } from './accordion-context'

type AccordionTitleRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children' | 'title'>

export type AccordionTitleProps = Omit<ComponentProps, 'index'> & AccordionTitleRootAttributes

/** The text inside the trigger. */
export const AccordionTitle = forwardRef<HTMLSpanElement, AccordionTitleProps>(
  (
    { children, className, style, ...rest }: AccordionTitleProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const item = useAccordionItemContext('AccordionTitle')

    return (
      <span
        className={className}
        data-open={item.open ? '' : undefined}
        data-plume-accordion-title=""
        ref={ref}
        style={style}
        {...rest}
      >
        {children}
      </span>
    )
  },
)

AccordionTitle.displayName = 'AccordionTitle'
