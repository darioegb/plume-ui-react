---
'plume-ui-react': minor
---

Each component has its own stylesheet, `plume-ui-react/css/<component>.css` (`css/button.css`, `css/paginator.css`...), that imports the tokens and the CSS of the components it renders, so an app can load only the CSS it uses. `plume-ui-react/styles.css` stays as it is, with everything.
