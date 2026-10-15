# @plume-ui-react/tabs

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
  - @plume-ui-react/spinner@0.1.0
  - @plume-ui-react/lazy-utils@0.1.0

## 0.0.4

### Patch Changes

- Updated dependencies [[`26d4591`](https://github.com/darioegb/plume-ui-react/commit/26d4591ff891c85e9cf22f16c392d88a83267875)]:
  - @plume-ui-react/spinner@0.0.14
  - @plume-ui-react/button@0.0.16

## 0.0.3

### Patch Changes

- [`1863389`](https://github.com/darioegb/plume-ui-react/commit/1863389b8949444b81e17bf0aa257c1da8b52c00) Thanks [@darioegb](https://github.com/darioegb)! - Update Readme & update changelog script

- Updated dependencies [[`1863389`](https://github.com/darioegb/plume-ui-react/commit/1863389b8949444b81e17bf0aa257c1da8b52c00)]:
  - @plume-ui-react/spinner@0.0.13
  - @plume-ui-react/button@0.0.15
  - @plume-ui-react/core@0.0.9

## 0.0.2

### Patch Changes

- [#23](https://github.com/darioegb/plume-ui-react/pull/23) [`0746448`](https://github.com/darioegb/plume-ui-react/commit/07464483f3f562d4fb5b0c1b74168cf23792a7ac) Thanks [@darioegb](https://github.com/darioegb)! - Change customClasses to className and customStyles to style, also add index to ComponentProps
  The composition pattern was applied to the tab component to make it more customizable
- Updated dependencies [[`0746448`](https://github.com/darioegb/plume-ui-react/commit/07464483f3f562d4fb5b0c1b74168cf23792a7ac)]:
  - @plume-ui-react/spinner@0.0.12
  - @plume-ui-react/button@0.0.14
  - @plume-ui-react/core@0.0.8

## 0.0.1

### Patch Changes

- [#21](https://github.com/darioegb/plume-ui-react/pull/21) [`a069bcc`](https://github.com/darioegb/plume-ui-react/commit/a069bcc6b8f7be738ed84c63fa076f55ebbf2963) Thanks [@darioegb](https://github.com/darioegb)! - Add tabs component
- Updated dependencies [[`a069bcc`](https://github.com/darioegb/plume-ui-react/commit/a069bcc6b8f7be738ed84c63fa076f55ebbf2963)]:
  - @plume-ui-react/color-utils@0.0.5
  - @plume-ui-react/spinner@0.0.11
  - @plume-ui-react/button@0.0.13
  - @plume-ui-react/lazy-utils@0.0.1
