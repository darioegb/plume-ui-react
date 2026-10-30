import type { ReactNode } from "react";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  ProgressBar,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "plume-ui-react";
import type { Project } from "../lib/data";
import { formatAgo, formatDue } from "../lib/format";
import { statusColor } from "../lib/status";
import styles from "./projects.module.css";

const activity = (
  project: Project,
  t: TFunction,
  language: string,
): { text: string; when: string }[] => [
  {
    text: t("projectDrawer.updatedPlan", { name: project.owner }),
    when: formatAgo(2, "day", language),
  },
  {
    text: t("projectDrawer.commented", {
      name: project.team[1] ?? project.owner,
    }),
    when: formatAgo(4, "day", language),
  },
  {
    text: t("projectDrawer.createdProject", { name: project.owner }),
    when: formatAgo(3, "week", language),
  },
];

export function ProjectDrawer({
  onComplete,
  onOpenChange,
  onRemove,
  open,
  project,
}: Readonly<{
  onComplete: (project: Project) => void;
  onOpenChange: (open: boolean) => void;
  onRemove: (project: Project) => void;
  open: boolean;
  project: Project | null;
}>): ReactNode {
  const { i18n, t } = useTranslation();

  return (
    <Drawer onOpenChange={onOpenChange} open={open && project !== null}>
      <DrawerContent>
        {project ? (
          <>
            <DrawerHeader>{project.name}</DrawerHeader>
            <DrawerBody>
              <Tabs>
                <TabList>
                  <Tab label={t("projectDrawer.overview")} />
                  <Tab label={t("projectDrawer.activity")} />
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <div className="d-flex flex-column gap-3 py-3">
                      <p className="mb-0">
                        {project.description || t("projectDrawer.noDescription")}
                      </p>
                      <dl className={styles.facts}>
                        <dt>{t("projectDrawer.status")}</dt>
                        <dd>
                          <Badge
                            colorScheme={statusColor[project.status]}
                            dot
                            variant="subtle"
                          >
                            {t(`status.${project.status}`)}
                          </Badge>
                        </dd>
                        <dt>{t("projectDrawer.due")}</dt>
                        <dd>{formatDue(project.due, i18n.language)}</dd>
                        <dt>{t("projectDrawer.owner")}</dt>
                        <dd className="d-flex align-items-center gap-2 small text-body-secondary">
                          <Avatar name={project.owner} size="sm" />
                          {project.owner}
                        </dd>
                        <dt>{t("projectDrawer.team")}</dt>
                        <dd>
                          <AvatarGroup max={5} size="sm">
                            {project.team.map((member) => (
                              <Avatar key={member} name={member} />
                            ))}
                          </AvatarGroup>
                        </dd>
                        <dt>{t("projectDrawer.visibility")}</dt>
                        <dd>
                          <Badge colorScheme="salmon" variant="subtle">
                            {t(`visibility.${project.visibility}`)}
                          </Badge>
                        </dd>
                      </dl>
                      <ProgressBar
                        aria-label={t("projectDrawer.progress")}
                        colorScheme={statusColor[project.status]}
                        showValue
                        value={project.progress}
                      />
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <ul className="list-group list-group-flush py-3">
                      {activity(project, t, i18n.language).map((event) => (
                        <li
                          className="list-group-item bg-transparent px-0"
                          key={event.text}
                        >
                          {event.text}
                          <span className="d-block small text-body-secondary">
                            {event.when}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </DrawerBody>
            <DrawerFooter>
              <Button
                colorScheme="error"
                onClick={() => onRemove(project)}
                variant="ghost"
              >
                {t("projectDrawer.delete")}
              </Button>
              <DrawerClose>
                <Button
                  disabled={project.status === "Done"}
                  onClick={() => onComplete(project)}
                  variant="outline"
                >
                  {t("projectDrawer.markDone")}
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
}
