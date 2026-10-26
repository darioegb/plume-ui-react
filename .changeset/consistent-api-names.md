---
'plume-ui-react': minor
---

One name for the value callback and for flags, before 1.0. The components that report a value use `onValueChange`, and flags are plain adjectives, without `is`. This is a breaking change, so the old names are gone, with no alias:

- `DatePicker`, `TimePicker` and `RadioGroup`: `onChange` is now `onValueChange` (`RadioGroup` is still called with the value and the event).
- `Tabs`: `onChange` is now `onIndexChange`, the same name as the `Carousel`.
- `Button`: `isBusy` is now `busy`.
- `DatePicker`: `isRange` and `isCalendar` are now `range` and `calendar`, and the `isRange` option of `getDateStringByLanguage` is `range`.
- `TimePicker`: `isPanel` is now `panel`.
- `Tabs`: `isLazy` is now `lazy`.

`Input`, `Textarea`, `Checkbox`, `Toggle` and `Radio`, which are a single native control, keep the `onChange` of the element. The guide Upgrading to 1.0 has a table with every change.

The `Carousel` can also translate the `aria-roledescription` of the carousel and of each slide, with `labels.roleDescription` and `labels.slideRoleDescription`.
