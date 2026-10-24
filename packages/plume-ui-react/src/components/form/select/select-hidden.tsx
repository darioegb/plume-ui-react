'use client'

import type { InputHTMLAttributes, ReactNode } from 'react'
import { useSelectContext } from './select-context'

export type SelectHiddenProps = Pick<InputHTMLAttributes<HTMLInputElement>, 'form' | 'name'>

export function SelectHidden({ form, name }: Readonly<SelectHiddenProps>): ReactNode {
  const context = useSelectContext('SelectHidden')
  const resolved = name ?? context.name
  if (!resolved) return null
  if (context.multiple) {
    return context.selected.map((value) => (
      <input
        data-plume-select-hidden=""
        form={form}
        key={value}
        name={resolved}
        type="hidden"
        value={value}
      />
    ))
  }
  return (
    <input
      data-plume-select-hidden=""
      form={form}
      name={resolved}
      type="hidden"
      value={context.selected[0] ?? ''}
    />
  )
}
