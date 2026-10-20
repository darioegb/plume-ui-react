'use client'

import type { ChangeEvent, ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useEffect, useState } from 'react'
import { Portal, useDismiss, useLayer, usePosition } from '../../../overlay'
import { mergeRefs } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import { useSelectContext } from './select-context'
import styles from './select.module.css'

type SelectContentRootAttributes = Pick<HTMLAttributes<HTMLDivElement>, 'aria-label' | 'children'>

export interface SelectContentOwnProps {
  emptyText?: ReactNode
  searchLabel?: string
  searchPlaceholder?: string
}

export type SelectContentProps = Omit<ComponentProps, 'index'> &
  SelectContentRootAttributes &
  SelectContentOwnProps

export const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(
  (
    {
      'aria-label': ariaLabel,
      children,
      className = '',
      emptyText = 'No results',
      searchLabel = 'Search',
      searchPlaceholder,
      style,
    }: SelectContentProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const context = useSelectContext('SelectContent')
    const {
      close,
      flip,
      isStyled,
      labelling,
      multiple,
      offset,
      open,
      placement,
      query,
      shift,
      trigger,
    } = context
    const [panel, setPanel] = useState<HTMLDivElement | null>(null)
    const [search, setSearch] = useState<HTMLInputElement | null>(null)
    const [width, setWidth] = useState<number | undefined>(undefined)
    const isTopmost = useLayer(open)
    const position = usePosition({
      anchor: trigger,
      floating: panel,
      enabled: open,
      placement,
      offset,
      flip,
      shift,
    })

    useDismiss({
      enabled: open,
      onDismiss: (reason) => close(reason === 'escape'),
      elements: [trigger, panel],
      isTopmost,
    })

    useEffect(() => {
      if (open && trigger) setWidth(trigger.getBoundingClientRect().width)
    }, [open, trigger])

    useEffect(() => {
      if (open && search) search.focus({ preventScroll: true })
    }, [open, search])

    const classes = [isStyled && styles.panel, className].filter(Boolean).join(' ')
    const hasMatches = context.options.some(
      (option) => !query || option.label.toLowerCase().includes(query.toLowerCase()),
    )

    return (
      <Portal>
        <div
          className={classes || undefined}
          data-placement={position.placement}
          hidden={!open}
          ref={mergeRefs<HTMLDivElement>(setPanel, ref)}
          style={{
            ...position.style,
            minWidth: width,
            opacity: position.isPositioned ? undefined : 0,
            ...style,
          }}
        >
          {context.searchable ? (
            <div className={isStyled ? styles.search : undefined}>
              <input
                aria-activedescendant={context.activeId}
                aria-autocomplete="list"
                aria-controls={context.listboxId}
                aria-expanded={open}
                aria-label={searchLabel}
                autoComplete="off"
                className={isStyled ? styles.searchInput : undefined}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  context.setQuery(event.target.value)
                }
                onKeyDown={(event) => context.onListKeyDown(event, true)}
                placeholder={searchPlaceholder}
                ref={setSearch}
                role="combobox"
                spellCheck={false}
                type="text"
                value={query}
              />
            </div>
          ) : null}
          <div
            aria-label={ariaLabel ?? labelling.label}
            aria-labelledby={ariaLabel ? undefined : labelling.labelledBy}
            aria-multiselectable={multiple || undefined}
            className={isStyled ? styles.list : undefined}
            id={context.listboxId}
            ref={context.setListbox}
            role="listbox"
          >
            {children}
          </div>
          {query && !hasMatches ? (
            <div className={isStyled ? styles.empty : undefined}>{emptyText}</div>
          ) : null}
        </div>
      </Portal>
    )
  },
)

SelectContent.displayName = 'SelectContent'
