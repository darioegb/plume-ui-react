# @plume-ui-react/lib

## 0.3.1

### Patch Changes

- [#61](https://github.com/darioegb/plume-ui-react/pull/61) [`56edaee837a1a1ffb0243208c9278e420c32a99c`](https://github.com/darioegb/plume-ui-react/commit/56edaee837a1a1ffb0243208c9278e420c32a99c) Thanks [@darioegb](https://github.com/darioegb)! - Props that did nothing or leaked to the DOM, and a few behavior fixes found while documenting every prop.

  - `Button`: `busyText` only replaces the label while `isBusy` is set; it used to show even when the button wasn't busy.
  - `Input`: removed `errorMessage` and `isRequired` from the props. They were never implemented and ended up as unknown attributes on the `<input>`, with a React warning.
  - `Spinner`: `size` no longer leaks to the `<output>` element as an HTML attribute.
  - `Tabs`: `TabPanel` applies its `className`. `Tab` and `TabPanel` no longer accept `id`, which was ignored; their ids derive from the `Tabs` `id`.
  - `DatePicker`: `readOnly` also disables the calendar button, so the date can't be changed from the calendar.
  - `DatePicker`: every `config` key is optional. `{ language: 'es' }` or `{ footer: { apply: 'Aplicar' } }` work alone, and the missing keys fall back to `en`, `Apply` and `Cancel`. `DatePickerConfig` is now exported.
  - `DatePicker`: accepts `name`, passed to the input, and `inputRef`, a ref to the input for form libraries such as react-hook-form, which focus the field when validation fails.
  - `DatePicker`: a new `value` prop is no longer echoed back through `onChange`. With a complete range, that echo made a controlled DatePicker (e.g. inside react-hook-form's `Controller`) re-render forever.

- Updated dependencies [[`56edaee837a1a1ffb0243208c9278e420c32a99c`](https://github.com/darioegb/plume-ui-react/commit/56edaee837a1a1ffb0243208c9278e420c32a99c)]:
  - @plume-ui-react/button@0.2.1
  - @plume-ui-react/input@0.3.1
  - @plume-ui-react/spinner@0.1.1
  - @plume-ui-react/tabs@0.2.1
  - @plume-ui-react/datepicker@0.2.1

## 0.3.0

### Minor Changes

- [#59](https://github.com/darioegb/plume-ui-react/pull/59) [`8574f4df255787243a70209d846f505fe7338829`](https://github.com/darioegb/plume-ui-react/commit/8574f4df255787243a70209d846f505fe7338829) Thanks [@darioegb](https://github.com/darioegb)! - Clearer focus states and full keyboard support for Tabs and DatePicker.

  - Focus rings: every component uses the same 2px ring, offset 2px, in the color scheme's `text` shade, so it meets the 3:1 contrast WCAG asks for in light and dark mode. Buttons and tabs show it only for keyboard focus (`:focus-visible`), not after a mouse click. The `link` button variant gets the ring too.
  - Windows High Contrast: focusable elements no longer use `outline: none`, so the system focus outline shows in forced-colors mode.
  - `Input`: `--input-color` now maps to the scheme's `text` shade and is used for the border and the ring; `--input-hover-color` was removed. The browser reset no longer applies to every `<input>` on the page, only to Plume inputs, and it keeps zero specificity so styles such as Bootstrap's `.form-control` still win.
  - `Button`: accepts `onKeyDown`.
  - `Tabs`: follows the WAI-ARIA tabs pattern. Only the selected tab is in the tab order, the arrow keys (up/down when vertical), Home and End move between tabs and skip disabled ones, and each tab is linked to its panel with `aria-controls`/`aria-labelledby`. `TabList` accepts `aria-label`/`aria-labelledby` instead of the fixed "Tab List" label, and ids derive from the `Tabs` `id` when one is given.
  - `DatePicker`:
    - Opening the calendar focuses the selected day (or today); arrow keys, Home/End and PageUp/PageDown move through the days and change month when needed. Escape closes the calendar, and closing it or picking a date returns focus to the input. Moving focus out of the date picker closes it.
    - Days are announced with their full date, with `aria-pressed` on the selection and `aria-current="date"` on today. The range preview also follows keyboard focus.
    - Fixes: clicking the calendar button while the calendar is open closes it instead of reopening it; only the current date is highlighted as today (it used to highlight the same day number in every month); going back from January (or forward from December) changes the year; a `value` set on mount opens the calendar on that month; `minDate`/`maxDate` are no longer mutated. The input reserves room for the calendar button, so long values and the range placeholder no longer run under the icon.

### Patch Changes

- Updated dependencies [[`8574f4df255787243a70209d846f505fe7338829`](https://github.com/darioegb/plume-ui-react/commit/8574f4df255787243a70209d846f505fe7338829)]:
  - @plume-ui-react/button@0.2.0
  - @plume-ui-react/input@0.3.0
  - @plume-ui-react/tabs@0.2.0
  - @plume-ui-react/datepicker@0.2.0

## 0.2.2

### Patch Changes

- [#54](https://github.com/darioegb/plume-ui-react/pull/54) [`970f86be2e56619272600a4d5fda59b6e2cb4648`](https://github.com/darioegb/plume-ui-react/commit/970f86be2e56619272600a4d5fda59b6e2cb4648) Thanks [@darioegb](https://github.com/darioegb)! - `DatePicker` reads typed dates in the active format instead of always assuming month/day/year.

  - Typing `31/01/2026` with `language: 'es'` (or `31.01.2026` with `de`) now selects January 31, 2026; it used to resolve to a wrong date or an invalid one.
  - Dates that don't exist, such as `02/31/2040`, are ignored instead of rolling over to the next month.
  - `displayFormat` accepts the `dd`, `mm` and `yyyy` tokens in either case, so `DD/MM/YYYY` works for typing as well as for display.
  - `date-utils`: `getDateFromDateString` takes an optional format (default `mm/dd/yyyy`), `validateFormatDate` also checks that the date exists, and `formatDate` accepts lowercase tokens.

- Updated dependencies [[`970f86be2e56619272600a4d5fda59b6e2cb4648`](https://github.com/darioegb/plume-ui-react/commit/970f86be2e56619272600a4d5fda59b6e2cb4648)]:
  - @plume-ui-react/datepicker@0.1.5

## 0.2.1

### Patch Changes

- [#50](https://github.com/darioegb/plume-ui-react/pull/50) [`b01c51ad105c83e70e5e3078b6dff53e6990b1a5`](https://github.com/darioegb/plume-ui-react/commit/b01c51ad105c83e70e5e3078b6dff53e6990b1a5) Thanks [@darioegb](https://github.com/darioegb)! - `Input` and `DatePicker` no longer overflow narrow containers.

  - The 18rem minimum width now applies only when there is room (`min(18rem, 100%)`), so the fields fit on small screens.
  - An `Input` with `addonBefore` / `addonAfter` shrinks its field to keep the addons beside it, and addons no longer wrap.

- Updated dependencies [[`b01c51ad105c83e70e5e3078b6dff53e6990b1a5`](https://github.com/darioegb/plume-ui-react/commit/b01c51ad105c83e70e5e3078b6dff53e6990b1a5)]:
  - @plume-ui-react/input@0.2.1
  - @plume-ui-react/datepicker@0.1.4

## 0.2.0

### Minor Changes

- [#42](https://github.com/darioegb/plume-ui-react/pull/42) [`cacb0aeeef6ad52866bb3e0618bd4f89dd6daecf`](https://github.com/darioegb/plume-ui-react/commit/cacb0aeeef6ad52866bb3e0618bd4f89dd6daecf) Thanks [@darioegb](https://github.com/darioegb)! - Masks now validate what can be typed, and `lib` is the only package you need to install.

  - **Breaking (`use-mask` / `Input` `mask`)**: `#` now accepts only a digit (it used to accept any character). New mask characters: `A` for a letter and `*` for a letter or digit; `\` escapes the next character as a literal. Characters that don't fit the next slot are rejected, and deleting never leaves a dangling separator.
  - `DatePicker`: the field only accepts digits (letters are rejected) and shows a numeric keyboard on mobile.
  - `lib` now depends on and re-exports `@plume-ui-react/core`, so `import { Button, ThemeProvider, useTheme } from '@plume-ui-react/lib'` works with a single install. Installing `@plume-ui-react/core` separately is only needed with individual component packages.

### Patch Changes

- Updated dependencies [[`cacb0aeeef6ad52866bb3e0618bd4f89dd6daecf`](https://github.com/darioegb/plume-ui-react/commit/cacb0aeeef6ad52866bb3e0618bd4f89dd6daecf)]:
  - @plume-ui-react/input@0.2.0
  - @plume-ui-react/datepicker@0.1.3

## 0.1.2

### Patch Changes

- Updated dependencies [[`61eb5ec22dd44ad493f965d1dab450a48321a25f`](https://github.com/darioegb/plume-ui-react/commit/61eb5ec22dd44ad493f965d1dab450a48321a25f)]:
  - @plume-ui-react/tabs@0.1.1
  - @plume-ui-react/input@0.1.1
  - @plume-ui-react/datepicker@0.1.2

## 0.1.1

### Patch Changes

- Updated dependencies [[`6ad7a57ad29013649a7fac36308d516ccbac7559`](https://github.com/darioegb/plume-ui-react/commit/6ad7a57ad29013649a7fac36308d516ccbac7559)]:
  - @plume-ui-react/datepicker@0.1.1

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
  - @plume-ui-react/button@0.1.0
  - @plume-ui-react/spinner@0.1.0
  - @plume-ui-react/input@0.1.0
  - @plume-ui-react/tabs@0.1.0
  - @plume-ui-react/datepicker@0.1.0

## 0.0.17

### Patch Changes

- Updated dependencies [[`26d4591`](https://github.com/darioegb/plume-ui-react/commit/26d4591ff891c85e9cf22f16c392d88a83267875)]:
  - @plume-ui-react/spinner@0.0.14
  - @plume-ui-react/button@0.0.16
  - @plume-ui-react/tabs@0.0.4

## 0.0.16

### Patch Changes

- Updated dependencies [[`1863389`](https://github.com/darioegb/plume-ui-react/commit/1863389b8949444b81e17bf0aa257c1da8b52c00)]:
  - @plume-ui-react/spinner@0.0.13
  - @plume-ui-react/button@0.0.15
  - @plume-ui-react/tabs@0.0.3

## 0.0.15

### Patch Changes

- Updated dependencies [[`0746448`](https://github.com/darioegb/plume-ui-react/commit/07464483f3f562d4fb5b0c1b74168cf23792a7ac)]:
  - @plume-ui-react/spinner@0.0.12
  - @plume-ui-react/button@0.0.14
  - @plume-ui-react/tabs@0.0.2

## 0.0.14

### Patch Changes

- Updated dependencies [[`a069bcc`](https://github.com/darioegb/plume-ui-react/commit/a069bcc6b8f7be738ed84c63fa076f55ebbf2963)]:
  - @plume-ui-react/spinner@0.0.11
  - @plume-ui-react/button@0.0.13
  - @plume-ui-react/tabs@0.0.1

## 0.0.13

### Patch Changes

- Updated dependencies [[`eadca38`](https://github.com/darioegb/plume-ui-react/commit/eadca38f6715d94f92a56924d55ad31254bbe273)]:
  - @plume-ui-react/button@0.0.12

## 0.0.12

### Patch Changes

- Updated dependencies [[`f23a136`](https://github.com/darioegb/plume-ui-react/commit/f23a1366455f170489e47b5979a964392476cda1)]:
  - @plume-ui-react/spinner@0.0.10
  - @plume-ui-react/button@0.0.11

## 0.0.11

### Patch Changes

- Updated dependencies []:
  - @plume-ui-react/button@0.0.10
  - @plume-ui-react/spinner@0.0.9

## 0.0.10

### Patch Changes

- Updated dependencies []:
  - @plume-ui-react/button@0.0.9
  - @plume-ui-react/spinner@0.0.8

## 0.0.9

### Patch Changes

- Updated dependencies [[`69cadd9`](https://github.com/darioegb/plume-ui-react/commit/69cadd948e3438fc7e85de225a96e76e15d53b31)]:
  - @plume-ui-react/spinner@0.0.7
  - @plume-ui-react/button@0.0.8

## 0.0.8

### Patch Changes

- Updated dependencies [[`d08ff1d`](https://github.com/darioegb/plume-ui-react/commit/d08ff1dfc0950545ab825be925cb156658f19da4)]:
  - @plume-ui-react/button@0.0.7
  - @plume-ui-react/spinner@0.0.6

## 0.0.7

### Patch Changes

- Updated dependencies [[`3c32eed`](https://github.com/darioegb/plume-ui-react/commit/3c32eedde61cc15403042c4b897888bc6d866702)]:
  - @plume-ui-react/button@0.0.6

## 0.0.6

### Patch Changes

- Updated dependencies [[`746c53e`](https://github.com/darioegb/plume-ui-react/commit/746c53ec024dd732c78b732bca51b759a5b9eb0b)]:
  - @plume-ui-react/button@0.0.5
  - @plume-ui-react/spinner@0.0.5

## 0.0.5

### Patch Changes

- Updated dependencies [[`83a75fd`](https://github.com/darioegb/plume-ui-react/commit/83a75fd485c9afb07ac0093d6204d1af9a484384)]:
  - @plume-ui-react/button@0.0.4
  - @plume-ui-react/spinner@0.0.4

## 0.0.4

### Patch Changes

- Updated dependencies [[`a340fc2`](https://github.com/darioegb/plume-ui-react/commit/a340fc2db02a0c5346a298dcd09f1f9bc2bc7259)]:
  - @plume-ui-react/spinner@0.0.3
  - @plume-ui-react/button@0.0.3

## 0.0.3

### Patch Changes

- Updated dependencies [[`0e5ef60`](https://github.com/darioegb/plume-ui-react/commit/0e5ef6088913e489e90d58d5e767bdd236f9e97d)]:
  - @plume-ui-react/spinner@0.0.2
  - @plume-ui-react/button@0.0.2

## 0.0.2

### Patch Changes

- 8ec5f46: Update docs

## 0.0.1

### Patch Changes

- 21ffd05: First release
- Updated dependencies [21ffd05]
  - @plume-ui-react/button@0.0.1
  - @plume-ui-react/spinner@0.0.1
