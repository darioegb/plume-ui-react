'use client'

import type { ForwardedRef, HTMLAttributes } from 'react'
import { createElement, forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'
import { useModalContext } from './modal-context'
import styles from './modal.module.css'

export interface ModalHeaderOwnProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

type ModalHeaderRootAttributes = Pick<HTMLAttributes<HTMLHeadingElement>, 'children'>

export type ModalHeaderProps = Omit<ComponentProps, 'index'> &
  ModalHeaderRootAttributes &
  ModalHeaderOwnProps

export const ModalHeader = forwardRef<HTMLHeadingElement, ModalHeaderProps>(
  (
    { as = 'h2', children, className = '', style }: ModalHeaderProps,
    ref: ForwardedRef<HTMLHeadingElement>,
  ) => {
    const { isStyled, titleId } = useModalContext('ModalHeader')
    const classes = [isStyled && styles.header, className].filter(Boolean).join(' ')

    return createElement(as, { className: classes, id: titleId, ref, style }, children)
  },
)

ModalHeader.displayName = 'ModalHeader'
