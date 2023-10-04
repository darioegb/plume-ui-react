import { deepMerge } from '@plume-ui-react/merge-utils'
import type { CustomUserConfig, DefaultConfig, PlumeUIConfig } from '.'

const defaultConfig: DefaultConfig = {
  colors: {
    primary: 'rgb(99, 102, 241)',
    secondary: 'rgb(107, 114, 128)',
    info: 'rgb(59, 130, 246)',
    warning: 'rgb(234, 179, 8)',
    error: 'rgb(239, 68, 68)',
    success: 'rgb(34, 197, 94)',
    dark: 'rgb(31, 41, 55)',
    light: 'rgb(250, 250, 250)',
  },
}

let userConfig = {} as CustomUserConfig

export function setUserConfig(config: CustomUserConfig): void {
  userConfig = config
}

export function getMergedConfig(): PlumeUIConfig {
  return deepMerge<PlumeUIConfig>(defaultConfig, userConfig as never)
}
