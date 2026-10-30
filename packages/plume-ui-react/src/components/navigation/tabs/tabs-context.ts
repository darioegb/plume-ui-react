'use client'

import { createContext, useContext } from 'react'
import type { ColorScheme, Size } from '../../../theme'

export type TabsVariant = 'underline' | 'rounded' | 'enclosed' | 'segment' | 'unstyled'
export type TabsOrientation = 'horizontal' | 'vertical'
export type TabsAlignment = 'left' | 'center' | 'right'

export interface TabsContextValue {
  alignment: TabsAlignment
  baseId: string
  colorScheme: ColorScheme
  index: number
  isStyled: boolean
  lazy: boolean
  orientation: TabsOrientation
  select: (index: number) => void
  size: Size
  variant: TabsVariant
}

export const TabsContext = createContext<TabsContextValue | undefined>(undefined)

export const TabIndexContext = createContext<number | undefined>(undefined)

export function useTabsContext(part: string): TabsContextValue {
  const context = useContext(TabsContext)
  if (!context) throw new Error(`${part} must be used within a <Tabs>`)
  return context
}

export function useTabIndex(part: string, explicit?: number): number {
  const position = useContext(TabIndexContext)
  const index = explicit ?? position
  if (index === undefined) throw new Error(`${part} must be used within a <TabList> or <TabPanels>`)
  return index
}

export const getTabId = (baseId: string, index: number): string => `${baseId}-tab-${index}`
export const getPanelId = (baseId: string, index: number): string => `${baseId}-panel-${index}`
