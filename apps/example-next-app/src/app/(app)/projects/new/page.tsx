import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { getProjects, members } from '@/lib/data'
import { NewProjectWizard } from './new-project-wizard'

export const metadata: Metadata = { title: 'New project' }

export default async function NewProjectPage(): Promise<ReactNode> {
  const projects = await getProjects()
  return (
    <>
      <PageHeader description="Three short steps to set up a project." title="New project" />
      <NewProjectWizard members={members} takenNames={projects.map((project) => project.name)} />
    </>
  )
}
