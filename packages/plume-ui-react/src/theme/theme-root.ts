'use client'

import { createContext, useContext } from 'react'

export const ThemeRootContext = createContext<HTMLElement | null | undefined>(undefined)

export const useThemeRoot = (): HTMLElement | null | undefined => useContext(ThemeRootContext)
