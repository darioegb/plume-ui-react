'use client'

import type { ChangeEvent, ForwardedRef, InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { mergeRefs } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import { useSelectContentContext } from './select-content-context'
import { useSelectContext } from './select-context'
import styles from './select.module.css'

type SelectSearchInputRootAttributes = Pick<InputHTMLAttributes<HTMLInputElement>, 'placeholder'>

export type SelectSearchInputProps = Omit<ComponentProps, 'index'> & SelectSearchInputRootAttributes

/** The search input. */
export const SelectSearchInput = forwardRef<HTMLInputElement, SelectSearchInputProps>(
  (
    { className, placeholder, style }: SelectSearchInputProps,
    ref: ForwardedRef<HTMLInputElement>,
  ): ReactNode => {
    const context = useSelectContext('SelectSearchInput')
    const content = useSelectContentContext('SelectSearchInput')
    const { setSearch } = content
    const mergedRef = useMemo(() => mergeRefs<HTMLInputElement>(setSearch, ref), [ref, setSearch])

    return (
      <input
        aria-activedescendant={context.activeId}
        aria-autocomplete="list"
        aria-controls={context.listboxId}
        aria-expanded={context.open}
        aria-label={context.labels.search}
        autoComplete="off"
        className={joinClasses(context.isStyled && styles.searchInput, className)}
        data-plume-select-search-input=""
        onChange={(event: ChangeEvent<HTMLInputElement>) => context.setQuery(event.target.value)}
        onKeyDown={(event) => context.onListKeyDown(event, true)}
        placeholder={placeholder ?? content.searchPlaceholder}
        ref={mergedRef}
        role="combobox"
        spellCheck={false}
        style={style}
        type="text"
        value={context.query}
      />
    )
  },
)

SelectSearchInput.displayName = 'SelectSearchInput'
