'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useAccordionContext, useAccordionItemContext } from './accordion-context'
import styles from './accordion.module.css'

export interface AccordionContentOwnProps {
  bodyClassName?: string
}

type AccordionContentRootAttributes = Pick<HTMLAttributes<HTMLElement>, 'children' | 'title'>

export type AccordionContentProps = Omit<ComponentProps, 'index'> &
  AccordionContentRootAttributes &
  AccordionContentOwnProps

export const AccordionContent = forwardRef<HTMLElement, AccordionContentProps>(
  (
    { bodyClassName, children, className, style, ...rest }: AccordionContentProps,
    ref: ForwardedRef<HTMLElement>,
  ): ReactNode => {
    const { isStyled } = useAccordionContext('AccordionContent')
    const item = useAccordionItemContext('AccordionContent')

    return (
      <section
        aria-labelledby={item.triggerId}
        className={joinClasses(isStyled && styles.content, className)}
        data-open={item.open ? '' : undefined}
        data-plume-accordion-content=""
        id={item.contentId}
        ref={ref}
        style={style}
        {...rest}
      >
        <div data-plume-accordion-clip="">
          <div className={joinClasses(isStyled && styles.body, bodyClassName)}>{children}</div>
        </div>
      </section>
    )
  },
)

AccordionContent.displayName = 'AccordionContent'
