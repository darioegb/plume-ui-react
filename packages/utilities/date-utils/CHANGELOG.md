# @plume-ui-react/date-utils

## 0.1.2

### Patch Changes

- [#54](https://github.com/darioegb/plume-ui-react/pull/54) [`970f86be2e56619272600a4d5fda59b6e2cb4648`](https://github.com/darioegb/plume-ui-react/commit/970f86be2e56619272600a4d5fda59b6e2cb4648) Thanks [@darioegb](https://github.com/darioegb)! - `DatePicker` reads typed dates in the active format instead of always assuming month/day/year.

  - Typing `31/01/2026` with `language: 'es'` (or `31.01.2026` with `de`) now selects January 31, 2026; it used to resolve to a wrong date or an invalid one.
  - Dates that don't exist, such as `02/31/2040`, are ignored instead of rolling over to the next month.
  - `displayFormat` accepts the `dd`, `mm` and `yyyy` tokens in either case, so `DD/MM/YYYY` works for typing as well as for display.
  - `date-utils`: `getDateFromDateString` takes an optional format (default `mm/dd/yyyy`), `validateFormatDate` also checks that the date exists, and `formatDate` accepts lowercase tokens.

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

## 0.0.5

### Patch Changes

- [#21](https://github.com/darioegb/plume-ui-react/pull/21) [`a069bcc`](https://github.com/darioegb/plume-ui-react/commit/a069bcc6b8f7be738ed84c63fa076f55ebbf2963) Thanks [@darioegb](https://github.com/darioegb)! - Add getLightenColor method

## 0.0.4

### Patch Changes

- [`69cadd9`](https://github.com/darioegb/plume-ui-react/commit/69cadd948e3438fc7e85de225a96e76e15d53b31) Thanks [@darioegb](https://github.com/darioegb)! - Update some dependencies

## 0.0.3

### Patch Changes

- [`746c53e`](https://github.com/darioegb/plume-ui-react/commit/746c53ec024dd732c78b732bca51b759a5b9eb0b) Thanks [@darioegb](https://github.com/darioegb)! - Update prettier printWidth
  Update global readme
  Update global changelog
  Fix sonar test scope

## 0.0.2

### Patch Changes

- [#6](https://github.com/darioegb/plume-ui-react/pull/6) [`83a75fd`](https://github.com/darioegb/plume-ui-react/commit/83a75fd485c9afb07ac0093d6204d1af9a484384) Thanks [@darioegb](https://github.com/darioegb)! - Add sonar-cloud analysis workflow
  Fix sonar first auto analysis issues
  Add unstyled variant to button & spinner components

## 0.0.1

### Patch Changes

- 21ffd05: First release
