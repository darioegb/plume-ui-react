'use client'

import type { ReactNode } from 'react'
import { useTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from 'plume-ui-react'
import { saveLocale } from '@/app/actions'
import { locales, type Locale } from '@/i18n/config'
import { CheckIcon } from './icons'

export function LanguageSwitcher(): ReactNode {
  const t = useTranslations('language')
  const current = useLocale()
  const [, startTransition] = useTransition()

  // The action sets the cookie and Next renders the current page again with the new language.
  const select = (locale: Locale): void => {
    if (locale !== current) startTransition(() => saveLocale(locale))
  }

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button aria-label={t('label')} variant="ghost">
          {current.toUpperCase()}
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        {locales.map((locale) => (
          <DropdownItem
            icon={locale === current ? <CheckIcon /> : undefined}
            key={locale}
            onSelect={() => select(locale)}
          >
            {t(locale)}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}
