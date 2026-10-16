# `@plume-ui-react/use-debounce`

React hook that returns a value only after it has stopped changing for a given delay.

## Installation

```sh
npm install @plume-ui-react/use-debounce
```

## Usage

```tsx
import { useEffect, useState } from 'react'
import { useDebounce } from '@plume-ui-react/use-debounce'

function Search() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce({ value: query, delay: 300 })

  useEffect(() => {
    if (debouncedQuery) fetchResults(debouncedQuery)
  }, [debouncedQuery])

  return <input onChange={(e) => setQuery(e.target.value)} value={query} />
}
```

`delay` is in milliseconds. The first render returns the initial `value` immediately.

## License

[MIT](https://github.com/darioegb/plume-ui-react/blob/main/LICENSE)
