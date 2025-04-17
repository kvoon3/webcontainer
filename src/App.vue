<script setup lang="ts">
import type { WebContainer } from '@webcontainer/api'
import { Terminal } from '@xterm/xterm'
import { onMounted, shallowRef } from 'vue'
import { useWebContainer } from '~/composables/webContainer'
import { files } from '~/templates/files'

const content = shallowRef(files['index.js'].file.contents)
const previewUrl = shallowRef('')
const term = new Terminal({
  convertEol: true,
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

  term.open(document.getElementById('terminal')!)

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
  <div p4 h-full>
    <h1 text-2xl font-semibold leading-loose p4 text-center>
      Playground
    </h1>
    <div grid="~ cols-2 rows-2 gap-4">
      <textarea v-model="content" font-mono p2 border rounded col-span-2 w-full>I am a textarea</textarea>
      <div border rounded>
        <iframe w-full :src="previewUrl" />
      </div>
      <div id="terminal" />
    </div>
  </div>
</template>
