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
- **`className` and `style`** always work. `style` is applied last, so it can override the component's CSS variables.
- **`size`** (`sm | md | lg`), **`shape`** and **`colorScheme`** reuse the shared types from the theme. A `colorScheme` is any key of the theme palette, including custom ones added with module augmentation.
- **`variant="unstyled"`** drops every Plume class and keeps only the user's `className`, so the component can be styled with Tailwind or Bootstrap.
- **Ids** come from React's `useId` (React 18 is the minimum), never from a module counter.
- **Server rendering:** don't touch `window` or `document` while rendering. Use effects. See [Server and client components](#server-and-client-components) for the `'use client'` rule.

## Theming

Components never compute colors in JavaScript. A `colorScheme` is mapped to local CSS variables that point to the tokens emitted by `<ThemeProvider>`:

```tsx
'--badge-solid': `var(--plume-color-${colorScheme}-solid)`,
'--badge-contrast': `var(--plume-color-${colorScheme}-solid-contrast)`,
```

The stylesheet uses those variables and the `--plume-*` scales (`--plume-space-*`, `--plume-radius-*`, `--plume-font-size-*`), never raw values. The schemes expose `solid`, `solid-contrast`, `solid-hover`, `solid-active`, `text`, `text-hover`, `text-active`, `tint` and `tint-strong`, already adjusted for contrast in light and dark mode, so a component works in both without extra rules.

## Server and client components

The package is built module by module, and each module keeps its own `'use client'` directive in the build. That lets a Next.js Server Component import from `plume-ui-react` directly, including `<ThemeProvider>` in the root layout and the utilities (`themeToCssVars`, `defaultTheme`, the date and color helpers).

A module starts with `'use client'` when it:

- imports `createContext`, `Component` or `PureComponent` from React,
- calls a hook other than `useId`, `useMemo`, `useCallback` and `useDebugValue` (the ones React also provides on the server), or
- renders a context `Provider`.

Nothing else gets the directive. `Button`, `Spinner`, `Field` and the pure helpers have none, so they also render on the server. Don't add it defensively: once a module is a client module, a Server Component can only render it, not call anything else it exports.

`pnpm build` checks both sides of this in `packages/plume-ui-react/scripts/check-client-directives.mjs`: every module that needs the directive has it, none has it without need, and the built file of each module agrees with its source. Keep `export *` out of modules that have the directive, because Next.js doesn't support it there.

Props a Server Component passes to a client module have to be serializable, so anything that takes a callback (`DatePicker` requires `onChange`) needs a client parent. The directives live in the ESM build, which is what bundlers resolve. The CommonJS build is a single file and has none.

## Compound components

When a component is made of several pieces (a root and its parts), use **separate named exports with the component name as prefix**: `Tabs`, `TabList`, `Tab`, `TabPanels`, `TabPanel`. For a new component: `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionPanel`.

Do **not** attach the parts to the root (`Accordion.Item`). A Client Component can't be dotted into from a Server Component: with `export const Accordion = Object.assign(Root, { Item })`, rendering `<Accordion.Item>` in a Server Component fails the Next.js build (`Could not find the module ".../accordion.tsx#Accordion#Item" in the React Client Manifest`). Separate exports work in both worlds and tree-shake individually.

The rest of the pattern:

- **One context per component**, in its own file (`<name>-context.ts`), created with `undefined` as default. The root provides it and the parts read it through a `use<Name>Context` hook that throws a clear error when a part is rendered outside the root. Memoize the context value.
- **The root owns the state** and the shared options (`size`, `colorScheme`, `variant`). Parts read them from the context instead of repeating props.
- **Ids link the parts** (`aria-controls`, `aria-labelledby`) and derive from the root id, as `getTabId` and `getPanelId` do in Tabs.
- **Parts forward refs and accept `className` and `style`** like any other component.
- Prefer context over `cloneElement` to tell a part which one it is. Tabs still injects `index` with `cloneElement`, which breaks when a child is wrapped; don't copy that part.

[Tabs](packages/plume-ui-react/src/components/navigation/tabs) is the reference for the keyboard model, ids and ARIA wiring.

## Form controls

Form controls are **bare controls**: they render the control only and never their own label, helper text or error message. [`Field`](packages/plume-ui-react/src/components/form/field) wraps a control and provides those, wiring the accessibility attributes through `cloneElement`.

For that to work, a control has to:

- accept the `FieldControlProps` that `Field` injects: `id`, `aria-describedby`, `aria-invalid`, `disabled`, `readOnly` and `required`, and apply them to the actual element (the `<input>`, not a wrapper);
- forward its `ref` to that element, so it also works with form libraries such as react-hook-form;
- stay independent of any form library. Add a spec with react-hook-form's `register` or `Controller` as `Input` and `DatePicker` do, but the component itself doesn't import it.

## Checklist

Copy it into the pull request description.

**API**
- [ ] Props split in own props, root attributes and `<Name>Props`; DOM attributes whitelisted
- [ ] `forwardRef` and `displayName`; `className` and `style` work
- [ ] `variant="unstyled"` leaves only the user's classes
- [ ] Compound parts are separate prefixed exports, with a context and a hook that throws outside the root
- [ ] Form controls accept `FieldControlProps` on the real element and forward the ref

**Styling**
- [ ] Only `--plume-*` tokens and local variables, no color math in JavaScript
- [ ] Looks right in light and dark mode, and with a custom `colorScheme`

**Accessibility**
- [ ] The right role, name and state (`aria-*`) for the pattern
- [ ] Fully usable with the keyboard, with a visible focus
- [ ] No violations in the Storybook accessibility panel, in light and dark mode

**Tests**
- [ ] Specs cover rendering, props, refs, keyboard and error paths; coverage stays above the 90% threshold (`pnpm test:coverage`)
- [ ] `pnpm lint` and `pnpm build` pass (the build includes the `'use client'` check)

**Docs**
- [ ] Story with `autodocs`, a description, every prop in `argTypes` and the main variations (the docs page and its Source link are generated from it)
- [ ] The component is listed alphabetically in `packages/plume-ui-react/README.md` (the scaffold already adds it to the root README)

**Release**
- [ ] Exported from `src/index.ts` and listed in `src/tests/index.spec.ts` (the scaffold does both)
- [ ] Changeset added with `pnpm changeset`: `minor` while the package is `0.x`
