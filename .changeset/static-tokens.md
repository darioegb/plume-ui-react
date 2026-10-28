---
'plume-ui-react': minor
---

`plume-ui-react/styles.css` now declares the default theme as CSS variables (`:root` for light mode and `[data-plume-color-mode='dark']` for dark mode), so the components work without a `<ThemeProvider>`. `<ThemeProvider>` writes inline only the variables that differ from the default, which makes the HTML it renders on the server much smaller. The tokens are also published alone as `plume-ui-react/tokens.css`.
