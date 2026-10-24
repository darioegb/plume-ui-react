'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { mergeRefs } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import { useSelectContentContext } from './select-content-context'
import { useSelectContext } from './select-context'
import styles from './select.module.css'

type SelectListRootAttributes = Pick<HTMLAttributes<HTMLDivElement>, 'aria-label' | 'children'>

export type SelectListProps = Omit<ComponentProps, 'index'> & SelectListRootAttributes

export const SelectList = forwardRef<HTMLDivElement, SelectListProps>(
  (
    { 'aria-label': ariaLabel, children, className, style }: SelectListProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const context = useSelectContext('SelectList')
    const content = useSelectContentContext('SelectList')
    const { labelling, setListbox } = context
    const explicitLabel = ariaLabel ?? content.ariaLabel
    const mergedRef = useMemo(() => mergeRefs<HTMLDivElement>(setListbox, ref), [ref, setListbox])

    return (
      <div
        aria-label={explicitLabel ?? labelling.label}
        aria-labelledby={explicitLabel ? undefined : labelling.labelledBy}
        aria-multiselectable={context.multiple || undefined}
        className={joinClasses(context.isStyled && styles.list, className)}
        data-plume-select-list=""
        id={context.listboxId}
        ref={mergedRef}
        role="listbox"
        style={style}
      >
        {children}
      </div>
    )
  },
)

SelectList.displayName = 'SelectList'
