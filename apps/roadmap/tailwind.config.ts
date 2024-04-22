import sharedConfig from '@repo/tailwind-config'
import type { Config } from 'tailwindcss'

const config: Config = {
  presets: [sharedConfig],
  content: ['./app/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
}
export default config
