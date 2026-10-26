---
'plume-ui-react': minor
---

Accessibility sweep of the 44 components in light and dark mode, checked with axe.

- `Button` with `isBusy` no longer sets the native `disabled`: it keeps the focus, is announced with `aria-busy` and `aria-disabled`, and ignores its clicks. The label still names it while busy.
- `Popover` is no longer a focus trap: Tab past its last control closes it and moves on, as a non-modal dialog should. Escape and outside presses work as before.
- A `Toast` stays longer when its text is longer, and one with an `action` stays until it is dismissed or acted on, unless it sets its own `duration`.
- `Spinner` without `color` takes the foreground of the theme, so it shows in dark mode.
- `ThemeProvider` sets `color-scheme`, so native controls and scrollbars follow the color mode.
- `Select` announces "no results" through a live region that is always in the page, and `Field` announces its error with `role="alert"`.
- `Paginator` and `Carousel` keep the focus when the arrow you were pressing becomes unavailable.
- Forced colors (Windows high contrast) support in `Avatar` status, `Button`, `DatePicker`, `Rating`, `Slider`, `Spinner`, `Stepper`, `Tabs` and `TimePicker`, and a status that does not depend on color alone in `Avatar` and `Badge`.
- Larger touch targets for the `Slider` thumb and the `Carousel` dots, and `Button`, `Select` and `Spinner` respect `prefers-reduced-motion`.
- Text contrast on the hover and active states of `Button` and the selected item of `Tree`.
