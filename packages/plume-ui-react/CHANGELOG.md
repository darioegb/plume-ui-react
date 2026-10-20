# plume-ui-react

## 0.5.0

### Minor Changes

- [#85](https://github.com/darioegb/plume-ui-react/pull/85) [`289c244b877b86b2d78fbbd47c5526c5349d4113`](https://github.com/darioegb/plume-ui-react/commit/289c244b877b86b2d78fbbd47c5526c5349d4113) Thanks [@darioegb](https://github.com/darioegb)! - Adds `Modal` (with `ModalTrigger`, `ModalContent`, `ModalHeader`, `ModalBody`, `ModalFooter` and `ModalClose`): a dialog built with no dependencies. The focus moves into it, stays inside while the user tabs and goes back to the trigger on close, the page behind doesn't scroll, and `Esc` and a click on the backdrop close it, only on the one on top when they are nested. It can be controlled with `open` and `onOpenChange`, is named by its header or an `aria-label`, and its body takes the focus when it scrolls so a keyboard user can reach it.

  Adds `Popover` (with `PopoverTrigger`, `PopoverContent` and `PopoverClose`): a panel that opens next to its trigger, with `placement`, `offset`, `flip` and `shift`, and `elevated`, `outline` and `unstyled` variants. It is a non-modal dialog: the focus moves into it and goes back to the trigger, `Esc` and a click outside close it, and the page behind keeps scrolling.

  Adds `Tooltip`: `<Tooltip content="Save"><Button /></Tooltip>`. It opens when the pointer rests on the element or when it takes the focus with the keyboard, describes the element with `aria-describedby` while it is open, never takes the focus, and closes with `Esc`, on blur or when the pointer leaves. The pointer can move onto the tooltip without it closing. It has `placement`, `offset`, `openDelay` and `closeDelay`, and `solid`, `outline` and `unstyled` variants.

  Adds `ToastProvider` and `useToast()`: toasts that are shown from any component below the provider with `toast`, `success`, `info`, `warning` and `error`. They are announced to screen readers without moving the focus (`error` is assertive), go away by themselves, stop their timer while the pointer is over them or the focus is inside, can have an action, and can be updated by id. The provider has nine `position`s (including the center ones), `duration`, `max` and `solid`, `subtle`, `outline` and `unstyled` variants. The status icons are optional and replaceable: `icons={false}` hides them, `icons={{ success: <MyIcon /> }}` replaces one, and a toast can set its own with `icon`.

## 0.4.1

### Patch Changes

- [#82](https://github.com/darioegb/plume-ui-react/pull/82) [`df3b3cea452373354373e2a769b5ed33802ed3e9`](https://github.com/darioegb/plume-ui-react/commit/df3b3cea452373354373e2a769b5ed33802ed3e9) Thanks [@darioegb](https://github.com/darioegb)! - `Icon` with a `label` no longer puts `role="img"` and `aria-label` on its wrapper. The SVG is hidden from assistive technology and the label is rendered as text that only screen readers get, which works in every screen reader and browser combination and needs no ARIA role.

## 0.4.0

### Minor Changes

- [#79](https://github.com/darioegb/plume-ui-react/pull/79) [`0488375b8e81e0ac89e740ea8e57040052daaad3`](https://github.com/darioegb/plume-ui-react/commit/0488375b8e81e0ac89e740ea8e57040052daaad3) Thanks [@darioegb](https://github.com/darioegb)! - Adds four presentation components: `Badge` (`solid`, `outline` and `subtle` variants, an optional status `dot`), `Card` (with `CardHeader`, `CardBody` and `CardFooter`; `elevated`, `outline` and `filled` variants), `Icon` (sizes and colors an SVG you bring, and hides it from screen readers unless it has a `label`) and `List` (with `ListItem`, `ListItemButton`, `ListItemIcon`, `ListItemText`, `ListSubheader` and `ListDivider`; `plain`, `bordered` and `filled` variants, bullets or numbers, selected and disabled buttons or links as rows). None of them needs JavaScript on the client, so they can be rendered in a Server Component. `Card` and `List` share their size with their parts through CSS variables instead of a context.

  Also adds the `tint-text` token of every color scheme (`--plume-color-<scheme>-tint-text`): text that keeps at least 4.5:1 on the `tint` and `tint-strong` backgrounds in light and dark mode, which `text` doesn't always do. The subtle `Badge` and the selected row of `List` use it.

### Patch Changes

- [#79](https://github.com/darioegb/plume-ui-react/pull/79) [`c8d6cdb62be5428b9c9b1b77df247f8d3e1b9ab7`](https://github.com/darioegb/plume-ui-react/commit/c8d6cdb62be5428b9c9b1b77df247f8d3e1b9ab7) Thanks [@darioegb](https://github.com/darioegb)! - Fixes `Checkbox`, `Radio` and `Toggle` inside a `Field`: the input had two `<label>` elements, the one of the Field and the one that wraps the control, which screen readers handle unevenly and axe reports as `form-field-multiple-labels`. The Field no longer ties its label to a control that has text of its own, and the input is named with the Field label followed by that text. A control with no text no longer wraps itself in an empty `<label>`.

- [#79](https://github.com/darioegb/plume-ui-react/pull/79) [`216904f1067fd8e4b5c9b6bfef87d92bec18a78c`](https://github.com/darioegb/plume-ui-react/commit/216904f1067fd8e4b5c9b6bfef87d92bec18a78c) Thanks [@darioegb](https://github.com/darioegb)! - Darkens the default `semantic.muted` color in light mode (`#71717a` to `#6e6e77`) and lightens it in dark mode (`#a1a1aa` to `#acacb5`). The placeholder of the `filled` variant of `Input`, `Textarea` and `DatePicker` is `muted` text over `surfaceMuted`, where it reached only 4.39:1 in light mode and 4.07:1 in dark mode, below the 4.5:1 that WCAG AA asks of text. A test now keeps `muted` at 4.5:1 or more on the background, the surface and the muted surface in both modes.

## 0.3.0

### Minor Changes

- [#76](https://github.com/darioegb/plume-ui-react/pull/76) [`87acb6e65b565d3cd71c295e0814d720277bd1cf`](https://github.com/darioegb/plume-ui-react/commit/87acb6e65b565d3cd71c295e0814d720277bd1cf) Thanks [@darioegb](https://github.com/darioegb)! - Adds the `borderStrong` semantic color and uses it for the boundary of form controls: `Input`, `Textarea`, the `DatePicker` field and the new `Checkbox`, `Radio` and `Toggle`. The default `border` was about 1.5:1 against white, and in dark mode it was the same color as the `filled` background, so the field boundary was hard to see or invisible. `borderStrong` keeps at least 3:1 against the background, surface and muted surface in light and dark mode (WCAG 1.4.11). The decorative dividers of `Tabs` and the `DatePicker` calendar keep using `border`.

  The default theme looks different: control borders are darker. If you customized `semantic.border` to change the border of inputs, set `semantic.borderStrong` instead. The `SemanticColors` type has a new `borderStrong` key, so a full `Theme` object needs it.

  `Field` is now a client component that gives its label an id, which `RadioGroup` uses to name itself.

- [#76](https://github.com/darioegb/plume-ui-react/pull/76) [`12c2c31ba7eeb51279fb94d1a46dd840f9d2eb49`](https://github.com/darioegb/plume-ui-react/commit/12c2c31ba7eeb51279fb94d1a46dd840f9d2eb49) Thanks [@darioegb](https://github.com/darioegb)! - Adds five form components: `Checkbox` (with an `indeterminate` state), `Radio`, `RadioGroup`, `Toggle` (a switch) and `Textarea`. `RadioGroup` owns the value, name, size, color scheme and state of its radios, and inside a `Field` it is named by the Field label. They render the native elements, so they work with forms, labels and the keyboard, and they accept what `Field` passes to its control (`id`, `aria-describedby`, `aria-invalid`, `disabled`, `readOnly`, `required`), so a `Field` can wrap them. `Checkbox` and `Radio` have a `solid` (default) and an `outline` variant, and a `RadioGroup` can set the variant of its radios. `Checkbox`, `Radio` and `Toggle` take their label as children and send `className` and `style` to the label that wraps the input, while `ref` points to the input. They also work with react-hook-form's `register`.

### Patch Changes

- [#76](https://github.com/darioegb/plume-ui-react/pull/76) [`25d397a464ceb3440542a98ee140bd0d2de64e30`](https://github.com/darioegb/plume-ui-react/commit/25d397a464ceb3440542a98ee140bd0d2de64e30) Thanks [@darioegb](https://github.com/darioegb)! - Fixes the calendar icon of `DatePicker`, which sat a few pixels below the center of the field (6px with `size="sm"`). The button now takes the height of the input instead of its own fixed height.

## 0.2.0

### Minor Changes

- [#73](https://github.com/darioegb/plume-ui-react/pull/73) [`36d1a6aaef8c7d61a6d36daca0a472bcf43ad451`](https://github.com/darioegb/plume-ui-react/commit/36d1a6aaef8c7d61a6d36daca0a472bcf43ad451) Thanks [@darioegb](https://github.com/darioegb)! - Components can be imported directly from React Server Components. The build used to drop every `'use client'` directive, so a Server Component importing `Tabs`, `Input` or `DatePicker` failed with `createContext is not a function` unless the app wrapped it in its own client boundary. The ESM build now emits one file per module and keeps the directive on the modules that need it, so `<ThemeProvider>` also works in a root layout, while `Button`, `Spinner`, `Field` and the utilities stay usable on the server. The stylesheet and the public API are unchanged, and importing a single component still leaves the rest out of the bundle.

### Patch Changes

- [#73](https://github.com/darioegb/plume-ui-react/pull/73) [`7099029b2ea81787f1cc46e0fc85b7246bbea7b1`](https://github.com/darioegb/plume-ui-react/commit/7099029b2ea81787f1cc46e0fc85b7246bbea7b1) Thanks [@darioegb](https://github.com/darioegb)! - `Tabs` and `Field` generate their ids with React's `useId` only. The module counter they fell back to is gone, since React 18 is the minimum supported version.

## 0.1.0

### Minor Changes

- [#68](https://github.com/darioegb/plume-ui-react/pull/68) [`340029560d2577b3aef8cb820ca327301d6c4cd1`](https://github.com/darioegb/plume-ui-react/commit/340029560d2577b3aef8cb820ca327301d6c4cd1) Thanks [@darioegb](https://github.com/darioegb)! - First release of `plume-ui-react`, the single package that replaces `@plume-ui-react/lib`, the per-component packages, `@plume-ui-react/core`, the hooks and the utilities. Every export keeps its name: import from `plume-ui-react` and the stylesheet from `plume-ui-react/styles.css`. Importing one component still leaves the rest out of the bundle. Module augmentation of `ColorPalette` now targets `plume-ui-react`, and `react`/`react-dom` >= 18 are required.
