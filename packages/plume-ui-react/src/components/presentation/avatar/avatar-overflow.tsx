'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { useLabels } from '../../../locale/locale-provider'
import { Avatar, type AvatarProps } from './avatar'
import { AvatarFallback } from './avatar-fallback'
import { useAvatarGroup } from './avatar-context'
import type { AvatarGroupLabels } from './avatar-group'

export type AvatarOverflowProps = Omit<
  AvatarProps,
  'alt' | 'fallback' | 'name' | 'src' | 'status'
> & {
  count: number
}

const DEFAULT_LABELS: Pick<AvatarGroupLabels, 'overflow'> = {
  overflow: (hidden) => `${hidden} more`,
}

export const AvatarOverflow = forwardRef<HTMLSpanElement, AvatarOverflowProps>(
  (
    { children, count, ...rest }: AvatarOverflowProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const group = useAvatarGroup()
    const { overflow } = useLabels('avatarGroup', DEFAULT_LABELS, {
      overflow: group?.labels?.overflow,
    })

    return (
      <Avatar alt={overflow(count)} data-overflow="" ref={ref} {...rest}>
        <AvatarFallback>{children ?? `+${count}`}</AvatarFallback>
      </Avatar>
    )
  },
)

AvatarOverflow.displayName = 'AvatarOverflow'
