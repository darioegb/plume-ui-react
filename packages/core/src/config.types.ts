import type { CustomColorPalette, DefaultColorPalette } from './theme.types'

export interface DefaultConfig {
  colors: Record<DefaultColorPalette, string>
}
export interface CustomUserConfig { colors: CustomColorPalette }
export type PlumeUIConfig = DefaultConfig & CustomUserConfig
