'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'
import { useFileUploadItemContext } from './fileupload-context'

type FileUploadNameRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export type FileUploadNameProps = Omit<ComponentProps, 'index'> & FileUploadNameRootAttributes

/** The name of the file, or the children. */
export const FileUploadName = forwardRef<HTMLSpanElement, FileUploadNameProps>(
  (
    { children, className, style }: FileUploadNameProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { file } = useFileUploadItemContext('FileUploadName')

    return (
      <span className={className} data-plume-fileupload-name="" ref={ref} style={style}>
        {children ?? file.name}
      </span>
    )
  },
)

FileUploadName.displayName = 'FileUploadName'
