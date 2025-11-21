<script lang="ts" setup>
const {
  disabledPrev = false,
  disabledNext = false
} = defineProps<{
  disabledPrev?: boolean
  disabledNext?: boolean
}>()

const emits = defineEmits<{
  (e: 'click:prev'): void;
  (e: 'click:next'): void;
}>()
</script>

<template>
  <div class="flex gap-x-2 items-center">
    <JButton
      :disabled="disabledPrev"
      class="p-0! w-9 sm:w-10 h-9 sm:h-10 rounded!"
      role="button"
      shape="circle"
      size="sm"
      variant="alternative"
      @click.stop="emits('click:prev')"
    >
      <UIcon
        class="h-6 w-6"
        name="i-heroicons-chevron-left-20-solid"
      />
    </JButton>
    <JButton
      :disabled="disabledNext"
      class="p-0! w-9 sm:w-10 h-9 sm:h-10 rounded!"
      role="button"
      shape="circle"
      size="sm"
      variant="alternative"
      @click.stop="emits('click:next')"
    >
      <UIcon
        class="h-6 w-6"
        name="i-heroicons-chevron-right-20-solid"
      />
    </JButton>
  </div>
</template>
