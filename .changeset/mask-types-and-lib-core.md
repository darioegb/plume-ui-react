---
'@plume-ui-react/use-mask': minor
'@plume-ui-react/input': minor
'@plume-ui-react/datepicker': patch
'@plume-ui-react/lib': minor
---

Masks now validate what can be typed, and `lib` is the only package you need to install.

- **Breaking (`use-mask` / `Input` `mask`)**: `#` now accepts only a digit (it used to accept any character). New mask characters: `A` for a letter and `*` for a letter or digit; `\` escapes the next character as a literal. Characters that don't fit the next slot are rejected, and deleting never leaves a dangling separator.
- `DatePicker`: the field only accepts digits (letters are rejected) and shows a numeric keyboard on mobile.
- `lib` now depends on and re-exports `@plume-ui-react/core`, so `import { Button, ThemeProvider, useTheme } from '@plume-ui-react/lib'` works with a single install. Installing `@plume-ui-react/core` separately is only needed with individual component packages.
