# plume-ui-react

## 0.1.0

### Minor Changes

- [#68](https://github.com/darioegb/plume-ui-react/pull/68) [`340029560d2577b3aef8cb820ca327301d6c4cd1`](https://github.com/darioegb/plume-ui-react/commit/340029560d2577b3aef8cb820ca327301d6c4cd1) Thanks [@darioegb](https://github.com/darioegb)! - First release of `plume-ui-react`, the single package that replaces `@plume-ui-react/lib`, the per-component packages, `@plume-ui-react/core`, the hooks and the utilities. Every export keeps its name: import from `plume-ui-react` and the stylesheet from `plume-ui-react/styles.css`. Importing one component still leaves the rest out of the bundle. Module augmentation of `ColorPalette` now targets `plume-ui-react`, and `react`/`react-dom` >= 18 are required.
