<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->

# Plume UI React

A React component library themed with CSS variables, published as a single package, `plume-ui-react`. pnpm and
Turborepo monorepo. Answer the user in the language they write in; code, docs, commits and pull requests are in
English.

## Where things are

- `packages/plume-ui-react/src/components/<category>/<name>/`: a component, with its CSS module, `index.ts`,
  `stories/` and `tests/`. The other folders of `src` are `theme/`, `locale/`, `hooks/`, `utils/` and `overlay/` (the
  internal primitives of the overlays: `useLayer`, `useDismiss`, `Portal`, `joinClasses`, `hasPart`...).
- `packages/plume-ui-react/scripts/`: build-time code (tokens, Tailwind theme, breakpoints) and the checks that `lint`
  and `build` run.
- `apps/docs`: Storybook. The guides are the MDX files of `apps/docs/stories`; the component stories live with the
  components. The `*.generated.json` files of `apps/docs/src` are written by `apps/docs/scripts` on `dev`, `lint` and
  `build`; don't edit them by hand.
- `apps/example-vite`, `apps/example-next-app`: standalone apps outside the pnpm workspace. They install the package
  from npm, so a change in `src` reaches them only after a release.
- `packages/{eslint-config-custom,prettier-config,tailwind-config,tsconfig}`: the shared configs.
- `scripts/new-component.mjs` and `scripts/component-templates/`: the component scaffold.
- `PLAN-1.0.md`: the roadmap to 1.0, not committed. Context on what is planned, not a spec.

## Rules

- Read [AUTHORING.md](AUTHORING.md) before you add or change a component: it is the contract every component follows
  (props, parts, `unstyled`, texts, stories, `'use client'`). [CONTRIBUTING.md](CONTRIBUTING.md) has the commit and
  branch conventions. Read the section you need rather than the whole file, and don't re-derive from the code a
  convention these files already state.
- Create a component with `pnpm new:component <Name> <category> [--compound]`, never by copying another one: it
  registers the component in `src/index.ts`, `src/tests/index.spec.ts` and the root README. Then look at a similar
  component and reuse the components and parts that already exist instead of writing new markup.
- Keep the lists of components in alphabetical order: `src/index.ts`, `src/tests/index.spec.ts`, the two READMEs and
  the dependencies of the per-component CSS.
- Don't add comments that explain what the code does. A comment says why, only when the code can't; the reasoning of
  a change goes in the commit and the pull request.
- Commits, branches and pull requests are in English and follow Conventional Commits. A change to the published
  package needs a changeset (`pnpm changeset`, `patch` or `minor` while the version is `0.x`).
- If a rule here or in AUTHORING.md turns out wrong or incomplete, fix the document in the same change.

## While you work

- Run the narrowest check while iterating: `pnpm --filter plume-ui-react exec vitest run <path>` for a spec,
  `pnpm --filter plume-ui-react exec eslint <file>`, `pnpm --filter @plume-ui-react/docs check:api` for the JSDoc.
  Leave the full commands below for the end.
- `pnpm dev` starts Storybook on port 6006.
- Skip `.claude/worktrees/` (full copies of the repository), `node_modules`, `dist`, `coverage`, `storybook-static`,
  the `*.generated.json` and `pnpm-lock.yaml` when you search or read.

## Before opening a pull request

```sh
pnpm lint            # eslint, stylelint, the story and guide snippets, the API reference
pnpm test:coverage   # CI fails under 90 % coverage
pnpm build           # includes the 'use client' check
```

CI also runs `pnpm --filter plume-ui-react check:package` (publint and attw) after the build.

What these check, so a failure is easy to place:

- `packages/plume-ui-react/scripts/check-story-snippets.mjs`: every "Show code" of a story and every `tsx` block of a
  guide compiles against the public API. Sample names a snippet uses without defining go in its `PLACEHOLDERS` or
  `DATA`.
- `apps/docs/scripts/check-api.mjs`: every own prop and every exported part has a JSDoc description.
- `packages/plume-ui-react/scripts/check-client-directives.mjs`: `'use client'` is on exactly the modules that need it.
- `src/tests/index.spec.ts` and `src/tests/token-names.spec.ts`: the list of exports and of `--plume-*` variables, so a rename is
  always on purpose.
