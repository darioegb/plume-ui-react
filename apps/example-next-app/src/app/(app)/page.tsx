import type { ReactNode } from 'react'
import {
  Avatar,
  AvatarGroup,
  Badge,
  Card,
  CardBody,
  CardHeader,
  ProgressBar,
} from 'plume-ui-react'
import { PageHeader } from '@/components/page-header'
import { getDashboard, type ProjectStatus } from '@/lib/data'
import { getUser } from '@/lib/session'
import styles from './dashboard.module.css'

const statusColor = {
  'At risk': 'warning',
  Delayed: 'error',
  Done: 'success',
  'On track': 'primary',
} as const satisfies Record<ProjectStatus, string>

// A Server Component: Card, Badge and ProgressBar render on the server, and only the Avatars hydrate.
export default async function DashboardPage(): Promise<ReactNode> {
  const [user, { metrics, projects }] = await Promise.all([getUser(), getDashboard()])
  const firstName = user?.name.split(' ')[0] ?? 'there'

  return (
    <>
      <PageHeader description="Here is where your projects stand today." title={`Welcome back, ${firstName}`} />

      <section aria-label="Key numbers" className={styles.metrics}>
        {metrics.map((metric) => (
          <Card key={metric.id} variant="outline">
            <CardBody>
              <div className={styles.metric}>
                <span className={styles.label}>{metric.label}</span>
                <span className={styles.value}>{metric.value}</span>
                <Badge colorScheme={metric.trend === 'up' ? 'success' : 'warning'} size="sm" variant="subtle">
                  {metric.change}
                </Badge>
              </div>
            </CardBody>
          </Card>
        ))}
      </section>

      <Card variant="outline">
        <CardHeader>Active projects</CardHeader>
        <CardBody>
          <ul className={styles.projects}>
            {projects.map((project) => (
              <li className={styles.project} key={project.id}>
                <div className={styles.projectInfo}>
                  <span className={styles.projectName}>{project.name}</span>
                  <span className={styles.label}>Due {project.due}</span>
                </div>
                <Badge colorScheme={statusColor[project.status]} dot variant="subtle">
                  {project.status}
                </Badge>
                <ProgressBar
                  aria-label={`${project.name} progress`}
                  className={styles.progress}
                  colorScheme={statusColor[project.status]}
                  showValue
                  value={project.progress}
                />
                <AvatarGroup max={3} size="sm">
                  {project.team.map((member) => (
                    <Avatar key={member} name={member} />
                  ))}
                </AvatarGroup>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </>
  )
}
