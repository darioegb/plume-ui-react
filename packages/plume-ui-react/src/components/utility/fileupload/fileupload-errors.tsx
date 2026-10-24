'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef, Fragment } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import type { FileRejection } from './file-utils'
import { useFileUploadContext } from './fileupload-context'
import { FileUploadError } from './fileupload-error'
import styles from './fileupload.module.css'

export interface FileUploadErrorsOwnProps {
  children?: ReactNode | ((rejection: FileRejection, index: number) => ReactNode)
}

export type FileUploadErrorsProps = Omit<ComponentProps, 'index'> & FileUploadErrorsOwnProps

const rejectionKey = (rejection: FileRejection, position: number): string =>
  `${rejection.file.name}-${position}`

export const FileUploadErrors = forwardRef<HTMLUListElement, FileUploadErrorsProps>(
  (
    { children, className, style }: FileUploadErrorsProps,
    ref: ForwardedRef<HTMLUListElement>,
  ): ReactNode => {
    const { isStyled, rejections } = useFileUploadContext('FileUploadErrors')
    if (rejections.length === 0) return null

    const content =
      typeof children === 'function'
        ? rejections.map((rejection, position) => (
            <Fragment key={rejectionKey(rejection, position)}>
              {children(rejection, position)}
            </Fragment>
          ))
        : (children ??
          rejections.map((rejection, position) => (
            <FileUploadError key={rejectionKey(rejection, position)} rejection={rejection} />
          )))

    return (
      <ul
        className={joinClasses(isStyled && styles.errors, className)}
        data-plume-fileupload-errors=""
        ref={ref}
        role="alert"
        style={style}
      >
        {content}
      </ul>
    )
  },
)

FileUploadErrors.displayName = 'FileUploadErrors'
