'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef, Fragment } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useFileUploadContext } from './fileupload-context'
import { FileUploadItem } from './fileupload-item'
import styles from './fileupload.module.css'

export interface FileUploadListOwnProps {
  children?: ReactNode | ((file: File, index: number) => ReactNode)
}

export type FileUploadListProps = Omit<ComponentProps, 'index'> & FileUploadListOwnProps

const fileKey = (file: File, position: number): string => `${file.name}-${file.size}-${position}`

export const FileUploadList = forwardRef<HTMLUListElement, FileUploadListProps>(
  (
    { children, className, style }: FileUploadListProps,
    ref: ForwardedRef<HTMLUListElement>,
  ): ReactNode => {
    const { files, isStyled } = useFileUploadContext('FileUploadList')
    if (files.length === 0) return null

    const content =
      typeof children === 'function'
        ? files.map((file, position) => (
            <Fragment key={fileKey(file, position)}>{children(file, position)}</Fragment>
          ))
        : (children ??
          files.map((file, position) => (
            <FileUploadItem file={file} key={fileKey(file, position)} />
          )))

    return (
      <ul
        className={joinClasses(isStyled && styles.list, className)}
        data-plume-fileupload-list=""
        ref={ref}
        style={style}
      >
        {content}
      </ul>
    )
  },
)

FileUploadList.displayName = 'FileUploadList'
