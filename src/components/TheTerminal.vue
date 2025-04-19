<script setup lang="ts">
import type { WebContainer } from '@webcontainer/api'
import { useEventListener } from '@vueuse/core'
import { FitAddon } from '@xterm/addon-fit'
import { Terminal } from '@xterm/xterm'
import { nextTick, useTemplateRef, watch } from 'vue'
import { useWebContainer } from '../composables/webContainer'

const { wc } = useWebContainer()

const terminal = new Terminal({
  convertEol: true,
})
const fitAddon = new FitAddon()
terminal.loadAddon(fitAddon)

const terminalEl = useTemplateRef<HTMLDivElement>('terminalEl')

watch(wc, async (wc) => {
  if (!wc)
    return

  const shellProcess = await startShell(wc)
  const writer = shellProcess.input.getWriter()

  // terminal input -> shell
  terminal.onData((data) => {
    writer.write(data)
  })

  const resize = () => {
    // resize xterm
    fitAddon.fit()
    // resize shell content
    shellProcess.resize({
      cols: terminal.cols,
      rows: terminal.rows,
    })
  }

  nextTick(() => {
    terminal.open(terminalEl.value!)

    resize()
    useEventListener('resize', resize)
  })
}, { immediate: true })

async function startShell(wc: WebContainer) {
  const process = await wc.spawn('jsh', {
    terminal: {
      cols: terminal.cols,
      rows: terminal.rows,
    },
  })

  // shell output -> terminal
  process.output.pipeTo(new WritableStream({
    write(data) {
      terminal.write(data)
    },
  }))

  return process
}
</script>

<template>
  <div ref="terminalEl" />
</template>
