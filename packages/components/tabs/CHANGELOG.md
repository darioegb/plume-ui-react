# @plume-ui-react/tabs

## 0.2.1

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
  - @plume-ui-react/spinner@0.1.1

## 0.2.0

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
