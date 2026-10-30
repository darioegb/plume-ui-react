'use client'

import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { Heading, type HeadingLevel } from '../../presentation/heading'
import { useModalContext } from './modal-context'
import styles from './modal.module.css'

export interface ModalHeaderOwnProps {
  /**
   * The heading level. The title names the dialog, so choose the one that fits the page.
   * @default 'h2'
   */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

type ModalHeaderRootAttributes = Pick<
  HTMLAttributes<HTMLHeadingElement>,
  'children' | 'lang' | 'title'
>

export type ModalHeaderProps = Omit<ComponentProps, 'index'> &
  ModalHeaderRootAttributes &
  ModalHeaderOwnProps

/** The title, which names the dialog. It is a `Heading` with the look of `heading-5`. */
export const ModalHeader = forwardRef<HTMLHeadingElement, ModalHeaderProps>(
  (
    { as = 'h2', className, ...rest }: ModalHeaderProps,
    ref: ForwardedRef<HTMLHeadingElement>,
  ) => {
    const { isStyled, titleId } = useModalContext('ModalHeader')

    return (
      <Heading
        className={joinClasses(isStyled && styles.header, className)}
        data-plume-modal-header=""
        id={titleId}
        level={Number(as.slice(1)) as HeadingLevel}
        ref={ref}
        size={5}
        variant={isStyled ? 'default' : 'unstyled'}
        {...rest}
      />
    )
  },
)

ModalHeader.displayName = 'ModalHeader'
