import { WebContainer } from '@webcontainer/api'

let wc: WebContainer | null = null

export async function useWebContainer() {
  if (!wc)
    wc = await WebContainer.boot()

  return wc
}
