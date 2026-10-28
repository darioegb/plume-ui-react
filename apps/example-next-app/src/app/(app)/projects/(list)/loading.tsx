import type { ReactNode } from 'react'
import { Skeleton } from 'plume-ui-react'
import { SkeletonPage } from '@/components/skeleton-page'
import styles from './projects.module.css'

export default function Loading(): ReactNode {
  return (
    <SkeletonPage label="Loading the projects">
      <div className={styles.toolbar}>
        <Skeleton className={styles.search} height={40} shape="rect" />
        <Skeleton className={styles.status} height={40} shape="rect" />
        <Skeleton className={styles.due} height={40} shape="rect" />
      </div>
      <Skeleton width="6rem" />
      <div className={styles.rows}>
        <Skeleton height={32} shape="rect" />
        {[1, 2, 3, 4, 5].map((item) => (
          <Skeleton height={56} key={item} shape="rect" />
        ))}
      </div>
    </SkeletonPage>
  )
}
