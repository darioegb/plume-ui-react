---
'plume-ui-react': minor
---

The parts of the `Sidebar` (`SidebarBackdrop`, `SidebarContent`, `SidebarItem`, `SidebarItemIcon` and `SidebarItemLabel`) throw `must be used within a <Sidebar>` when they are rendered outside it, instead of silently using the styled defaults. The toggle is no longer read from a ref while rendering, so the focus returns to it when the panel closes even if it mounts later.
