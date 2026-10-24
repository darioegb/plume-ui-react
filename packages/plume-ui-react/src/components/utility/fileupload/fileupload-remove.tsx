'use client'

import type { ButtonHTMLAttributes, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { CloseIcon } from '../../../overlay/icons'
import type { ComponentProps } from '../../../theme'
import { useFileUploadContext, useFileUploadItemContext } from './fileupload-context'
import styles from './fileupload.module.css'

type FileUploadRemoveRootAttributes = Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-label' | 'children'
>

export type FileUploadRemoveProps = Omit<ComponentProps, 'index'> & FileUploadRemoveRootAttributes

export const FileUploadRemove = forwardRef<HTMLButtonElement, FileUploadRemoveProps>(
  (
    { 'aria-label': ariaLabel, children, className, style }: FileUploadRemoveProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const { inactive, isStyled, labels, remove } = useFileUploadContext('FileUploadRemove')
    const { file } = useFileUploadItemContext('FileUploadRemove')
    if (inactive) return null

    return (
      <button
        aria-label={ariaLabel ?? labels.remove(file)}
        className={joinClasses(isStyled && styles.remove, className)}
        data-plume-fileupload-remove=""
        onClick={() => remove(file)}
        ref={ref}
        style={style}
        type="button"
      >
        {children ?? <CloseIcon />}
      </button>
    )
  },
)

FileUploadRemove.displayName = 'FileUploadRemove'
