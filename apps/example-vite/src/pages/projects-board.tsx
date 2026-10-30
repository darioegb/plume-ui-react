import type { ReactNode } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  DatePicker,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSeparator,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Paginator,
  PaginatorItem,
  PaginatorList,
  PaginatorNext,
  PaginatorPageSize,
  PaginatorPrevious,
  PaginatorSummary,
  ProgressBar,
  Select,
  SelectContent,
  SelectOption,
  SelectTrigger,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
  useTableState,
  useToast,
  type DateRange,
} from "plume-ui-react";
import {
  CheckIcon,
  EyeIcon,
  MoreIcon,
  SearchIcon,
  TrashIcon,
} from "../components/icons";
import {
  deleteProject,
  updateProject,
  type Project,
  type ProjectStatus,
} from "../lib/data";
import { formatDue, toIsoDate } from "../lib/format";
import { statusColor } from "../lib/status";
import { NewProjectDrawer } from "./new-project-drawer";
import { ProjectDrawer } from "./project-drawer";
import styles from "./projects.module.css";

const statuses: ProjectStatus[] = ["On track", "At risk", "Delayed", "Done"];

// Defined outside the component: the hook needs stable functions.
const filterFns = {
  due: (project: Project, value: unknown): boolean => {
    const { endDate, startDate } = value as DateRange;
    if (startDate && project.due < toIsoDate(startDate)) return false;
    return !(endDate && project.due > toIsoDate(endDate));
  },
  status: (project: Project, value: unknown): boolean =>
    project.status === value,
};

const sortFns = {
  status: (first: Project, second: Project): number =>
    statuses.indexOf(first.status) - statuses.indexOf(second.status),
};

