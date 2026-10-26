'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { hasPart } from '../../../overlay/has-part'
import type { ComponentProps } from '../../../theme'
import { Collapse, CollapseBody, CollapseClip } from '../../utility/collapse'
import { useAccordionContext, useAccordionItemContext } from './accordion-context'
import { AccordionBody } from './accordion-body'
import styles from './accordion.module.css'

type AccordionContentRootAttributes = Pick<HTMLAttributes<HTMLElement>, 'children' | 'title'>

export type AccordionContentProps = Omit<ComponentProps, 'index'> & AccordionContentRootAttributes

/**
 * The panel, a `<section>` that only animates its height. Its content sits in a box with the
 * padding, unless you put an `AccordionBody` in it.
 */
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
        data-plume-accordion-content=""
        id={item.contentId}
        open={item.open}
        ref={ref}
        style={style}
        variant="unstyled"
        {...rest}
      >
        {composed ? (
          <CollapseClip>{children}</CollapseClip>
        ) : (
          <CollapseBody className={joinClasses(isStyled && styles.body)}>{children}</CollapseBody>
        )}
      </Collapse>
    )
  },
)

AccordionContent.displayName = 'AccordionContent'
