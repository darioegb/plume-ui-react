---
'plume-ui-react': minor
---

The stylesheets `plume-ui-react/css/<component>.css` no longer import `tokens.css`. Import `plume-ui-react/tokens.css` once, before them, and then the sheet of each component. A bundler that does not remove the repeated `@import` (Vite 7 and earlier) copied the 21 KB of tokens in every sheet: an app with 25 of them shipped 25 copies, 662 KB of CSS instead of 113 KB.
