# plume-ui-react

## 0.10.0

### Minor Changes

- [#101](https://github.com/darioegb/plume-ui-react/pull/101) [`8aab2780f40dbf09a2dd40ebbcef89fdb684289c`](https://github.com/darioegb/plume-ui-react/commit/8aab2780f40dbf09a2dd40ebbcef89fdb684289c) Thanks [@darioegb](https://github.com/darioegb)! - Adds the navigation components of the 1.0 catalog.

  `Breadcrumb` (with `BreadcrumbItem`, `BreadcrumbLink` and `BreadcrumbSeparator`) shows the path of the current page. It is a `<nav>` named "Breadcrumb" with an ordered list, the current page has `aria-current="page"`, and the separators are decorative, can be any node, and the last one is not shown. It has `plain` (underlined links) and `filled` variants.

  `Stepper` (with `Step`, `StepIndicator`, `StepTitle`, `StepDescription` and `StepSeparator`) shows the progress of a process, horizontal or vertical. `activeStep` marks the current step, the ones before it are completed and the ones after it upcoming; the state is in `data-state` on every part and in `aria-current="step"`, and a screen reader says "Completed" or "Not started" (`statusLabels` translates them). Each step finds its position from the `Stepper`, so a step can be wrapped in your own component. It has `solid` and `outline` variants.

  `Navbar` (with `NavbarBrand`, `NavbarContent`, `NavbarItem` and `NavbarToggle`) is the bar at the top of a page. Below a `breakpoint` (`sm`, `md`, `lg` or `never`) its content folds behind a toggle with `aria-expanded` and `aria-controls`; the folding is CSS only, so it works on the server, and <kbd>Esc</kbd> or a press outside closes the menu. The menu can be controlled with `open`, `defaultOpen` and `onOpenChange`. It has `plain`, `filled` and `solid` variants and can be `sticky`.

  `Sidebar` (with `SidebarProvider`, `SidebarContent`, `SidebarItem` and `SidebarToggle`) is the navigation of an app. On a wide screen it collapses to a rail of icons (`collapsed`, `defaultCollapsed`, `onCollapsedChange`); below a `breakpoint` it leaves the page and opens over it as a modal dialog that traps the focus, locks the scroll of the page and closes with <kbd>Esc</kbd> or a press on the backdrop (`open`, `defaultOpen`, `onOpenChange`). The provider is separate so the toggle can live anywhere, for example in the header of the page. It has `plain`, `filled` and `solid` variants, opens from the `left` or the `right`, and with `breakpoint="never"` it stays docked at every width.

  Every one of them has an `unstyled` variant that keeps the structure and drops the Plume styles, and takes a class for each part.

## 0.9.0

### Minor Changes

- [#96](https://github.com/darioegb/plume-ui-react/pull/96) [`680224f5a46c133bd99701e42a6ff1c21bdd7f44`](https://github.com/darioegb/plume-ui-react/commit/680224f5a46c133bd99701e42a6ff1c21bdd7f44) Thanks [@darioegb](https://github.com/darioegb)! - Makes the floating panels fit a phone. The `Select`, the `Dropdown`, the `Popover` and the `DatePicker` now measure the room they have next to their trigger and never grow past it: a long list scrolls inside the panel (`overscroll-behavior: contain`, so the page behind does not move) instead of running off the bottom of the screen, where it could not be reached. The room is exposed as the `--plume-available-height` and `--plume-available-width` custom properties on the panel. The `DatePicker` calendar is now placed with the same logic, so it no longer overflows the right edge of a narrow screen, and a range picker stacks its two months in a column on a small screen.

  Changes how the `Select` marks the options of a `multiple` select: a chosen option now shows the same check at its end as in a single select, instead of a checkbox. The `checkbox` part of `SelectOption` `classNames` is gone; style `check`, which now applies to both.

  Adds `showCount` to the `Textarea`: it shows how many characters there are under the field (`12`, or `12 / 200` with `maxLength`), links the count to the textarea for screen readers, announces how many characters are left when few remain, and marks the count at the limit. `formatCount` and `formatRemaining` change the texts and `countClassName` styles the count.

  The remove button of a `Chip` keeps its look but has a hit area of at least 24px, so it can be pressed with a finger.

## 0.8.0

### Minor Changes

- [#95](https://github.com/darioegb/plume-ui-react/pull/95) [`a7ed1c381389b64b99c5038dc5462f2c314995fc`](https://github.com/darioegb/plume-ui-react/commit/a7ed1c381389b64b99c5038dc5462f2c314995fc) Thanks [@darioegb](https://github.com/darioegb)! - Adds `NumberInput`: a field for a number, with buttons to subtract and add and the keyboard of a spin button (<kbd>↑</kbd> and <kbd>↓</kbd> add `step`, <kbd>PageUp</kbd> and <kbd>PageDown</kbd> a `largeStep`, <kbd>Home</kbd> and <kbd>End</kbd> go to `min` and `max`). It is a text input with `role="spinbutton"` rather than `type="number"`, so the mouse wheel does not change it and the text can be a partial number while the user types; the value is clamped to `min`/`max` and rounded to `precision` when the field loses focus or on <kbd>Enter</kbd>, and it is `null` when the field is empty. `format` and `parse` show and read a currency, a unit or a locale, and the formatted text is exposed as `aria-valuetext`. The buttons keep adding while they are held, and with a `name` the plain number is submitted in a hidden input. It has the `outline`, `filled`, `underline` and `unstyled` variants of `Input`, composes with `Field`, and `classNames` styles its `input`, `decrement` and `increment`.

  Adds `PinInput`: a row of one-character boxes for a one-time code or a PIN. Typing moves to the next box, <kbd>Backspace</kbd> goes back, the arrows, <kbd>Home</kbd> and <kbd>End</kbd> move between them, and a pasted code (or one that arrives whole from the autofill of a phone) is spread over the boxes. `type` limits the characters to digits, letters and digits, or anything but spaces, `mask` hides them, `onComplete` runs with the last box and `focusOnMount` focuses the first. It is a `<fieldset>` with one named input per character (`Digit 1 of 6`) and a single tab stop on the next box to fill; with a `name` the code is submitted in a hidden input, and it composes with `Field`.

  Adds `Rating`: a row of stars, or of any icon, to give or show a score. It is a group of radio buttons, so the arrows change the score, and `allowHalf` gives every star two radios for half scores. The stars follow the pointer as a preview, `clearable` lets the user remove the score, and `icon`, `emptyIcon`, `classNames` and `getItemLabel` change how it looks and is announced. A `readOnly` rating is text (`3 out of 5`) with the icons hidden, not a group of disabled radios. It composes with `Field` and takes the `solid` and `unstyled` variants.

  `Input` gets `revealable`: with `type="password"` it adds a button, in the place of `elementAfter`, that shows or hides the password (a toggle button with `aria-pressed`, named by `revealLabel`, and styled in `unstyled` with `revealClassName`). It also accepts `autoComplete`, and the group of an `Input` keeps its row in the `unstyled` variant. The addons of an `Input` now line up with it: they have the height of the field, a single border between them and the input, and square corners where they touch (they follow the `pill` shape), also with an `elementBefore` or `elementAfter`.

## 0.7.0

### Minor Changes

- [#92](https://github.com/darioegb/plume-ui-react/pull/92) [`ed2ca95b67e623cc484e2deffc592583b9a4a58e`](https://github.com/darioegb/plume-ui-react/commit/ed2ca95b67e623cc484e2deffc592583b9a4a58e) Thanks [@darioegb](https://github.com/darioegb)! - Adds `Accordion` (with `AccordionItem`, `AccordionTrigger` and `AccordionContent`): a stack of headings that each show or hide a section, following the WAI-ARIA accordion pattern. Every trigger is a button inside a heading (`headingLevel`, `3` by default) with `aria-expanded` and `aria-controls`, and its panel is a region named by the trigger. <kbd>Enter</kbd> and <kbd>Space</kbd> toggle an item, the arrows, <kbd>Home</kbd> and <kbd>End</kbd> move between the triggers and a disabled one is skipped. With `type="single"` one item is open at a time (`collapsible` lets the user close it) and with `type="multiple"` any number; the open items live in `value` / `defaultValue` / `onValueChange`. The panel animates its height, a closed one is out of reach of the keyboard and of screen readers, and the animation stops with `prefers-reduced-motion`. It has the `outline`, `filled` and `unstyled` variants, three sizes and a color scheme, and an `icon` can replace the chevron.

  Adds `Skeleton`: a placeholder for content that is loading, with the `text` (one or several `lines`, the last one shorter), `rect` and `circle` shapes, a `width` and a `height`, and the `pulse` and `wave` animations. It is hidden from screen readers, so mark the container that holds it with `aria-busy`.

  Adds `ProgressBar`: a `progressbar` with `value` and `max` (kept in range), `valueText` for the text a screen reader reads, and `indeterminate` for a task of unknown length, which drops the value. It has the `solid`, `striped` (with `animated`) and `unstyled` variants, three thicknesses, two shapes and a color scheme, and `indicatorClassName` styles the bar in every variant.

## 0.6.0

### Minor Changes

- [#89](https://github.com/darioegb/plume-ui-react/pull/89) [`39df04e6e8d37fbe6b572615c5554784f688b45f`](https://github.com/darioegb/plume-ui-react/commit/39df04e6e8d37fbe6b572615c5554784f688b45f) Thanks [@darioegb](https://github.com/darioegb)! - Adds `Dropdown` (with `DropdownTrigger`, `DropdownMenu`, `DropdownItem`, `DropdownSeparator` and `DropdownLabel`): a menu of actions that follows the WAI-ARIA menu button pattern. The trigger opens it with a click, <kbd>Enter</kbd>, <kbd>Space</kbd> or the arrows; the arrows, <kbd>Home</kbd>, <kbd>End</kbd> and typing a few letters move between the items, <kbd>Esc</kbd> and <kbd>Tab</kbd> close it and give the focus back to the trigger, and a disabled item is skipped. Items can have an icon and a shortcut, be links (`href`) and keep the menu open (`closeOnSelect`). It has `elevated`, `outline` and `unstyled` variants and `sm`, `md` and `lg` sizes, opens on the side given by `placement` and flips or shifts to stay on the screen.

  Adds `Select` (with `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectOption` and `SelectGroup`): a select-only combobox for choosing one option or, with `multiple`, several. The focus stays on the trigger and the list is followed with `aria-activedescendant`; the arrows, <kbd>Home</kbd>, <kbd>End</kbd>, <kbd>PageUp</kbd>, <kbd>PageDown</kbd> and typing a few letters move through the options, and with the list closed typing changes a single value and <kbd>Backspace</kbd> removes the last option of a `multiple` select. An option can have an `icon`, which can be an image, and a `description`; the trigger shows the chosen option with its icon, or the chosen options as chips (`maxDisplay`, `display="text"` or a render function). It can be `searchable` (a search box filters the options, with an empty message), `clearable`, controlled or not (`value`, `defaultValue`, `onValueChange`, `open`, `onOpenChange`), disabled, read only, required and invalid, and it adds hidden inputs when it has a `name`, so it works in a plain form. It composes with `Field` and has the `outline`, `filled`, `underline` and `unstyled` variants of `Input`, three sizes, two shapes and a color scheme for the focus ring.

  Adds `Chip`: a compact element for a value that was entered or picked, such as a tag, a filter or an option of a `Select` that allows several. It can have an icon or an image and, with `onRemove`, a remove button named after the chip (`Remove Design`), and it has the `subtle`, `solid`, `outline` and `unstyled` variants, three sizes, two shapes and a color scheme. `classNames` styles its `icon`, `label` and `remove` parts. The `Select` uses it for the options of a `multiple` select.

- [#89](https://github.com/darioegb/plume-ui-react/pull/89) [`36227e7acba6ae5427bfebc554c9a65c5cd228f5`](https://github.com/darioegb/plume-ui-react/commit/36227e7acba6ae5427bfebc554c9a65c5cd228f5) Thanks [@darioegb](https://github.com/darioegb)! - Makes `variant="unstyled"` usable in the components whose parts could not take a class. `Checkbox`, `Radio` and `Toggle` take `inputClassName`, for the `<input>`, and `labelClassName`, for the text: until now `className` only reached the label that wraps the input, so Tailwind or Bootstrap could not style the control. `ToastProvider` takes `classNames` to style the `icon`, `content`, `title`, `description`, `action` and `dismiss` of the toasts, and `ModalContent` takes `backdropClassName` for the layer behind the dialog, which an unstyled `Modal` had no way to style. The `Modal` backdrop now keeps its position and its centering when it is unstyled, so it covers the screen without a class of your own.

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
