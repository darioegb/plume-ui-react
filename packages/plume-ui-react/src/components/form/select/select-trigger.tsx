'use client'

import type { CSSProperties, ForwardedRef, ReactNode } from 'react'
import { forwardRef, useEffect, useRef } from 'react'
import { ChevronDownIcon, CloseIcon } from '../../../overlay/icons'
import { joinClasses } from '../../../overlay/class-names'
import { mergeRefs } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import { Chip } from '../../presentation/chip'
import { useFieldContext } from '../field/field-context'
import { useSelectContext, type SelectContextValue } from './select-context'
import { SelectValue } from './select-value'
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
  classNames: SelectTriggerProps['classNames']
  context: SelectContextValue
  maxDisplay: number
  removeLabel: (label: string) => string
}>): ReactNode {
  const { isStyled, selectedOptions } = context
  const shown = selectedOptions.slice(0, maxDisplay)
  const hidden = selectedOptions.length - shown.length
  const canRemove = !context.disabled && !context.readOnly
  const variant = isStyled ? 'subtle' : 'unstyled'

  return (
    <>
      {shown.map((option) => (
        <Chip
          className={classNames?.chip}
          classNames={{ remove: classNames?.chipRemove }}
          icon={option.icon}
          key={option.value}
          onRemove={canRemove ? () => context.remove(option.value) : undefined}
          removeLabel={removeLabel(option.label)}
          size={context.size}
          variant={variant}
        >
          <span aria-hidden="true">{option.label}</span>
        </Chip>
      ))}
      {hidden > 0 ? (
        <Chip className={classNames?.chip} size={context.size} variant={variant}>
          +{hidden}
        </Chip>
      ) : null}
    </>
  )
}

interface ControlParts {
  classNames?: SelectTriggerProps['classNames']
  context: SelectContextValue
}

function controlClasses(context: SelectContextValue, className: string): string | undefined {
  const { isStyled } = context
  const classes = [
    isStyled && styles.control,
    isStyled && styles[context.variant],
    isStyled && styles[context.size],
    isStyled && styles[context.shape],
    isStyled && context.invalid && styles.invalid,
    isStyled && context.disabled && styles.disabled,
    className,
  ]
  return classes.filter(Boolean).join(' ') || undefined
}

interface ComboboxButtonProps extends ControlParts {
  ariaLabel?: string
  children?: ReactNode
  labelledBy?: string
  placeholder?: ReactNode
  showChips: boolean
}

const ComboboxButton = forwardRef<HTMLButtonElement, ComboboxButtonProps>(
  (
    { ariaLabel, children, classNames, context, labelledBy, placeholder, showChips },
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const { isStyled, open } = context
    const hasValue = context.selected.length > 0
    const chipLabels = context.selectedOptions.map((option) => option.label).join(', ')

    return (
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
        ref={ref}
        role="combobox"
        type="button"
      >
        {showChips ? (
          <>
            {hasValue ? null : (
              <span className={isStyled ? styles.placeholder : undefined}>{placeholder}</span>
            )}
            {hasValue ? <span style={srOnly}>{chipLabels}</span> : null}
          </>
        ) : (
          (children ?? <SelectValue placeholder={placeholder} />)
        )}
      </button>
    )
  },
)

ComboboxButton.displayName = 'ComboboxButton'

function ClearButton({
  classNames,
  clearLabel,
  context,
}: Readonly<ControlParts & { clearLabel: string }>): ReactNode {
  return (
    <button
      aria-label={clearLabel}
      className={joinClasses(context.isStyled && styles.clear, classNames?.clear)}
      data-plume-select-clear=""
      onClick={context.clear}
      type="button"
    >
      <CloseIcon />
    </button>
  )
}

function ChevronButton({
  classNames,
  context,
  onToggle,
}: Readonly<ControlParts & { onToggle: () => void }>): ReactNode {
  return (
    <button
      aria-hidden="true"
      className={joinClasses(context.isStyled && styles.chevron, classNames?.chevron)}
      data-plume-select-chevron=""
      disabled={context.disabled}
      onClick={onToggle}
      onMouseDown={(event) => event.preventDefault()}
      tabIndex={-1}
      type="button"
    >
      <ChevronDownIcon />
    </button>
  )
}

function useLabelledBy(
  context: SelectContextValue,
  ariaLabel: string | undefined,
  ariaLabelledby: string | undefined,
): string | undefined {
  const field = useFieldContext()
  const { setLabelling } = context
  const fieldLabel = field?.controlId === context.controlId ? field.labelId : undefined
  const labelledBy = ariaLabelledby ?? (ariaLabel ? undefined : fieldLabel)

  useEffect(() => {
    setLabelling({ label: ariaLabel, labelledBy })
  }, [ariaLabel, labelledBy, setLabelling])

  return labelledBy
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
    const labelledBy = useLabelledBy(context, ariaLabel, ariaLabelledby)
    const { isStyled, name, open } = context
    const showChips = context.multiple && display === 'chips' && children === undefined
    const colorVars = {
      '--select-color': `var(--plume-color-${context.colorScheme}-text)`,
      ...style,
    } as CSSProperties

    const toggle = (): void => {
      button.current?.focus()
      if (open) context.close(false)
      else context.setOpen(true)
    }

    return (
      <div
        className={controlClasses(context, className)}
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
          <ComboboxButton
            ariaLabel={ariaLabel}
            classNames={classNames}
            context={context}
            labelledBy={labelledBy}
            placeholder={placeholder}
            ref={mergeRefs<HTMLButtonElement>(button, ref)}
            showChips={showChips}
          >
            {children}
          </ComboboxButton>
        </div>
        {context.canClear && context.selected.length > 0 ? (
          <ClearButton classNames={classNames} clearLabel={clearLabel} context={context} />
        ) : null}
        <ChevronButton classNames={classNames} context={context} onToggle={toggle} />
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
