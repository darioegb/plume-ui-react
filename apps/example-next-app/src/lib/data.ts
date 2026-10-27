export type ProjectStatus = 'On track' | 'At risk' | 'Delayed' | 'Done'

export interface Project {
  description: string
  /** ISO date, `YYYY-MM-DD`. */
  due: string
  id: string
  name: string
  owner: string
  progress: number
  status: ProjectStatus
  team: string[]
  visibility: Visibility
}

export type Visibility = 'Private' | 'Workspace'

export interface NewProjectInput {
  description: string
  /** ISO date, `YYYY-MM-DD`. */
  due: string
  name: string
  notify: boolean
  owner: string
  team: string[]
  visibility: Visibility
}

export interface Metric {
  change: string
  id: string
  label: string
  trend: 'up' | 'down'
  value: string
}

const seed: Omit<Project, 'visibility'>[] = [
  {
    description: 'A new marketing site with a faster build and an updated brand.',
    due: '2026-11-14',
    id: 'website-redesign',
    name: 'Website redesign',
    owner: 'Ana Ruiz',
    progress: 72,
    status: 'On track',
    team: ['Ana Ruiz', 'Marco Silva', 'Lena Fischer'],
  },
  {
    description: 'The first release of the iOS and Android apps.',
    due: '2026-12-02',
    id: 'mobile-app',
    name: 'Mobile app launch',
    owner: 'Marco Silva',
    progress: 45,
    status: 'At risk',
    team: ['Marco Silva', 'Priya Nair', 'Tom Becker', 'Sara Lind', 'Ken Ito'],
  },
  {
    description: 'Move the subscriptions to the new billing provider.',
    due: '2026-10-30',
    id: 'billing-migration',
    name: 'Billing migration',
    owner: 'Priya Nair',
    progress: 28,
    status: 'Delayed',
    team: ['Priya Nair', 'Tom Becker'],
  },
  {
    description: 'A welcome sequence for new accounts.',
    due: '2026-10-18',
    id: 'onboarding-emails',
    name: 'Onboarding emails',
    owner: 'Lena Fischer',
    progress: 100,
    status: 'Done',
    team: ['Lena Fischer', 'Sara Lind'],
  },
  {
    description: 'Track the usage of every feature in one place.',
    due: '2026-11-21',
    id: 'analytics-dashboard',
    name: 'Analytics dashboard',
    owner: 'Tom Becker',
    progress: 61,
    status: 'On track',
    team: ['Tom Becker', 'Ken Ito', 'Ana Ruiz'],
  },
  {
    description: 'Answers to the questions customers ask most.',
    due: '2026-11-05',
    id: 'help-center',
    name: 'Help center',
    owner: 'Sara Lind',
    progress: 83,
    status: 'On track',
    team: ['Sara Lind', 'Lena Fischer'],
  },
  {
    description: 'Single sign-on and audit logs for larger teams.',
    due: '2026-12-15',
    id: 'enterprise-sso',
    name: 'Enterprise SSO',
    owner: 'Ken Ito',
    progress: 18,
    status: 'At risk',
    team: ['Ken Ito', 'Priya Nair', 'Marco Silva'],
  },
  {
    description: 'Cut the time to first paint on the main pages.',
    due: '2026-10-25',
    id: 'performance-audit',
    name: 'Performance audit',
    owner: 'Marco Silva',
    progress: 100,
    status: 'Done',
    team: ['Marco Silva', 'Tom Becker'],
  },
  {
    description: 'Public docs for the REST API, with examples.',
    due: '2026-11-28',
    id: 'api-docs',
    name: 'API documentation',
    owner: 'Lena Fischer',
    progress: 37,
    status: 'On track',
    team: ['Lena Fischer', 'Ken Ito'],
  },
  {
    description: 'Review the colors and the text for contrast and keyboard use.',
    due: '2026-10-28',
    id: 'accessibility-review',
    name: 'Accessibility review',
    owner: 'Ana Ruiz',
    progress: 52,
    status: 'Delayed',
    team: ['Ana Ruiz', 'Sara Lind', 'Tom Becker'],
  },
  {
    description: 'Let customers see the status of their orders.',
    due: '2026-12-09',
    id: 'customer-portal',
    name: 'Customer portal',
    owner: 'Priya Nair',
    progress: 9,
    status: 'On track',
    team: ['Priya Nair', 'Marco Silva', 'Sara Lind', 'Ana Ruiz'],
  },
  {
    description: 'Archive the old uploads and move the rest to cold storage.',
    due: '2026-10-12',
    id: 'storage-cleanup',
    name: 'Storage cleanup',
    owner: 'Tom Becker',
    progress: 100,
    status: 'Done',
    team: ['Tom Becker'],
  },
]

// The simulated database: it lives in the server process and is shared by every user.
const projects: Project[] = seed.map((project) => ({ ...project, visibility: 'Workspace' }))

export const members = [
  'Ana Ruiz',
  'Marco Silva',
  'Lena Fischer',
  'Priya Nair',
  'Tom Becker',
  'Sara Lind',
  'Ken Ito',
  'Noor Haddad',
  'Diego Alvarez',
]

const metrics: Metric[] = [
  { change: '+3 this month', id: 'active', label: 'Active projects', trend: 'up', value: '12' },
  { change: '+18%', id: 'completed', label: 'Tasks completed', trend: 'up', value: '248' },
  { change: '-2 since Monday', id: 'overdue', label: 'Overdue tasks', trend: 'down', value: '7' },
  { change: '+1 this week', id: 'team', label: 'Team members', trend: 'up', value: '9' },
]

// Stands in for a database call, so the loading skeleton is visible.
const latency = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

export async function getDashboard(): Promise<{ metrics: Metric[]; projects: Project[] }> {
  await latency(900)
  return { metrics, projects: projects.slice(0, 4) }
}

export async function getProjects(): Promise<Project[]> {
  await latency(600)
  return [...projects]
}

export async function addProject(input: NewProjectInput): Promise<Project> {
  await latency(500)
  const project: Project = {
    description: input.description || 'No description yet.',
    due: input.due,
    id: `${input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`,
    name: input.name,
    owner: input.owner,
    progress: 0,
    status: 'On track',
    team: input.team,
    visibility: input.visibility,
  }
  projects.unshift(project)
  return project
}
