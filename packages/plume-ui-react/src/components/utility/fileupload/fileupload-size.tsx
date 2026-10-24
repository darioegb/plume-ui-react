'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useFileUploadContext, useFileUploadItemContext } from './fileupload-context'
import styles from './fileupload.module.css'

type FileUploadSizeRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export type FileUploadSizeProps = Omit<ComponentProps, 'index'> & FileUploadSizeRootAttributes

export const FileUploadSize = forwardRef<HTMLSpanElement, FileUploadSizeProps>(
  (
    { children, className, style }: FileUploadSizeProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled, labels } = useFileUploadContext('FileUploadSize')
    const { file } = useFileUploadItemContext('FileUploadSize')

    return (
      <span
        className={joinClasses(isStyled && styles.fileSize, className)}
        data-plume-fileupload-size=""
        ref={ref}
        style={style}
      >
        {children ?? labels.fileSize(file.size)}
      </span>
    )
  },
)

FileUploadSize.displayName = 'FileUploadSize'
