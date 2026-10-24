# Authoring components

How components in `plume-ui-react` are built. Read it before adding one, and use the checklist at the end before opening the pull request.

## Creating a component

```sh
pnpm new:component Badge presentation             # a single component
pnpm new:component Accordion navigation --compound   # a root with a context and parts
```

The first argument is the PascalCase name and the second the category: `form`, `interaction`, `presentation`, `navigation`, `overlay` or `utility`. The command scaffolds the folder from [scripts/component-templates](scripts/component-templates) and registers the component, in alphabetical order, in `src/index.ts`, in the public API test (`src/tests/index.spec.ts`) and in the component table of the root README. It prints what is left to do by hand.

The scaffold is a working, tested component with placeholder styles. Replace the placeholders, don't build around them.

```text
packages/plume-ui-react/src/components/<category>/<name>/
  <name>.tsx            the component
  <name>.module.css     its styles
  index.ts              the public exports of the component
  stories/<name>.stories.tsx
  tests/<name>.spec.tsx
```

The folder is the lowercase name (`datepicker`), which is also what Storybook uses in the docs URL. Extra files take the same prefix (`datepicker-input.tsx`).

## API conventions

- **Props** are split in three: `<Name>OwnProps` (what the component adds), `<Name>RootAttributes` (a `Pick` of the DOM attributes it forwards) and `<Name>Props`, which combines them with `ComponentProps` from the theme. Whitelist DOM attributes instead of spreading everything, so the public API is deliberate.
- **`forwardRef`** to the root DOM element, and set `displayName`.
- **`className` and `style`** always work, and both go to the outermost element the component renders. For a control that is a single native element (`Input` and `Textarea` without addons or counter) that element is the `<input>` or `<textarea>`; as soon as the component wraps it (an input group, the counter of the `Textarea`, the root of a picker) they go to the wrapper, and `classNames.input` reaches the native control. `style` is applied last, so it can override the component's CSS variables.
- **`size`** (`sm | md | lg`), **`shape`** and **`colorScheme`** reuse the shared types from the theme. A `colorScheme` is any key of the theme palette, including custom ones added with module augmentation.
- **`variant`**: whenever it makes sense, give the component more than one look. `solid` and `outline` are the minimum for anything with an active state or a fill (`Checkbox`, `Radio`, `Toggle`, `Button`), the text fields share `outline`, `filled` and `underline`, and every component with variants also has `unstyled`. A component without variants (a plain container like `Field`) should say why in its story. A group that shares options with its parts passes the variant down, and a part can set its own.
- **Story order** is the same in every component, for the stories they have: `Default`, `Variants`, `Sizes`, `Colors`, then the ones specific to the component, then the states (`Disabled`, `Invalid`), `WithField` and last `Tailwind` and `Bootstrap`. Storybook lists them in the order they are exported. Every component has the last two, built with `variant="unstyled"` and the classes of the framework, with the code in `parameters.docs.source`; use the Plume utilities of the Tailwind preset (`bg-surface`, `text-foreground`, `border-border`, `bg-primary-solid`) so they follow the color mode, and avoid `text-muted`, which Bootstrap also defines and wins. A component made of parts shows the whole composition.
- **Props table.** In `argTypes`, group the props that are native attributes of the element (`id`, `name`, `required`, `minLength`, `title`, `tabIndex`, `hidden`…) in the `HTML attributes` category, the `aria-*` ones and `role` in `Accessibility` and the handlers in `Events`. The props of the component itself, and the main ones such as `disabled`, `placeholder` or `value`, stay in the default group.
- **The `Variants` story** shows every variant of the component once, `unstyled` included, and nothing else (no sizes or states mixed in). `unstyled` is not a story of its own; a separate story is only for showing it next to Tailwind or Bootstrap.
- **The `Colors` story** shows every color of the theme in one variant, the first and default one, and nothing else (no variants, sizes or states mixed in), so the colors are what the reader compares. Say in the description how the color is used by the other variants.
- **Every text can be changed.** A string the component shows or announces (an `aria-label` such as "Close" or "Next page", the text of a button, a status, a unit) must come from a prop with a default, never be hard-coded, so it can be translated. The lib stays agnostic of any i18n library: texts are plain strings or functions that you fill from whatever you use (react-intl, i18next, next-intl...). A component with library texts takes `labels?: Partial<<Name>Labels>` (the `<Name>Labels` interface, with every key required, is exported from the `index.ts`; texts that carry data are functions, such as `page: (page, current) => string`). Keep the defaults in a `DEFAULT_LABELS` const and merge them with `mergeLabels` from `src/overlay/labels`. Parts read the labels of the root through its context. A leaf part with a single text takes a `label` prop (`SidebarToggle`, `OverlayClose`, `Spinner`). Never add a loose `<thing>Label` prop. Read them with `useLabels('<key>', DEFAULT_LABELS, labels)` from `src/locale/locale-provider` instead of calling `mergeLabels` yourself: it adds the texts of the `LocaleProvider` between the default and the prop, and the key goes in `MessageMap` (`src/locale/messages.ts`). List `labels` in the `Accessibility` category of the story.
- **Reuse the components of the lib.** If a component needs something that another one already provides (a progress bar, a collapsing box, a close button, an icon), compose that component instead of writing its own markup and CSS, and give its parts a `classNames` entry so `unstyled` can reach them (`FileUpload` uses `ProgressBar` with `progress` and `progressIndicator`). Check `src/components` and `src/overlay` first.
- **`variant="unstyled"`** drops every Plume class and keeps only the user's `className`, so the component can be styled with Tailwind or Bootstrap.
- **Classes for the parts.** When the root `className` can't reach what has to be styled, give the component a `classNames` record keyed by part (`Partial<Record<<Name>Part, string>>`, with the `<Name>Part` type exported from the `index.ts`), even when there is a single part. Never add a loose `<part>ClassName` prop. They are added in every variant, next to the Plume classes, so with `unstyled` they are the only classes the part has. Join them with `joinClasses` from `src/overlay/class-names`.
- **Structure of an unstyled component.** Dropping the classes must not drop what makes it work (a flex row for the chevron, the layer that centers a modal, the reset of a `<button>` or a `<dialog>`). Give those a rule with zero specificity on a data attribute, like `:global(:where([data-plume-select-control]))` in the CSS module, so it applies to every variant and any class of the user wins over it. Expose the state to style as `data-*` or `aria-*` attributes (`data-open`, `data-active`, `aria-selected`) and list them in the story.
- **Badge and Chip.** They look alike and share their sizes, shapes and variants in `components/presentation/shared` (`tag.module.css`, `tagColorVars`). A `Badge` is a static status or count and never has anything interactive inside, so it doesn't get `icon` or `onRemove`. A value the user can handle or remove is a `Chip`.
- **Ids** come from React's `useId` (React 18 is the minimum), never from a module counter.
- **Server rendering:** don't touch `window` or `document` while rendering. Use effects. See [Server and client components](#server-and-client-components) for the `'use client'` rule.

