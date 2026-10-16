# `@plume-ui-react/merge-utils`

Deep merge for plain objects, used by Plume UI to apply theme overrides on top of the default theme.

## Installation

```sh
npm install @plume-ui-react/merge-utils
```

## Usage

```ts
import { deepMerge } from '@plume-ui-react/merge-utils'

const theme = deepMerge(defaultTheme, { colors: { primary: { 500: '#5263ff' } } })
```

`deepMerge(target, ...sources)` returns a new object and never mutates its inputs. Later sources win; nested plain objects are merged recursively, while primitives and arrays are replaced.

## License

[MIT](https://github.com/darioegb/plume-ui-react/blob/main/LICENSE)
