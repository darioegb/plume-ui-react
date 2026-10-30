export type ProjectStatus = 'onTrack' | 'atRisk' | 'delayed' | 'done'

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

export type Visibility = 'private' | 'workspace'

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

export type MetricId = 'active' | 'completed' | 'overdue' | 'team'

export interface Metric {
  /** A ratio for `completed` (0.18 is 18 %), a count for the rest. */
  change: number
  id: MetricId
  trend: 'up' | 'down'
  value: number
}

const seed: Omit<Project, 'visibility'>[] = [
  {
    description: 'A new marketing site with a faster build and an updated brand.',
    due: '2026-11-14',
    id: 'website-redesign',
    name: 'Website redesign',
    owner: 'Ana Ruiz',
    progress: 72,
    status: 'onTrack',
    team: ['Ana Ruiz', 'Marco Silva', 'Lena Fischer'],
  },
  {
    description: 'The first release of the iOS and Android apps.',
    due: '2026-12-02',
    id: 'mobile-app',
    name: 'Mobile app launch',
    owner: 'Marco Silva',
    progress: 45,
    status: 'atRisk',
    team: ['Marco Silva', 'Priya Nair', 'Tom Becker', 'Sara Lind', 'Ken Ito'],
  },
  {
    description: 'Move the subscriptions to the new billing provider.',
    due: '2026-10-30',
    id: 'billing-migration',
    name: 'Billing migration',
    owner: 'Priya Nair',
    progress: 28,
    status: 'delayed',
    team: ['Priya Nair', 'Tom Becker'],
  },
  {
    description: 'A welcome sequence for new accounts.',
    due: '2026-10-18',
    id: 'onboarding-emails',
    name: 'Onboarding emails',
    owner: 'Lena Fischer',
    progress: 100,
    status: 'done',
    team: ['Lena Fischer', 'Sara Lind'],
  },
  {
    description: 'Track the usage of every feature in one place.',
    due: '2026-11-21',
    id: 'analytics-dashboard',
    name: 'Analytics dashboard',
    owner: 'Tom Becker',
    progress: 61,
    status: 'onTrack',
    team: ['Tom Becker', 'Ken Ito', 'Ana Ruiz'],
  },
  {
    description: 'Answers to the questions customers ask most.',
    due: '2026-11-05',
    id: 'help-center',
    name: 'Help center',
    owner: 'Sara Lind',
    progress: 83,
    status: 'onTrack',
    team: ['Sara Lind', 'Lena Fischer'],
  },
  {
    description: 'Single sign-on and audit logs for larger teams.',
    due: '2026-12-15',
    id: 'enterprise-sso',
    name: 'Enterprise SSO',
    owner: 'Ken Ito',
    progress: 18,
    status: 'atRisk',
    team: ['Ken Ito', 'Priya Nair', 'Marco Silva'],
  },
  {
    description: 'Cut the time to first paint on the main pages.',
    due: '2026-10-25',
    id: 'performance-audit',
    name: 'Performance audit',
    owner: 'Marco Silva',
    progress: 100,
    status: 'done',
    team: ['Marco Silva', 'Tom Becker'],
  },
  {
    description: 'Public docs for the REST API, with examples.',
    due: '2026-11-28',
    id: 'api-docs',
    name: 'API documentation',
    owner: 'Lena Fischer',
    progress: 37,
    status: 'onTrack',
    team: ['Lena Fischer', 'Ken Ito'],
  },
  {
    description: 'Review the colors and the text for contrast and keyboard use.',
    due: '2026-10-28',
    id: 'accessibility-review',
    name: 'Accessibility review',
    owner: 'Ana Ruiz',
    progress: 52,
    status: 'delayed',
    team: ['Ana Ruiz', 'Sara Lind', 'Tom Becker'],
  },
  {
    description: 'Let customers see the status of their orders.',
    due: '2026-12-09',
    id: 'customer-portal',
    name: 'Customer portal',
    owner: 'Priya Nair',
    progress: 9,
    status: 'onTrack',
    team: ['Priya Nair', 'Marco Silva', 'Sara Lind', 'Ana Ruiz'],
  },
  {
    description: 'Archive the old uploads and move the rest to cold storage.',
    due: '2026-10-12',
    id: 'storage-cleanup',
    name: 'Storage cleanup',
    owner: 'Tom Becker',
    progress: 100,
    status: 'done',
    team: ['Tom Becker'],
  },
]

