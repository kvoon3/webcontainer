<script setup lang="ts">
import type { WebContainer } from '@webcontainer/api'
import { Terminal } from '@xterm/xterm'
import { onMounted, shallowRef, useTemplateRef, watchEffect } from 'vue'

import { useWebContainer } from '~/composables/webContainer'
import { files } from '~/templates/files'

const content = shallowRef(files['index.js'].file.contents)
const previewUrl = shallowRef('')

const term = new Terminal({
  convertEol: true,
})
const el = useTemplateRef<HTMLDivElement>('terminal')
watchEffect(() => {
  if (el.value) {
    term.open(el.value)
  }
})

async function installDependencies(wc: WebContainer) {
  const installProcess = await wc.spawn('pnpm', ['install'])
  installProcess.output.pipeTo(new WritableStream({
    write(data) {
      term.write(data)
    },
  }))
  return installProcess.exit
}

async function startServer(wc: WebContainer) {
  const startProcess = await wc.spawn('pnpm', ['run', 'start'])

  startProcess.output.pipeTo(new WritableStream({
    write(data) {
      term.write(data)
    },
  }))

  wc.on('server-ready', (_, url) => {
    previewUrl.value = url
  })
}

let wc: WebContainer | null = null

onMounted(async () => {
  wc = await useWebContainer()

  await wc.mount(files)

  const exitCode = await installDependencies(wc)

  if (exitCode !== 0) {
    throw new Error('Failed to install dependencies')
  }

  await startServer(wc)

  watchDebounced(content, async (val) => {
    try {
      await wc?.fs.writeFile('index.js', val)
    }
    catch (error) {
      console.error(error)
    }
  }, {
    debounce: 800,
    immediate: true,
  })
})
</script>

<template>
  <div flex="~ col" h-full>
    <div font-semibold p2 border>
      Playground
    </div>
    <div grow-1 relative>
      <div inset-0 absolute grid="~ cols-2 rows-2 ">
        <textarea v-model="content" font-mono p2 border rounded col-span-2 h-full w-full>I am a textarea</textarea>
        <div of-scroll>
          <iframe w-full :src="previewUrl" />
        </div>
        <div of-scroll>
          <div ref="terminal" h-full />
        </div>
      </div>
    </div>
  </div>
</template>
