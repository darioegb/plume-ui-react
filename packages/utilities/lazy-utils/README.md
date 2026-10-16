# `@plume-ui-react/lazy-utils`

Wraps already-created React content in `React.lazy`, so it can be rendered inside `<Suspense>` only when needed. Plume UI Tabs use it for `isLazy` panels.

## Installation

```sh
npm install @plume-ui-react/lazy-utils
```

## Usage

```tsx
import { Suspense } from 'react'
import { lazyLoadContent } from '@plume-ui-react/lazy-utils'

const LazyReport = lazyLoadContent(<Report />)

function Panel() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <LazyReport />
    </Suspense>
  )
}
```

## License

[MIT](https://github.com/darioegb/plume-ui-react/blob/main/LICENSE)