## Theming

Components never compute colors in JavaScript. A `colorScheme` is mapped to local CSS variables that point to the tokens emitted by `<ThemeProvider>`:

```tsx
'--badge-solid': `var(--plume-color-${colorScheme}-solid)`,
'--badge-contrast': `var(--plume-color-${colorScheme}-solid-contrast)`,
```

The stylesheet uses those variables and the `--plume-*` scales (`--plume-space-*`, `--plume-radius-*`, `--plume-font-size-*`), never raw values. The schemes expose `solid`, `solid-contrast`, `solid-hover`, `solid-active`, `text`, `text-hover`, `text-active`, `tint`, `tint-strong` and `tint-text`, already adjusted for contrast in light and dark mode, so a component works in both without extra rules. Text over a `tint` or `tint-strong` background takes `tint-text`: the plain `text` color is tuned for the page surfaces and can fall short of 4.5:1 on a tint.

## Server and client components

The package is built module by module, and each module keeps its own `'use client'` directive in the build. That lets a Next.js Server Component import from `plume-ui-react` directly, including `<ThemeProvider>` in the root layout and the utilities (`themeToCssVars`, `defaultTheme`, the date and color helpers).

A module starts with `'use client'` when it:

- imports `createContext`, `Component` or `PureComponent` from React,
- calls a hook other than `useId`, `useMemo`, `useCallback` and `useDebugValue` (the ones React also provides on the server),
- renders a context `Provider`, or
- attaches an event handler to an element (`onClick={...}`), because a Server Component can't pass a function to an element (`Event handlers cannot be passed to Client Component props`). Forwarding the handlers a consumer passes in `...rest` is fine.

