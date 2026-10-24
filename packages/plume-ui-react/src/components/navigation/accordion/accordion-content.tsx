'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { hasPart } from '../../../overlay/has-part'
import type { ComponentProps } from '../../../theme'
import { Collapse } from '../../utility/collapse'
import { useAccordionContext, useAccordionItemContext } from './accordion-context'
import { AccordionBody } from './accordion-body'
import styles from './accordion.module.css'

type AccordionContentRootAttributes = Pick<HTMLAttributes<HTMLElement>, 'children' | 'title'>

export type AccordionContentProps = Omit<ComponentProps, 'index'> & AccordionContentRootAttributes

export const AccordionContent = forwardRef<HTMLElement, AccordionContentProps>(
  (
    { children, className, style, ...rest }: AccordionContentProps,
    ref: ForwardedRef<HTMLElement>,
  ): ReactNode => {
    const { isStyled } = useAccordionContext('AccordionContent')
    const item = useAccordionItemContext('AccordionContent')
    const composed = hasPart(children, [AccordionBody])

    return (
      <Collapse
        aria-labelledby={item.triggerId}
        as="section"
        className={className}
        classNames={{ body: composed ? undefined : joinClasses(isStyled && styles.body) }}
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
