'use client'

import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { mergeRefs } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import { useModalContext } from './modal-context'
import styles from './modal.module.css'

type ModalBodyRootAttributes = Pick<HTMLAttributes<HTMLElement>, 'children'>

export type ModalBodyProps = Omit<ComponentProps, 'index'> & ModalBodyRootAttributes

/** The content. It scrolls when it is taller than the screen. */
export const ModalBody = forwardRef<HTMLElement, ModalBodyProps>(
  ({ children, className = '', style }: ModalBodyProps, ref: ForwardedRef<HTMLElement>) => {
    const { bodyId, isStyled, titleId } = useModalContext('ModalBody')
    const element = useRef<HTMLElement>(null)
    const [scrolls, setScrolls] = useState(false)
    const classes = [isStyled && styles.body, className].filter(Boolean).join(' ')

    useEffect(() => {
      const node = element.current
      if (!node) return undefined
      const measure = (): void => setScrolls(node.scrollHeight > node.clientHeight)
      measure()
      const observer =
        typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure)
      observer?.observe(node)
      return () => observer?.disconnect()
    }, [])

    const scrollableProps = scrolls ? { 'aria-labelledby': titleId, tabIndex: 0 } : undefined

    return (
      <section
        {...scrollableProps}
        className={classes}
        id={bodyId}
        ref={mergeRefs<HTMLElement>(element, ref)}
        style={style}
      >
        {children}
      </section>
    )
  },
)

ModalBody.displayName = 'ModalBody'
