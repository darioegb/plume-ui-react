---
"plume-ui-react": patch
---

Cleans up what SonarCloud reported: CSS Modules `@value` declarations are replaced by the values they held, the unused loader styles of `Spinner` are gone, and `Input`, `ThemeProvider`, the focus trap and a few utilities follow the rules Sonar flagged. No behavior changes.
