type RadiusValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 'full'

type SizeValue = 'max' | 'min' | 'full'

type SpaceValue =
  | 0
  | 1
  | 2
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

type ZIndexValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

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
  fontSizes: FontSizes
  fontWeights: FontWeights
  lineHeights: LineHeights
}

export interface FontSizes {
  xs: string
  sm: string
  base: string
  lg: string
  xl: string
  '2xl': string
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

export type Spaces = {
  [key in SpaceValue]: string
}

export type Sizes = {
  [key in SizeValue]: string
}

export type Radii = {
  [key in RadiusValue]: string
}

export type ZIndeces = {
  [key in ZIndexValue]: number
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

export interface SemanticColors {
  background: string
  surface: string
  surfaceMuted: string
  foreground: string
  muted: string
  border: string
}

export interface Theme {
  colors: ColorPalette
  semantic: SemanticColors
  typography: Typography
  spaces: Spaces // Padding & margin
  sizes: Sizes // Width & height
  radii: Radii
  zIndeces: ZIndeces
  shadows: Shadows
  breakpoints: Breakpoints
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
