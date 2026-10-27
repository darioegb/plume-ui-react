export type ProjectStatus = 'On track' | 'At risk' | 'Delayed' | 'Done'

export interface Project {
  due: string
  id: string
  name: string
  progress: number
  status: ProjectStatus
  team: string[]
}

export interface Metric {
  change: string
  id: string
  label: string
  trend: 'up' | 'down'
  value: string
}

const projects: Project[] = [
  {
    due: 'Nov 14',
    id: 'website-redesign',
    name: 'Website redesign',
    progress: 72,
    status: 'On track',
    team: ['Ana Ruiz', 'Marco Silva', 'Lena Fischer'],
  },
  {
    due: 'Dec 2',
    id: 'mobile-app',
    name: 'Mobile app launch',
    progress: 45,
    status: 'At risk',
    team: ['Marco Silva', 'Priya Nair', 'Tom Becker', 'Sara Lind', 'Ken Ito'],
  },
  {
    due: 'Oct 30',
    id: 'billing-migration',
    name: 'Billing migration',
    progress: 28,
    status: 'Delayed',
    team: ['Priya Nair', 'Tom Becker'],
  },
  {
    due: 'Oct 18',
    id: 'onboarding-emails',
    name: 'Onboarding emails',
    progress: 100,
    status: 'Done',
    team: ['Lena Fischer', 'Sara Lind'],
  },
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
  return { metrics, projects }
}
