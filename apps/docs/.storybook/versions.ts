import pkg from '../../../packages/plume-ui-react/package.json'

export interface DocsVersion {
  /** Text shown in the header. */
  label: string
  /** Where the docs of this version live. */
  href: string
}

/**
 * The docs of the older majors, archived under `/v1`, `/v2`... when a new major is released. While the
 * list is empty the header shows only the current version, and with the first entry it becomes a menu.
 *
 * @example { label: 'v1', href: '/plume-ui-react/v1/' }
 */
const archived: DocsVersion[] = []

export const currentVersion: DocsVersion = { href: './', label: `v${pkg.version}` }

export const versions: DocsVersion[] = [currentVersion, ...archived]
