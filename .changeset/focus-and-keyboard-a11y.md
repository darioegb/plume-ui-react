---
'@plume-ui-react/button': minor
'@plume-ui-react/input': minor
'@plume-ui-react/tabs': minor
'@plume-ui-react/datepicker': minor
'@plume-ui-react/lib': minor
---

Clearer focus states and full keyboard support for Tabs and DatePicker.

- Focus rings: every component uses the same 2px ring, offset 2px, in the color scheme's `text` shade, so it meets the 3:1 contrast WCAG asks for in light and dark mode. Buttons and tabs show it only for keyboard focus (`:focus-visible`), not after a mouse click. The `link` button variant gets the ring too.
- Windows High Contrast: focusable elements no longer use `outline: none`, so the system focus outline shows in forced-colors mode.
- `Input`: `--input-color` now maps to the scheme's `text` shade and is used for the border and the ring; `--input-hover-color` was removed. The browser reset no longer applies to every `<input>` on the page, only to Plume inputs, and it keeps zero specificity so styles such as Bootstrap's `.form-control` still win.
- `Button`: accepts `onKeyDown`.
- `Tabs`: follows the WAI-ARIA tabs pattern. Only the selected tab is in the tab order, the arrow keys (up/down when vertical), Home and End move between tabs and skip disabled ones, and each tab is linked to its panel with `aria-controls`/`aria-labelledby`. `TabList` accepts `aria-label`/`aria-labelledby` instead of the fixed "Tab List" label, and ids derive from the `Tabs` `id` when one is given.
- `DatePicker`:
  - Opening the calendar focuses the selected day (or today); arrow keys, Home/End and PageUp/PageDown move through the days and change month when needed. Escape closes the calendar, and closing it or picking a date returns focus to the input. Moving focus out of the date picker closes it.
  - Days are announced with their full date, with `aria-pressed` on the selection and `aria-current="date"` on today. The range preview also follows keyboard focus.
  - Fixes: clicking the calendar button while the calendar is open closes it instead of reopening it; only the current date is highlighted as today (it used to highlight the same day number in every month); going back from January (or forward from December) changes the year; a `value` set on mount opens the calendar on that month; `minDate`/`maxDate` are no longer mutated. The input reserves room for the calendar button, so long values and the range placeholder no longer run under the icon.
