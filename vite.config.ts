import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import { VueMcp } from 'vite-plugin-vue-mcp'

const r = (p: string) => `${resolve(__dirname, p)}/`

export default defineConfig({
  resolve: {
    alias: {
      '~/': r('src'),
      '~~/': r('./'),
    },
  },
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
  plugins: [
    vue(),
    UnoCSS(),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.vue\.[tj]sx?\?vue/, // .vue (vue-loader with experimentalInlineMatchResource enabled)
        /\.md$/, // .md
      ],
      dirs: ['src/composables'],
      imports: ['vue', '@vueuse/core'],
      dumpUnimportItems: true,
    }),
    VueMcp(),
  ],
})
