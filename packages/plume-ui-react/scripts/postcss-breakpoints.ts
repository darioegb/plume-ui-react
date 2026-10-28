import type { Plugin } from 'postcss'
import { defaultTheme } from '../src/theme/config'

const NAME = /\(--(?<below>below-)?(?<key>[\w-]+)\)/g

/**
 * Lets the stylesheets write `@media (--md)` and `@media (--below-md)`, which a `var()` could not
 * do, with the widths of `defaultTheme.breakpoints` as the only definition: `--md` is
 * `(width >= 48rem)` and `--below-md` is `(width < 48rem)`.
 */
export function breakpoints(): Plugin {
  const widths = defaultTheme.breakpoints as unknown as Record<string, string>
  return {
    postcssPlugin: 'plume-breakpoints',
    AtRule: {
      media(rule) {
        rule.params = rule.params.replace(NAME, (_, below: string | undefined, key: string) => {
          const width = widths[key]
          if (!width) throw rule.error(`Unknown breakpoint "${key}"`)
          return below ? `(width < ${width})` : `(width >= ${width})`
        })
      },
    },
  }
}
