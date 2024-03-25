import { deepMerge } from '@plume-ui-react/merge-utils'
import type { PlumeUIConfig } from '.'

const defaultConfig: PlumeUIConfig = {
  colors: {
    primary: '#3b83f6',
    secondary: '#6b7280',
    info: '#0ea4e9',
    warning: '#eab208',
    error: '#ef4444',
    success: '#22c55e',
    dark: '#1f2937',
    light: '#fafafa',
  },
}

let userConfig = {} as PlumeUIConfig

export function setUserConfig(config: PlumeUIConfig): void {
  userConfig = config
}

export function getMergedConfig(): PlumeUIConfig {
  return deepMerge<PlumeUIConfig>(defaultConfig, userConfig)
}
