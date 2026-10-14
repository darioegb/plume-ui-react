import type { Config } from 'tailwindcss'

// Plume design tokens exposed as Tailwind utilities. Every value points to a CSS
// variable emitted by <ThemeProvider>, so utilities stay in sync with the active
// theme and flip automatically in dark mode. The provider must wrap the app for
// these variables to resolve.
const SCHEMES = [
  'primary',
  'secondary',
  'info',
  'warning',
  'error',
  'success',
  'brown',
  'pink',
  'purple',
  'teal',
  'yellow',
] as const

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

const paletteColors = Object.fromEntries(
  SCHEMES.map((scheme) => [
    scheme,
    {
      ...Object.fromEntries(
        SHADES.map((shade) => [shade, `var(--plume-color-${scheme}-${shade})`]),
      ),
      DEFAULT: `var(--plume-color-${scheme}-500)`,
      contrast: `var(--plume-color-${scheme}-contrast)`,
    },
  ]),
)

const semanticColors = {
  background: 'var(--plume-background)',
  surface: {
    DEFAULT: 'var(--plume-surface)',
    muted: 'var(--plume-surface-muted)',
  },
  foreground: 'var(--plume-foreground)',
  muted: 'var(--plume-muted)',
  border: 'var(--plume-border)',
}

const spacing = Object.fromEntries(
  [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56,
    60, 64, 68, 72, 76, 80, 84, 88, 92, 96,
  ].map((n) => [n, `var(--plume-space-${n})`]),
)

const borderRadius = {
  0: 'var(--plume-radius-0)',
  1: 'var(--plume-radius-1)',
  2: 'var(--plume-radius-2)',
  3: 'var(--plume-radius-3)',
  4: 'var(--plume-radius-4)',
  5: 'var(--plume-radius-5)',
  6: 'var(--plume-radius-6)',
  full: 'var(--plume-radius-full)',
}

const fontSize = {
  xs: 'var(--plume-font-size-xs)',
  sm: 'var(--plume-font-size-sm)',
  base: 'var(--plume-font-size-base)',
  lg: 'var(--plume-font-size-lg)',
  xl: 'var(--plume-font-size-xl)',
  '2xl': 'var(--plume-font-size-2xl)',
}

const fontWeight = {
  thin: 'var(--plume-font-weight-thin)',
  extralight: 'var(--plume-font-weight-extralight)',
  light: 'var(--plume-font-weight-light)',
  normal: 'var(--plume-font-weight-normal)',
  medium: 'var(--plume-font-weight-medium)',
  semibold: 'var(--plume-font-weight-semibold)',
  bold: 'var(--plume-font-weight-bold)',
  extrabold: 'var(--plume-font-weight-extrabold)',
  black: 'var(--plume-font-weight-black)',
}

const lineHeight = {
  none: 'var(--plume-line-height-none)',
  tight: 'var(--plume-line-height-tight)',
  snug: 'var(--plume-line-height-snug)',
  normal: 'var(--plume-line-height-normal)',
  relaxed: 'var(--plume-line-height-relaxed)',
  loose: 'var(--plume-line-height-loose)',
}

const boxShadow = {
  none: 'var(--plume-shadow-none)',
  sm: 'var(--plume-shadow-sm)',
  md: 'var(--plume-shadow-md)',
  lg: 'var(--plume-shadow-lg)',
  xl: 'var(--plume-shadow-xl)',
  '2xl': 'var(--plume-shadow-2xl)',
}

const zIndex = Object.fromEntries(
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => [n, `var(--plume-z-${n})`]),
)

const config: Config = {
  darkMode: ['class', '[data-plume-color-mode="dark"]'],
  content: [
    // For examples projects
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    // For storybook
    './stories/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/components/*/src/stories/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ...paletteColors,
        ...semanticColors,
      },
      fontFamily: {
        plume: 'var(--plume-font-family)',
      },
      spacing,
      borderRadius,
      fontSize,
      fontWeight,
      lineHeight,
      boxShadow,
      zIndex,
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config

