# @plume-ui-react/use-click-outside

## 0.1.0

### Minor Changes

- [#28](https://github.com/darioegb/plume-ui-react/pull/28) [`51c5e44b5b8e953cbba6c6d25a8d0ab0e5113b93`](https://github.com/darioegb/plume-ui-react/commit/51c5e44b5b8e953cbba6c6d25a8d0ab0e5113b93) Thanks [@darioegb](https://github.com/darioegb)! - First usable release (0.1.0). The core theming was finished and every package was
  realigned to a single version.

  ### Breaking changes
  - **Theming is now declarative.** The global `setUserTheme` (and the
    `getColorFromTheme` / `createStyles` helpers) were removed with no shim. Wrap
    your app in `<ThemeProvider>` instead. See the **Guides → Migration** docs.
  - **Stylesheet import path.** Import `@plume-ui-react/lib/styles.css` (or a
    component's `./styles.css` subpath) instead of the deep `dist/index.css` path.

  ### Highlights
  - New SSR/RSC‑safe `<ThemeProvider>` that serializes every design token to CSS
    variables, with built‑in light/dark mode (`colorMode`) and semantic tokens.
  - All components consume the token CSS variables (zero per‑render color maths).
  - `useMask` hook is now a real package; `Input` gains an optional `mask` prop and
    the DatePicker field is unified onto the masked `Input`.
  - Robust CSS packaging: a single bundled `styles.css` per package plus an
    `exports` map (dual `.d.ts`/`.d.mts` types and `./styles.css`).
  - Tailwind preset exposing Plume tokens as utilities, and a `variant="unstyled"`
    escape hatch for bring‑your‑own‑className (e.g. Bootstrap).
  - `deepMerge` is now non‑mutating (fixes light‑mode semantic tokens).

## 0.0.1

### Patch Changes

- Initial release of the `useClickOutside` hook.
