import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWebFonts,
  presetWind4,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetAttributify(),
    presetWind4({
      darkMode: 'class',
    }),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: 'DM Sans',
        mono: 'Fira Code',
      },
    }),
    presetIcons(),
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
