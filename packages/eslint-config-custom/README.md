# `eslint-config-custom`

Internal ESLint 9 flat configs shared by every package.

| Entry | Use for |
| --- | --- |
| `eslint-config-custom/library` | Node/TypeScript packages |
| `eslint-config-custom/react` | React libraries (adds React, hooks and a11y rules) |
| `eslint-config-custom/storybook` | The docs app (React config plus Storybook rules) |

```js
// eslint.config.js
module.exports = require('eslint-config-custom/react')
```
