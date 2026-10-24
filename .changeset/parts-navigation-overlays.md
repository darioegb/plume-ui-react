---
'plume-ui-react': minor
---

`Accordion`, `Breadcrumb`, `Stepper`, `Sidebar`, `Modal`, `Drawer`, `Toast`, `Dropdown` and `Tree` are made of exported parts (`AccordionHeading`, `AccordionTitle`, `AccordionIcon`, `AccordionBody`, `BreadcrumbList`, `StepIndicatorContent`, `StepIndicatorLabel`, `SidebarBackdrop`, `SidebarItemIcon`, `SidebarItemLabel`, `ModalBackdrop`, `DrawerBackdrop`, `Toast`, `ToastIcon`, `ToastBody`, `ToastTitle`, `ToastDescription`, `ToastActionButton`, `ToastDismiss`, `DropdownItemIcon`, `DropdownItemLabel`, `DropdownItemShortcut`, `TreeItemChevron`, `TreeItemCheckbox`, `TreeItemIcon`), each with its own `className`, `style` and `ref`, and `classNames` is removed from them. `ToastProvider` takes a `render` function to compose the toasts created with `useToast()`. `Tabs`, `Navbar`, `Popover` and `Tooltip` already were made of parts and now take `style` in each of them. See "Upgrading to 1.0".
