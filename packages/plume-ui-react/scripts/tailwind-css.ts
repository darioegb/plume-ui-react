import { defaultTheme } from '../src/theme/config'

const plume = (name: string): string => `var(--plume-${name})`
const line = (name: string, value: string): string => `  --${name}: ${value};`
const keys = (record: object): string[] => Object.keys(record)
const kebab = (key: string): string => key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)

function colors(): string[] {
  const schemes = keys(defaultTheme.colors)
  const entries = schemes.flatMap((scheme) => {
    const shades = keys(defaultTheme.colors[scheme as keyof typeof defaultTheme.colors])
    return [
      line(`color-${scheme}`, plume(`color-${scheme}-500`)),
      ...shades.map((shade) => line(`color-${scheme}-${shade}`, plume(`color-${scheme}-${shade}`))),
      line(`color-${scheme}-solid`, plume(`color-${scheme}-solid`)),
      line(`color-${scheme}-on-solid`, plume(`color-${scheme}-solid-contrast`)),
      line(`color-${scheme}-text`, plume(`color-${scheme}-text`)),
      line(`color-${scheme}-tint`, plume(`color-${scheme}-tint`)),
      line(`color-${scheme}-tint-strong`, plume(`color-${scheme}-tint-strong`)),
      line(`color-${scheme}-tint-text`, plume(`color-${scheme}-tint-text`)),
    ]
  })
  const semantic = keys(defaultTheme.semantic).map((key) =>
    line(`color-${kebab(key)}`, plume(kebab(key))),
  )
  return [...entries, ...semantic]
}

const scale = (prefix: string, record: object, token: string): string[] =>
  keys(record).map((key) => line(`${prefix}-${kebab(key)}`, plume(`${token}-${kebab(key)}`)))

function textStyles(): string[] {
  return keys(defaultTheme.textStyles).flatMap((name) => [
    line(`text-${name}`, plume(`text-${name}-size`)),
    line(`text-${name}--line-height`, plume(`text-${name}-line-height`)),
    line(`text-${name}--letter-spacing`, plume(`text-${name}-letter-spacing`)),
    line(`text-${name}--font-weight`, plume(`text-${name}-weight`)),
  ])
}

const utility = (name: string, declaration: string): string =>
  `@utility ${name} {\n  ${declaration};\n}`

function utilities(): string[] {
  return [
    ...keys(defaultTheme.zIndices).map((name) =>
      utility(`z-${name}`, `z-index: ${plume(`z-${name}`)}`),
    ),
    ...keys(defaultTheme.motion.durations).map((name) =>
      utility(`duration-${name}`, `transition-duration: ${plume(`duration-${name}`)}`),
    ),
    utility('opacity-disabled', `opacity: ${plume('opacity-disabled')}`),
    ...keys(defaultTheme.controlHeights).flatMap((name) => [
      utility(`h-control-${name}`, `height: ${plume(`control-height-${name}`)}`),
      utility(`min-h-control-${name}`, `min-height: ${plume(`control-height-${name}`)}`),
    ]),
  ]
}

/**
 * The theme for Tailwind CSS v4: `@theme inline` points every utility to the variable of Plume
 * (`bg-primary-solid` is `var(--plume-color-primary-solid)`), so they follow the theme and the color
 * mode. `inline` is what keeps the variable and not its value, which a nested provider needs. The
 * spacing, the breakpoints and the container widths of Tailwind v4 are already the ones of Plume.
 */
export function buildTailwindCss(): string {
  const theme = [
    ...colors(),
    line('font-plume', plume('font-family')),
    line('font-plume-mono', plume('font-family-mono')),
    ...scale('text', defaultTheme.typography.fontSizes, 'font-size'),
    ...textStyles(),
    ...scale('font-weight', defaultTheme.typography.fontWeights, 'font-weight'),
    ...scale('leading', defaultTheme.typography.lineHeights, 'line-height'),
    ...scale('tracking', defaultTheme.typography.letterSpacings, 'letter-spacing'),
    ...scale('radius', defaultTheme.radii, 'radius'),
    ...scale('shadow', defaultTheme.shadows, 'shadow'),
    ...scale('container', defaultTheme.containers, 'container'),
    ...scale('ease', defaultTheme.motion.easings, 'easing'),
  ]
  return `@theme inline {\n${theme.join('\n')}\n}\n\n${utilities().join('\n\n')}\n`
}
