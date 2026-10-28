---
'plume-ui-react': minor
---

`plume-ui-react/styles.css` puts all the CSS of the package in the cascade layer `plume` (and declares `@layer base, plume, components, utilities;` first), so a `className` or any CSS of yours wins over Plume without `variant="unstyled"`, and so do Tailwind v4 utilities. CSS with no layer also beats Plume now: if you use Bootstrap, `normalize.css` or the preflight of Tailwind v3, import it into a layer that comes before `plume`; see the guide Customizing styles.
