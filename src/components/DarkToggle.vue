<script setup lang="ts">
import { isDark, toggleDark } from '~/shared/const'
</script>

<template>
  <button
    :class="
      isDark
        ? 'i-ph-moon'
        : 'i-ph-sun'
    "
    @click="() => toggleDark()"
  />
</template>
