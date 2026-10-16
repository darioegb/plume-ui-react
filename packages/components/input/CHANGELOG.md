# @plume-ui-react/input

## 0.2.1

### Patch Changes

- [#50](https://github.com/darioegb/plume-ui-react/pull/50) [`b01c51ad105c83e70e5e3078b6dff53e6990b1a5`](https://github.com/darioegb/plume-ui-react/commit/b01c51ad105c83e70e5e3078b6dff53e6990b1a5) Thanks [@darioegb](https://github.com/darioegb)! - `Input` and `DatePicker` no longer overflow narrow containers.

  - The 18rem minimum width now applies only when there is room (`min(18rem, 100%)`), so the fields fit on small screens.
  - An `Input` with `addonBefore` / `addonAfter` shrinks its field to keep the addons beside it, and addons no longer wrap.

## 0.2.0

### Minor Changes

- [#42](https://github.com/darioegb/plume-ui-react/pull/42) [`cacb0aeeef6ad52866bb3e0618bd4f89dd6daecf`](https://github.com/darioegb/plume-ui-react/commit/cacb0aeeef6ad52866bb3e0618bd4f89dd6daecf) Thanks [@darioegb](https://github.com/darioegb)! - Masks now validate what can be typed, and `lib` is the only package you need to install.

  - **Breaking (`use-mask` / `Input` `mask`)**: `#` now accepts only a digit (it used to accept any character). New mask characters: `A` for a letter and `*` for a letter or digit; `\` escapes the next character as a literal. Characters that don't fit the next slot are rejected, and deleting never leaves a dangling separator.
  - `DatePicker`: the field only accepts digits (letters are rejected) and shows a numeric keyboard on mobile.
  - `lib` now depends on and re-exports `@plume-ui-react/core`, so `import { Button, ThemeProvider, useTheme } from '@plume-ui-react/lib'` works with a single install. Installing `@plume-ui-react/core` separately is only needed with individual component packages.

### Patch Changes

- Updated dependencies [[`cacb0aeeef6ad52866bb3e0618bd4f89dd6daecf`](https://github.com/darioegb/plume-ui-react/commit/cacb0aeeef6ad52866bb3e0618bd4f89dd6daecf)]:
  - @plume-ui-react/use-mask@0.2.0

## 0.1.1

### Patch Changes

- [#38](https://github.com/darioegb/plume-ui-react/pull/38) [`61eb5ec22dd44ad493f965d1dab450a48321a25f`](https://github.com/darioegb/plume-ui-react/commit/61eb5ec22dd44ad493f965d1dab450a48321a25f) Thanks [@darioegb](https://github.com/darioegb)! - Components no longer depend on a global CSS reset (e.g. Tailwind preflight) to render correctly.

  - `Tabs`: reset the `<button>` defaults (gray background, outset border) on tabs.
  - `Input` and `DatePicker`: set `box-sizing: border-box` so the field no longer overflows its container.
  - `DatePicker`: reset the calendar day and month/year buttons (they showed the browser's default border and background).
  - `date-utils`: `getDaysOfWeekByLanguage` returned the weekday headers shifted (e.g. `Thu Fri Sat…`) depending on the year and timezone; it now always returns Monday to Sunday.

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

### Patch Changes

- Updated dependencies [[`51c5e44b5b8e953cbba6c6d25a8d0ab0e5113b93`](https://github.com/darioegb/plume-ui-react/commit/51c5e44b5b8e953cbba6c6d25a8d0ab0e5113b93)]:
  - @plume-ui-react/core@0.1.0
  - @plume-ui-react/button@0.1.0
  - @plume-ui-react/use-debounce@0.1.0
  - @plume-ui-react/use-mask@0.1.0
  - @plume-ui-react/color-utils@0.1.0
