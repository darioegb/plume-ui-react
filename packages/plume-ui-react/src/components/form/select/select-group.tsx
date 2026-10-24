'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef, useId, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useSelectContext } from './select-context'
import { SelectGroupContext } from './select-group-context'
import { SelectGroupLabel } from './select-group-label'
import { hasPart } from './select-parts'
import styles from './select.module.css'

export interface SelectGroupOwnProps {
  children?: ReactNode
  label?: ReactNode
}

export type SelectGroupProps = Omit<ComponentProps, 'index'> & SelectGroupOwnProps

export const SelectGroup = forwardRef<HTMLDivElement, SelectGroupProps>(
  (
    { children, className, label, style }: SelectGroupProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { isStyled } = useSelectContext('SelectGroup')
    const labelId = useId()
    const groupContext = useMemo(() => ({ labelId }), [labelId])

    return (
      <SelectGroupContext.Provider value={groupContext}>
        <div
          aria-labelledby={labelId}
          className={joinClasses(isStyled && styles.group, className)}
          data-plume-select-group=""
          ref={ref}
          role="group"
          style={style}
        >
          {hasPart(children, [SelectGroupLabel]) ? (
            children
          ) : (
            <>
              <SelectGroupLabel>{label}</SelectGroupLabel>
              {children}
            </>
          )}
        </div>
      </SelectGroupContext.Provider>
    )
  },
)

SelectGroup.displayName = 'SelectGroup'
