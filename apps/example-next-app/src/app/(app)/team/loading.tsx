import type { ReactNode } from 'react'
import { Card, CardBody, Skeleton } from 'plume-ui-react'
import { SkeletonPage } from '@/components/skeleton-page'
import styles from './team.module.css'

export default function Loading(): ReactNode {
  return (
    <SkeletonPage label="Loading the team">
      <div className={styles.toolbar}>
        <Skeleton className={styles.search} height={40} shape="rect" />
      </div>
      <Skeleton height={36} shape="rect" width="min(16rem, 100%)" />
      <ul className={styles.grid}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <li key={item}>
            <Card variant="outline">
              <CardBody>
                <div className={styles.header}>
                  <Skeleton height={48} shape="circle" width={48} />
                  <div className={styles.lines}>
                    <Skeleton width="8rem" />
                    <Skeleton width="6rem" />
                  </div>
                </div>
                <div className={styles.skills}>
                  <Skeleton height={24} shape="rect" width={64} />
                  <Skeleton height={24} shape="rect" width={80} />
                </div>
                <Skeleton height={32} shape="rect" width={80} />
              </CardBody>
            </Card>
          </li>
        ))}
      </ul>
    </SkeletonPage>
  )
}
