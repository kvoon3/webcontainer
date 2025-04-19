import type { WebContainer } from '@webcontainer/api'
import { dirname } from 'pathe'

export async function setupFiles(wc: WebContainer) {
  const fileContentMap = await Promise.all(
    Object.entries(
      import.meta.glob('./vite/**/*', { query: 'raw' }),
    ).map(async ([key, getContent]) => {
      const path = key.replace('./vite/', '')
      const content = await getContent().then((m: any) => m.default) as string
      const dir = dirname(path)

      if (dir !== '.') {
        try {
          wc.fs.mkdir(dir, { recursive: true })
        }
        catch (error) {
          console.error(error)
        }
      }

      return wc.fs.writeFile(path, content, 'utf-8')
    }),
  )

  return fileContentMap
}
