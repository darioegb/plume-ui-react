import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Skeleton } from "plume-ui-react";
import { PageHeader } from "../components/page-header";
import { SkeletonPage } from "../components/skeleton-page";
import { getProjects } from "../lib/data";
import { useResource } from "../lib/use-resource";
import { ProjectsBoard } from "./projects-board";
import styles from "./projects.module.css";

export function ProjectsPage(): ReactNode {
  const { t } = useTranslation();
  const projects = useResource(getProjects);

  if (projects.status === "loading") {
    return (
      <SkeletonPage label={t("projects.loading")}>
        <div className="d-flex flex-wrap align-items-center gap-2">
          <Skeleton className={styles.search} height={40} shape="rect" />
          <Skeleton className={styles.status} height={40} shape="rect" />
          <Skeleton className={styles.due} height={40} shape="rect" />
        </div>
        <Skeleton width="6rem" />
        <div className="d-flex flex-column gap-2">
          <Skeleton height={32} shape="rect" />
          {[1, 2, 3, 4, 5].map((item) => (
            <Skeleton height={56} key={item} shape="rect" />
          ))}
        </div>
      </SkeletonPage>
    );
  }

  if (projects.status === "error") {
    return <Alert status="error">{t("projects.loadError")}</Alert>;
  }

  return (
    <>
      <PageHeader
        description={t("projects.description")}
        title={t("projects.title")}
      />
      <ProjectsBoard projects={projects.value} />
    </>
  );
}
