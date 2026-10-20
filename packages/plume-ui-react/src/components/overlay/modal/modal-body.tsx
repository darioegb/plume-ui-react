'use client'

import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { mergeRefs } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import { useModalContext } from './modal-context'
import styles from './modal.module.css'

type ModalBodyRootAttributes = Pick<HTMLAttributes<HTMLDivElement>, 'children'>

export type ModalBodyProps = Omit<ComponentProps, 'index'> & ModalBodyRootAttributes

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ children, className = '', style }: ModalBodyProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { bodyId, isStyled, titleId } = useModalContext('ModalBody')
    const element = useRef<HTMLDivElement>(null)
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

    return (
      <div
        aria-labelledby={scrolls ? titleId : undefined}
        className={classes}
        id={bodyId}
        ref={mergeRefs<HTMLDivElement>(element, ref)}
        role={scrolls ? 'region' : undefined}
        style={style}
        tabIndex={scrolls ? 0 : undefined}
      >
        {children}
      </div>
    )
  },
)

ModalBody.displayName = 'ModalBody'
