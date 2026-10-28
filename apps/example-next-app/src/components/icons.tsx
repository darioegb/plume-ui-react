import type { ReactNode } from 'react'

function Glyph({ path }: Readonly<{ path: string }>): ReactNode {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="1.1em"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="1.1em"
    >
      <path d={path} />
    </svg>
  )
}

export const DashboardIcon = (): ReactNode => <Glyph path="M3 3h8v10H3zM13 3h8v6h-8zM13 11h8v10h-8zM3 15h8v6H3z" />
export const ProjectsIcon = (): ReactNode => <Glyph path="M3 7h18v13H3zM8 7V4h8v3" />
export const TeamIcon = (): ReactNode => (
  <Glyph path="M16 20v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6M22 20v-2a4 4 0 0 0-3-3.9M16 4.1a3 3 0 0 1 0 5.8" />
)
export const SettingsIcon = (): ReactNode => (
  <Glyph path="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
)
export const SunIcon = (): ReactNode => (
  <Glyph path="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
)
export const MoonIcon = (): ReactNode => <Glyph path="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8" />
export const SignOutIcon = (): ReactNode => <Glyph path="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
export const FolderIcon = (): ReactNode => <Glyph path="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
export const SearchIcon = (): ReactNode => <Glyph path="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16M21 21l-4.3-4.3" />
export const MoreIcon = (): ReactNode => (
  <Glyph path="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2M19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2M5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
)
export const ArrowUpIcon = (): ReactNode => <Glyph path="M12 19V5M5 12l7-7 7 7" />
export const CheckIcon = (): ReactNode => <Glyph path="M20 6 9 17l-5-5" />
export const TrashIcon = (): ReactNode => <Glyph path="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5" />
export const EyeIcon = (): ReactNode => <Glyph path="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
