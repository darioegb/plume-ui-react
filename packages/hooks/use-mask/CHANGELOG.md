# @plume-ui-react/use-mask

## 0.2.0

### Minor Changes

- [#42](https://github.com/darioegb/plume-ui-react/pull/42) [`cacb0aeeef6ad52866bb3e0618bd4f89dd6daecf`](https://github.com/darioegb/plume-ui-react/commit/cacb0aeeef6ad52866bb3e0618bd4f89dd6daecf) Thanks [@darioegb](https://github.com/darioegb)! - Masks now validate what can be typed, and `lib` is the only package you need to install.

  - **Breaking (`use-mask` / `Input` `mask`)**: `#` now accepts only a digit (it used to accept any character). New mask characters: `A` for a letter and `*` for a letter or digit; `\` escapes the next character as a literal. Characters that don't fit the next slot are rejected, and deleting never leaves a dangling separator.
  - `DatePicker`: the field only accepts digits (letters are rejected) and shows a numeric keyboard on mobile.
  - `lib` now depends on and re-exports `@plume-ui-react/core`, so `import { Button, ThemeProvider, useTheme } from '@plume-ui-react/lib'` works with a single install. Installing `@plume-ui-react/core` separately is only needed with individual component packages.

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

- First real release of the `useMask` hook: controlled/uncontrolled support,
  literal auto-insertion, and an exported pure `applyMask` helper. Shipped with a
  real tsup build (ESM + CJS + types).

## 0.0.0

### Patch Changes

- Work in progress: the `useMask` hook is not yet published (completed in a later phase).
