'use client'

import { createContext, useContext } from 'react'
import type { ColorScheme, Shape, Size } from '../../../theme'
import type { AvatarVariant } from './avatar'

export interface AvatarGroupContextValue {
  colorScheme?: ColorScheme
  shape?: Shape
  size?: Size
  variant?: AvatarVariant
}

export const AvatarGroupContext = createContext<AvatarGroupContextValue | undefined>(undefined)

export const useAvatarGroup = (): AvatarGroupContextValue | undefined =>
  useContext(AvatarGroupContext)
