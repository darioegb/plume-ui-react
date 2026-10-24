'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { FileUploadItemContext, useFileUploadContext } from './fileupload-context'
import { FileUploadName } from './fileupload-name'
import { FileUploadProgress } from './fileupload-progress'
import { FileUploadRemove } from './fileupload-remove'
import { FileUploadSize } from './fileupload-size'
import styles from './fileupload.module.css'

type FileUploadItemRootAttributes = Pick<HTMLAttributes<HTMLLIElement>, 'children'>

export interface FileUploadItemOwnProps {
  file: File
}

export type FileUploadItemProps = Omit<ComponentProps, 'index'> &
  FileUploadItemRootAttributes &
  FileUploadItemOwnProps

export const FileUploadItem = forwardRef<HTMLLIElement, FileUploadItemProps>(
  (
    { children, className, file, style }: FileUploadItemProps,
    ref: ForwardedRef<HTMLLIElement>,
  ): ReactNode => {
    const { isStyled } = useFileUploadContext('FileUploadItem')
    const context = useMemo(() => ({ file }), [file])

    return (
      <FileUploadItemContext.Provider value={context}>
        <li
          className={joinClasses(isStyled && styles.item, className)}
          data-plume-fileupload-item=""
          ref={ref}
          style={style}
        >
          {children ?? (
            <>
              <FileUploadName />
              <FileUploadSize />
              <FileUploadRemove />
              <FileUploadProgress />
            </>
          )}
        </li>
      </FileUploadItemContext.Provider>
    )
  },
)

FileUploadItem.displayName = 'FileUploadItem'
