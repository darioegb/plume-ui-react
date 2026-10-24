'use client'

import type { ForwardedRef, ImgHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { useAvatarContext } from './avatar-context'
import styles from './avatar.module.css'

type AvatarImageRootAttributes = Pick<
  ImgHTMLAttributes<HTMLImageElement>,
  'crossOrigin' | 'decoding' | 'loading' | 'referrerPolicy'
>

export type AvatarImageProps = Omit<ComponentProps, 'index'> & AvatarImageRootAttributes

export const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  (
    { className, style, ...rest }: AvatarImageProps,
    ref: ForwardedRef<HTMLImageElement>,
  ): ReactNode => {
    const { isStyled, setFailedSrc, showImage, src } = useAvatarContext('AvatarImage')

    if (!showImage) return null

    return (
      <img
        alt=""
        className={joinClasses(isStyled && styles.image, className)}
        data-plume-avatar-image=""
        onError={() => {
          setFailedSrc(src)
        }}
        ref={ref}
        src={src}
        style={style}
        {...rest}
      />
    )
  },
)

AvatarImage.displayName = 'AvatarImage'
