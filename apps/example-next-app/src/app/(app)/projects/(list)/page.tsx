import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { PageHeader } from '@/components/page-header'
import { getProjects } from '@/lib/data'
import { ProjectsBoard } from './projects-board'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('projects')
  return { title: t('title') }
}

export default async function ProjectsPage(): Promise<ReactNode> {
  const [projects, t] = await Promise.all([getProjects(), getTranslations('projects')])
  return (
    <>
      <PageHeader description={t('description')} title={t('title')} />
      <ProjectsBoard projects={projects} />
    </>
  )
}
