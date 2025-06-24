import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'ai-primary': 'hsl(var(--ai-primary))',
        'ai-secondary': 'hsl(var(--ai-secondary))',
        'ai-neural': 'hsl(var(--ai-neural))',
        'ai-accent': 'hsl(var(--ai-accent))',
        'ai-warning': 'hsl(var(--ai-warning))',
        'ai-surface': 'hsl(var(--ai-surface))',
        'ai-background': 'hsl(var(--ai-background))',
      },
    },
  },
  plugins: [],
}

export default config
