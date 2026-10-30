import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { PageHeader } from '@/components/page-header'
import { getTeam } from '@/lib/data'
import { TeamDirectory } from './team-directory'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('team')
  return { title: t('title') }
}

export default async function TeamPage(): Promise<ReactNode> {
  const [team, t] = await Promise.all([getTeam(), getTranslations('team')])
  return (
    <>
      <PageHeader description={t('description')} title={t('title')} />
      <TeamDirectory team={team} />
    </>
  )
}
