---
'plume-ui-react': minor
---

Adds the navigation components of the 1.0 catalog.

`Breadcrumb` (with `BreadcrumbItem`, `BreadcrumbLink` and `BreadcrumbSeparator`) shows the path of the current page. It is a `<nav>` named "Breadcrumb" with an ordered list, the current page has `aria-current="page"`, and the separators are decorative, can be any node, and the last one is not shown. It has `plain` and `filled` variants.

`Stepper` (with `Step`, `StepIndicator`, `StepTitle`, `StepDescription` and `StepSeparator`) shows the progress of a process, horizontal or vertical. `activeStep` marks the current step, the ones before it are completed and the ones after it upcoming; the state is in `data-state` on every part and in `aria-current="step"`, and a screen reader says "Completed" or "Not started" (`statusLabels` translates them). Each step finds its position from the `Stepper`, so a step can be wrapped in your own component. It has `solid` and `outline` variants.

`Navbar` (with `NavbarBrand`, `NavbarContent`, `NavbarItem` and `NavbarToggle`) is the bar at the top of a page. Below a `breakpoint` (`sm`, `md`, `lg` or `never`) its content folds behind a toggle with `aria-expanded` and `aria-controls`; the folding is CSS only, so it works on the server, and <kbd>Esc</kbd> or a press outside closes the menu. The menu can be controlled with `open`, `defaultOpen` and `onOpenChange`. It has `plain`, `outline`, `filled` and `solid` variants and can be `sticky`.

`Sidebar` (with `SidebarProvider`, `SidebarContent`, `SidebarItem` and `SidebarToggle`) is the navigation of an app. On a wide screen it collapses to a rail of icons (`collapsed`, `defaultCollapsed`, `onCollapsedChange`); below a `breakpoint` it leaves the page and opens over it as a modal dialog that traps the focus, locks the scroll of the page and closes with <kbd>Esc</kbd> or a press on the backdrop (`open`, `defaultOpen`, `onOpenChange`). The provider is separate so the toggle can live anywhere, for example in the header of the page. It has `plain`, `outline`, `filled` and `solid` variants, opens from the `left` or the `right`, and with `breakpoint="never"` it stays docked at every width.

Every one of them has an `unstyled` variant that keeps the structure and drops the Plume styles, and takes a class for each part.
