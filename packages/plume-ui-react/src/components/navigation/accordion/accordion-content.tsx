'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { Collapse } from '../../utility/collapse'
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
      <Collapse
        aria-labelledby={item.triggerId}
        as="section"
        bodyClassName={joinClasses(isStyled && styles.body, bodyClassName)}
        className={className}
        data-plume-accordion-content=""
        id={item.contentId}
        open={item.open}
        ref={ref}
        style={style}
        variant="unstyled"
        {...rest}
      >
        {children}
      </Collapse>
    )
  },
)

AccordionContent.displayName = 'AccordionContent'