Nothing else gets the directive. `Button`, `Spinner`, `Field` and the pure helpers have none, so they also render on the server. Don't add it defensively: once a module is a client module, a Server Component can only render it, not call anything else it exports.

`pnpm build` checks both sides of this in `packages/plume-ui-react/scripts/check-client-directives.mjs`: every module that needs the directive has it, none has it without need, and the built file of each module agrees with its source. Keep `export *` out of modules that have the directive, because Next.js doesn't support it there.

Props a Server Component passes to a client module have to be serializable, so anything that takes a callback (`DatePicker` requires `onChange`) needs a client parent. The directives live in the ESM build, which is what bundlers resolve. The CommonJS build is a single file and has none.

## Compound components

When a component is made of several pieces (a root and its parts), use **separate named exports with the component name as prefix**: `Tabs`, `TabList`, `Tab`, `TabPanels`, `TabPanel`. For a new component: `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionPanel`.

Do **not** attach the parts to the root (`Accordion.Item`). A Client Component can't be dotted into from a Server Component: with `export const Accordion = Object.assign(Root, { Item })`, rendering `<Accordion.Item>` in a Server Component fails the Next.js build (`Could not find the module ".../accordion.tsx#Accordion#Item" in the React Client Manifest`). Separate exports work in both worlds and tree-shake individually.

The rest of the pattern:

- **One context per component that shares state**, in its own file (`<name>-context.ts`), created with `undefined` as default. The root provides it and the parts read it through a `use<Name>Context` hook that throws a clear error when a part is rendered outside the root. Memoize the context value.
- **Presentational compounds** (`Card`, `List`) have no state to share, so they have no context. The root sets CSS variables (`--card-padding`) that the parts read, which keeps them free of `'use client'` and renderable in a Server Component. Scope the rules of the parts under the root class (`.card .header`), so the root's `unstyled` variant leaves its parts bare too.
- **The root owns the state** and the shared options (`size`, `colorScheme`, `variant`). Parts read them from the context instead of repeating props.
- **Ids link the parts** (`aria-controls`, `aria-labelledby`) and derive from the root id, as `getTabId` and `getPanelId` do in Tabs.
- **Parts forward refs and accept `className` and `style`** like any other component.
- Prefer context over `cloneElement` to tell a part which one it is. Tabs still injects `index` with `cloneElement`, which breaks when a child is wrapped; don't copy that part. `Stepper` shows the way when a part needs its position: the root wraps every child in a context provider with `Children.map`, so a part wrapped in a component of its own still finds its index.

[Tabs](packages/plume-ui-react/src/components/navigation/tabs) is the reference for the keyboard model, ids and ARIA wiring.

## Overlays

Modal, Popover, Tooltip, Dropdown and Toast are built on the primitives in `src/overlay`. They have no dependencies and are internal: they are not exported from the package, so they can change until a component settles how it uses them.

