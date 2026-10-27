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
import { getDashboard } from '@/lib/data'
import { formatDue } from '@/lib/format'
import { getUser } from '@/lib/session'
import { statusColor } from '@/lib/status'
import styles from './dashboard.module.css'

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
                  <span className={styles.label}>Due {formatDue(project.due)}</span>
                </div>
                <Badge className={styles.status} colorScheme={statusColor[project.status]} dot variant="subtle">
                  {project.status}
                </Badge>
                <ProgressBar
                  aria-label={`${project.name} progress`}
                  className={styles.progress}
                  colorScheme={statusColor[project.status]}
                  showValue
                  value={project.progress}
                />
                <AvatarGroup className={styles.team} max={3} size="sm">
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
