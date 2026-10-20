'use client'

import type { ChangeEvent, ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useEffect, useState } from 'react'
import { Portal } from '../../../overlay'
import { useFloatingPanel } from '../../../overlay/use-floating-panel'
import { joinClasses } from '../../../overlay/class-names'
import { mergeRefs } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import { useSelectContext } from './select-context'
import styles from './select.module.css'

type SelectContentRootAttributes = Pick<HTMLAttributes<HTMLDivElement>, 'aria-label' | 'children'>

export type SelectContentPart = 'empty' | 'list' | 'search' | 'searchInput'

export interface SelectContentOwnProps {
  classNames?: Partial<Record<SelectContentPart, string>>
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
      classNames,
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
    const [search, setSearch] = useState<HTMLInputElement | null>(null)
    const [width, setWidth] = useState<number | undefined>(undefined)
    const { position, setPanel } = useFloatingPanel({
      anchor: trigger,
      enabled: open,
      flip,
      offset,
      onDismiss: (reason) => close(reason === 'escape'),
      placement,
      shift,
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
          data-plume-select-panel=""
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
            <div className={joinClasses(isStyled && styles.search, classNames?.search)}>
              <input
                aria-activedescendant={context.activeId}
                aria-autocomplete="list"
                aria-controls={context.listboxId}
                aria-expanded={open}
                aria-label={searchLabel}
                autoComplete="off"
                className={joinClasses(isStyled && styles.searchInput, classNames?.searchInput)}
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
            className={joinClasses(isStyled && styles.list, classNames?.list)}
            data-plume-select-list=""
            id={context.listboxId}
            ref={context.setListbox}
            role="listbox"
          >
            {children}
          </div>
          {query && !hasMatches ? (
            <div className={joinClasses(isStyled && styles.empty, classNames?.empty)}>
              {emptyText}
            </div>
          ) : null}
        </div>
      </Portal>
    )
  },
)

SelectContent.displayName = 'SelectContent'
