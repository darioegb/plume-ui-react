'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from 'plume-ui-react'
import { ArrowUpIcon } from './icons'

const THRESHOLD = 400

export function ScrollToTop(): ReactNode {
  const t = useTranslations('nav')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const update = (): void => setVisible(window.scrollY > THRESHOLD)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  if (!visible) return null

  const scrollToTop = (): void => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ behavior: reduce ? 'auto' : 'smooth', top: 0 })
  }

  return (
    <Button
      aria-label={t('scrollToTop')}
      className="fixed end-5 bottom-5 z-10 size-12 animate-appear p-0 shadow-lg motion-reduce:animate-none dark:ring-1 dark:ring-border"
      colorScheme="primary"
      onClick={scrollToTop}
      shape="pill"
      type="button"
    >
      <ArrowUpIcon />
    </Button>
  )
}
