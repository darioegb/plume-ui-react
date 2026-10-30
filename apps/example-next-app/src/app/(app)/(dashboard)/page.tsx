import type { ReactNode } from 'react'
import { getLocale, getTranslations } from 'next-intl/server'
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
import { formatDue, formatNumber } from '@/lib/format'
import { getUser } from '@/lib/session'
import { statusColor } from '@/lib/status'
import styles from './dashboard.module.css'

// A Server Component: Card, Badge and ProgressBar render on the server, and only the Avatars hydrate.
export default async function DashboardPage(): Promise<ReactNode> {
  const [user, { metrics, projects }, locale, t, tStatus] = await Promise.all([
    getUser(),
    getDashboard(),
    getLocale(),
    getTranslations('dashboard'),
    getTranslations('status'),
  ])
  const firstName = user?.name.split(' ')[0] ?? t('guest')

  return (
    <>
      <PageHeader description={t('description')} title={t('title', { name: firstName })} />

      <section aria-label={t('keyNumbers')} className={styles.metrics}>
        {metrics.map((metric) => (
          <Card key={metric.id} variant="outline">
            <CardBody>
              <div className={styles.metric}>
                <span className={styles.label}>{t(`metrics.${metric.id}.label`)}</span>
                <span className={styles.value}>{formatNumber(metric.value, locale)}</span>
                <Badge colorScheme={metric.trend === 'up' ? 'success' : 'warning'} size="sm" variant="subtle">
                  {t(`metrics.${metric.id}.change`, { change: metric.change })}
                </Badge>
              </div>
            </CardBody>
          </Card>
        ))}
      </section>

      <Card variant="outline">
        <CardHeader>{t('activeProjects')}</CardHeader>
        <CardBody>
          <ul className={styles.projects}>
            {projects.map((project) => (
              <li className={styles.project} key={project.id}>
                <div className={styles.projectInfo}>
                  <span className={styles.projectName}>{project.name}</span>
                  <span className={styles.label}>{t('due', { date: formatDue(project.due, locale) })}</span>
                </div>
                <Badge className={styles.status} colorScheme={statusColor[project.status]} dot variant="subtle">
                  {tStatus(project.status)}
                </Badge>
                <ProgressBar
                  aria-label={t('progress', { name: project.name })}
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
