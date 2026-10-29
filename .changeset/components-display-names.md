---
'plume-ui-react': patch
---

Set `displayName` on the components that lacked it (`Modal`, `Select`, `Dropdown`, `Drawer`, `Popover`, `Tooltip`, `ToastProvider`, `SidebarProvider`, `TabsProvider`, `PaginatorPages` and some of the parts of the DatePicker, Select, TimePicker and Rating), so React DevTools and the code Storybook generates show their names instead of the minified ones.
