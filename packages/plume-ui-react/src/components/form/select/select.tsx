'use client'

import type { ReactNode } from 'react'
import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import type { Placement } from '../../../overlay'
import { useLabels } from '../../../locale/locale-provider'
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
  /**
   * Ids of the elements that describe the select. A `Field` adds its helper text and its error.
   */
  'aria-describedby'?: string
  /**
   * Marks the value as invalid, and the field draws its border with the error color. A `Field` sets
   * it.
   */
  'aria-invalid'?: boolean | 'true' | 'false'
  /** The `SelectTrigger` and the `SelectContent`. */
  children: ReactNode
  /**
   * Shows a button to clear the value, and lets <kbd>Backspace</kbd> clear a single value.
   * @default false
   */
  clearable?: boolean
  /**
   * Whether choosing an option closes the list: `true` for one value and `false` for several.
   * @default true
   */
  closeOnSelect?: boolean
  /**
   * Color of the focus ring, from the theme palette (custom schemes included).
   * @default 'secondary'
   */
  colorScheme?: ColorScheme
  /**
   * Whether the list is open at first, for an uncontrolled select.
   * @default false
   */
  defaultOpen?: boolean
  /**
   * Disables the select.
   * @default false
   */
  disabled?: boolean
  /**
   * Opens on the opposite side when there is no room on the one asked for.
   * @default true
   */
  flip?: boolean
  /** Id of the button of the trigger. A `Field` sets it, to link its label to the select. */
  id?: string
  /**
   * The texts of the select, for other languages: `clear` is the accessible name of the clear
   * button (`Clear`), `remove(label)` the name of the button that removes a chip (`Remove Apple`),
   * `overflow(hidden)` the text of the chip that counts the hidden ones (`+2`), `search` the name
   * of the search box (`Search`) and `empty` what shows when the search finds nothing
   * (`No results`).
   */
  labels?: Partial<SelectLabels>
  /**
   * Name of the field in a form. The select adds hidden inputs with the chosen values: one for a
   * single value, one for each value when it is `multiple`.
   */
  name?: string
  /**
   * Distance in pixels between the field and the list.
   * @default 4
   */
  offset?: number
  /** Called with the new state when the list opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Whether the list is open, for a controlled select. Pair it with `onOpenChange`. */
  open?: boolean
  /**
   * Where the list opens, relative to the field.
   * @default 'bottom-start'
   */
  placement?: Placement
  /**
   * The value is shown and focusable, but the list does not open.
   * @default false
   */
  readOnly?: boolean
  /**
   * Marks the select as required for assistive technology.
   * @default false
   */
  required?: boolean
  /**
   * Adds a search box to the list that filters the options as the user types. Typing on the closed
   * trigger opens it with that text.
   * @default false
   */
  searchable?: boolean
  /**
   * Shape of the `outline` field.
   * @default 'rounded'
   */
  shape?: Shape
  /**
   * Slides the list along its side to keep it inside the screen.
   * @default true
   */
  shift?: boolean
  /**
   * Height and text size of the field.
   * @default 'md'
   */
  size?: Size
  /**
   * Visual variant, the same ones as `Input`. `unstyled` drops the Plume styles so you can bring
   * your own.
   * @default 'outline'
   */
  variant?: SelectVariant
}

interface SelectSingleProps {
  /**
   * The value of an uncontrolled select at first: a string, or an array of strings when it is
   * `multiple`.
   */
  defaultValue?: string
  /**
   * Lets the user choose several options. The list stays open after each choice and the trigger
   * shows the chosen options as chips.
   * @default false
   */
  multiple?: false
  /**
   * Called with the new value: a string, or an array of strings when it is `multiple`. It is an
   * empty string, or an empty array, when the value is cleared.
   */
  onValueChange?: (value: string) => void
  /**
   * The value of a controlled select: the `value` of the chosen option, or an array of them when
   * it is `multiple`. Pair it with `onValueChange`.
   */
  value?: string
}

interface SelectMultipleProps {
  /**
   * The value of an uncontrolled select at first: a string, or an array of strings when it is
   * `multiple`.
   */
  defaultValue?: string[]
  /**
   * Lets the user choose several options. The list stays open after each choice and the trigger
   * shows the chosen options as chips.
   */
  multiple: true
  /**
   * Called with the new value: a string, or an array of strings when it is `multiple`. It is an
   * empty string, or an empty array, when the value is cleared.
   */
  onValueChange?: (value: string[]) => void
  /**
   * The value of a controlled select: the `value` of the chosen option, or an array of them when it
   * is `multiple`. Pair it with `onValueChange`.
   */
  value?: string[]
}

const DEFAULT_LABELS: SelectLabels = {
  clear: 'Clear',
  empty: 'No results',
  overflow: (hidden) => `+${hidden}`,
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

function initialSelection(defaultValue: string | string[] | undefined): string[] {
  if (Array.isArray(defaultValue)) return defaultValue
  return defaultValue ? [defaultValue] : []
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
  const merged = useLabels('select', DEFAULT_LABELS, labels)
  const text = useMemo<SelectLabels>(
    () => ({
      clear: merged.clear,
      empty: merged.empty,
      overflow: merged.overflow,
      remove: merged.remove,
      search: merged.search,
    }),
    [merged.clear, merged.empty, merged.overflow, merged.remove, merged.search],
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

  const isControlled = value !== undefined
  useEffect(() => {
    const form = trigger?.closest('form')
    if (!form || isControlled) return undefined
    const reset = (): void => commit(initialSelection(defaultValue))
    form.addEventListener('reset', reset)
    return () => form.removeEventListener('reset', reset)
  }, [commit, defaultValue, isControlled, trigger])

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

Select.displayName = 'Select'
