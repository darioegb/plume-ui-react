# `@plume-ui-react/use-click-outside`

React hook that calls a function when the user clicks outside an element. Used by Plume UI to close popovers such as the DatePicker calendar.

## Installation

```sh
npm install @plume-ui-react/use-click-outside
```

## Usage

Attach the returned ref to the element to watch:

```tsx
import { useState } from 'react'
import { useClickOutside } from '@plume-ui-react/use-click-outside'

function Dropdown() {
  const [open, setOpen] = useState(false)
  const ref = useClickOutside({ callback: () => setOpen(false) })

  return (
    <div ref={ref}>
      <button onClick={() => setOpen(true)} type="button">
        Options
      </button>
      {open ? <ul>…</ul> : null}
    </div>
  )
}
```

Clicks are detected on `mousedown`. Wrap `callback` in `useCallback` if it changes on every render, to avoid re-subscribing the listener.

## License

[MIT](https://github.com/darioegb/plume-ui-react/blob/main/LICENSE)
