'use client'

import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { LocaleProvider, type PlumeMessages } from 'plume-ui-react'
import { useLocale as useIntlLocale, useTranslations } from 'next-intl'

// Plume exports its own `useLocale`, so the one of next-intl is imported with another name.
export function PlumeLocale({ children }: Readonly<{ children: ReactNode }>): ReactNode {
  const t = useTranslations('plume')
  const locale = useIntlLocale()

  const messages = useMemo<PlumeMessages>(
    () => ({
      alert: { dismiss: t('alert.dismiss') },
      avatar: {
        away: t('avatar.away'),
        busy: t('avatar.busy'),
        offline: t('avatar.offline'),
        online: t('avatar.online'),
      },
      avatarGroup: { overflow: (hidden) => t('avatarGroup.overflow', { hidden }) },
      breadcrumb: { breadcrumb: t('breadcrumb.breadcrumb') },
      button: { busy: t('button.busy') },
      chip: { remove: t('chip.remove') },
      datePicker: {
        apply: t('datePicker.apply'),
        calendar: t('datePicker.calendar'),
        cancel: t('datePicker.cancel'),
        format: (format) => t('datePicker.format', { format }),
        nextMonth: t('datePicker.nextMonth'),
        nextYears: t('datePicker.nextYears'),
        openCalendar: t('datePicker.openCalendar'),
        previousMonth: t('datePicker.previousMonth'),
        previousYears: t('datePicker.previousYears'),
      },
      input: { reveal: t('input.reveal') },
      navbarToggle: { label: t('navbarToggle.label') },
      overlayClose: { label: t('overlayClose.label') },
      paginator: {
        first: t('paginator.first'),
        last: t('paginator.last'),
        next: t('paginator.next'),
        page: (page, current) => t(current ? 'paginator.pageCurrent' : 'paginator.page', { page }),
        pageSize: t('paginator.pageSize'),
        pagination: t('paginator.pagination'),
        previous: t('paginator.previous'),
        summary: (from, to, total) => t('paginator.summary', { from, to, total }),
      },
      select: {
        clear: t('select.clear'),
        empty: t('select.empty'),
        overflow: (hidden) => t('select.overflow', { hidden }),
        remove: (label) => t('select.remove', { label }),
        search: t('select.search'),
      },
      sidebarToggle: { label: t('sidebarToggle.label') },
      spinner: { label: t('spinner.label') },
      stepper: { completed: t('stepper.completed'), upcoming: t('stepper.upcoming') },
      table: { loading: t('table.loading') },
      toast: { dismiss: t('toast.dismiss'), region: t('toast.region') },
    }),
    [t],
  )

  return (
    <LocaleProvider locale={locale} messages={messages}>
      {children}
    </LocaleProvider>
  )
}
