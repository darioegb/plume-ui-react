'use client'

import { createContext, useContext } from 'react'

const ModalBackdropContext = createContext(false)

export const ModalBackdropProvider = ModalBackdropContext.Provider

export const useInModalBackdrop = (): boolean => useContext(ModalBackdropContext)
