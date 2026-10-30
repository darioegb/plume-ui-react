'use client'

import type { MouseEvent, ReactNode } from 'react'
import { useState, useTransition } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
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
import { LanguageSwitcher } from './language-switcher'
import { ScrollToTop } from './scroll-to-top'
import styles from './app-shell.module.css'

const pages = [
  { href: '/', icon: <DashboardIcon />, label: 'dashboard' },
  { href: '/projects', icon: <ProjectsIcon />, label: 'projects' },
  { href: '/team', icon: <TeamIcon />, label: 'team' },
  { href: '/settings', icon: <SettingsIcon />, label: 'settings' },
] as const

const subpages = { '/projects/new': 'newProject' } as const

const isCurrent = (pathname: string, href: string): boolean =>
  href === '/' ? pathname === '/' : pathname.startsWith(href)

export function AppShell({
  children,
  user,
}: Readonly<{ children: ReactNode; user: { email: string; name: string } }>): ReactNode {
  const t = useTranslations('nav')
  const tApp = useTranslations('app')
  const pathname = usePathname()
  const router = useRouter()
  const { colorMode, setColorMode } = useTheme()
  const { setColorModeSetting } = usePreferences()
  const [open, setOpen] = useState(false)
  const [, startTransition] = useTransition()
  const current = pages.find((page) => isCurrent(pathname, page.href))
  const subpage = pathname in subpages ? subpages[pathname as keyof typeof subpages] : undefined

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
      <div className="flex min-h-screen">
        <Sidebar aria-label={t('application')}>
          <div
            className={`${styles.brand} flex items-center gap-2.5 px-4 pt-5 pb-3 text-lg font-bold whitespace-nowrap text-foreground`}
          >
            <span
              aria-hidden="true"
              className="inline-flex size-8 flex-none items-center justify-center rounded-2 bg-primary-solid text-primary-on-solid"
            >
              P
            </span>
            <span className={styles.name}>{tApp('name')}</span>
          </div>
          <SidebarContent aria-label={t('pages')}>
            {pages.map((page) => (
              <SidebarItem
                active={isCurrent(pathname, page.href)}
                href={page.href}
                icon={page.icon}
                key={page.href}
                onClick={go(page.href)}
              >
                {t(page.label)}
              </SidebarItem>
            ))}
          </SidebarContent>
        </Sidebar>
        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar
            aria-label={t('topBar')}
            breakpoint="never"
            className="z-5 flex items-center gap-3 bg-background px-5 py-2"
            sticky
          >
            <SidebarToggle />
            <NavbarContent>
              <Breadcrumb size="sm">
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" current={pathname === '/'} onClick={go('/')}>
                    {t('home')}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {current && current.href !== '/' ? (
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      current={!subpage}
                      href={subpage ? current.href : undefined}
                      onClick={subpage ? go(current.href) : undefined}
                    >
                      {t(current.label)}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                ) : null}
                {subpage ? (
                  <BreadcrumbItem>
                    <BreadcrumbLink current>{t(subpage)}</BreadcrumbLink>
                  </BreadcrumbItem>
                ) : null}
              </Breadcrumb>
            </NavbarContent>
            <NavbarContent align="end">
              <LanguageSwitcher />
              <Button
                aria-label={colorMode === 'dark' ? t('switchToLight') : t('switchToDark')}
                onClick={toggleColorMode}
                variant="ghost"
              >
                {colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
              </Button>
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button aria-label={t('accountMenu', { name: user.name })} variant="ghost">
                    <Avatar name={user.name} size="sm" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownLabel>{user.email}</DropdownLabel>
                  <DropdownSeparator />
                  <DropdownItem icon={<SettingsIcon />} onSelect={() => router.push('/settings')}>
                    {t('settings')}
                  </DropdownItem>
                  <DropdownItem icon={<SignOutIcon />} onSelect={() => startTransition(() => signOut())}>
                    {t('signOut')}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarContent>
          </Navbar>
          <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 pt-6 pb-12" id="main">
            {children}
          </main>
        </div>
      </div>
      <ScrollToTop />
    </SidebarProvider>
  )
}
