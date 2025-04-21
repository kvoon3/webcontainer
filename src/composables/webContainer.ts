import { WebContainer } from '@webcontainer/api'
import { shallowRef } from 'vue'
import { wc } from '~/shared/const'

const isLoading = shallowRef(false)

export function useWebContainer() {
  if (!wc.value && !isLoading.value) {
    isLoading.value = true
    WebContainer.boot().then((instance) => {
      wc.value = instance
      isLoading.value = false
    })
  }

  return {
    wc,
    isLoading,
  }
}