// The simulated database: it lives in the server process and is shared by every user.
const projects: Project[] = seed.map((project) => ({ ...project, visibility: 'workspace' }))

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
  { change: 3, id: 'active', trend: 'up', value: 12 },
  { change: 0.18, id: 'completed', trend: 'up', value: 248 },
  { change: 2, id: 'overdue', trend: 'down', value: 7 },
  { change: 1, id: 'team', trend: 'up', value: 9 },
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
    description: input.description,
    due: input.due,
    id: `${input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`,
    name: input.name,
    owner: input.owner,
    progress: 0,
    status: 'onTrack',
    team: input.team,
    visibility: input.visibility,
  }
  projects.unshift(project)
  return project
}

export type Department = 'design' | 'engineering' | 'product' | 'support'
export type Presence = 'away' | 'busy' | 'offline' | 'online'
export type Role =
  | 'backendEngineer'
  | 'customerSuccess'
  | 'dataAnalyst'
  | 'frontendEngineer'
  | 'productDesigner'
  | 'productManager'
  | 'staffEngineer'
  | 'supportLead'
  | 'supportSpecialist'
  | 'uxResearcher'
export type Skill =
  | 'accessibility'
  | 'accounts'
  | 'architecture'
  | 'css'
  | 'dashboards'
  | 'designSystems'
  | 'docs'
  | 'figma'
  | 'go'
  | 'interviews'
  | 'nodejs'
  | 'onboarding'
  | 'postgresql'
  | 'react'
  | 'research'
  | 'roadmaps'
  | 'security'
  | 'sql'
  | 'surveys'
  | 'training'

export interface TeamMember {
  department: Department
  email: string
  name: string
  pending?: boolean
  presence: Presence
  role: Role
  skills: Skill[]
}

const team: TeamMember[] = [
  { department: 'product', email: 'ana.ruiz@plume.dev', name: 'Ana Ruiz', presence: 'online', role: 'productManager', skills: ['roadmaps', 'research'] },
  { department: 'engineering', email: 'marco.silva@plume.dev', name: 'Marco Silva', presence: 'busy', role: 'frontendEngineer', skills: ['react', 'accessibility', 'css'] },
  { department: 'design', email: 'lena.fischer@plume.dev', name: 'Lena Fischer', presence: 'online', role: 'productDesigner', skills: ['figma', 'designSystems'] },
  { department: 'engineering', email: 'priya.nair@plume.dev', name: 'Priya Nair', presence: 'away', role: 'backendEngineer', skills: ['nodejs', 'postgresql'] },
  { department: 'product', email: 'tom.becker@plume.dev', name: 'Tom Becker', presence: 'offline', role: 'dataAnalyst', skills: ['sql', 'dashboards'] },
  { department: 'support', email: 'sara.lind@plume.dev', name: 'Sara Lind', presence: 'online', role: 'supportLead', skills: ['onboarding', 'docs'] },
  { department: 'engineering', email: 'ken.ito@plume.dev', name: 'Ken Ito', presence: 'busy', role: 'staffEngineer', skills: ['architecture', 'security', 'go'] },
  { department: 'design', email: 'noor.haddad@plume.dev', name: 'Noor Haddad', presence: 'away', role: 'uxResearcher', skills: ['interviews', 'surveys'] },
  { department: 'support', email: 'diego.alvarez@plume.dev', name: 'Diego Alvarez', presence: 'offline', role: 'customerSuccess', skills: ['accounts', 'training'] },
]

export async function getTeam(): Promise<TeamMember[]> {
  await latency(400)
  return team
}
