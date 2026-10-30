import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
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
import {
  formatChange,
  formatDue,
  formatNumber,
} from "../lib/format";
import { statusColor } from "../lib/status";
import { useResource } from "../lib/use-resource";
import styles from "./dashboard.module.css";

export function DashboardPage(): ReactNode {
  const { i18n, t } = useTranslation();
  const dashboard = useResource(getDashboard);

  if (dashboard.status === "loading") {
    return (
      <SkeletonPage label={t("dashboard.loading")}>
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
    return <Alert status="error">{t("dashboard.loadError")}</Alert>;
  }

  const { metrics, projects } = dashboard.value;

  return (
    <>
      <PageHeader
        description={t("dashboard.description")}
        title={t("dashboard.welcome", { name: "Ana" })}
      />

      <section aria-label={t("dashboard.keyNumbers")} className={styles.metrics}>
        {metrics.map((metric) => (
          <Card key={metric.id} variant="outline">
            <CardBody>
              <div className={styles.metric}>
                <span className={styles.label}>
                  {t(`metrics.${metric.id}.label`)}
                </span>
                <span className={styles.value}>
                  {formatNumber(metric.value, i18n.language)}
                </span>
                <Badge
                  colorScheme={metric.trend === "up" ? "success" : "warning"}
                  size="sm"
                  variant="subtle"
                >
                  {t(`metrics.${metric.id}.change`, {
                    change: formatChange(
                      metric.change,
                      i18n.language,
                      metric.percent,
                    ),
                  })}
                </Badge>
              </div>
            </CardBody>
          </Card>
        ))}
      </section>

      <Card variant="outline">
        <CardHeader>{t("dashboard.activeProjects")}</CardHeader>
        <CardBody>
          <ul className={styles.projects}>
            {projects.map((project) => (
              <li className={styles.project} key={project.id}>
                <div className={styles.projectInfo}>
                  <span className={styles.projectName}>{project.name}</span>
                  <span className={styles.label}>
                    {t("dashboard.due", {
                      date: formatDue(project.due, i18n.language),
                    })}
                  </span>
                </div>
                <Badge
                  className={styles.status}
                  colorScheme={statusColor[project.status]}
                  dot
                  variant="subtle"
                >
                  {t(`status.${project.status}`)}
                </Badge>
                <ProgressBar
                  aria-label={t("dashboard.progressOf", { name: project.name })}
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
