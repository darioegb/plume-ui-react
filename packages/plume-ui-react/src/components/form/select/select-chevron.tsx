'use client'

import type { ButtonHTMLAttributes, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { ChevronDownIcon } from '../../../overlay/icons'
import type { ComponentProps } from '../../../theme'
import { useSelectContext } from './select-context'
import { useSelectTriggerContext } from './select-trigger-context'
import styles from './select.module.css'

type SelectChevronRootAttributes = Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

export type SelectChevronProps = Omit<ComponentProps, 'index'> & SelectChevronRootAttributes

export const SelectChevron = forwardRef<HTMLButtonElement, SelectChevronProps>(
  (
    { children, className, style }: SelectChevronProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const context = useSelectContext('SelectChevron')
    const { toggle } = useSelectTriggerContext('SelectChevron')

    return (
      <button
        aria-hidden="true"
        className={joinClasses(context.isStyled && styles.chevron, className)}
        data-disabled={context.disabled ? '' : undefined}
        data-plume-select-chevron=""
        disabled={context.disabled}
        onClick={toggle}
        onMouseDown={(event) => event.preventDefault()}
        ref={ref}
        style={style}
        tabIndex={-1}
        type="button"
      >
        {children ?? <ChevronDownIcon />}
      </button>
    )
  },
)

SelectChevron.displayName = 'SelectChevron'
