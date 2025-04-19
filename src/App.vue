<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'

import { shallowRef, watch } from 'vue'
import DarkToggle from '~/components/DarkToggle.vue'

import TheTerminal from '~/components/TheTerminal.vue'
import { setupFiles } from '~/templates'
import { useWebContainer } from './composables/webContainer'

const content = shallowRef('')
const previewUrl = shallowRef('')

const { wc } = useWebContainer()

const indexFile = 'src/main.js'

watch(wc, async (wc) => {
  if (wc) {
    await setupFiles(wc)

    content.value = await wc.fs.readFile(indexFile, 'utf-8')

    wc.on('server-ready', (_, url) => {
      previewUrl.value = url
    })
  }
})

watchDebounced(content, async (val) => {
  if (!wc.value)
    return

  try {
    await wc.value?.fs.writeFile(indexFile, val)
  }
  catch (error) {
    console.error(error)
  }
}, {
  debounce: 800,
  immediate: true,
})
</script>

<template>
  <div flex="~ col" h-screen of-hidden>
    <div flex justify-between border-base border-neutral p2>
      <span text-lg font-semibold>
        Playground
      </span>

      <DarkToggle />
    </div>
    <div relative grow-1>
      <div class="panelWrapper" absolute inset-0 grid="~ cols-2 rows-2">
        <textarea v-model="content" col-span-2 h-full w-full rounded bg-base p2 font-mono outline-none>I am a textarea</textarea>
        <div flex="~ col">
          <div class="title">
            Preview
          </div>
          <div grow-1 of-scroll>
            <iframe allow="cross-origin-isolated" :src="previewUrl" h-full w-full />
          </div>
        </div>
        <div flex="~ col">
          <div class="title">
            Terminal
          </div>
          <div relative grow-1>
            <TheTerminal absolute inset-0 />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title {
  --uno: text-lg font-semibold p4 bg-secondary;
}
</style>
