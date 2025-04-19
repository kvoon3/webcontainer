import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWebFonts,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: {
    'text-base': 'text-$c-text-base',

    'bg-base': 'bg-$c-bg-base',
    'bg-secondary': 'bg-$c-bg-secondary',

    'border-base': 'border-$c-border',
    'border-secondary': 'border-$c-border-secondary',

    'scrollbar-bg': 'bg-$c-scrollbar-bg',
    'scrollbar-thumb': 'bg-$c-scrollbar-thumb',
  },
  presets: [
    presetAttributify(),
    presetWind3({
      darkMode: 'class',
    }),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: 'DM Sans',
        mono: 'Fira Code',
      },
    }),
    presetIcons({
      scale: 1.2,
      collections: {
        ph: () => import('@iconify-json/ph/icons.json').then(i => i.default as any),
      },
    }),
  ],
  content: {
    pipeline: {
      include: [
        /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,

        'src/**/*.{js,ts}',
      ],
    },
  },
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
