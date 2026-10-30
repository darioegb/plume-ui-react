import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import { Card, CardBody, Skeleton } from 'plume-ui-react'
import { SkeletonPage } from '@/components/skeleton-page'
import styles from './new-project.module.css'

export default async function Loading(): Promise<ReactNode> {
  const t = await getTranslations('newProject')
  return (
    <SkeletonPage label={t('loading')}>
      <div className={styles.wizard}>
        <div className={styles.steps}>
          {[1, 2, 3].map((item) => (
            <div className={styles.step} key={item}>
              <Skeleton height={32} shape="circle" width={32} />
              <Skeleton width="5rem" />
            </div>
          ))}
        </div>
        <Card variant="outline">
          <CardBody>
            <div className={styles.form}>
              <Skeleton height={40} shape="rect" />
              <Skeleton height={88} shape="rect" />
              <Skeleton height={40} shape="rect" />
            </div>
          </CardBody>
        </Card>
      </div>
    </SkeletonPage>
  )
}
