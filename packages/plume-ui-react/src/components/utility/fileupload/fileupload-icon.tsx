'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { UploadIcon } from '../../../overlay/icons'
import type { ComponentProps } from '../../../theme'
import { useFileUploadContext } from './fileupload-context'
import styles from './fileupload.module.css'

type FileUploadIconRootAttributes = Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

export type FileUploadIconProps = Omit<ComponentProps, 'index'> & FileUploadIconRootAttributes

/**
 * The decorative icon of the dropzone, hidden from assistive technology. Without children it
 * shows an upload arrow.
 */
export const FileUploadIcon = forwardRef<HTMLSpanElement, FileUploadIconProps>(
  (
    { children, className, style }: FileUploadIconProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { isStyled } = useFileUploadContext('FileUploadIcon')

    return (
      <span
        aria-hidden="true"
        className={joinClasses(isStyled && styles.icon, className)}
        data-plume-fileupload-icon=""
        ref={ref}
        style={style}
      >
        {children ?? <UploadIcon />}
      </span>
    )
  },
)

FileUploadIcon.displayName = 'FileUploadIcon'
