import type { ReactNode } from "react";
import {
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  Card,
  CardBody,
  CardHeader,
  ProgressBar,
  Skeleton,
} from "plume-ui-react";
import { PageHeader } from "../components/page-header";
import { SkeletonPage } from "../components/skeleton-page";
import { getDashboard } from "../lib/data";
import { formatDue } from "../lib/format";
import { statusColor } from "../lib/status";
import { useResource } from "../lib/use-resource";
import styles from "./dashboard.module.css";

export function DashboardPage(): ReactNode {
  const dashboard = useResource(getDashboard);

  if (dashboard.status === "loading") {
    return (
      <SkeletonPage label="Loading the dashboard">
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
    );
  }

  if (dashboard.status === "error") {
    return <Alert status="error">Could not load the dashboard. Reload the page to try again.</Alert>;
  }

  const { metrics, projects } = dashboard.value;

  return (
    <>
      <PageHeader
        description="Here is where your projects stand today."
        title="Welcome back, Ana"
      />

      <section aria-label="Key numbers" className={styles.metrics}>
        {metrics.map((metric) => (
          <Card key={metric.id} variant="outline">
            <CardBody>
              <div className={styles.metric}>
                <span className={styles.label}>{metric.label}</span>
                <span className={styles.value}>{metric.value}</span>
                <Badge
                  colorScheme={metric.trend === "up" ? "success" : "warning"}
                  size="sm"
                  variant="subtle"
                >
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
                  <span className={styles.label}>
                    Due {formatDue(project.due)}
                  </span>
                </div>
                <Badge
                  className={styles.status}
                  colorScheme={statusColor[project.status]}
                  dot
                  variant="subtle"
                >
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
  );
}
