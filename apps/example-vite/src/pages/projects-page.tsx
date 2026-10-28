import type { ReactNode } from "react";
import { Alert, Skeleton } from "plume-ui-react";
import { PageHeader } from "../components/page-header";
import { SkeletonPage } from "../components/skeleton-page";
import { getProjects } from "../lib/data";
import { useResource } from "../lib/use-resource";
import { ProjectsBoard } from "./projects-board";
import styles from "./projects.module.css";

export function ProjectsPage(): ReactNode {
  const projects = useResource(getProjects);

  if (projects.status === "loading") {
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
    );
  }

  if (projects.status === "error") {
    return <Alert status="error">Could not load projects. Reload the page to try again.</Alert>;
  }

  return (
    <>
      <PageHeader
        description="Every project of the workspace, with its status and owner."
        title="Projects"
      />
      <ProjectsBoard projects={projects.value} />
    </>
  );
}
