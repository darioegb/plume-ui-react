'use client'

import type { KeyboardEvent, ReactNode } from 'react'
import { createContext, useContext } from 'react'
import type { Placement } from '../../../overlay'
import type { ColorScheme, Shape, Size } from '../../../theme'

export type SelectVariant = 'outline' | 'filled' | 'underline' | 'unstyled'

export interface SelectLabels {
  clear: string
  empty: ReactNode
  remove: (label: string) => string
  search: string
}

export interface SelectedOption {
  icon?: ReactNode
  label: string
  value: string
}

export interface SelectOptionRecord extends SelectedOption {
  disabled: boolean
}

export interface SelectLabelling {
  label?: string
  labelledBy?: string
}

export interface SelectContextValue {
  activeId: string | undefined
  canClear: boolean
  clear: () => void
  close: (returnFocus: boolean) => void
  colorScheme: ColorScheme
  controlId: string
  describedBy: string | undefined
  disabled: boolean
  flip: boolean
  invalid: boolean
  labels: SelectLabels
  isSelected: (value: string) => boolean
  isStyled: boolean
  labelling: SelectLabelling
  listboxId: string
  multiple: boolean
  name: string | undefined
  offset: number
  onListKeyDown: (event: KeyboardEvent, isTextInput: boolean) => void
  open: boolean
  options: readonly SelectOptionRecord[]
  placement: Placement
  query: string
  readOnly: boolean
  register: (record: SelectOptionRecord) => () => void
  remove: (value: string) => void
  required: boolean
  searchable: boolean
  select: (value: string) => void
  selected: readonly string[]
  selectedOptions: readonly SelectedOption[]
  setActiveId: (id: string | undefined) => void
  setLabelling: (labelling: SelectLabelling) => void
  setListbox: (element: HTMLElement | null) => void
  setOpen: (open: boolean) => void
  setQuery: (query: string) => void
  setTrigger: (element: HTMLElement | null) => void
  shape: Shape
  shift: boolean
  size: Size
  trigger: HTMLElement | null
  variant: SelectVariant
}

export const SelectContext = createContext<SelectContextValue | undefined>(undefined)

export function useSelectContext(part: string): SelectContextValue {
  const context = useContext(SelectContext)
  if (!context) throw new Error(`${part} must be used within a <Select>`)
  return context
}
