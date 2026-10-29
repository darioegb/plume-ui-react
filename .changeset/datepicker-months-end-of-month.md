---
'plume-ui-react': patch
---

Fix the month list of the `DatePicker` on the 29th, 30th and 31st of a month: it showed March twice and no February (and repeated the 31st month in the months of 30 days), because the names were built by moving today's date to each month.
