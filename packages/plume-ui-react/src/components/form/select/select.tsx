'use client'

import type { ReactNode } from 'react'
import { useCallback, useId, useMemo, useState } from 'react'
import type { Placement } from '../../../overlay'
import { mergeLabels } from '../../../overlay/labels'
import { useOpenState } from '../../../overlay/use-open-state'
import { useSelectionState } from '../../../overlay/use-selection-state'
import type { ColorScheme, Shape, Size } from '../../../theme'
import {
  SelectContext,
  type SelectLabelling,
  type SelectLabels,
  type SelectVariant,
} from './select-context'
import { useSelectKeyboard } from './use-select-keyboard'
import { useSelectRegistry } from './use-select-registry'

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
  labels?: Partial<SelectLabels>
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

const DEFAULT_LABELS: SelectLabels = {
  clear: 'Clear',
  empty: 'No results',
  remove: (label) => `Remove ${label}`,
  search: 'Search',
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
  labels,
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
  const [open, setOpenState] = useOpenState({
    defaultOpen,
    onOpenChange,
    open: openProp,
  })
  const { commit, selected } = useSelectionState({
    defaultValue,
    multiple,
    onValueChange,
    value,
  })
  const { options, register } = useSelectRegistry()
  const merged = mergeLabels(DEFAULT_LABELS, labels)
  const text = useMemo<SelectLabels>(
    () => ({
      clear: merged.clear,
      empty: merged.empty,
      remove: merged.remove,
      search: merged.search,
    }),
    [merged.clear, merged.empty, merged.remove, merged.search],
  )
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

  const select = useCallback(
    (next: string): void => {
      if (!canEdit) return
      const result = nextSelection(selected, next, multiple)
      if (result) commit(result)
      if (shouldClose) close(true)
    },
    [canEdit, close, commit, multiple, selected, shouldClose],
  )

  const clear = useCallback((): void => {
    if (canEdit && selected.length > 0) commit([])
  }, [canEdit, commit, selected])

  const remove = useCallback(
    (item: string): void => {
      if (canEdit) commit(selected.filter((current) => current !== item))
    },
    [canEdit, commit, selected],
  )

  const clearLast = useCallback((): void => {
    if (!canEdit || selected.length === 0) return
    commit(multiple ? selected.slice(0, -1) : [])
  }, [canEdit, commit, multiple, selected])

  const isSelected = useCallback((item: string): boolean => selected.includes(item), [selected])

  const { activeId, onListKeyDown, query, setActiveId, setQuery } = useSelectKeyboard({
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

  const context = useMemo(
    () => ({
      activeId,
      canClear: clearable && canEdit,
      clear,
      close,
      colorScheme,
      controlId: baseId,
      describedBy,
      disabled,
      flip,
      invalid: ariaInvalid === true || ariaInvalid === 'true',
      isSelected,
      isStyled: variant !== 'unstyled',
      labelling,
      labels: text,
      listboxId: `${baseId}-listbox`,
      multiple,
      name,
      offset,
      onListKeyDown,
      open,
      options,
      placement,
      query,
      readOnly,
      register,
      remove,
      required,
      searchable,
      select,
      selected,
      selectedOptions: chosen,
      setActiveId,
      setLabelling,
      setListbox,
      setOpen,
      setQuery,
      setTrigger,
      shape,
      shift,
      size,
      trigger,
      variant,
    }),
    [
      activeId,
      ariaInvalid,
      baseId,
      canEdit,
      chosen,
      clear,
      clearable,
      close,
      colorScheme,
      describedBy,
      disabled,
      flip,
      isSelected,
      labelling,
      multiple,
      name,
      offset,
      onListKeyDown,
      open,
      options,
      placement,
      query,
      readOnly,
      register,
      remove,
      required,
      searchable,
      select,
      selected,
      setActiveId,
      setOpen,
      setQuery,
      shape,
      shift,
      size,
      text,
      trigger,
      variant,
    ],
  )

  return <SelectContext.Provider value={context}>{children}</SelectContext.Provider>
}
