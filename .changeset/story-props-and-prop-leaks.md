---
'@plume-ui-react/button': patch
'@plume-ui-react/input': patch
'@plume-ui-react/spinner': patch
'@plume-ui-react/tabs': patch
'@plume-ui-react/datepicker': patch
'@plume-ui-react/lib': patch
---

Props that did nothing or leaked to the DOM, and a few behavior fixes found while documenting every prop.

- `Button`: `busyText` only replaces the label while `isBusy` is set; it used to show even when the button wasn't busy.
- `Input`: removed `errorMessage` and `isRequired` from the props. They were never implemented and ended up as unknown attributes on the `<input>`, with a React warning.
- `Spinner`: `size` no longer leaks to the `<output>` element as an HTML attribute.
- `Tabs`: `TabPanel` applies its `className`. `Tab` and `TabPanel` no longer accept `id`, which was ignored; their ids derive from the `Tabs` `id`.
- `DatePicker`: `readOnly` also disables the calendar button, so the date can't be changed from the calendar.
- `DatePicker`: every `config` key is optional. `{ language: 'es' }` or `{ footer: { apply: 'Aplicar' } }` work alone, and the missing keys fall back to `en`, `Apply` and `Cancel`. `DatePickerConfig` is now exported.