export function ProjectsBoard({
  projects: initial,
}: Readonly<{ projects: Project[] }>): ReactNode {
  const { i18n, t } = useTranslation();
  const toast = useToast();
  const [projects, setProjects] = useState(initial);
  const [creating, setCreating] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [removing, setRemoving] = useState<Project | null>(null);

  const state = useTableState({
    defaultPageSize: 5,
    defaultSort: { column: "due", direction: "ascending" },
    filterFns,
    rows: projects,
    sortFns,
  });

  const dueRange = (state.filters.due as DateRange | undefined) ?? {
    endDate: null,
    startDate: null,
  };
  const detail = projects.find((project) => project.id === detailId) ?? null;

  const open = (project: Project): void => {
    setDetailId(project.id);
    setDetailOpen(true);
  };

  // The list updates at once and the request follows, as most apps do.
  const replace = (project: Project): void => {
    setProjects((current) =>
      current.map((item) => (item.id === project.id ? project : item)),
    );
    void updateProject(project);
  };

  const complete = (project: Project): void => {
    replace({ ...project, progress: 100, status: "Done" });
    toast.success({
      action: { label: t("projects.undo"), onClick: () => replace(project) },
      description: project.name,
      title: t("projects.completed"),
    });
  };

  const remove = (project: Project): void => {
    setProjects((current) => current.filter((item) => item.id !== project.id));
    void deleteProject(project.id);
    setDetailOpen(false);
    toast.info({ description: project.name, title: t("projects.deleted") });
  };

  return (
    <>
      <div className={styles.toolbar}>
        <Input
          aria-label={t("projects.search")}
          className={styles.search}
          elementBefore={<SearchIcon />}
          onChange={(event) => state.setFilter("name", event.target.value)}
          placeholder={t("projects.search")}
          value={String(state.filters.name ?? "")}
        />
        <div className={styles.status}>
          <Select
            onValueChange={(value) => state.setFilter("status", value)}
            value={String(state.filters.status ?? "")}
          >
            <SelectTrigger
              aria-label={t("projects.status")}
              placeholder={t("projects.allStatuses")}
            />
            <SelectContent>
              {statuses.map((status) => (
                <SelectOption key={status} value={status}>
                  {t(`status.${status}`)}
                </SelectOption>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className={styles.due}>
          <DatePicker
            aria-label={t("projects.dueFilter")}
            onValueChange={(range) =>
              state.setFilter(
                "due",
                range.startDate || range.endDate ? range : null,
              )
            }
            placeholder={t("projects.dueBetween")}
            range
            value={dueRange}
          />
        </div>
        {state.hasFilters ? (
          <Button onClick={state.resetFilters} variant="ghost">
            {t("projects.clearFilters")}
          </Button>
        ) : null}
        <Button className={styles.create} onClick={() => setCreating(true)}>
          {t("projects.newProject")}
        </Button>
      </div>

      <Table aria-label={t("projects.table")} hoverable>
        <TableCaption>{t("projects.count", { count: state.total })}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead {...state.getSortProps("name")}>
              {t("projects.project")}
            </TableHead>
            <TableHead {...state.getSortProps("status")}>
              {t("projects.status")}
            </TableHead>
            <TableHead {...state.getSortProps("progress")}>
              {t("projects.progress")}
            </TableHead>
            <TableHead {...state.getSortProps("due")}>
              {t("projects.due")}
            </TableHead>
            <TableHead>{t("projects.team")}</TableHead>
            <TableHead align="end">
              <span className={styles.visuallyHidden}>
                {t("projects.actions")}
              </span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {state.rows.length === 0 ? (
            <TableEmpty
              action={
                <Button
                  onClick={state.resetFilters}
                  size="sm"
                  variant="outline"
                >
                  {t("projects.clearFilters")}
                </Button>
              }
              colSpan={6}
              description={t("projects.emptyDescription")}
              title={t("projects.emptyTitle")}
            />
          ) : (
            state.rows.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <button
                    className={styles.name}
                    onClick={() => open(project)}
                    type="button"
                  >
                    {project.name}
                  </button>
                  <div className={styles.owner}>
                    <Avatar name={project.owner} size="sm" />
                    {project.owner}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    colorScheme={statusColor[project.status]}
                    dot
                    variant="subtle"
                  >
                    {t(`status.${project.status}`)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <ProgressBar
                    aria-label={t("projects.progressOf", { name: project.name })}
                    colorScheme={statusColor[project.status]}
                    showValue
                    value={project.progress}
                  />
                </TableCell>
                <TableCell>{formatDue(project.due, i18n.language)}</TableCell>
                <TableCell>
                  <AvatarGroup max={3} size="sm">
                    {project.team.map((member) => (
                      <Avatar key={member} name={member} />
                    ))}
                  </AvatarGroup>
                </TableCell>
                <TableCell align="end">
                  <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                      <Button
                        aria-label={t("projects.actionsFor", { name: project.name })}
                        size="sm"
                        variant="ghost"
                      >
                        <MoreIcon />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem
                        icon={<EyeIcon />}
                        onSelect={() => open(project)}
                      >
                        {t("projects.openDetails")}
                      </DropdownItem>
                      <DropdownItem
                        disabled={project.status === "Done"}
                        icon={<CheckIcon />}
                        onSelect={() => complete(project)}
                      >
                        {t("projects.markDone")}
                      </DropdownItem>
                      <DropdownSeparator />
                      <DropdownItem
                        icon={<TrashIcon />}
                        onSelect={() => setRemoving(project)}
                      >
                        {t("projects.delete")}
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Paginator
        aria-label={t("projects.pages")}
        onPageChange={state.setPage}
        onPageSizeChange={state.setPageSize}
        page={state.page}
        pageSize={state.pageSize}
        total={state.total}
      >
        <PaginatorPageSize options={[5, 10, 25]} />
        <PaginatorSummary />
        <PaginatorList>
          <PaginatorItem>
            <PaginatorPrevious />
          </PaginatorItem>
          <PaginatorItem>
            <PaginatorNext />
          </PaginatorItem>
        </PaginatorList>
      </Paginator>

      <NewProjectDrawer
        onCreated={(project) => {
          setProjects((current) => [project, ...current]);
          state.resetFilters();
          toast.success({ title: t("projects.created", { name: project.name }) });
        }}
        onOpenChange={setCreating}
        open={creating}
        takenNames={projects.map((project) => project.name)}
      />

      <ProjectDrawer
        onComplete={complete}
        onOpenChange={setDetailOpen}
        onRemove={setRemoving}
        open={detailOpen}
        project={detail}
      />

      <Modal
        onOpenChange={(next) => !next && setRemoving(null)}
        open={removing !== null}
      >
        <ModalContent>
          <ModalHeader>{t("projects.deleteTitle")}</ModalHeader>
          <ModalBody>
            {removing
              ? t("projects.deleteBody", { name: removing.name })
              : null}
          </ModalBody>
          <ModalFooter>
            <ModalClose>
              <Button variant="ghost">{t("projects.cancel")}</Button>
            </ModalClose>
            <ModalClose>
              <Button
                colorScheme="error"
                onClick={() => removing && remove(removing)}
              >
                {t("projects.delete")}
              </Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
