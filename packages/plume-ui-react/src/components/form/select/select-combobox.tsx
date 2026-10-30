'use client'

import type { ButtonHTMLAttributes, ForwardedRef, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { mergeRefs } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import { SelectChipsSummary } from './select-chips-summary'
import { useSelectContext } from './select-context'
import { SelectPlaceholder } from './select-placeholder'
import { useSelectTriggerContext } from './select-trigger-context'
import { SelectValue } from './select-value'
import styles from './select.module.css'

type SelectComboboxRootAttributes = Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

export interface SelectComboboxOwnProps {
  /** What it shows when nothing is chosen. */
  placeholder?: ReactNode
}

export type SelectComboboxProps = Omit<ComponentProps, 'index'> &
  SelectComboboxRootAttributes &
  SelectComboboxOwnProps

/** The button with `role="combobox"`. Its `children` replace what it shows. */
export const SelectCombobox = forwardRef<HTMLButtonElement, SelectComboboxProps>(
  (
    { children, className, placeholder, style }: SelectComboboxProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const context = useSelectContext('SelectCombobox')
    const trigger = useSelectTriggerContext('SelectCombobox')
    const { isStyled, open } = context
    const hasValue = context.selected.length > 0
    const resolvedPlaceholder = placeholder ?? trigger.placeholder
    const showChips = context.multiple && trigger.display === 'chips' && children === undefined
    const mergedRef = useMemo(
      () => mergeRefs<HTMLButtonElement>(trigger.buttonRef, ref),
      [trigger.buttonRef, ref],
    )

    return (
      <button
        aria-activedescendant={open && !context.searchable ? context.activeId : undefined}
        aria-controls={context.listboxId}
        aria-describedby={context.describedBy}
        aria-expanded={open}
        aria-invalid={context.invalid || undefined}
        aria-label={trigger.ariaLabel}
        aria-labelledby={trigger.labelledBy}
        aria-readonly={context.readOnly || undefined}
        aria-required={context.required || undefined}
        className={joinClasses(isStyled && styles.trigger, className)}
        data-disabled={context.disabled ? '' : undefined}
        data-placeholder={hasValue ? undefined : ''}
        data-plume-select-combobox=""
        disabled={context.disabled}
        id={context.controlId}
        onClick={() => (open ? context.close(false) : context.setOpen(true))}
        onKeyDown={(event) => context.onListKeyDown(event, false)}
        ref={mergedRef}
        role="combobox"
        style={style}
        type="button"
      >
        {showChips ? (
          <>
            {hasValue ? null : <SelectPlaceholder>{resolvedPlaceholder}</SelectPlaceholder>}
            <SelectChipsSummary />
          </>
        ) : (
          (children ?? <SelectValue placeholder={resolvedPlaceholder} />)
        )}
      </button>
    )
  },
)

SelectCombobox.displayName = 'SelectCombobox'
