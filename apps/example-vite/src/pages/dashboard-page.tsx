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

export function DashboardPage(): ReactNode {
  const { i18n, t } = useTranslation();
  const dashboard = useResource(getDashboard);

  if (dashboard.status === "loading") {
    return (
      <SkeletonPage label={t("dashboard.loading")}>
        <section className="row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-3">
          {[1, 2, 3, 4].map((item) => (
            <div className="col" key={item}>
              <Card className="h-100" variant="outline">
                <CardBody>
                  <div className="d-flex flex-column align-items-start gap-2">
                    <Skeleton width="60%" />
                    <Skeleton height={32} width="35%" />
                    <Skeleton width="45%" />
                  </div>
                </CardBody>
              </Card>
            </div>
          ))}
        </section>
        <Card variant="outline">
          <CardHeader>
            <Skeleton width="9rem" />
          </CardHeader>
          <CardBody>
            <div className="d-flex flex-column gap-3">
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

      <section
        aria-label={t("dashboard.keyNumbers")}
        className="row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-3"
      >
        {metrics.map((metric) => (
          <div className="col" key={metric.id}>
            <Card className="h-100" variant="outline">
              <CardBody>
                <div className="d-flex flex-column align-items-start gap-2">
                  <span className="small text-body-secondary">
                    {t(`metrics.${metric.id}.label`)}
                  </span>
                  <span className="fs-2 fw-bold lh-1">
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
          </div>
        ))}
      </section>

      <Card variant="outline">
        <CardHeader>{t("dashboard.activeProjects")}</CardHeader>
        <CardBody>
          <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
            {projects.map((project) => (
              <li className="row g-2 align-items-center" key={project.id}>
                <div className="col d-flex flex-column col-lg-4">
                  <span className="fw-semibold">{project.name}</span>
                  <span className="small text-body-secondary">
                    {t("dashboard.due", {
                      date: formatDue(project.due, i18n.language),
                    })}
                  </span>
                </div>
                <div className="col-auto col-lg-2">
                  <Badge
                    colorScheme={statusColor[project.status]}
                    dot
                    variant="subtle"
                  >
                    {t(`status.${project.status}`)}
                  </Badge>
                </div>
                <div className="col-12 col-lg-4">
                  <ProgressBar
                    aria-label={t("dashboard.progressOf", { name: project.name })}
                    colorScheme={statusColor[project.status]}
                    showValue
                    value={project.progress}
                  />
                </div>
                <div className="col-12 col-lg-2 d-flex justify-content-lg-end">
                  <AvatarGroup max={3} size="sm">
                    {project.team.map((member) => (
                      <Avatar key={member} name={member} />
                    ))}
                  </AvatarGroup>
                </div>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </>
  );
}
