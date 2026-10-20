'use client'

import type { ForwardedRef, KeyboardEvent, MouseEvent, ReactNode, RefObject } from 'react'
import { forwardRef, useEffect, useId, useRef, useState } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { CheckIcon } from '../../../overlay/icons'
import type { ComponentProps } from '../../../theme'
import { useSelectContext, type SelectOptionRecord } from './select-context'
import styles from './select.module.css'

export type SelectOptionPart = 'check' | 'checkbox' | 'description' | 'icon'

export interface SelectOptionOwnProps {
  children?: ReactNode
  classNames?: Partial<Record<SelectOptionPart, string>>
  description?: ReactNode
  disabled?: boolean
  icon?: ReactNode
  label?: string
  value: string
}

export type SelectOptionProps = Omit<ComponentProps, 'index'> & SelectOptionOwnProps

const matchesQuery = (label: string, query: string): boolean =>
  label.toLowerCase().includes(query.toLowerCase())

const isActivationKey = (key: string): boolean => key === 'Enter' || key === ' '

function OptionMark({
  children,
  className,
  show,
}: Readonly<{ children: ReactNode; className: string | undefined; show: boolean }>): ReactNode {
  if (!show) return null
  return (
    <span aria-hidden="true" className={className}>
      {children}
    </span>
  )
}

function OptionDescription({
  children,
  className,
  id,
}: Readonly<{ children: ReactNode; className: string | undefined; id: string }>): ReactNode {
  if (!children) return null
  return (
    <>
      {' '}
      <span className={className} id={id}>
        {children}
      </span>
    </>
  )
}

function useOptionRecord(
  {
    children,
    disabled,
    icon,
    label,
    value,
  }: Pick<SelectOptionProps, 'children' | 'disabled' | 'icon' | 'label' | 'value'>,
  register: (record: SelectOptionRecord) => () => void,
): { resolved: string; textRef: RefObject<HTMLSpanElement | null> } {
  const textRef = useRef<HTMLSpanElement>(null)
  const iconRef = useRef(icon)
  const [text, setText] = useState(label ?? '')
  const resolved = label ?? text
  iconRef.current = icon

  useEffect(() => {
    if (label === undefined) setText(textRef.current?.textContent ?? '')
  }, [children, label])

  useEffect(() => {
    const record: SelectOptionRecord = {
      disabled: Boolean(disabled),
      get icon() {
        return iconRef.current
      },
      label: resolved,
      value,
    }
    return register(record)
  }, [disabled, register, resolved, value])

  return { resolved, textRef }
}

export const SelectOption = forwardRef<HTMLDivElement, SelectOptionProps>(
  (
    {
      children,
      className = '',
      classNames,
      description,
      disabled = false,
      icon,
      label,
      style,
      value,
    }: SelectOptionProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const context = useSelectContext('SelectOption')
    const id = useId()
    const descriptionId = useId()
    const textId = useId()
    const { isStyled, multiple, query, register, select, setActiveId } = context
    const { resolved, textRef } = useOptionRecord(
      { children, disabled, icon, label, value },
      register,
    )

    const selected = context.isSelected(value)
    const matches = matchesQuery(resolved, query)
    const classes = [isStyled && styles.option, className].filter(Boolean).join(' ')

    const handlePointerMove = (): void => {
      if (!disabled && context.activeId !== id) setActiveId(id)
    }

    const handleClick = (event: MouseEvent<HTMLDivElement>): void => {
      event.preventDefault()
      if (!disabled) select(value)
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
      if (!isActivationKey(event.key)) return
      event.preventDefault()
      if (!disabled) select(value)
    }

    return (
      <div
        aria-disabled={disabled || undefined}
        aria-labelledby={description ? `${textId} ${descriptionId}` : undefined}
        aria-selected={selected}
        className={classes || undefined}
        data-active={context.activeId === id ? '' : undefined}
        data-label={resolved}
        data-plume-select-option=""
        data-value={value}
        hidden={!matches}
        id={id}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseDown={(event) => event.preventDefault()}
        onPointerMove={handlePointerMove}
        ref={ref}
        role="option"
        style={style}
        tabIndex={-1}
      >
        <OptionMark
          className={joinClasses(isStyled && styles.checkbox, classNames?.checkbox)}
          show={multiple}
        >
          {selected ? <CheckIcon /> : null}
        </OptionMark>
        <OptionMark
          className={joinClasses(isStyled && styles.optionIcon, classNames?.icon)}
          show={Boolean(icon)}
        >
          {icon}
        </OptionMark>
        <span className={isStyled ? styles.optionBody : undefined} data-plume-select-option-body="">
          <span id={textId} ref={textRef}>
            {children ?? label}
          </span>
          <OptionDescription
            className={joinClasses(isStyled && styles.description, classNames?.description)}
            id={descriptionId}
          >
            {description}
          </OptionDescription>
        </span>
        <OptionMark
          className={joinClasses(isStyled && styles.check, classNames?.check)}
          show={!multiple && selected}
        >
          <CheckIcon />
        </OptionMark>
      </div>
    )
  },
)

SelectOption.displayName = 'SelectOption'