| Primitive | What it does |
| --- | --- |
| `Portal` | Renders its children after mount (nothing on the server) into the closest `<ThemeProvider>` root, so the content inherits the tokens and the color mode. `container` overrides the target. |
| `useLayer(open)` | Registers the overlay in a stack and returns `isTopmost()`, so nested overlays act one at a time. |
| `useDismiss` | Closes on Escape and on a press outside. List the trigger among `elements` so pressing it doesn't count as outside. |
| `useFocusTrap` | Moves the focus in when it activates, keeps Tab inside and gives the focus back on close (`returnFocus` takes the trigger, because Safari doesn't focus a button when clicked). |
| `useScrollLock` | Locks the page scroll and compensates for the scrollbar. It is reference counted, so stacked modals release it once. |
| `usePosition` | Places a `position: fixed` element next to an anchor, flipping and shifting to stay inside the viewport, and follows scroll, resize and size changes. `computePosition` is the same logic as a pure function. |

The hooks take **elements**, not refs: keep them in state with a callback ref. The content of a `Portal` mounts after `open` becomes true, and a ref object wouldn't tell the hook when it appears.

```tsx
const [anchor, setAnchor] = useState<HTMLElement | null>(null)
const [floating, setFloating] = useState<HTMLElement | null>(null)
const isTopmost = useLayer(open)
useDismiss({ enabled: open, onDismiss: close, elements: [anchor, floating], isTopmost })
useFocusTrap(floating, { active: open, isTopmost, returnFocus: anchor })
useScrollLock(open && isModal)
const { style } = usePosition({ anchor, floating, enabled: open, placement })

return (
  <>
    <button ref={setAnchor}>Open</button>
    {open ? (
      <Portal>
        <div ref={setFloating} role="dialog" style={style}>...</div>
      </Portal>
    ) : null}
  </>
)
```

`Modal`, `Popover`, `Tooltip` and `Toast` are built this way, and they show the recipe: the root keeps the open state (controlled with `open` and `onOpenChange`, or uncontrolled), a trigger takes a single element and gives it its handlers and `aria-*` attributes through `cloneWithProps` in `src/overlay/trigger.ts` (which merges the refs and chains the handlers), and the content renders in a `Portal` only while it is open. A toast is the exception: `ToastProvider` keeps a list, renders one live region that is always in the page, and `useToast()` adds to it.

Each component still owns what these don't do: the role and ARIA wiring, hiding the rest of the page from assistive technology in a modal, and enter and exit transitions.

## Form controls

Form controls are **bare controls**: they render the control only and never their own label, helper text or error message. [`Field`](packages/plume-ui-react/src/components/form/field) wraps a control and provides those, wiring the accessibility attributes through `cloneElement`.

For that to work, a control has to:

- accept the `FieldControlProps` that `Field` injects: `id`, `aria-describedby`, `aria-invalid`, `disabled`, `readOnly` and `required`, and apply them to the actual element (the `<input>`, not a wrapper);
- forward its `ref` to that element, so it also works with form libraries such as react-hook-form;
- be a **single element**: no wrapper and no label of its own. `Checkbox`, `Radio` and `Toggle` are one `<input>`, and the visible text comes from `Field` (`<Field label="Accept" orientation="inline"><Checkbox /></Field>`), so there is one `<label>` per input. Two labels on one input is a violation in axe (`form-field-multiple-labels`);
- stay independent of any form library. Add a spec with react-hook-form's `register` or `Controller` as `Input` and `DatePicker` do, but the component itself doesn't import it.

## Checklist

Copy it into the pull request description.

**API**
- [ ] Props split in own props, root attributes and `<Name>Props`; DOM attributes whitelisted
- [ ] `forwardRef` and `displayName`; `className` and `style` work
- [ ] Has variants (`solid` and `outline` at least, when it makes sense) and a `Variants` story with one example per variant, `unstyled` included
- [ ] `unstyled` is usable: every part can take a class and keeps the structure it needs, and there are `Tailwind` and `Bootstrap` stories that prove it, in light and dark mode
- [ ] `variant="unstyled"` leaves only the user's classes
- [ ] Compound parts are separate prefixed exports, with a context and a hook that throws outside the root (or CSS variables from the root, for presentational ones)
- [ ] Form controls accept `FieldControlProps` on the real element and forward the ref

**Styling**
- [ ] Only `--plume-*` tokens and local variables, no color math in JavaScript
- [ ] Looks right in light and dark mode, and with a custom `colorScheme`

**Accessibility**
- [ ] The right role, name and state (`aria-*`) for the pattern
- [ ] Fully usable with the keyboard, with a visible focus
- [ ] Overlays share one `useLayer` between `useDismiss` and `useFocusTrap`, and return the focus to the trigger
- [ ] No violations in the Storybook accessibility panel, in light and dark mode

**Tests**
- [ ] Specs cover rendering, props, refs, keyboard and error paths; coverage stays above the 90% threshold (`pnpm test:coverage`)
- [ ] `pnpm lint` and `pnpm build` pass (the build includes the `'use client'` check)

**Docs**
- [ ] Story with `autodocs`, a description, every prop in `argTypes` and the main variations, in the usual order (the docs page and its Source link are generated from it)
- [ ] The component is listed alphabetically in `packages/plume-ui-react/README.md` (the scaffold already adds it to the root README)

**Release**
- [ ] Exported from `src/index.ts` and listed in `src/tests/index.spec.ts` (the scaffold does both)
- [ ] Changeset added with `pnpm changeset`: `minor` while the package is `0.x`
- [ ] Once the release that publishes it is out, add it to the three examples under `apps/` (`example-vite`, `example-next-app` and `example-next-pages`): they install `plume-ui-react` from npm, so bump it to that version and add a section to the demo
