'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useThemeRoot } from '../theme/theme-root'

export interface PortalProps {
  children: ReactNode
  container?: HTMLElement | null
}

export function Portal({ children, container }: Readonly<PortalProps>): ReactNode {
  const [mounted, setMounted] = useState(false)
  const themeRoot = useThemeRoot()

  useEffect(() => {
    setMounted(true)
  }, [])

  const target = container ?? (themeRoot === undefined ? document.body : themeRoot)
  if (!mounted || !target) return null

  return createPortal(children, target)
}
