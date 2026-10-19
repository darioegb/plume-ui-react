import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'
import { get__Name__ContentId, use__Name__Context } from './__slug__-context'
import styles from './__slug__.module.css'

export type __Name__ContentProps = Omit<ComponentProps, 'index'> &
  Pick<HTMLAttributes<HTMLDivElement>, 'children' | 'id'>

export const __Name__Content = forwardRef<HTMLDivElement, __Name__ContentProps>(
  (
    { children, className = '', id, style }: __Name__ContentProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const { baseId, isStyled, size } = use__Name__Context()
    const classes = `${isStyled ? `${styles.content} ${styles[size]}` : ''} ${className}`.trim()

    return (
      <div
        className={classes}
        id={id ?? get__Name__ContentId(baseId)}
        ref={ref}
        style={style}
      >
        {children}
      </div>
    )
  },
)

__Name__Content.displayName = '__Name__Content'
