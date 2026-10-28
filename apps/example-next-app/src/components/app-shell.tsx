'use client'

import type { MouseEvent, ReactNode } from 'react'
import { useState, useTransition } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  Avatar,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Dropdown,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
  DropdownSeparator,
  DropdownTrigger,
  Navbar,
  NavbarContent,
  Sidebar,
  SidebarContent,
  SidebarItem,
  SidebarProvider,
  SidebarToggle,
  useTheme,
} from 'plume-ui-react'
import { saveColorMode, signOut } from '@/app/actions'
import { usePreferences } from '@/app/providers'
import { DashboardIcon, MoonIcon, ProjectsIcon, SettingsIcon, SignOutIcon, SunIcon, TeamIcon } from './icons'
import { ScrollToTop } from './scroll-to-top'
import styles from './app-shell.module.css'

const pages = [
  { href: '/', icon: <DashboardIcon />, label: 'Dashboard' },
  { href: '/projects', icon: <ProjectsIcon />, label: 'Projects' },
  { href: '/team', icon: <TeamIcon />, label: 'Team' },
  { href: '/settings', icon: <SettingsIcon />, label: 'Settings' },
]

const subpages: Record<string, string> = { '/projects/new': 'New project' }

const isCurrent = (pathname: string, href: string): boolean =>
  href === '/' ? pathname === '/' : pathname.startsWith(href)

export function AppShell({
  children,
  user,
}: Readonly<{ children: ReactNode; user: { email: string; name: string } }>): ReactNode {
  const pathname = usePathname()
  const router = useRouter()
  const { colorMode, setColorMode } = useTheme()
  const { setColorModeSetting } = usePreferences()
  const [open, setOpen] = useState(false)
  const [, startTransition] = useTransition()
  const current = pages.find((page) => isCurrent(pathname, page.href))
  const subpage = subpages[pathname]

  // Plain clicks navigate on the client; modified ones keep the browser's behavior.
  const go =
    (href: string) =>
    (event: MouseEvent<HTMLElement>): void => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      event.preventDefault()
      setOpen(false)
      router.push(href)
    }

  const toggleColorMode = (): void => {
    const next = colorMode === 'dark' ? 'light' : 'dark'
    setColorMode(next)
    setColorModeSetting(next)
    startTransition(() => saveColorMode(next))
  }

  return (
    <SidebarProvider onOpenChange={setOpen} open={open}>
      <div className={styles.layout}>
        <Sidebar aria-label="Application">
          <div className={styles.brand}>
            <span aria-hidden="true" className={styles.mark}>
              P
            </span>
            <span className={styles.name}>Plume Projects</span>
          </div>
          <SidebarContent aria-label="Pages">
            {pages.map((page) => (
              <SidebarItem
                active={isCurrent(pathname, page.href)}
                href={page.href}
                icon={page.icon}
                key={page.href}
                onClick={go(page.href)}
              >
                {page.label}
              </SidebarItem>
            ))}
          </SidebarContent>
        </Sidebar>
        <div className={styles.column}>
          <Navbar aria-label="Top bar" breakpoint="never" className={styles.topbar} sticky>
            <SidebarToggle />
            <NavbarContent>
              <Breadcrumb size="sm">
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" current={pathname === '/'} onClick={go('/')}>
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {current && current.href !== '/' ? (
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      current={!subpage}
                      href={subpage ? current.href : undefined}
                      onClick={subpage ? go(current.href) : undefined}
                    >
                      {current.label}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                ) : null}
                {subpage ? (
                  <BreadcrumbItem>
                    <BreadcrumbLink current>{subpage}</BreadcrumbLink>
                  </BreadcrumbItem>
                ) : null}
              </Breadcrumb>
            </NavbarContent>
            <NavbarContent align="end">
              <Button
                aria-label={colorMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                onClick={toggleColorMode}
                variant="ghost"
              >
                {colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
              </Button>
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button aria-label={`Account menu for ${user.name}`} variant="ghost">
                    <Avatar name={user.name} size="sm" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownLabel>{user.email}</DropdownLabel>
                  <DropdownSeparator />
                  <DropdownItem icon={<SettingsIcon />} onSelect={() => router.push('/settings')}>
                    Settings
                  </DropdownItem>
                  <DropdownItem icon={<SignOutIcon />} onSelect={() => startTransition(() => signOut())}>
                    Sign out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarContent>
          </Navbar>
          <main className={styles.content} id="main">
            {children}
          </main>
        </div>
      </div>
      <ScrollToTop />
    </SidebarProvider>
  )
}
