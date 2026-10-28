import type { ReactNode } from "react";
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
import { formatDue } from "../lib/format";
import { statusColor } from "../lib/status";
import styles from "./projects.module.css";

const activity = (project: Project): { text: string; when: string }[] => [
  { text: `${project.owner} updated the plan`, when: "2 days ago" },
  {
    text: `${project.team[1] ?? project.owner} commented on a task`,
    when: "4 days ago",
  },
  { text: `${project.owner} created the project`, when: "3 weeks ago" },
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
  return (
    <Drawer onOpenChange={onOpenChange} open={open && project !== null}>
      <DrawerContent>
        {project ? (
          <>
            <DrawerHeader>{project.name}</DrawerHeader>
            <DrawerBody>
              <Tabs>
                <TabList>
                  <Tab label="Overview" />
                  <Tab label="Activity" />
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <div className={styles.detail}>
                      <p className={styles.description}>
                        {project.description}
                      </p>
                      <dl className={styles.facts}>
                        <dt>Status</dt>
                        <dd>
                          <Badge
                            colorScheme={statusColor[project.status]}
                            dot
                            variant="subtle"
                          >
                            {project.status}
                          </Badge>
                        </dd>
                        <dt>Due</dt>
                        <dd>{formatDue(project.due)}</dd>
                        <dt>Owner</dt>
                        <dd className={styles.owner}>
                          <Avatar name={project.owner} size="sm" />
                          {project.owner}
                        </dd>
                        <dt>Team</dt>
                        <dd>
                          <AvatarGroup max={5} size="sm">
                            {project.team.map((member) => (
                              <Avatar key={member} name={member} />
                            ))}
                          </AvatarGroup>
                        </dd>
                        <dt>Visibility</dt>
                        <dd>
                          <Badge colorScheme="salmon" variant="subtle">
                            {project.visibility}
                          </Badge>
                        </dd>
                      </dl>
                      <ProgressBar
                        aria-label="Progress"
                        colorScheme={statusColor[project.status]}
                        showValue
                        value={project.progress}
                      />
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <ul className={styles.activity}>
                      {activity(project).map((event) => (
                        <li key={event.text}>
                          {event.text}
                          <span className={styles.when}>{event.when}</span>
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
                Delete
              </Button>
              <DrawerClose>
                <Button
                  disabled={project.status === "Done"}
                  onClick={() => onComplete(project)}
                  variant="outline"
                >
                  Mark as done
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
}
