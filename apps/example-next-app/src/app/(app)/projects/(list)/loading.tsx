import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import { Skeleton } from 'plume-ui-react'
import { SkeletonPage } from '@/components/skeleton-page'
import styles from './projects.module.css'

export default async function Loading(): Promise<ReactNode> {
  const t = await getTranslations('projects')
  return (
    <SkeletonPage label={t('loading')}>
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
