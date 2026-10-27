'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useEffect, useMemo, useState } from 'react'
import { Portal } from '../../../overlay'
import { useFloatingPanel } from '../../../overlay/use-floating-panel'
import { joinClasses } from '../../../overlay/class-names'
import { mergeRefs } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import { SelectContentContext } from './select-content-context'
import { useSelectContext } from './select-context'
import { SelectEmpty } from './select-empty'
import { SelectList } from './select-list'
import { hasPart } from '../../../overlay/has-part'
import { SelectSearch } from './select-search'
import { SelectSearchInput } from './select-search-input'
import styles from './select.module.css'

const CONTENT_PARTS = [SelectEmpty, SelectList, SelectSearch, SelectSearchInput]

type SelectContentRootAttributes = Pick<HTMLAttributes<HTMLDivElement>, 'aria-label' | 'children'>

export interface SelectContentOwnProps {
  /** Placeholder of the search box, when the select is `searchable`. */
  searchPlaceholder?: string
}

export type SelectContentProps = Omit<ComponentProps, 'index'> &
  SelectContentRootAttributes &
  SelectContentOwnProps

/**
 * The panel with the list. It is as wide as the trigger and scrolls when it is long. Given
 * `children` that are not parts, they are the options of a `SelectList`; given `SelectSearch`,
 * `SelectList` or `SelectEmpty` it renders them as written.
 */
export const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(
  (
    { 'aria-label': ariaLabel, children, className, searchPlaceholder, style }: SelectContentProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const context = useSelectContext('SelectContent')
    const { close, flip, isStyled, offset, open, placement, shift, trigger } = context
    const [search, setSearch] = useState<HTMLInputElement | null>(null)
    const [width, setWidth] = useState<number | undefined>(undefined)
    const { position, setPanel } = useFloatingPanel({
      anchor: trigger,
      enabled: open,
      flip,
      offset,
      onDismiss: (reason) => close(reason === 'escape'),
      ownsFocus: false,
      placement,
      shift,
    })

    useEffect(() => {
      if (open && trigger) setWidth(trigger.getBoundingClientRect().width)
    }, [open, trigger])

    useEffect(() => {
      if (open && search) search.focus({ preventScroll: true })
    }, [open, search])

    const contentContext = useMemo(
      () => ({ ariaLabel, searchPlaceholder, setSearch }),
      [ariaLabel, searchPlaceholder],
    )
    const composed = hasPart(children, CONTENT_PARTS)

    return (
      <Portal>
        <SelectContentContext.Provider value={contentContext}>
          <div
            className={joinClasses(isStyled && styles.panel, className)}
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
            {composed ? (
              children
            ) : (
              <>
                <SelectSearch>
                  <SelectSearchInput />
                </SelectSearch>
                <SelectList>{children}</SelectList>
                <SelectEmpty />
              </>
            )}
          </div>
        </SelectContentContext.Provider>
      </Portal>
    )
  },
)

SelectContent.displayName = 'SelectContent'
