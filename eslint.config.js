import fs from 'node:fs'
import antfu from '@antfu/eslint-config'
import { createAutoInsert } from 'eslint-plugin-unimport'

export default antfu(
  {
    formatters: true,
    unocss: true,
  },
  {
    files: ['src/templates/**/*'],
    rules: {
      'no-console': 'off',
    },
  },
  createAutoInsert({
    imports: JSON.parse(fs.readFileSync('.unimport-items.json', 'utf-8')),
  }),
)
