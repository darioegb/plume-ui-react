'use client'

import type { ReactNode } from 'react'
import { useCallback, useId, useMemo, useState } from 'react'
import type { Placement } from '../../../overlay'
import { useOpenState } from '../../../overlay/use-open-state'
import type { ColorScheme, Shape, Size } from '../../../theme'
import { SelectContext, type SelectLabelling, type SelectVariant } from './select-context'
import { useSelectKeyboard } from './use-select-keyboard'
import { useSelectRegistry } from './use-select-registry'
import { useSelectValue } from './use-select-value'

interface SelectBaseProps {
  'aria-describedby'?: string
  'aria-invalid'?: boolean | 'true' | 'false'
  children: ReactNode
  clearable?: boolean
  closeOnSelect?: boolean
  colorScheme?: ColorScheme
  defaultOpen?: boolean
  disabled?: boolean
  flip?: boolean
  id?: string
  name?: string
  offset?: number
  onOpenChange?: (open: boolean) => void
  open?: boolean
  placement?: Placement
  readOnly?: boolean
  required?: boolean
  searchable?: boolean
  shape?: Shape
  shift?: boolean
  size?: Size
  variant?: SelectVariant
}

interface SelectSingleProps {
  defaultValue?: string
  multiple?: false
  onValueChange?: (value: string) => void
  value?: string
}

interface SelectMultipleProps {
  defaultValue?: string[]
  multiple: true
  onValueChange?: (value: string[]) => void
  value?: string[]
}

export type SelectProps = SelectBaseProps & (SelectMultipleProps | SelectSingleProps)

function nextSelection(
  selected: readonly string[],
  value: string,
  multiple: boolean,
): string[] | undefined {
  if (!multiple) return value === selected[0] ? undefined : [value]
  return selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]
}

export function Select({
  'aria-describedby': describedBy,
  'aria-invalid': ariaInvalid,
  children,
  clearable = false,
  closeOnSelect,
  colorScheme = 'secondary',
  defaultOpen = false,
  defaultValue,
  disabled = false,
  flip = true,
  id,
  multiple = false,
  name,
  offset = 4,
  onOpenChange,
  onValueChange,
  open: openProp,
  placement = 'bottom-start',
  readOnly = false,
  required = false,
  searchable = false,
  shape = 'rounded',
  shift = true,
  size = 'md',
  value,
  variant = 'outline',
}: Readonly<SelectProps>): ReactNode {
  const generatedId = useId()
  const baseId = id ?? generatedId
  const [trigger, setTrigger] = useState<HTMLElement | null>(null)
  const [listbox, setListbox] = useState<HTMLElement | null>(null)
  const [labelling, setLabelling] = useState<SelectLabelling>({})
  const [open, setOpenState] = useOpenState({ defaultOpen, onOpenChange, open: openProp })
  const { commit, selected } = useSelectValue({ defaultValue, multiple, onValueChange, value })
  const { options, register } = useSelectRegistry()
  const canEdit = !disabled && !readOnly
  const shouldClose = closeOnSelect ?? !multiple

  const setOpen = useCallback(
    (next: boolean): void => {
      if (!next || canEdit) setOpenState(next)
    },
    [canEdit, setOpenState],
  )

  const close = useCallback(
    (returnFocus: boolean): void => {
      setOpenState(false)
      if (returnFocus) trigger?.querySelector<HTMLElement>('[role="combobox"]')?.focus()
    },
    [setOpenState, trigger],
  )

  const select = (next: string): void => {
    if (!canEdit) return
    const result = nextSelection(selected, next, multiple)
    if (result) commit(result)
    if (shouldClose) close(true)
  }

  const clear = (): void => {
    if (canEdit && selected.length > 0) commit([])
  }

  const clearLast = (): void => {
    if (!canEdit || selected.length === 0) return
    commit(multiple ? selected.slice(0, -1) : [])
  }

  const keyboard = useSelectKeyboard({
    canEdit,
    canRemove: canEdit && (multiple || clearable),
    clearLast,
    close,
    commit: (next) => commit([next]),
    listbox,
    multiple,
    open,
    openList: () => setOpen(true),
    options,
    searchable,
    select,
    selected,
  })

  const chosen = useMemo(
    () => selected.flatMap((item) => options.find((record) => record.value === item) ?? []),
    [options, selected],
  )

  const context = {
    activeId: keyboard.activeId,
    canClear: clearable && canEdit,
    clear,
    close,
    colorScheme,
    controlId: baseId,
    describedBy,
    disabled,
    flip,
    invalid: ariaInvalid === true || ariaInvalid === 'true',
    isSelected: (item: string): boolean => selected.includes(item),
    isStyled: variant !== 'unstyled',
    labelling,
    listboxId: `${baseId}-listbox`,
    multiple,
    name,
    offset,
    onListKeyDown: keyboard.onListKeyDown,
    open,
    options,
    placement,
    query: keyboard.query,
    readOnly,
    register,
    required,
    searchable,
    select,
    selected,
    selectedOptions: chosen,
    setActiveId: keyboard.setActiveId,
    setLabelling,
    setListbox,
    setOpen,
    setQuery: keyboard.setQuery,
    setTrigger,
    shape,
    shift,
    size,
    trigger,
    variant,
  }

  return <SelectContext.Provider value={context}>{children}</SelectContext.Provider>
}
