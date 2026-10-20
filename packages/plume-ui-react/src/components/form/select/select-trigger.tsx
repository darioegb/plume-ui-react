'use client'

import type { CSSProperties, ForwardedRef, ReactNode } from 'react'
import { forwardRef, useEffect, useRef } from 'react'
import { ChevronDownIcon, CloseIcon } from '../../../overlay/icons'
import { joinClasses } from '../../../overlay/class-names'
import { mergeRefs } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import { useFieldContext } from '../field/field-context'
import { useSelectContext, type SelectContextValue } from './select-context'
import { OptionContent, SelectValue } from './select-value'
import styles from './select.module.css'

export type SelectTriggerPart = 'chevron' | 'chip' | 'chipRemove' | 'clear' | 'field' | 'trigger'

export interface SelectTriggerOwnProps {
  'aria-label'?: string
  'aria-labelledby'?: string
  children?: ReactNode
  classNames?: Partial<Record<SelectTriggerPart, string>>
  clearLabel?: string
  display?: 'chips' | 'text'
  maxDisplay?: number
  placeholder?: ReactNode
  removeLabel?: (label: string) => string
}

export type SelectTriggerProps = Omit<ComponentProps, 'index'> & SelectTriggerOwnProps

const srOnly: CSSProperties = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: 1,
  margin: -1,
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: 1,
}

function Chips({
  classNames,
  context,
  maxDisplay,
  removeLabel,
}: Readonly<{
  classNames?: SelectTriggerProps['classNames']
  context: SelectContextValue
  maxDisplay: number
  removeLabel: (label: string) => string
}>): ReactNode {
  const { isStyled, selectedOptions } = context
  const shown = selectedOptions.slice(0, maxDisplay)
  const hidden = selectedOptions.length - shown.length
  const canRemove = !context.disabled && !context.readOnly

  return (
    <>
      {shown.map((option) => (
        <span
          className={joinClasses(isStyled && styles.chip, classNames?.chip)}
          data-plume-select-chip=""
          key={option.value}
        >
          <span aria-hidden="true" className={isStyled ? styles.chipContent : undefined}>
            <OptionContent option={option} />
          </span>
          {canRemove ? (
            <button
              aria-label={removeLabel(option.label)}
              className={joinClasses(isStyled && styles.chipRemove, classNames?.chipRemove)}
              data-plume-select-remove=""
              onClick={() => context.remove(option.value)}
              type="button"
            >
              <CloseIcon />
            </button>
          ) : null}
        </span>
      ))}
      {hidden > 0 ? (
        <span
          className={joinClasses(isStyled && styles.chip, classNames?.chip)}
          data-plume-select-chip=""
        >
          +{hidden}
        </span>
      ) : null}
    </>
  )
}

export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  (
    {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      children,
      className = '',
      classNames,
      clearLabel = 'Clear',
      display = 'chips',
      maxDisplay = Number.POSITIVE_INFINITY,
      placeholder,
      removeLabel = (label) => `Remove ${label}`,
      style,
    }: SelectTriggerProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const context = useSelectContext('SelectTrigger')
    const button = useRef<HTMLButtonElement>(null)
    const field = useFieldContext()
    const { colorScheme, isStyled, multiple, name, open, selected, setLabelling, variant } = context
    const fieldLabel = field?.controlId === context.controlId ? field?.labelId : undefined
    const labelledBy = ariaLabelledby ?? (ariaLabel ? undefined : fieldLabel)
    const showChips = multiple && display === 'chips' && children === undefined
    const hasValue = selected.length > 0

    useEffect(() => {
      setLabelling({ label: ariaLabel, labelledBy })
    }, [ariaLabel, labelledBy, setLabelling])

    const classes = [
      isStyled && styles.control,
      isStyled && styles[variant],
      isStyled && styles[context.size],
      isStyled && styles[context.shape],
      isStyled && context.invalid && styles.invalid,
      isStyled && context.disabled && styles.disabled,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const colorVars = {
      '--select-color': `var(--plume-color-${colorScheme}-text)`,
      ...style,
    } as CSSProperties

    return (
      <div
        className={classes || undefined}
        data-open={open ? '' : undefined}
        data-plume-select-control=""
        ref={context.setTrigger}
        style={colorVars}
      >
        <div
          className={joinClasses(isStyled && styles.field, classNames?.field)}
          data-plume-select-field=""
        >
          {showChips ? (
            <Chips
              classNames={classNames}
              context={context}
              maxDisplay={maxDisplay}
              removeLabel={removeLabel}
            />
          ) : null}
          <button
            aria-activedescendant={open && !context.searchable ? context.activeId : undefined}
            aria-controls={context.listboxId}
            aria-describedby={context.describedBy}
            aria-expanded={open}
            aria-invalid={context.invalid || undefined}
            aria-label={ariaLabel}
            aria-labelledby={labelledBy}
            aria-readonly={context.readOnly || undefined}
            aria-required={context.required || undefined}
            className={joinClasses(isStyled && styles.trigger, classNames?.trigger)}
            data-placeholder={hasValue ? undefined : ''}
            data-plume-select-trigger=""
            disabled={context.disabled}
            id={context.controlId}
            onClick={() => (open ? context.close(false) : context.setOpen(true))}
            onKeyDown={(event) => context.onListKeyDown(event, false)}
            ref={mergeRefs<HTMLButtonElement>(button, ref)}
            role="combobox"
            type="button"
          >
            {showChips ? (
              <>
                {hasValue ? null : (
                  <span className={isStyled ? styles.placeholder : undefined}>{placeholder}</span>
                )}
                {hasValue ? (
                  <span style={srOnly}>
                    {context.selectedOptions.map((option) => option.label).join(', ')}
                  </span>
                ) : null}
              </>
            ) : (
              (children ?? <SelectValue placeholder={placeholder} />)
            )}
          </button>
        </div>
        {context.canClear && hasValue ? (
          <button
            aria-label={clearLabel}
            className={joinClasses(isStyled && styles.clear, classNames?.clear)}
            data-plume-select-clear=""
            onClick={context.clear}
            type="button"
          >
            <CloseIcon />
          </button>
        ) : null}
        <button
          aria-hidden="true"
          className={joinClasses(isStyled && styles.chevron, classNames?.chevron)}
          data-plume-select-chevron=""
          disabled={context.disabled}
          onClick={() => {
            button.current?.focus()
            if (open) context.close(false)
            else context.setOpen(true)
          }}
          onMouseDown={(event) => event.preventDefault()}
          tabIndex={-1}
          type="button"
        >
          <ChevronDownIcon />
        </button>
        {name ? <HiddenInputs name={name} /> : null}
      </div>
    )
  },
)

function HiddenInputs({ name }: Readonly<{ name: string }>): ReactNode {
  const { multiple, selected } = useSelectContext('SelectTrigger')
  if (multiple) {
    return selected.map((value) => <input key={value} name={name} type="hidden" value={value} />)
  }
  return <input name={name} type="hidden" value={selected[0] ?? ''} />
}

SelectTrigger.displayName = 'SelectTrigger'
