'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
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
} from 'plume-ui-react'
import { CheckIcon, EyeIcon, MoreIcon, SearchIcon, TrashIcon } from '@/components/icons'
import type { Project, ProjectStatus } from '@/lib/data'
import { formatDue, toIsoDate } from '@/lib/format'
import { statusColor } from '@/lib/status'
import { ProjectDrawer } from './project-drawer'
import styles from './projects.module.css'

const statuses: ProjectStatus[] = ['On track', 'At risk', 'Delayed', 'Done']

// Defined outside the component: the hook needs stable functions.
const filterFns = {
  due: (project: Project, value: unknown): boolean => {
    const { endDate, startDate } = value as DateRange
    if (startDate && project.due < toIsoDate(startDate)) return false
    return !(endDate && project.due > toIsoDate(endDate))
  },
  status: (project: Project, value: unknown): boolean => project.status === value,
}

const sortFns = {
  status: (first: Project, second: Project): number =>
    statuses.indexOf(first.status) - statuses.indexOf(second.status),
}

export function ProjectsBoard({ projects: initial }: Readonly<{ projects: Project[] }>): ReactNode {
  const toast = useToast()
  const [projects, setProjects] = useState(initial)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [removing, setRemoving] = useState<Project | null>(null)

  const state = useTableState({
    defaultPageSize: 5,
    defaultSort: { column: 'due', direction: 'ascending' },
    filterFns,
    rows: projects,
    sortFns,
  })

  const dueRange = (state.filters.due as DateRange | undefined) ?? { endDate: null, startDate: null }
  const detail = projects.find((project) => project.id === detailId) ?? null

  const open = (project: Project): void => {
    setDetailId(project.id)
    setDetailOpen(true)
  }

  const complete = (project: Project): void => {
    setProjects((current) =>
      current.map((item) => (item.id === project.id ? { ...item, progress: 100, status: 'Done' } : item)),
    )
    toast.success({
      action: {
        label: 'Undo',
        onClick: () => setProjects((current) => current.map((item) => (item.id === project.id ? project : item))),
      },
      description: project.name,
      title: 'Project completed',
    })
  }

  const remove = (project: Project): void => {
    setProjects((current) => current.filter((item) => item.id !== project.id))
    setDetailOpen(false)
    toast.info({ description: project.name, title: 'Project deleted' })
  }

  return (
    <>
      <div className={styles.toolbar}>
        <Input
          aria-label="Search projects"
          className={styles.search}
          elementBefore={<SearchIcon />}
          onChange={(event) => state.setFilter('name', event.target.value)}
          placeholder="Search projects"
          value={String(state.filters.name ?? '')}
        />
        <div className={styles.status}>
          <Select
            onValueChange={(value) => state.setFilter('status', value)}
            value={String(state.filters.status ?? '')}
          >
            <SelectTrigger aria-label="Status" placeholder="All statuses" />
            <SelectContent>
              {statuses.map((status) => (
                <SelectOption key={status} value={status}>
                  {status}
                </SelectOption>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className={styles.due}>
          <DatePicker
            aria-label="Due date"
            onValueChange={(range) =>
              state.setFilter('due', range.startDate || range.endDate ? range : null)
            }
            placeholder="Due between"
            range
            value={dueRange}
          />
        </div>
        {state.hasFilters ? (
          <Button onClick={state.resetFilters} variant="ghost">
            Clear filters
          </Button>
        ) : null}
      </div>

      <Table aria-label="Projects" hoverable>
        <TableCaption>{`${state.total} ${state.total === 1 ? 'project' : 'projects'}`}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead {...state.getSortProps('name')}>Project</TableHead>
            <TableHead {...state.getSortProps('status')}>Status</TableHead>
            <TableHead {...state.getSortProps('progress')}>Progress</TableHead>
            <TableHead {...state.getSortProps('due')}>Due</TableHead>
            <TableHead>Team</TableHead>
            <TableHead align="end">
              <span className={styles.visuallyHidden}>Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {state.rows.length === 0 ? (
            <TableEmpty
              action={
                <Button onClick={state.resetFilters} size="sm" variant="outline">
                  Clear filters
                </Button>
              }
              colSpan={6}
              description="No project matches the search and the filters."
              title="No projects found"
            />
          ) : (
            state.rows.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <button className={styles.name} onClick={() => open(project)} type="button">
                    {project.name}
                  </button>
                  <div className={styles.owner}>
                    <Avatar name={project.owner} size="sm" />
                    {project.owner}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge colorScheme={statusColor[project.status]} dot variant="subtle">
                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <ProgressBar
                    aria-label={`${project.name} progress`}
                    colorScheme={statusColor[project.status]}
                    showValue
                    value={project.progress}
                  />
                </TableCell>
                <TableCell>{formatDue(project.due)}</TableCell>
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
                      <Button aria-label={`Actions for ${project.name}`} size="sm" variant="ghost">
                        <MoreIcon />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem icon={<EyeIcon />} onSelect={() => open(project)}>
                        Open details
                      </DropdownItem>
                      <DropdownItem
                        disabled={project.status === 'Done'}
                        icon={<CheckIcon />}
                        onSelect={() => complete(project)}
                      >
                        Mark as done
                      </DropdownItem>
                      <DropdownSeparator />
                      <DropdownItem icon={<TrashIcon />} onSelect={() => setRemoving(project)}>
                        Delete
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
        aria-label="Projects pages"
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

      <ProjectDrawer
        onComplete={complete}
        onOpenChange={setDetailOpen}
        onRemove={setRemoving}
        open={detailOpen}
        project={detail}
      />

      <Modal onOpenChange={(next) => !next && setRemoving(null)} open={removing !== null}>
        <ModalContent>
          <ModalHeader>Delete project</ModalHeader>
          <ModalBody>
            {removing ? `"${removing.name}" and its history will be removed. This cannot be undone.` : null}
          </ModalBody>
          <ModalFooter>
            <ModalClose>
              <Button variant="ghost">Cancel</Button>
            </ModalClose>
            <ModalClose>
              <Button colorScheme="error" onClick={() => removing && remove(removing)}>
                Delete
              </Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
