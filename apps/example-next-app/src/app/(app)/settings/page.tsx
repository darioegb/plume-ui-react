import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { PageHeader } from '@/components/page-header'
import { SettingsForm } from './settings-form'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('settings')
  return { title: t('title') }
}

export default async function SettingsPage(): Promise<ReactNode> {
  const t = await getTranslations('settings')
  return (
    <>
      <PageHeader description={t('description')} title={t('title')} />
      <SettingsForm />
    </>
  )
}
