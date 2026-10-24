'use client'

import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'
import type { ColorScheme, Shape, Size } from '../../../theme'
import type { AvatarStatus, AvatarVariant } from './avatar'
import type { AvatarGroupLabels } from './avatar-group'

export interface AvatarGroupContextValue {
  colorScheme?: ColorScheme
  labels?: Partial<AvatarGroupLabels>
  shape?: Shape
  size?: Size
  variant?: AvatarVariant
}

export const AvatarGroupContext = createContext<AvatarGroupContextValue | undefined>(undefined)

export const useAvatarGroup = (): AvatarGroupContextValue | undefined =>
  useContext(AvatarGroupContext)

export interface AvatarContextValue {
  fallback: ReactNode
  isStyled: boolean
  name: string | undefined
  setFailedSrc: (src: string | undefined) => void
  showImage: boolean
  src: string | undefined
  status: AvatarStatus | undefined
  variant: AvatarVariant
}

export const AvatarContext = createContext<AvatarContextValue | undefined>(undefined)

export function useAvatarContext(part: string): AvatarContextValue {
  const context = useContext(AvatarContext)
  if (!context) throw new Error(`${part} must be rendered inside an <Avatar>`)
  return context
}
