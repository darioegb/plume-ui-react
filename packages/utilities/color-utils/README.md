# `@plume-ui-react/color-utils`

Color helpers used by Plume UI components. They accept hex (`#5263ff`) or `rgb()` colors.

## Installation

```sh
npm install @plume-ui-react/color-utils
```

## API

| Function | Returns |
| --- | --- |
| `getContrastColor(color)` | `'#000000'` or `'#ffffff'`, whichever reads better on `color` |
| `getContrastRatio(foreground, background)` | WCAG 2.1 contrast ratio, from 1 to 21 (AA needs at least 4.5 for normal text) |
| `getLightenColor(color, lightness = 10)` | `color` mixed towards white by `lightness` percent, as `rgb()` |
| `getDarkenColor(color, darkness = 10)` | `color` mixed towards black by `darkness` percent, as `rgb()` |

```ts
import { getContrastColor, getContrastRatio } from '@plume-ui-react/color-utils'

getContrastColor('#5263ff') // '#ffffff'
getContrastRatio('#ffffff', '#5263ff') >= 4.5 // true
```

## License

[MIT](https://github.com/darioegb/plume-ui-react/blob/main/LICENSE)
