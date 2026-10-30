import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import { Card, CardBody, CardHeader, Skeleton } from 'plume-ui-react'
import { SkeletonPage } from '@/components/skeleton-page'
import styles from './dashboard.module.css'

export default async function Loading(): Promise<ReactNode> {
  const t = await getTranslations('dashboard')
  return (
    <SkeletonPage label={t('loading')}>
      <section className={styles.metrics}>
        {[1, 2, 3, 4].map((item) => (
          <Card key={item} variant="outline">
            <CardBody>
              <div className={styles.metric}>
                <Skeleton width="60%" />
                <Skeleton height={32} width="35%" />
                <Skeleton width="45%" />
              </div>
            </CardBody>
          </Card>
        ))}
      </section>
      <Card variant="outline">
        <CardHeader>
          <Skeleton width="9rem" />
        </CardHeader>
        <CardBody>
          <div className={styles.projects}>
            {[1, 2, 3, 4].map((item) => (
              <Skeleton height={40} key={item} shape="rect" />
            ))}
          </div>
        </CardBody>
      </Card>
    </SkeletonPage>
  )
}
