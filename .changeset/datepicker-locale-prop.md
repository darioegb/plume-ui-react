---
'plume-ui-react': minor
---

`DatePicker` takes a `locale` prop (a BCP 47 tag such as `es` or `es-AR`) instead of `config={{ language }}`, and `config` and the `DatePickerConfig` type are removed. It sets the names of the months and days, the default `displayFormat` and the day labels, and falls back to the `locale` of the `LocaleProvider`. See "Upgrading to 1.0".
