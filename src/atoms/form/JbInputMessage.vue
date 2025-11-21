<template>
  <div
    :class="[typeClass]"
    class="flex justify-start items-center gap-x-1 text-left"
  >
    <slot />
  </div>
</template>
<script lang="ts" setup>
const { type = 'error' } = defineProps<{
  type?: 'error' | 'info' | 'success';
}>()

const typeClassMap = {
  error: 'text-red-600 text-sm font-bold leading-none',
  info: 'text-sm leading-none',
  success: 'text-paragraph text-sm leading-none',
}

const typeClass = computed(() => typeClassMap[type])
</script>
