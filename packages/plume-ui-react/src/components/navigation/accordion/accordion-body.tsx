'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useAccordionContext, useAccordionItemContext } from './accordion-context'
import styles from './accordion.module.css'

type AccordionBodyRootAttributes = Pick<HTMLAttributes<HTMLDivElement>, 'children' | 'title'>

export type AccordionBodyProps = Omit<ComponentProps, 'index'> & AccordionBodyRootAttributes

/**
 * The box with the content and the padding of the panel. Add it to style that box, or to change its
 * padding.
 */
export const AccordionBody = forwardRef<HTMLDivElement, AccordionBodyProps>(
  (
    { children, className, style, ...rest }: AccordionBodyProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { isStyled } = useAccordionContext('AccordionBody')
    const item = useAccordionItemContext('AccordionBody')

    return (
      <div
        className={joinClasses(isStyled && styles.body, className)}
        data-open={item.open ? '' : undefined}
        data-plume-accordion-body=""
        ref={ref}
        style={style}
        {...rest}
      >
        {children}
      </div>
    )
  },
)

AccordionBody.displayName = 'AccordionBody'
