type RadiusValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 'full'

type SpaceValue =
  | 0
  | 0.5
  | 1
  | 1.5
  | 2
  | 2.5
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 16
  | 20
  | 24
  | 28
  | 32
  | 36
  | 40
  | 44
  | 48
  | 52
  | 56
  | 60
  | 64
  | 68
  | 72
  | 76
  | 80
  | 84
  | 88
  | 92
  | 96

export interface ShadeLevel {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
  950: string
}

export interface ColorPalette {
  primary: ShadeLevel
  secondary: ShadeLevel
  info: ShadeLevel
  warning: ShadeLevel
  error: ShadeLevel
  success: ShadeLevel
  brown: ShadeLevel
  pink: ShadeLevel
  purple: ShadeLevel
  teal: ShadeLevel
  yellow: ShadeLevel
}

export interface Typography {
  fontFamily: string
  fontFamilyMono: string
  fontSizes: FontSizes
  fontWeights: FontWeights
  lineHeights: LineHeights
  letterSpacings: LetterSpacings
}

export interface FontSizes {
  xs: string
  sm: string
  base: string
  lg: string
  xl: string
  '2xl': string
  '3xl': string
  '4xl': string
  '5xl': string
}

export interface FontWeights {
  thin: number
  extralight: number
  light: number
  normal: number
  medium: number
  semibold: number
  bold: number
  extrabold: number
  black: number
}

export interface LineHeights {
  none: number
  tight: number
  snug: number
  normal: number
  relaxed: number
  loose: number
}

export interface LetterSpacings {
  tight: string
  normal: string
  wide: string
}

export interface TextStyle {
  fontSize: string
  fontWeight: number | string
  lineHeight: number | string
  letterSpacing: string
}

export interface TextStyles {
  'heading-1': TextStyle
  'heading-2': TextStyle
  'heading-3': TextStyle
  'heading-4': TextStyle
  'heading-5': TextStyle
  'heading-6': TextStyle
  body: TextStyle
  'body-sm': TextStyle
  label: TextStyle
  caption: TextStyle
}

export type Spaces = {
  [key in SpaceValue]: string
}

export type Radii = {
  [key in RadiusValue]: string
}

export interface ZIndices {
  sticky: number
  overlay: number
  modal: number
  popover: number
  dropdown: number
  tooltip: number
  toast: number
}

export interface Shadows {
  none: string
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
}

export interface Breakpoints {
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
}

export interface Containers {
  '3xs': string
  '2xs': string
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
  '3xl': string
  '4xl': string
  '5xl': string
  '6xl': string
  '7xl': string
}

export interface Motion {
  durations: { fast: string; normal: string; slow: string }
  easings: { standard: string; out: string; inOut: string }
}

export interface FocusRing {
  width: string
  offset: string
  inset: string
  color: string
}

export interface BorderWidths {
  thin: string
  medium: string
  thick: string
}

export interface ControlHeights {
  sm: string
  md: string
  lg: string
}

export interface Opacities {
  disabled: number
}

export interface Overlays {
  hover: string
  active: string
}

export interface Targets {
  min: string
}

export interface SemanticColors {
  background: string
  surface: string
  surfaceMuted: string
  foreground: string
  muted: string
  border: string
  borderStrong: string
  borderHover: string
  backdrop: string
}

export interface Theme {
  colors: ColorPalette
  semantic: SemanticColors
  typography: Typography
  textStyles: TextStyles
  spaces: Spaces // Padding & margin
  radii: Radii
  zIndices: ZIndices
  shadows: Shadows
  breakpoints: Breakpoints // Read in JS: a var() does not work inside @media
  containers: Containers // Named widths: max width of a page, a dialog or a panel
  motion: Motion
  focusRing: FocusRing
  borderWidths: BorderWidths
  controlHeights: ControlHeights
  opacities: Opacities
  overlays: Overlays // Alphas of currentcolor for the hover and the press of an item
  targets: Targets // The smallest box a pointer has to hit
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
