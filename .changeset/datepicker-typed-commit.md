---
'plume-ui-react': patch
---

`DatePicker` commits a date typed by hand as soon as the text is complete and valid, instead of 500 ms later. A form that was submitted right after typing (Enter, or a click on the submit button) used to validate the previous value, for example with react-hook-form.
