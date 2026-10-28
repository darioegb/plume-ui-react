import type { MouseEvent, ReactNode } from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
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
} from "plume-ui-react";
import { resetData } from "../lib/data";
import { usePreferences } from "../providers";
import { brands, type BrandId } from "../theme";
import {
  CheckIcon,
  DashboardIcon,
  MoonIcon,
  ProjectsIcon,
  RefreshIcon,
  SunIcon,
} from "./icons";
import { ScrollToTop } from "./scroll-to-top";
import styles from "./app-shell.module.css";

const user = { email: "ana.ruiz@plume.dev", name: "Ana Ruiz" };

const pages = [
  { href: "/", icon: <DashboardIcon />, label: "Dashboard" },
  { href: "/projects", icon: <ProjectsIcon />, label: "Projects" },
];

const isCurrent = (pathname: string, href: string): boolean =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);

export function AppShell({
  children,
}: Readonly<{ children: ReactNode }>): ReactNode {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { colorMode, setColorMode } = useTheme();
  const { brand, setBrand, setColorModeSetting } = usePreferences();
  const [open, setOpen] = useState(false);
  const current = pages.find((page) => isCurrent(pathname, page.href));

  // A new page starts at the top, like a full page load would.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Plain clicks navigate on the client; modified ones keep the browser's behavior.
  const go =
    (href: string) =>
    (event: MouseEvent<HTMLElement>): void => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      event.preventDefault();
      setOpen(false);
      void navigate(href);
    };

  const toggleColorMode = (): void => {
    const next = colorMode === "dark" ? "light" : "dark";
    setColorMode(next);
    setColorModeSetting(next);
  };

  const resetDemo = (): void => {
    resetData();
    window.location.reload();
  };

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
          <Navbar
            aria-label="Top bar"
            breakpoint="never"
            className={styles.topbar}
            sticky
          >
            <SidebarToggle />
            <NavbarContent>
              <Breadcrumb size="sm">
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/"
                    current={pathname === "/"}
                    onClick={go("/")}
                  >
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {current && current.href !== "/" ? (
                  <BreadcrumbItem>
                    <BreadcrumbLink current>{current.label}</BreadcrumbLink>
                  </BreadcrumbItem>
                ) : null}
              </Breadcrumb>
            </NavbarContent>
            <NavbarContent align="end">
              <Button
                aria-label={
                  colorMode === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
                onClick={toggleColorMode}
                variant="ghost"
              >
                {colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
              </Button>
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button
                    aria-label={`Account menu for ${user.name}`}
                    variant="ghost"
                  >
                    <Avatar name={user.name} size="sm" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownLabel>{user.email}</DropdownLabel>
                  <DropdownSeparator />
                  <DropdownLabel>Brand color</DropdownLabel>
                  {(Object.keys(brands) as BrandId[]).map((id) => (
                    <DropdownItem
                      icon={id === brand ? <CheckIcon /> : undefined}
                      key={id}
                      onSelect={() => setBrand(id)}
                    >
                      {brands[id].label}
                    </DropdownItem>
                  ))}
                  <DropdownSeparator />
                  <DropdownItem icon={<RefreshIcon />} onSelect={resetDemo}>
                    Reset demo data
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
  );
}
