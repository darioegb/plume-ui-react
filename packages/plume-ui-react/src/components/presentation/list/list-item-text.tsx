import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'
import styles from './list.module.css'

export interface ListItemTextOwnProps {
  /** Main text of the row. It falls back to `children`. */
  primary?: ReactNode
  /** Smaller text under the main one. */
  secondary?: ReactNode
}

type ListItemTextRootAttributes = Pick<HTMLAttributes<HTMLDivElement>, 'children' | 'hidden' | 'id'>

export type ListItemTextProps = Omit<ComponentProps, 'index'> &
  ListItemTextRootAttributes &
  ListItemTextOwnProps

/** The text of the row. */
export const ListItemText = forwardRef<HTMLDivElement, ListItemTextProps>(
  (
    { children, className = '', primary, secondary, style, ...rest }: ListItemTextProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const main = primary ?? children

    return (
      <div
        className={[styles.text, className].filter(Boolean).join(' ')}
        ref={ref}
        style={style}
        {...rest}
      >
        {main ? <span className={styles.primary}>{main}</span> : null}
        {secondary ? <span className={styles.secondary}>{secondary}</span> : null}
      </div>
    )
  },
)

ListItemText.displayName = 'ListItemText'
