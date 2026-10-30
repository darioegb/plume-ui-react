import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { PageHeader } from '@/components/page-header'
import { getProjects, members } from '@/lib/data'
import { NewProjectWizard } from './new-project-wizard'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('newProject')
  return { title: t('title') }
}

export default async function NewProjectPage(): Promise<ReactNode> {
  const [projects, t] = await Promise.all([getProjects(), getTranslations('newProject')])
  return (
    <>
      <PageHeader description={t('description')} title={t('title')} />
      <NewProjectWizard members={members} takenNames={projects.map((project) => project.name)} />
    </>
  )
}
