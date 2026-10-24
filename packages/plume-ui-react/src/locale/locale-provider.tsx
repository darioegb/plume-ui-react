'use client'

import type { ReactNode } from 'react'
import { createContext, useContext, useMemo } from 'react'
import { mergeLabels } from '../overlay/labels'
import type { MessageMap, PlumeMessages } from './messages'

export interface LocaleContextValue {
  locale?: string
  messages?: PlumeMessages
}

export interface LocaleProviderProps {
  children: ReactNode
  locale?: string
  messages?: PlumeMessages
}

const LocaleContext = createContext<LocaleContextValue>({})

export function LocaleProvider({
  children,
  locale,
  messages,
}: Readonly<LocaleProviderProps>): ReactNode {
  const value = useMemo(() => ({ locale, messages }), [locale, messages])
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): string | undefined {
  return useContext(LocaleContext).locale
}

export function useLabels<K extends keyof MessageMap>(
  key: K,
  defaults: MessageMap[K],
  labels?: Partial<MessageMap[K]>,
): MessageMap[K] {
  const provided = useContext(LocaleContext).messages?.[key]
  return useMemo(
    () => mergeLabels(mergeLabels(defaults, provided), labels),
    [defaults, provided, labels],
  )
}
