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
  /** Number of avatars that are hidden. It fills the counter and its accessible name. */
  count: number
}

const DEFAULT_LABELS: Pick<AvatarGroupLabels, 'overflow'> = {
  overflow: (hidden) => `${hidden} more`,
}

/**
 * The counter of the group. It is what the group renders when `max` hides avatars, and you can
 * place it yourself. Its name comes from `labels.overflow` of the group.
 */
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
