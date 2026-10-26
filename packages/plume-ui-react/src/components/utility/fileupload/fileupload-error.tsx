'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ComponentProps } from '../../../theme'
import type { FileRejection } from './file-utils'
import { useFileUploadContext } from './fileupload-context'

type FileUploadErrorRootAttributes = Pick<HTMLAttributes<HTMLLIElement>, 'children'>

export interface FileUploadErrorOwnProps {
  /** The rejected file and the reason it was left out. */
  rejection: FileRejection
}

export type FileUploadErrorProps = Omit<ComponentProps, 'index'> &
  FileUploadErrorRootAttributes &
  FileUploadErrorOwnProps

/** One of the errors. The text comes from `labels.rejection`, or from the children. */
export const FileUploadError = forwardRef<HTMLLIElement, FileUploadErrorProps>(
  (
    { children, className, rejection, style }: FileUploadErrorProps,
    ref: ForwardedRef<HTMLLIElement>,
  ): ReactNode => {
    const { labels } = useFileUploadContext('FileUploadError')

    return (
      <li className={className} data-plume-fileupload-error="" ref={ref} style={style}>
        {children ?? labels.rejection(rejection)}
      </li>
    )
  },
)

FileUploadError.displayName = 'FileUploadError'
