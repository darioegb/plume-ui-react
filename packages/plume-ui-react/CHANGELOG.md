# plume-ui-react

## 0.2.0

### Minor Changes

- [#73](https://github.com/darioegb/plume-ui-react/pull/73) [`36d1a6aaef8c7d61a6d36daca0a472bcf43ad451`](https://github.com/darioegb/plume-ui-react/commit/36d1a6aaef8c7d61a6d36daca0a472bcf43ad451) Thanks [@darioegb](https://github.com/darioegb)! - Components can be imported directly from React Server Components. The build used to drop every `'use client'` directive, so a Server Component importing `Tabs`, `Input` or `DatePicker` failed with `createContext is not a function` unless the app wrapped it in its own client boundary. The ESM build now emits one file per module and keeps the directive on the modules that need it, so `<ThemeProvider>` also works in a root layout, while `Button`, `Spinner`, `Field` and the utilities stay usable on the server. The stylesheet and the public API are unchanged, and importing a single component still leaves the rest out of the bundle.

### Patch Changes

- [#73](https://github.com/darioegb/plume-ui-react/pull/73) [`7099029b2ea81787f1cc46e0fc85b7246bbea7b1`](https://github.com/darioegb/plume-ui-react/commit/7099029b2ea81787f1cc46e0fc85b7246bbea7b1) Thanks [@darioegb](https://github.com/darioegb)! - `Tabs` and `Field` generate their ids with React's `useId` only. The module counter they fell back to is gone, since React 18 is the minimum supported version.

## 0.1.0

### Minor Changes

- [#68](https://github.com/darioegb/plume-ui-react/pull/68) [`340029560d2577b3aef8cb820ca327301d6c4cd1`](https://github.com/darioegb/plume-ui-react/commit/340029560d2577b3aef8cb820ca327301d6c4cd1) Thanks [@darioegb](https://github.com/darioegb)! - First release of `plume-ui-react`, the single package that replaces `@plume-ui-react/lib`, the per-component packages, `@plume-ui-react/core`, the hooks and the utilities. Every export keeps its name: import from `plume-ui-react` and the stylesheet from `plume-ui-react/styles.css`. Importing one component still leaves the rest out of the bundle. Module augmentation of `ColorPalette` now targets `plume-ui-react`, and `react`/`react-dom` >= 18 are required.
