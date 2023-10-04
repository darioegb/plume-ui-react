import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    // For examples projects
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    // For storybook
    './stories/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/components/**/stories/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
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
