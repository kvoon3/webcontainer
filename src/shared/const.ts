import type { WebContainer } from '@webcontainer/api'
import { useDark, useToggle } from '@vueuse/core'
import { shallowRef } from 'vue'

export const wc = shallowRef<WebContainer | null>(null)

export const isDark = useDark()
export const toggleDark = useToggle(isDark)
