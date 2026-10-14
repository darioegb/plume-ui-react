# @plume-ui-react/core

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
  - @plume-ui-react/color-utils@0.1.0
  - @plume-ui-react/merge-utils@0.1.0

## 0.0.9

### Patch Changes

- [`1863389`](https://github.com/darioegb/plume-ui-react/commit/1863389b8949444b81e17bf0aa257c1da8b52c00) Thanks [@darioegb](https://github.com/darioegb)! - Update Readme & update changelog script

## 0.0.8

### Patch Changes

- [#23](https://github.com/darioegb/plume-ui-react/pull/23) [`0746448`](https://github.com/darioegb/plume-ui-react/commit/07464483f3f562d4fb5b0c1b74168cf23792a7ac) Thanks [@darioegb](https://github.com/darioegb)! - Change customClasses to className and customStyles to style, also add index to ComponentProps
  The composition pattern was applied to the tab component to make it more customizable

## 0.0.7

### Patch Changes

- [`66b108f`](https://github.com/darioegb/plume-ui-react/commit/66b108f96f150f4ecc6cae741296094305a5721a) Thanks [@darioegb](https://github.com/darioegb)! - Update readme core

## 0.0.6

### Patch Changes

- [`4de8748`](https://github.com/darioegb/plume-ui-react/commit/4de8748a446de36ad69f350acb3a47386359d73e) Thanks [@darioegb](https://github.com/darioegb)! - Add readme to Core

## 0.0.5

### Patch Changes

- [`69cadd9`](https://github.com/darioegb/plume-ui-react/commit/69cadd948e3438fc7e85de225a96e76e15d53b31) Thanks [@darioegb](https://github.com/darioegb)! - Update some dependencies

- Updated dependencies [[`69cadd9`](https://github.com/darioegb/plume-ui-react/commit/69cadd948e3438fc7e85de225a96e76e15d53b31)]:
  - @plume-ui-react/merge-utils@0.0.4

## 0.0.4

### Patch Changes

- [`d08ff1d`](https://github.com/darioegb/plume-ui-react/commit/d08ff1dfc0950545ab825be925cb156658f19da4) Thanks [@darioegb](https://github.com/darioegb)! - Fix some minor visual issues button
  Perform build size al packages removing mts files

## 0.0.3

### Patch Changes

- Updated dependencies [[`746c53e`](https://github.com/darioegb/plume-ui-react/commit/746c53ec024dd732c78b732bca51b759a5b9eb0b)]:
  - @plume-ui-react/merge-utils@0.0.3

## 0.0.2

### Patch Changes

- Updated dependencies [[`83a75fd`](https://github.com/darioegb/plume-ui-react/commit/83a75fd485c9afb07ac0093d6204d1af9a484384)]:
  - @plume-ui-react/merge-utils@0.0.2

## 0.0.1

### Patch Changes

- 21ffd05: First release
- Updated dependencies [21ffd05]
  - @plume-ui-react/merge-utils@0.0.1
