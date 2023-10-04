import type { Config } from 'tailwindcss'
import sharedConfig from 'tailwind-config/tailwind.config'

const config: Pick<Config, 'presets' | 'corePlugins'> = {
  presets: [sharedConfig],
  corePlugins: {
    preflight: false,
  },
}

export default config
